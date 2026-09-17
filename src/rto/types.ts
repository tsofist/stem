import type { Nullable, PromiseMay, Rec, ValuesOf, VoidFunction } from '../index';
import type { NonNegativeInt, PositiveInt } from '../number/integer/types';

/**
 * Registry of artifacts known to a single orchestration: artifact name → produced value type.
 *
 * The single source of truth: every `requires`/`optional`/`produces` key and every value in
 * `OrchestratorState.artifacts` is keyed by it.
 *
 * NB: the constraint is `object` and not `URec` — a registry declared as a plain type has no index
 * signature. Members must not be optional: an optional one would make a hard requirement arrive as
 * `T | undefined` in the task context.
 *
 * @see defineOrchestration
 *
 * @example
 *   type Artifacts = {
 *      jsonSchema: SchemaObject;
 *      servicesMap: Map<string, string>;
 *   };
 */
export type OrchestrationArtifactsRegistry = object;

/** Name of an artifact declared in the registry */
export type OrchestrationArtifactName<A extends OrchestrationArtifactsRegistry> = Extract<
    keyof A,
    string
>;

/**
 * A set of artifact names; an object rather than an array so that duplicate keys are a compile
 * error (TS1117) and the key union stays directly inferable.
 */
export type OrchestrationArtifactSet<
    A extends OrchestrationArtifactsRegistry,
    K extends OrchestrationArtifactName<A> = OrchestrationArtifactName<A>,
> = Rec<true, K>;

/** Lifecycle state of a single task */
export type OrchestrationTaskStatus =
    /** Not a part of the current run */
    | 'idle'
    /** Scheduled for the current run, required artifacts are not available yet */
    | 'waiting'
    /** Executing right now */
    | 'running'
    /** Finished successfully */
    | 'completed'
    /** Threw an error */
    | 'failed'
    /** Never started: a required artifact can no longer be produced */
    | 'blocked'
    /** Aborted by `cancel()`/`dispose()` or by an external signal */
    | 'cancelled';

/** Lifecycle state of the orchestrator itself */
export type OrchestratorStatus = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';

/** Scheduling strategy */
export type OrchestrationMode =
    /** Schedule every declared task */
    | 'eager'
    /** Schedule only the tasks the result node transitively depends on */
    | 'lazy';

/**
 * View of the artifacts available to a task or to the result node.
 *
 * Hard requirements are non-optional, soft ones (`optional`) are optional.
 */
export type OrchestrationArtifactsView<
    A extends OrchestrationArtifactsRegistry,
    Req extends OrchestrationArtifactName<A>,
    Opt extends OrchestrationArtifactName<A>,
> = Simplify<Readonly<Pick<A, Req>> & Readonly<Partial<Pick<A, Opt>>>>;

/**
 * Everything a task is given while it runs.
 *
 * Read-only by design: a task never writes to the orchestrator state, it either publishes artifacts
 * or returns them.
 */
export type OrchestrationTaskContext<
    A extends OrchestrationArtifactsRegistry,
    Req extends OrchestrationArtifactName<A>,
    Opt extends OrchestrationArtifactName<A>,
    Prod extends OrchestrationArtifactName<A>,
> = {
    /** Key of this task in the orchestration `tasks` record */
    readonly taskId: string;
    /** Aborted by `cancel()`, `dispose()` or by the externally provided signal */
    readonly signal: AbortSignal;
    /** Exactly the artifacts declared in `requires` (+ `optional`), and nothing else */
    readonly artifacts: OrchestrationArtifactsView<A, Req, Opt>;
    /**
     * Publish a produced artifact before the task finishes, making its consumers runnable at once.
     *
     * Re-publishing updates the value for observers and for tasks that have not started yet, but
     * never restarts a consumer that is already running.
     */
    readonly publish: <K extends Prod>(name: K, value: A[K]) => void;
    /** Report execution progress in the `0..1` range; surfaced on `state.tasks[taskId].progress` */
    readonly progress: (value: number, message?: string) => void;
};

