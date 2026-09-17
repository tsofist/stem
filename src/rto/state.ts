import {
    computed,
    reactive,
    readonly,
    shallowReactive,
    shallowReadonly,
    shallowRef,
} from '@vue/reactivity';
import type { Nullable, PRec, Rec } from '../index';
import type { NonNegativeInt } from '../number/integer/types';
import type { NameSet } from './graph';
import type {
    OrchestrationArtifactsRegistry,
    OrchestratorState,
    OrchestratorStatus,
    OrchestrationTaskState,
    OrchestrationTaskStatus,
} from './types';

/** Statuses a task can no longer leave without an explicit reset */
export const TerminalTaskStatuses: Readonly<PRec<true, OrchestrationTaskStatus>> = {
    completed: true,
    failed: true,
    blocked: true,
    cancelled: true,
};

/** Mutable counterpart of `OrchestrationTaskState` */
export type MutableTaskState = {
    status: OrchestrationTaskStatus;
    error: Nullable<Error>;
    progress: number;
    message: Nullable<string>;
    attempt: NonNegativeInt;
    startedAt: Nullable<number>;
    finishedAt: Nullable<number>;
    pending: NameSet;
};

/**
 * Reactive store of an orchestrator.
 *
 * Everything the scheduler reasons about lives here, so a single reactive effect keeps the whole
 * orchestration moving. Presence of an artifact is tracked by a dedicated `published` set rather
 * than by probing `artifacts`: a plain property read is reliably tracked by `@vue/reactivity`,
 * `hasOwnProperty` probing is not.
 */
export type OrchestratorStateStore<A extends OrchestrationArtifactsRegistry, T> = {
    /** Read-only projection handed out to the host application */
    readonly state: OrchestratorState<A, T>;
    readonly tasks: Rec<MutableTaskState>;
    readonly artifacts: Partial<A>;
    /** Artifacts published so far */
    readonly published: NameSet;
    /** Artifact → the task that actually published it */
    readonly publishedBy: Rec<string>;
    /** Tasks participating in the current run */
    readonly scheduled: NameSet;
    readonly getStatus: () => OrchestratorStatus;
    readonly setStatus: (status: OrchestratorStatus) => void;
    readonly getError: () => Nullable<Error>;
    readonly setError: (error: Nullable<Error>) => void;
    readonly isSettled: () => boolean;
};

/**
 * Create the reactive store of an orchestrator.
 *
 * Must be called inside the orchestrator's `effectScope()` so that every `computed()` it creates is
 * disposed together with the orchestrator.
 */
export function createOrchestratorState<A extends OrchestrationArtifactsRegistry, T>(
    taskIds: NameSet,
    infinite: NameSet,
): OrchestratorStateStore<A, T> {
    const status = shallowRef<OrchestratorStatus>('idle');
    const error = shallowRef<Nullable<Error>>(undefined);
    const artifacts = shallowReactive<Partial<A>>({});
    const published = shallowReactive<NameSet>({});
    const publishedBy: Rec<string> = {};
    const scheduled = shallowReactive<NameSet>({});
    const tasks = shallowReactive<Rec<MutableTaskState>>({});

    for (const taskId of Object.keys(taskIds)) {
        tasks[taskId] = reactive(createTaskState());
    }

    const counters = computed(() => {
        const result: Rec<NonNegativeInt, OrchestrationTaskStatus> = {
            idle: 0,
            waiting: 0,
            running: 0,
            completed: 0,
            failed: 0,
            blocked: 0,
            cancelled: 0,
        };
        for (const taskId of Object.keys(tasks)) {
            result[tasks[taskId].status]++;
        }
        return result;
    });

    const progress = computed(() => {
        let total = 0;
        let done = 0;
        for (const taskId of Object.keys(scheduled)) {
            if (infinite[taskId]) continue;
            total++;
            const task = tasks[taskId];
            if (TerminalTaskStatuses[task.status]) done += 1;
            else if (task.status === 'running') done += clampProgress(task.progress);
        }
        return total === 0 ? 0 : done / total;
    });

    const settled = computed(() => {
        for (const taskId of Object.keys(scheduled)) {
            if (infinite[taskId]) continue;
            if (!TerminalTaskStatuses[tasks[taskId].status]) return false;
        }
        return true;
    });

    const publicTasks = readonly(tasks) as OrchestratorState<A, T>['tasks'];
    const publicArtifacts = shallowReadonly(artifacts) as OrchestratorState<A, T>['artifacts'];

    const state: OrchestratorState<A, T> = {
        get status() {
            return status.value;
        },
        get error() {
            return error.value;
        },
        get tasks() {
            return publicTasks;
        },
        get artifacts() {
            return publicArtifacts;
        },
        get counters() {
            return counters.value;
        },
        get progress() {
            return progress.value;
        },
        get settled() {
            return settled.value;
        },
    };

    return {
        state,
        tasks,
        artifacts,
        published,
        publishedBy,
        scheduled,
        getStatus: () => status.value,
        setStatus: (value) => {
            status.value = value;
        },
        getError: () => error.value,
        setError: (value) => {
            error.value = value;
        },
        isSettled: () => settled.value,
    };
}

/** Initial state of a task, also used to reset one */
export function createTaskState(attempt: NonNegativeInt = 0): MutableTaskState {
    return {
        status: 'idle',
        error: undefined,
        progress: 0,
        message: undefined,
        attempt,
        startedAt: undefined,
        finishedAt: undefined,
        pending: {},
    };
}

/** Reset a task in place, preserving the attempt counter */
export function resetTaskState(target: MutableTaskState): void {
    const fresh = createTaskState(target.attempt);
    Object.assign(target, fresh);
}

/** Check that a task state is terminal for the current run */
export function isTerminalTaskState(target: OrchestrationTaskState | MutableTaskState): boolean {
    return TerminalTaskStatuses[target.status] === true;
}

function clampProgress(value: number): number {
    if (!Number.isFinite(value) || value < 0) return 0;
    return value > 1 ? 1 : value;
}
