import { type WatchHandle, effectScope, watch } from '@vue/reactivity';
import { deferred, type Deferred } from '../deferred';
import { errorFrom } from '../error';
import type { PromiseMay, VoidFunction } from '../index';
import { OrchestratorErrors } from './errors';
import { createOrchestratorEvents } from './events';
import {
    buildOrchestrationGraph,
    collectClosure,
    type OrchestrationGraph,
    type NameSet,
} from './graph';
import {
    artifactsViewOf,
    collectUnreachableArtifacts,
    isTaskReady,
    pendingArtifactsOf,
} from './scheduler';
import { TerminalTaskStatuses, createOrchestratorState, resetTaskState } from './state';
import type {
    AnyOrchestrationResult,
    AnyOrchestrationTask,
    TaskOrchestrator,
    OrchestrationArtifactName,
    OrchestrationArtifactsRegistry,
    OrchestrationDefinition,
    OrchestratorOptions,
    OrchestrationArtifactsRegistryOf,
    OrchestrationTaskContext,
    OrchestrationTasks,
    OrchestrationTasksRecord,
    ValidateOrchestrationGraph,
} from './types';

/**
 * Build a Reactive Task Orchestrator out of declared tasks and an optional result node.
 *
 * Tasks declare which named artifacts they require and which they produce; the execution order is
 * derived from that alone. The artifacts registry does not have to be named again — it is recovered
 * from the declarations by `OrchestrationArtifactsRegistryOf`. The definition is validated both at
 * compile time by `ValidateOrchestrationGraph` and at runtime, so a malformed graph throws here and
 * never mid-run.
 *
 * NB: do not annotate the `tasks` record with a type — that collapses `keyof` to `string` and the
 * literal task ids are lost. Use a bare `const`, or `satisfies`.
 *
 * @see defineOrchestration
 * @see createDynamicTaskOrchestrator for graphs assembled at runtime
 *
 * @example
 *   const { task, result } = defineOrchestration<Artifacts>();
 *
 *   const rto = createTaskOrchestrator({
 *      tasks: {
 *          genSchema: task({
 *              produces: { jsonSchema: true },
 *              run: async ({ signal }) => ({ jsonSchema: await buildSchema(signal) }),
 *          }),
 *          genOpenApi: task({
 *              requires: { jsonSchema: true },
 *              produces: { openApi: true },
 *              run: ({ artifacts }) => ({ openApi: convert(artifacts.jsonSchema) }),
 *          }),
 *      },
 *      result: result({
 *          requires: { openApi: true },
 *          collect: ({ artifacts }) => artifacts.openApi,
 *      }),
 *   });
 *
 *   const openApi = await rto.run();
 */
export function createTaskOrchestrator<
    T extends OrchestrationTasksRecord,
    RReq extends OrchestrationArtifactName<OrchestrationArtifactsRegistryOf<T>> = never,
    ROpt extends OrchestrationArtifactName<OrchestrationArtifactsRegistryOf<T>> = never,
    Out = Readonly<Partial<OrchestrationArtifactsRegistryOf<T>>>,
>(
    definition: OrchestrationDefinition<T, RReq, ROpt, Out> & ValidateOrchestrationGraph<T, RReq>,
    options?: OrchestratorOptions,
): TaskOrchestrator<OrchestrationArtifactsRegistryOf<T>, T, Out> {
    return createDynamicTaskOrchestrator(definition as never, options);
}

/**
 * Build an orchestrator out of a definition whose shape is not statically known.
 *
 * The entry point for graphs assembled at runtime — tasks discovered from a plugin registry, built
 * in a loop, or filtered by a feature flag. It runs exactly the same engine and exactly the same
 * runtime validation, but the compile-time checks cannot apply to a record TypeScript cannot see
 * the keys of, so `A`, `T` and `Out` are given explicitly and task ids degrade to `string`.
 *
 * Prefer `createTaskOrchestrator` whenever the definition is a literal.
 *
 * @see createTaskOrchestrator
 *
 * @throws EC_RTO_DUPLICATE_PRODUCER
 * @throws EC_RTO_MISSING_PRODUCER
 * @throws EC_RTO_CYCLIC_DEPENDENCY
 * @throws EC_RTO_CONFLICTING_REQUIRE
 * @throws EC_RTO_CONFLICTING_OUTPUT
 * @throws EC_RTO_INVALID_TASK
 */