/** Everything the result node is given when it becomes computable */
export type OrchestrationResultContext<
    A extends OrchestrationArtifactsRegistry,
    Req extends OrchestrationArtifactName<A>,
    Opt extends OrchestrationArtifactName<A>,
> = {
    readonly signal: AbortSignal;
    readonly artifacts: OrchestrationArtifactsView<A, Req, Opt>;
};

/**
 * Declarative description of a single task, produced by `task()`.
 *
 * @see defineOrchestration
 */
export type OrchestrationTask<
    A extends OrchestrationArtifactsRegistry,
    Req extends OrchestrationArtifactName<A> = never,
    Opt extends OrchestrationArtifactName<A> = never,
    Prod extends OrchestrationArtifactName<A> = never,
> = {
    /** Artifacts the task cannot start without */
    readonly requires?: OrchestrationArtifactSet<A, Req>;
    /** Artifacts the task uses when they happen to be available, but never waits for */
    readonly optional?: OrchestrationArtifactSet<A, Opt>;
    /** Artifacts the task is expected to produce */
    readonly produces?: OrchestrationArtifactSet<A, Prod>;
    /** Artifacts are published via `ctx.publish()` instead of being returned */
    readonly streaming?: true;
    /**
     * The task is not expected to ever finish: it is excluded from progress, settlement and
     * deadlock accounting, and is aborted on `cancel()`/`dispose()`. Implies `streaming`.
     */
    readonly infinite?: true;
    readonly run: (ctx: OrchestrationTaskContext<A, Req, Opt, Prod>) => PromiseMay;
};

/** Any task definition bound to the registry `A` */
export type AnyOrchestrationTask<A extends OrchestrationArtifactsRegistry> = OrchestrationTask<
    A,
    any,
    any,
    any
>;

/** Record of task definitions bound to a known registry; its keys become the task ids */
export type OrchestrationTasks<A extends OrchestrationArtifactsRegistry> = Rec<
    AnyOrchestrationTask<A>
>;

/**
 * Constraint for the `tasks` record of a public API.
 *
 * NB: deliberately `Rec<object>` and not `OrchestrationTasks`. A tighter constraint becomes the
 * contextual type of the record literal, and TypeScript then infers the type arguments of every
 * `task()` call from it — collapsing `requires`/`produces` to `any` and silently disabling the
 * whole validation. Entries that are not task declarations are caught by
 * `ValidateOrchestrationGraph` instead.
 */
export type OrchestrationTasksRecord = Rec<object>;

/**
 * Recover the artifacts registry a record of task declarations was built for.
 *
 * Every declaration already encodes it, so the registry never has to be named twice.
 *
 * @see createTaskOrchestrator
 */
export type OrchestrationArtifactsRegistryOf<T> = ValuesOf<{
    [K in keyof T]: T[K] extends OrchestrationTask<
        infer A extends OrchestrationArtifactsRegistry,
        any,
        any,
        any
    >
        ? A
        : never;
}>;

/**
 * Terminal node of the orchestration, produced by `result()`.
 *
 * The orchestrator finishes as soon as this node becomes computable, which may happen long before
 * every task has finished.
 *
 * @see defineOrchestration
 */
export type OrchestrationResult<
    A extends OrchestrationArtifactsRegistry,
    Req extends OrchestrationArtifactName<A> = never,
    Opt extends OrchestrationArtifactName<A> = never,
    Out = void,
> = {
    readonly requires?: OrchestrationArtifactSet<A, Req>;
    readonly optional?: OrchestrationArtifactSet<A, Opt>;
    readonly collect: (ctx: OrchestrationResultContext<A, Req, Opt>) => PromiseMay<Out>;
};

/** Any result node bound to the registry `A` */
export type AnyOrchestrationResult<A extends OrchestrationArtifactsRegistry> = OrchestrationResult<
    A,
    any,
    any,
    any
>;

