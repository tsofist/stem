import { type EffectScope, watch } from '@vue/reactivity';
import type { Rec, VoidFunction } from '../index';
import type { OrchestratorStateStore } from './state';
import type {
    OrchestrationArtifactsRegistry,
    OrchestratorEventName,
    OrchestratorEvents,
    OrchestratorStatus,
    OrchestrationTaskId,
    OrchestrationTaskStatus,
} from './types';

export type OrchestratorEventEmitter<A extends OrchestrationArtifactsRegistry, T> = {
    readonly on: <E extends OrchestratorEventName>(
        event: E,
        handler: (payload: OrchestratorEvents<A, T>[E]) => void,
    ) => VoidFunction;
    readonly emit: <E extends OrchestratorEventName>(
        event: E,
        payload: OrchestratorEvents<A, T>[E],
    ) => void;
};

/**
 * Typed event emitter of an orchestrator.
 *
 * `task:status`, `task:progress` and `status` are *derived* from the reactive state by watchers, so
 * they cannot drift apart from what `state` reports. `artifact:published` is emitted at the
 * publishing site instead: re-publishing leaves the state shape unchanged, and the producer of a
 * given value is not recoverable from the state afterwards.
 *
 * Watchers are created lazily, on first subscription, inside the orchestrator's effect scope.
 */
export function createOrchestratorEvents<A extends OrchestrationArtifactsRegistry, T>(
    scope: EffectScope,
    store: OrchestratorStateStore<A, T>,
): OrchestratorEventEmitter<A, T> {
    const handlers: Rec<Set<(payload: any) => void>> = {};
    const watching: Rec<true> = {};

    function emit<E extends OrchestratorEventName>(
        event: E,
        payload: OrchestratorEvents<A, T>[E],
    ): void {
        const listeners = handlers[event];
        if (listeners == null) return;
        for (const handler of [...listeners]) {
            try {
                handler(payload);
            } catch (e) {
                // A faulty listener must never corrupt the orchestration; `emit` is called from
                // inside `ctx.publish()`, where a thrown error would fail the producing task

                console.error(`[TaskOrchestrator] "${event}" listener failed`, e);
            }
        }
    }

    function on<E extends OrchestratorEventName>(
        event: E,
        handler: (payload: OrchestratorEvents<A, T>[E]) => void,
    ): VoidFunction {
        handlers[event] ??= new Set();
        handlers[event].add(handler);

        if (!watching[event]) {
            watching[event] = true;
            scope.run(() => {
                startWatching(event);
            });
        }

        return () => {
            handlers[event]?.delete(handler);
        };
    }

    function startWatching(event: OrchestratorEventName): void {
        switch (event) {
            case 'task:status':
                watch(
                    () => snapshotOf(store, (taskId) => store.tasks[taskId].status),
                    (
                        next: Rec<OrchestrationTaskStatus>,
                        previous: Rec<OrchestrationTaskStatus>,
                    ) => {
                        for (const taskId of Object.keys(next)) {
                            if (next[taskId] === previous[taskId]) continue;
                            emit('task:status', {
                                taskId: taskId as OrchestrationTaskId<T>,
                                status: next[taskId],
                                previous: previous[taskId],
                            });
                        }
                    },
                );
                break;

            case 'task:progress':
                watch(
                    () => snapshotOf(store, (taskId) => store.tasks[taskId].progress),
                    (next: Rec<number>, previous: Rec<number>) => {
                        for (const taskId of Object.keys(next)) {
                            if (next[taskId] === previous[taskId]) continue;
                            emit('task:progress', {
                                taskId: taskId as OrchestrationTaskId<T>,
                                progress: next[taskId],
                                message: store.tasks[taskId].message,
                            });
                        }
                    },
                );
                break;

            case 'status':
                watch(
                    () => store.getStatus(),
                    (status: OrchestratorStatus, previous: OrchestratorStatus) => {
                        emit('status', { status, previous });
                    },
                );
                break;

            case 'artifact:published':
                // Emitted directly by the orchestrator, see the note above
                break;
        }
    }

    return { on, emit };
}

function snapshotOf<A extends OrchestrationArtifactsRegistry, T, V>(
    store: OrchestratorStateStore<A, T>,
    read: (taskId: string) => V,
): Rec<V> {
    const result: Rec<V> = {};
    for (const taskId of Object.keys(store.tasks)) {
        result[taskId] = read(taskId);
    }
    return result;
}
