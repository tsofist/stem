import type { Rec } from '../index';
import { OrchestratorErrors } from './errors';
import type {
    AnyOrchestrationResult,
    AnyOrchestrationTask,
    OrchestrationArtifactsRegistry,
    OrchestrationTasks,
} from './types';

/** A set of names; presence is the payload, `true` is the only legal value */
export type NameSet = Rec<true>;

/**
 * Immutable topology of an orchestration, fully validated before anything is executed.
 *
 * Contains no reactive state whatsoever.
 *
 * @see buildOrchestrationGraph
 */
export type OrchestrationGraph = {
    /** Every declared task id, in declaration order */
    readonly taskIds: NameSet;
    /** Artifact → the single task producing it */
    readonly producerOf: Rec<string>;
    /** Task → artifacts it produces */
    readonly producesOf: Rec<NameSet>;
    /** Task → artifacts it cannot start without */
    readonly requiresOf: Rec<NameSet>;
    /** Task → artifacts it uses when available but never waits for */
    readonly optionalOf: Rec<NameSet>;
    /** Task → tasks producing its hard requirements */
    readonly dependenciesOf: Rec<NameSet>;
    /** Task → tasks that hard-require something it produces */
    readonly dependentsOf: Rec<NameSet>;
    /** Tasks that are not expected to ever finish */
    readonly infinite: NameSet;
    /** Tasks publishing their artifacts via `ctx.publish()` */
    readonly streaming: NameSet;
    /** Artifacts the result node cannot be computed without */
    readonly resultRequires: NameSet;
    /** Artifacts the result node uses when available */
    readonly resultOptional: NameSet;
    /** Tasks the result node transitively depends on; every task when there is no result node */
    readonly resultClosure: NameSet;
};

/**
 * Build and validate the topology of an orchestration.
 *
 * Validates, in order: a single producer per artifact, well-formed task declarations, a producer
 * for every hard requirement, and the absence of cycles.
 *
 * @see createTaskOrchestrator
 *
 * @throws EC_RTO_DUPLICATE_PRODUCER
 * @throws EC_RTO_CONFLICTING_REQUIRE
 * @throws EC_RTO_CONFLICTING_OUTPUT
 * @throws EC_RTO_INVALID_TASK
 * @throws EC_RTO_MISSING_PRODUCER
 * @throws EC_RTO_CYCLIC_DEPENDENCY
 */
export function buildOrchestrationGraph<A extends OrchestrationArtifactsRegistry>(
    tasks: OrchestrationTasks<A>,
    result?: AnyOrchestrationResult<A>,
): OrchestrationGraph {
    const taskIds: NameSet = {};
    const producerOf: Rec<string> = {};
    const producesOf: Rec<NameSet> = {};
    const requiresOf: Rec<NameSet> = {};
    const optionalOf: Rec<NameSet> = {};
    const dependenciesOf: Rec<NameSet> = {};
    const dependentsOf: Rec<NameSet> = {};
    const infinite: NameSet = {};
    const streaming: NameSet = {};

    for (const taskId of Object.keys(tasks)) {
        const task: AnyOrchestrationTask<A> = tasks[taskId];

        taskIds[taskId] = true;
        producesOf[taskId] = nameSetOf(task.produces);
        requiresOf[taskId] = nameSetOf(task.requires);
        optionalOf[taskId] = nameSetOf(task.optional);
        dependenciesOf[taskId] = {};
        dependentsOf[taskId] = {};

        if (typeof task.run !== 'function') {
            OrchestratorErrors.raise('EC_RTO_INVALID_TASK', {
                taskId,
                reason: '"run" is not a function',
            });
        }

        const produces = producesOf[taskId];
        const hasOutputs = Object.keys(produces).length > 0;

        if (task.streaming) {
            streaming[taskId] = true;
            if (!hasOutputs) {
                OrchestratorErrors.raise('EC_RTO_INVALID_TASK', {
                    taskId,
                    reason: 'a streaming task must declare "produces"',
                });
            }
        }
        if (task.infinite) {
            infinite[taskId] = true;
            if (hasOutputs && !task.streaming) {
                OrchestratorErrors.raise('EC_RTO_INVALID_TASK', {
                    taskId,
                    reason: 'an infinite task producing artifacts must be "streaming"',
                });
            }
        }

        for (const artifact of Object.keys(produces)) {
            const owner = producerOf[artifact];
            if (owner != null) {
                OrchestratorErrors.raise('EC_RTO_DUPLICATE_PRODUCER', {
                    artifact,
                    tasks: { [owner]: true, [taskId]: true },
                });
            }
            if (requiresOf[taskId][artifact] || optionalOf[taskId][artifact]) {
                OrchestratorErrors.raise('EC_RTO_CONFLICTING_OUTPUT', { taskId, artifact });
            }
            producerOf[artifact] = taskId;
        }

        for (const artifact of Object.keys(requiresOf[taskId])) {
            if (optionalOf[taskId][artifact]) {
                OrchestratorErrors.raise('EC_RTO_CONFLICTING_REQUIRE', { taskId, artifact });
            }
        }
    }

    const resultRequires = nameSetOf(result?.requires);
    const resultOptional = nameSetOf(result?.optional);

    for (const taskId of Object.keys(taskIds)) {
        for (const artifact of Object.keys(requiresOf[taskId])) {
            const producer = producerOf[artifact];
            if (producer == null) {
                OrchestratorErrors.raise('EC_RTO_MISSING_PRODUCER', {
                    artifact,
                    requiredBy: { [taskId]: true },
                });
            }
            dependenciesOf[taskId][producer] = true;
            dependentsOf[producer][taskId] = true;
        }
    }

    for (const artifact of Object.keys(resultRequires)) {
        if (producerOf[artifact] == null) {
            OrchestratorErrors.raise('EC_RTO_MISSING_PRODUCER', { artifact, requiredBy: {} });
        }
    }

    detectCycle(taskIds, dependenciesOf);

    return {
        taskIds,
        producerOf,
        producesOf,
        requiresOf,
        optionalOf,
        dependenciesOf,
        dependentsOf,
        infinite,
        streaming,
        resultRequires,
        resultOptional,
        resultClosure:
            result == null
                ? { ...taskIds }
                : collectClosure(dependenciesOf, producersOf(producerOf, resultRequires)),
    };
}