/** Id of a task within the orchestration `T` */
export type OrchestrationTaskId<T> = Extract<keyof T, string>;

/** Reactive state of a single task */
export type OrchestrationTaskState = {
    readonly status: OrchestrationTaskStatus;
    readonly error: Nullable<Error>;
    /** Last value reported via `ctx.progress()`, in the `0..1` range */
    readonly progress: number;
    /** Last message reported via `ctx.progress()` */
    readonly message: Nullable<string>;
    /** How many times the task has been started during the lifetime of the orchestrator */
    readonly attempt: NonNegativeInt;
    readonly startedAt: Nullable<number>;
    readonly finishedAt: Nullable<number>;
    /** Required artifacts that are not available yet */
    readonly pending: Readonly<Rec<true>>;
};

/**
 * Reactive state of the whole orchestration.
 *
 * Backed by `@vue/reactivity`, so it can be read from `computed()`/`watch()`/`effect()` of the host
 * application. Read-only: only the orchestrator writes to it.
 */
export type OrchestratorState<A extends OrchestrationArtifactsRegistry, T> = {
    readonly status: OrchestratorStatus;
    readonly error: Nullable<Error>;
    readonly tasks: Readonly<Rec<OrchestrationTaskState, OrchestrationTaskId<T>>>;
    readonly artifacts: Readonly<Partial<A>>;
    /** How many tasks are currently in each status */
    readonly counters: Readonly<Rec<NonNegativeInt, OrchestrationTaskStatus>>;
    /** Overall progress in the `0..1` range; infinite tasks are not accounted for */
    readonly progress: number;
    /** Every non-infinite scheduled task has reached a terminal status */
    readonly settled: boolean;
};

/** Payloads of the events an orchestrator emits */
export type OrchestratorEvents<A extends OrchestrationArtifactsRegistry, T> = {
    readonly 'task:status': {
        readonly taskId: OrchestrationTaskId<T>;
        readonly status: OrchestrationTaskStatus;
        readonly previous: OrchestrationTaskStatus;
    };
    readonly 'task:progress': {
        readonly taskId: OrchestrationTaskId<T>;
        readonly progress: number;
        readonly message: Nullable<string>;
    };
    readonly 'artifact:published': ValuesOf<{
        [K in keyof A]: {
            readonly artifact: K;
            readonly value: A[K];
            readonly producer: OrchestrationTaskId<T>;
        };
    }>;
    readonly 'status': {
        readonly status: OrchestratorStatus;
        readonly previous: OrchestratorStatus;
    };
};

/** Name of an event an orchestrator emits */
export type OrchestratorEventName = keyof OrchestratorEvents<
    OrchestrationArtifactsRegistry,
    unknown
>;

export type OrchestratorOptions = {
    /** Maximum number of simultaneously running tasks; unlimited by default */
    readonly concurrency?: PositiveInt;
    /** @default 'eager' */
    readonly mode?: OrchestrationMode;
    /** External cancellation source */
    readonly signal?: AbortSignal;
};

/** Reactive Task Orchestrator instance */
export type TaskOrchestrator<A extends OrchestrationArtifactsRegistry, T, Out> = {
    readonly state: OrchestratorState<A, T>;
    /**
     * Start the orchestration.
     *
     * Resolves as soon as the result node becomes computable; when the orchestration has no result
     * node, resolves once every non-infinite task has settled.
     */
    readonly run: () => Promise<Out>;
    /** Resolves when every non-infinite task has settled, regardless of the result node */
    readonly whenSettled: () => Promise<void>;
    /**
     * Re-execute a failed task and everything that transitively depends on it.
     *
     * Artifacts produced by unaffected tasks are preserved. Without arguments every failed task is
     * retried.
     */
    readonly retry: (taskId?: OrchestrationTaskId<T>) => Promise<Out>;
    /** Abort every running task and reject a pending `run()` */
    readonly cancel: (reason?: string) => void;
    /** Drop every artifact and return every task to `idle` */
    readonly reset: () => void;
    /** Subscribe to an event; returns the unsubscribe function */
    readonly on: <E extends OrchestratorEventName>(
        event: E,
        handler: (payload: OrchestratorEvents<A, T>[E]) => void,
    ) => VoidFunction;
    /** Stop every internal reactive effect and abort in-flight tasks; the instance becomes unusable */
    readonly dispose: () => void;
};