export function createDynamicTaskOrchestrator<
    A extends OrchestrationArtifactsRegistry,
    T extends OrchestrationTasks<A>,
    Out,
>(
    definition: { readonly tasks: T; readonly result?: AnyOrchestrationResult<A> },
    options: OrchestratorOptions = {},
): TaskOrchestrator<A, T, Out> {
    const { tasks, result } = definition;
    const graph: OrchestrationGraph = buildOrchestrationGraph<A>(tasks, result);
    const scope = effectScope(true);
    const store = scope.run(() => createOrchestratorState<A, T>(graph.taskIds, graph.infinite))!;
    const events = createOrchestratorEvents<A, T>(scope, store);

    const concurrency = options.concurrency ?? Number.POSITIVE_INFINITY;
    const mode = options.mode ?? 'eager';
    const settleWaiters = new Set<Deferred<void>>();
    const taskControllers = new Map<string, AbortController>();

    /** The scheduler keeps working while this is set, even after `run()` has already resolved */
    let active = false;
    let disposed = false;
    let collecting = false;
    let resultDelivered = false;
    let passQueued = false;
    let inPass = false;
    let pending: Deferred<Out> | undefined;
    let runController: AbortController | undefined;
    let detachExternalSignal: VoidFunction | undefined;
    let watchHandle: WatchHandle | undefined;

    return {
        state: store.state,
        run,
        whenSettled,
        retry,
        cancel,
        reset,
        on: events.on,
        dispose,
    };

    function run(): Promise<Out> {
        assertUsable();
        if (active) OrchestratorErrors.raise('EC_RTO_ALREADY_RUNNING');
        resetInternal();
        return begin();
    }

    function retry(taskId?: string): Promise<Out> {
        assertUsable();
        if (active) OrchestratorErrors.raise('EC_RTO_ALREADY_RUNNING');

        const seeds: NameSet = {};
        if (taskId != null) {
            if (!graph.taskIds[taskId]) OrchestratorErrors.raise('EC_RTO_UNKNOWN_TASK', { taskId });
            seeds[taskId] = true;
        } else {
            for (const id of Object.keys(graph.taskIds)) {
                if (isRetryable(store.tasks[id].status)) seeds[id] = true;
            }
        }

        for (const id of Object.keys(collectClosure(graph.dependentsOf, seeds))) {
            for (const artifact of Object.keys(graph.producesOf[id])) {
                delete store.artifacts[artifact as keyof A];
                delete store.published[artifact];
                delete store.publishedBy[artifact];
            }
            resetTaskState(store.tasks[id]);
        }

        releaseRunController();
        return begin();
    }

    function whenSettled(): Promise<void> {
        if (!active && store.isSettled()) return Promise.resolve();
        const waiter = deferred();
        settleWaiters.add(waiter);
        return waiter.promise;
    }

    /**
     * Abort everything that is still in flight.
     *
     * Usable after `run()` has already resolved as well: infinite tasks outlive the result and this
     * is how they are stopped. Tasks that already completed keep their state.
     */
    function cancel(reason?: string): void {
        if (disposed || runController == null) return;
        const error = OrchestratorErrors.create('EC_RTO_CANCELLED', { reason });

        active = false;
        stopWatching();
        runController.abort(error);
        releaseRunController();

        for (const id of Object.keys(store.scheduled)) {
            const task = store.tasks[id];
            if (task.status === 'idle' || TerminalTaskStatuses[task.status]) continue;
            task.status = 'cancelled';
            task.finishedAt = Date.now();
        }

        if (store.getStatus() === 'running') {
            store.setStatus('cancelled');
            store.setError(error);
        }

        rejectRun(error);
        notifySettleWaiters();
    }

    function reset(): void {
        assertUsable();
        resetInternal();
    }

    function dispose(): void {
        if (disposed) return;
        disposed = true;
        active = false;

        const error = OrchestratorErrors.create('EC_RTO_DISPOSED');
        runController?.abort(error);
        releaseRunController();
        stopWatching();
        rejectRun(error);

        for (const waiter of settleWaiters) waiter.resolver();
        settleWaiters.clear();
        scope.stop();
    }

    function begin(): Promise<Out> {
        collecting = false;
        resultDelivered = false;
        active = true;
        store.setError(undefined);
        store.setStatus('running');

        runController = new AbortController();
        pending = deferred<Out>();

        markScheduled();
        startWatching();
        attachExternalSignal();
        requestPass();

        return pending.promise;
    }

    /** Decide which tasks take part in the run and move the fresh ones to `waiting` */
    function markScheduled(): void {
        const target = mode === 'lazy' ? graph.resultClosure : graph.taskIds;

        for (const taskId of Object.keys(graph.taskIds)) {
            if (!target[taskId]) {
                delete store.scheduled[taskId];
                continue;
            }
            store.scheduled[taskId] = true;

            const task = store.tasks[taskId];
            if (task.status === 'idle') {
                task.status = 'waiting';
                task.pending = pendingArtifactsOf(store, graph, taskId);
            }
        }
    }

    /**
     * Re-run the scheduling pass whenever anything it depends on changes.
     *
     * The getter returns a fresh array so that the callback fires on every change of any tracked
     * value, and the microtask scheduler collapses the several mutations a finishing task makes
     * into a single pass.
     */
    function startWatching(): void {
        if (watchHandle != null) return;
        watchHandle = scope.run(() =>
            watch(trackScheduling, requestPass, {
                scheduler: (job, isFirstRun) => {
                    if (isFirstRun) job();
                    else queueMicrotask(job);
                },
            }),
        );
    }

    function stopWatching(): void {
        watchHandle?.stop();
        watchHandle = undefined;
    }

    function trackScheduling(): unknown[] {
        const tracked: unknown[] = [];
        for (const taskId of Object.keys(graph.taskIds)) {
            tracked.push(store.scheduled[taskId], store.tasks[taskId].status);
        }
        for (const artifact of Object.keys(graph.producerOf)) {
            tracked.push(store.published[artifact]);
        }
        return tracked;
    }

    function requestPass(): void {
        if (passQueued || disposed) return;
        passQueued = true;
        queueMicrotask(() => {
            passQueued = false;
            runPass();
        });
    }

    function runPass(): void {
        if (inPass || disposed || !active) return;
        inPass = true;
        try {
            pass();
        } finally {
            inPass = false;
        }
    }

    function pass(): void {
        const unreachable = collectUnreachableArtifacts(store, graph);

        blockUnreachableTasks(unreachable);
        deliverResult(unreachable);
        startReadyTasks();

        if (store.isSettled()) {
            settle();
        } else if (!collecting && countRunning() === 0 && !hasStartableTask()) {
            // Safety net: with unreachability propagation in place every stuck task is normally
            // already `blocked`, so getting here means the scheduler itself lost track of something
            const error = deadlockError();
            for (const taskId of Object.keys(store.scheduled)) {
                const task = store.tasks[taskId];
                if (task.status !== 'waiting') continue;
                task.status = 'blocked';
                task.finishedAt = Date.now();
            }
            rejectRun(error);
            settle();
        }
    }

    function blockUnreachableTasks(unreachable: NameSet): void {
        for (const taskId of Object.keys(store.scheduled)) {
            const task = store.tasks[taskId];
            if (task.status !== 'waiting') continue;

            const pendingArtifacts = pendingArtifactsOf(store, graph, taskId);
            const blocker = Object.keys(pendingArtifacts).find((name) => unreachable[name]);

            if (blocker == null) {
                task.pending = pendingArtifacts;
            } else {
                task.status = 'blocked';
                task.finishedAt = Date.now();
                task.pending = { [blocker]: true };
            }
        }
    }

    function deliverResult(unreachable: NameSet): void {
        if (result == null || resultDelivered || collecting || pending == null) return;

        for (const artifact of Object.keys(graph.resultRequires)) {
            if (store.published[artifact]) continue;
            if (unreachable[artifact]) {
                rejectRun(
                    OrchestratorErrors.create('EC_RTO_RESULT_UNREACHABLE', {
                        artifact,
                        producer: graph.producerOf[artifact],
                    }),
                );
            }
            return;
        }

        collecting = true;
        const context = {
            signal: runController!.signal,
            artifacts: artifactsViewOf(store, graph.resultRequires, graph.resultOptional),
        };

        const collect = result.collect as (ctx: unknown) => PromiseMay;

        void Promise.resolve()
            .then(() => collect(context))
            .then(
                (collected: unknown) => {
                    collecting = false;
                    resolveRun(collected as Out);
                    requestPass();
                },
                (e: unknown) => {
                    collecting = false;
                    rejectRun(errorFrom(e));
                    requestPass();
                },
            );
    }

    function startReadyTasks(): void {
        let running = countRunning();

        for (const taskId of Object.keys(store.scheduled)) {
            if (running >= concurrency) break;
            if (store.tasks[taskId].status !== 'waiting') continue;
            if (!isTaskReady(store, graph, taskId)) continue;
            startTask(taskId);
            running++;
        }
    }

    function startTask(taskId: string): void {
        const definition = tasks[taskId] as AnyOrchestrationTask<A>;
        const task = store.tasks[taskId];

        task.status = 'running';
        task.startedAt = Date.now();
        task.finishedAt = undefined;
        task.error = undefined;
        task.progress = 0;
        task.message = undefined;
        task.attempt++;
        task.pending = {};

        const controller = new AbortController();
        taskControllers.set(taskId, controller);
        linkAbort(runController!.signal, controller);

        const context: OrchestrationTaskContext<A, never, never, never> = {
            taskId,
            signal: controller.signal,
            artifacts: artifactsViewOf(
                store,
                graph.requiresOf[taskId],
                graph.optionalOf[taskId],
            ) as never,
            publish: (name, value) => {
                publishArtifact(taskId, name, value);
            },
            progress: (value, message) => {
                task.progress = clampProgress(value);
                task.message = message;
            },
        };

        void Promise.resolve()
            .then(() => definition.run(context))
            .then(
                (produced: unknown) => {
                    completeTask(taskId, produced);
                },
                (e: unknown) => {
                    failTask(taskId, e);
                },
            );
    }

    function completeTask(taskId: string, produced: unknown): void {
        taskControllers.delete(taskId);

        const task = store.tasks[taskId];
        if (TerminalTaskStatuses[task.status]) return;

        try {
            if (!graph.streaming[taskId] && produced != null && typeof produced === 'object') {
                for (const [name, value] of Object.entries(produced)) {
                    publishArtifact(taskId, name, value);
                }
            }
            assertDeclaredOutputs(taskId);
        } catch (e) {
            failTask(taskId, e);
            return;
        }

        task.status = 'completed';
        task.finishedAt = Date.now();
        task.progress = 1;
        requestPass();
    }

    function failTask(taskId: string, source: unknown): void {
        taskControllers.delete(taskId);

        const task = store.tasks[taskId];
        if (TerminalTaskStatuses[task.status]) return;

        task.error = errorFrom(source);
        task.status = runController?.signal.aborted === true ? 'cancelled' : 'failed';
        task.finishedAt = Date.now();
        requestPass();
    }

    /**
     * @throws EC_RTO_MISSING_OUTPUT
     */
    function assertDeclaredOutputs(taskId: string): void {
        if (graph.infinite[taskId]) return;

        const missing: NameSet = {};
        let hasMissing = false;

        for (const artifact of Object.keys(graph.producesOf[taskId])) {
            if (store.published[artifact]) continue;
            missing[artifact] = true;
            hasMissing = true;
        }

        if (hasMissing)
            OrchestratorErrors.raise('EC_RTO_MISSING_OUTPUT', { taskId, artifacts: missing });
    }

    /**
     * @throws EC_RTO_UNDECLARED_ARTIFACT
     */
    function publishArtifact(taskId: string, name: string, value: unknown): void {
        if (!graph.producesOf[taskId][name]) {
            OrchestratorErrors.raise('EC_RTO_UNDECLARED_ARTIFACT', { taskId, artifact: name });
        }

        store.artifacts[name as keyof A] = value as A[keyof A];
        store.publishedBy[name] = taskId;
        store.published[name] = true;

        events.emit('artifact:published', {
            artifact: name,
            value,
            producer: taskId,
        } as never);
    }

    function settle(): void {
        if (!store.isSettled()) return;

        active = false;
        stopWatching();

        // While the result node is being collected the pending promise is already spoken for
        if (pending != null && !collecting) {
            const failure = firstFailure();
            if (failure != null) rejectRun(failure);
            else if (result == null) resolveRun({ ...store.artifacts } as Out);
            else rejectRun(deadlockError());
        }

        notifySettleWaiters();
    }

    /** Error of the first task that failed during the current run, in declaration order */
    function firstFailure(): Error | undefined {
        for (const taskId of Object.keys(store.scheduled)) {
            const task = store.tasks[taskId];
            if (task.status === 'failed' && task.error != null) return task.error;
        }
        return undefined;
    }

    function resolveRun(value: Out): void {
        if (pending == null) return;
        const target = pending;
        pending = undefined;
        resultDelivered = true;
        store.setStatus('completed');
        target.resolver(value);
    }

    function rejectRun(error: Error): void {
        if (pending == null) return;
        const target = pending;
        pending = undefined;
        store.setError(error);
        if (store.getStatus() === 'running') store.setStatus('failed');
        target.rejector(error);
    }

    function notifySettleWaiters(): void {
        if (!store.isSettled()) return;
        for (const waiter of settleWaiters) waiter.resolver();
        settleWaiters.clear();
    }

    function resetInternal(): void {
        active = false;
        collecting = false;
        resultDelivered = false;
        stopWatching();

        const error = OrchestratorErrors.create('EC_RTO_CANCELLED', { reason: 'reset' });
        runController?.abort(error);
        releaseRunController();
        rejectRun(error);

        for (const taskId of Object.keys(graph.taskIds)) {
            const task = store.tasks[taskId];
            task.attempt = 0;
            resetTaskState(task);
            delete store.scheduled[taskId];
        }
        for (const artifact of Object.keys(store.published)) {
            delete store.published[artifact];
            delete store.publishedBy[artifact];
        }
        for (const artifact of Object.keys(store.artifacts)) {
            delete store.artifacts[artifact as keyof A];
        }

        store.setStatus('idle');
        store.setError(undefined);
        notifySettleWaiters();
    }

    function releaseRunController(): void {
        detachExternalSignal?.();
        detachExternalSignal = undefined;
        taskControllers.clear();
        runController = undefined;
    }

    function attachExternalSignal(): void {
        const external = options.signal;
        if (external == null) return;

        if (external.aborted) {
            cancel('external signal');
            return;
        }

        const handler = () => {
            cancel('external signal');
        };
        external.addEventListener('abort', handler, { once: true });
        detachExternalSignal = () => {
            external.removeEventListener('abort', handler);
        };
    }

    function countRunning(): number {
        let result_ = 0;
        for (const taskId of Object.keys(store.scheduled)) {
            if (store.tasks[taskId].status === 'running') result_++;
        }
        return result_;
    }

    function hasStartableTask(): boolean {
        for (const taskId of Object.keys(store.scheduled)) {
            if (store.tasks[taskId].status !== 'waiting') continue;
            if (isTaskReady(store, graph, taskId)) return true;
        }
        return false;
    }

    function deadlockError(): Error {
        const waiting: NameSet = {};
        const missing: NameSet = {};

        for (const taskId of Object.keys(store.scheduled)) {
            if (store.tasks[taskId].status !== 'waiting') continue;
            waiting[taskId] = true;
            for (const artifact of Object.keys(pendingArtifactsOf(store, graph, taskId))) {
                missing[artifact] = true;
            }
        }

        return OrchestratorErrors.create('EC_RTO_DEADLOCK', { waiting, missing });
    }

    function assertUsable(): void {
        if (disposed) OrchestratorErrors.raise('EC_RTO_DISPOSED');
    }
}

function linkAbort(parent: AbortSignal, child: AbortController): void {
    if (parent.aborted) {
        child.abort(parent.reason);
        return;
    }
    parent.addEventListener(
        'abort',
        () => {
            child.abort(parent.reason);
        },
        { once: true },
    );
}

function isRetryable(status: string): boolean {
    return status === 'failed' || status === 'blocked' || status === 'cancelled';
}

function clampProgress(value: number): number {
    if (!Number.isFinite(value) || value < 0) return 0;
    return value > 1 ? 1 : value;
}
