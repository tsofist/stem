import type { OrchestrationGraph, NameSet } from './graph';
import { TerminalTaskStatuses, type OrchestratorStateStore } from './state';
import type { OrchestrationArtifactsRegistry } from './types';

/** Every hard requirement of the task has been published */
export function isTaskReady<A extends OrchestrationArtifactsRegistry, T>(
    store: OrchestratorStateStore<A, T>,
    graph: OrchestrationGraph,
    taskId: string,
): boolean {
    for (const artifact of Object.keys(graph.requiresOf[taskId])) {
        if (!store.published[artifact]) return false;
    }
    return true;
}

/** Hard requirements of the task that have not been published yet */
export function pendingArtifactsOf<A extends OrchestrationArtifactsRegistry, T>(
    store: OrchestratorStateStore<A, T>,
    graph: OrchestrationGraph,
    taskId: string,
): NameSet {
    const result: NameSet = {};
    for (const artifact of Object.keys(graph.requiresOf[taskId])) {
        if (!store.published[artifact]) result[artifact] = true;
    }
    return result;
}

/**
 * Artifacts that can no longer appear during the current run.
 *
 * An artifact is unreachable when its producer will never publish it — it failed, was blocked or
 * cancelled, finished without it, or is not scheduled at all — and the property propagates: a task
 * that hard-requires an unreachable artifact will never run, so none of its artifacts can appear
 * either.
 *
 * Recomputed to a fixpoint on every scheduling pass: the graphs are small, and this keeps the engine
 * free of incremental bookkeeping that could drift out of sync with the state.
 */
export function collectUnreachableArtifacts<A extends OrchestrationArtifactsRegistry, T>(
    store: OrchestratorStateStore<A, T>,
    graph: OrchestrationGraph,
): NameSet {
    const unreachable: NameSet = {};
    const dead: NameSet = {};

    for (const taskId of Object.keys(graph.taskIds)) {
        if (isDeadProducer(store, taskId)) dead[taskId] = true;
    }

    let changed = true;
    while (changed) {
        changed = false;

        for (const taskId of Object.keys(dead)) {
            for (const artifact of Object.keys(graph.producesOf[taskId])) {
                if (store.published[artifact] || unreachable[artifact]) continue;
                unreachable[artifact] = true;
                changed = true;
            }
        }

        for (const taskId of Object.keys(graph.taskIds)) {
            if (dead[taskId]) continue;
            for (const artifact of Object.keys(graph.requiresOf[taskId])) {
                if (!unreachable[artifact]) continue;
                dead[taskId] = true;
                changed = true;
                break;
            }
        }
    }

    return unreachable;
}

/** Build the artifacts view handed to a task or to the result node */
export function artifactsViewOf<A extends OrchestrationArtifactsRegistry, T>(
    store: OrchestratorStateStore<A, T>,
    required: NameSet,
    optional: NameSet,
): Partial<A> {
    const result: Partial<A> = {};
    for (const artifact of Object.keys(required)) {
        result[artifact as keyof A] = store.artifacts[artifact as keyof A];
    }
    for (const artifact of Object.keys(optional)) {
        if (store.published[artifact]) {
            result[artifact as keyof A] = store.artifacts[artifact as keyof A];
        }
    }
    return result;
}

/**
 * The task will never publish anything it has not published already.
 *
 * NB: a task that is scheduled but still `idle`/`waiting`/`running` is not dead — it may yet run.
 */
function isDeadProducer<A extends OrchestrationArtifactsRegistry, T>(
    store: OrchestratorStateStore<A, T>,
    taskId: string,
): boolean {
    if (!store.scheduled[taskId]) return true;
    return TerminalTaskStatuses[store.tasks[taskId].status] === true;
}