/**
 * Description of the whole orchestration.
 *
 * The artifacts registry is not a parameter — it is recovered from the task declarations by
 * `OrchestrationArtifactsRegistryOf`.
 *
 * @see createTaskOrchestrator
 */
export type OrchestrationDefinition<
    T extends OrchestrationTasksRecord,
    RReq extends OrchestrationArtifactName<OrchestrationArtifactsRegistryOf<T>> = never,
    ROpt extends OrchestrationArtifactName<OrchestrationArtifactsRegistryOf<T>> = never,
    Out = Readonly<Partial<OrchestrationArtifactsRegistryOf<T>>>,
> = {
    readonly tasks: T;
    readonly result?: OrchestrationResult<OrchestrationArtifactsRegistryOf<T>, RReq, ROpt, Out>;
};

/**
 * Declaration builders bound to a single artifacts registry.
 *
 * @see defineOrchestration
 * @see createTaskOrchestrator
 */
export type OrchestrationBuilders<A extends OrchestrationArtifactsRegistry> = {
    /**
     * Declare a task that consumes artifacts without producing any.
     */
    readonly task: {
        <
            Req extends OrchestrationArtifactName<A> = never,
            Opt extends OrchestrationArtifactName<A> = never,
        >(def: {
            readonly requires?: OrchestrationArtifactSet<A, Req>;
            readonly optional?: OrchestrationArtifactSet<A, Opt>;
            readonly produces?: undefined;
            readonly streaming?: undefined;
            readonly infinite?: true;
            readonly run: (
                ctx: OrchestrationTaskContext<A, NoInfer<Req>, NoInfer<Opt>, never>,
            ) => PromiseMay<void>;
        }): OrchestrationTask<A, Req, Opt>;

        /**
         * Declare a task that returns every artifact it produces when it finishes.
         */
        <
            Req extends OrchestrationArtifactName<A> = never,
            Opt extends OrchestrationArtifactName<A> = never,
            Prod extends OrchestrationArtifactName<A> = never,
            R extends Pick<A, Prod> = Pick<A, Prod>,
        >(def: {
            readonly requires?: OrchestrationArtifactSet<A, Req>;
            readonly optional?: OrchestrationArtifactSet<A, Opt>;
            readonly produces: OrchestrationArtifactSet<A, Prod>;
            readonly streaming?: undefined;
            readonly infinite?: undefined;
            readonly run: (
                ctx: OrchestrationTaskContext<A, NoInfer<Req>, NoInfer<Opt>, NoInfer<Prod>>,
            ) => PromiseMay<ExactProducedArtifacts<Pick<A, NoInfer<Prod>>, R>>;
        }): OrchestrationTask<A, Req, Opt, Prod>;

        /**
         * Declare a task that publishes its artifacts via `ctx.publish()` as they become available.
         */
        <
            Req extends OrchestrationArtifactName<A> = never,
            Opt extends OrchestrationArtifactName<A> = never,
            Prod extends OrchestrationArtifactName<A> = never,
        >(def: {
            readonly requires?: OrchestrationArtifactSet<A, Req>;
            readonly optional?: OrchestrationArtifactSet<A, Opt>;
            readonly produces: OrchestrationArtifactSet<A, Prod>;
            readonly streaming: true;
            readonly infinite?: true;
            readonly run: (
                ctx: OrchestrationTaskContext<A, NoInfer<Req>, NoInfer<Opt>, NoInfer<Prod>>,
            ) => PromiseMay<void>;
        }): OrchestrationTask<A, Req, Opt, Prod>;
    };

    /** Declare the terminal node of the orchestration */
    readonly result: <
        Req extends OrchestrationArtifactName<A> = never,
        Opt extends OrchestrationArtifactName<A> = never,
        Out = void,
    >(def: {
        readonly requires?: OrchestrationArtifactSet<A, Req>;
        readonly optional?: OrchestrationArtifactSet<A, Opt>;
        readonly collect: (
            ctx: OrchestrationResultContext<A, NoInfer<Req>, NoInfer<Opt>>,
        ) => PromiseMay<Out>;
    }) => OrchestrationResult<A, Req, Opt, Out>;
};