/**
 * Collect the transitive closure of `seeds` over the given adjacency, seeds included.
 *
 * Iterative on purpose: a deep graph must not be able to blow the call stack.
 */
export function collectClosure(adjacency: Rec<NameSet>, seeds: NameSet): NameSet {
    const result: NameSet = {};
    const queue = Object.keys(seeds);

    while (queue.length > 0) {
        const current = queue.pop()!;
        if (result[current]) continue;
        result[current] = true;
        for (const next of Object.keys(adjacency[current] ?? {})) {
            if (!result[next]) queue.push(next);
        }
    }

    return result;
}

/** Tasks producing the given artifacts */
export function producersOf(producerOf: Rec<string>, artifacts: NameSet): NameSet {
    const result: NameSet = {};
    for (const artifact of Object.keys(artifacts)) {
        const producer = producerOf[artifact];
        if (producer != null) result[producer] = true;
    }
    return result;
}

function nameSetOf(source: Rec<true> | undefined): NameSet {
    const result: NameSet = {};
    if (source != null) {
        for (const name of Object.keys(source)) {
            if (source[name]) result[name] = true;
        }
    }
    return result;
}

/**
 * Iterative depth-first search reporting the first cycle it runs into.
 *
 * The reported path follows the "depends on" direction, with the first task repeated at the end.
 *
 * @throws EC_RTO_CYCLIC_DEPENDENCY
 */
function detectCycle(taskIds: NameSet, dependenciesOf: Rec<NameSet>): void {
    const visited: NameSet = {};
    const path: string[] = [];
    const onPath: NameSet = {};

    for (const root of Object.keys(taskIds)) {
        if (visited[root]) continue;

        const stack: { taskId: string; deps: string[]; index: number }[] = [
            { taskId: root, deps: Object.keys(dependenciesOf[root]), index: 0 },
        ];
        path.push(root);
        onPath[root] = true;

        while (stack.length > 0) {
            const frame = stack[stack.length - 1];

            if (frame.index >= frame.deps.length) {
                visited[frame.taskId] = true;
                delete onPath[frame.taskId];
                path.pop();
                stack.pop();
                continue;
            }

            const next = frame.deps[frame.index++];

            if (onPath[next]) {
                OrchestratorErrors.raise('EC_RTO_CYCLIC_DEPENDENCY', {
                    path: [...path.slice(path.indexOf(next)), next],
                });
            }
            if (visited[next]) continue;

            path.push(next);
            onPath[next] = true;
            stack.push({ taskId: next, deps: Object.keys(dependenciesOf[next]), index: 0 });
        }
    }
}