/**
 * Compile-time validation of an orchestration graph: a requirement with no producer, an artifact
 * produced twice, a task requiring what it produces itself, an entry that is not a declaration.
 *
 * Resolves to `unknown` (a no-op in an intersection) for a valid graph, and to a branded object
 * carrying a human-readable message otherwise.
 *
 * Cycles are deliberately not covered — they are not expressible cheaply at the type level and are
 * reported by the runtime validator instead.
 *
 * @see createTaskOrchestrator
 */
export type ValidateOrchestrationGraph<T, RReq> = [NotATask<T>] extends [never]
    ? [UnreachableArtifact<T, RReq>] extends [never]
        ? [DuplicateArtifact<T>] extends [never]
            ? [SelfDependentArtifact<T>] extends [never]
                ? unknown
                : OrchestrationTypeError<`task requires an artifact it produces itself: "${SelfDependentArtifact<T> &
                      string}"`>
            : OrchestrationTypeError<`artifact "${DuplicateArtifact<T> &
                  string}" is produced by more than one task`>
        : OrchestrationTypeError<`artifact "${UnreachableArtifact<T, RReq> &
              string}" is required but has no producer`>
    : OrchestrationTypeError<`"${NotATask<T> & string}" is not a task declared with "task()"`>;

/** Compile-time diagnostic carrier: a readable message instead of a bare `never` */
type OrchestrationTypeError<M extends string> = { readonly __rtoError: M };

/**
 * Rejects artifacts that are not declared in `produces`.
 *
 * NB: the `U[K]` in the true branch is load-bearing — the seemingly equivalent `T[K]` disables
 * reverse mapped-type inference for `U` and the check silently evaporates. Excess-property checking
 * cannot be used instead: it does not fire for a return expression contextually typed through a
 * function-type target.
 *
 * @see ShallowExact
 */
type ExactProducedArtifacts<T, U extends T = T> = {
    [K in keyof U]: K extends keyof T
        ? U[K]
        : OrchestrationTypeError<`artifact "${K & string}" is not declared in "produces"`>;
};

/** Flattens an intersection so that hovers show the real fields; preserves `readonly` and `?` */
type Simplify<T> = { [K in keyof T]: T[K] } & {};

type NotATask<T> = ValuesOf<{
    [K in keyof T]: T[K] extends AnyOrchestrationTask<any> ? never : K;
}>;
type RequiredArtifactsOf<T> = T extends OrchestrationTask<any, infer Req, any, any> ? Req : never;
type ProducedArtifactsOf<T> = T extends OrchestrationTask<any, any, any, infer Prod> ? Prod : never;
type AllRequiredArtifacts<T> = ValuesOf<{ [K in keyof T]: RequiredArtifactsOf<T[K]> }>;
type AllProducedArtifacts<T> = ValuesOf<{ [K in keyof T]: ProducedArtifactsOf<T[K]> }>;
type UnreachableArtifact<T, RReq> = Exclude<
    AllRequiredArtifacts<T> | RReq,
    AllProducedArtifacts<T>
>;
type DuplicateArtifact<T> = ValuesOf<{
    [K in keyof T]: ProducedArtifactsOf<T[K]> & AllProducedArtifacts<Omit<T, K>>;
}>;
type SelfDependentArtifact<T> = ValuesOf<{
    [K in keyof T]: RequiredArtifactsOf<T[K]> & ProducedArtifactsOf<T[K]>;
}>;
