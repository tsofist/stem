# Reactive Task Orchestrator

> *RTO* is kept only as the module's short name — the `lib/rto` path and the `EC_RTO_*` error-code
> family. Nothing in the API vocabulary uses the abbreviation.

A dependency-driven task orchestration engine with DAG-based scheduling, built on `@vue/reactivity`.

Tasks declare which named **artifacts** they require and which they produce. The engine derives the
execution order from those declarations alone, runs every ready task in parallel, keeps all runtime
state in a reactive store, and resolves as soon as the terminal **result node** becomes computable —
possibly long before every task has finished.

```ts
import { defineOrchestration } from '@tsofist/stem/lib/rto/define';
import { createTaskOrchestrator } from '@tsofist/stem/lib/rto/runner';
import { OrchestratorErrors } from '@tsofist/stem/lib/rto/errors';
import type { TaskOrchestrator, OrchestratorState } from '@tsofist/stem/lib/rto/types';
```

## Quick start

```ts
type Artifacts = {
    jsonSchema: SchemaObject;
    servicesMap: Map<string, string>;
    openApi: OpenAPIDocument;
};

const { task, result } = defineOrchestration<Artifacts>();

const rto = createTaskOrchestrator({
    tasks: {
        genSchema: task({
            produces: { jsonSchema: true },
            run: async ({ signal }) => ({ jsonSchema: await buildSchema(signal) }),
        }),
        genServices: task({
            requires: { jsonSchema: true },
            produces: { servicesMap: true },
            run: ({ artifacts }) => ({ servicesMap: mapServices(artifacts.jsonSchema) }),
        }),
        genOpenApi: task({
            requires: { jsonSchema: true, servicesMap: true },
            produces: { openApi: true },
            run: ({ artifacts }) => ({ openApi: convert(artifacts) }),
        }),
    },
    result: result({
        requires: { openApi: true },
        collect: ({ artifacts }) => artifacts.openApi,
    }),
});

const openApi = await rto.run(); // Promise<OpenAPIDocument>
```

The **artifacts registry** (`Artifacts` above) is the single source of truth: every
`requires`/`optional`/`produces` key is checked against it, and `ctx.artifacts` inside `run` contains
exactly what the task declared — nothing more.

Task ids are the keys of the `tasks` record, so they are unique by construction and stay literal
throughout the API (`rto.state.tasks.genServices`, `rto.retry('genOpenApi')`).

### Two pieces, and why

`defineOrchestration<A>()` returns nothing but two identity functions — `task` and `result`. They
exist only because TypeScript has no partial type-argument inference: a flat
`task<Artifacts, …>({…})` would silently degrade the inferred `requires`/`produces` unions to
`never`. Currying is what binds the registry so that `ctx.artifacts` can be typed precisely.

`createTaskOrchestrator()` is a plain top-level function. It does *not* need the registry named
again — the declarations already carry it, and it is recovered from them
(`OrchestrationArtifactsRegistryOf<T>`).

Because the builders carry no state, they can be exported and used across modules:

```ts
// rto-context.ts
export const { task, result } = defineOrchestration<Artifacts>();

// gen-schema.task.ts
import { task } from './rto-context';
export const genSchema = task({ produces: { jsonSchema: true }, run: … });

// pipeline.ts
import { createTaskOrchestrator } from '@tsofist/stem/lib/rto/runner';
import { genSchema } from './gen-schema.task';
export const pipeline = createTaskOrchestrator({ tasks: { genSchema, … } });
```

## Graphs assembled at runtime

Everything above assumes the `tasks` record is a literal the compiler can see through. When it is
not — tasks discovered from a plugin registry, built in a loop, filtered by a feature flag — use
`createDynamicTaskOrchestrator()`:

```ts
import { createDynamicTaskOrchestrator } from '@tsofist/stem/lib/rto/runner';
import type { OrchestrationTasks } from '@tsofist/stem/lib/rto/types';

const tasks: OrchestrationTasks<Artifacts> = {};
for (const plugin of enabledPlugins) {
    tasks[plugin.id] = task({
        requires: plugin.requires,
        produces: plugin.produces,
        run: plugin.run,
    });
}

const rto = createDynamicTaskOrchestrator<Artifacts, typeof tasks, OpenAPIDocument>(
    { tasks, result: result({ requires: { openApi: true }, collect: ({ artifacts }) => artifacts.openApi }) },
    { concurrency: 4 },
);
```

It is the same engine and the same runtime validation — cycles, missing and duplicate producers,
malformed declarations all still throw at construction. What is given up is what the compiler cannot
know about a record whose keys it cannot see:

| | `createTaskOrchestrator` | `createDynamicTaskOrchestrator` |
|---|---|---|
| runtime validation | yes | yes |
| compile-time graph validation | yes | no |
| artifacts registry | recovered from declarations | passed explicitly as `A` |
| result type `Out` | inferred from `collect()` | passed explicitly |
| `state.tasks` keys | literal task ids | `string` |
| `retry(taskId)` | checked against the task ids | any `string` |

Prefer `createTaskOrchestrator` whenever the definition is a literal — the two are otherwise
interchangeable, and a dynamic graph can still be declared with `task()`/`result()` so that each
individual task keeps its precise run-context typing.

## Declaring dependencies

Dependencies are declared **by artifact**, never by task: every artifact has exactly one producer, so
naming the producer as well would only duplicate information that can go out of sync.

| field | meaning |
|---|---|
| `requires` | hard dependency — the task does not start until every one of these is published |
| `optional` | soft dependency — used when available, never waited for; arrives as `T \| undefined` |
| `produces` | artifacts the task is expected to publish |

```ts
task({
    requires: { jsonSchema: true },
    optional: { dbml: true },
    produces: { openApi: true },
    run: ({ artifacts }) => {
        artifacts.jsonSchema; // SchemaObject
        artifacts.dbml; // string | undefined
        artifacts.servicesMap; // compile error: not declared
        return { openApi: {} };
    },
});
```

Sets are objects rather than arrays so that duplicate keys are a compile error and the key union
stays directly inferable.

## Validation

A malformed graph is rejected twice over.

**At compile time**, `createTaskOrchestrator()` reports a readable message for a requirement with no
producer, an artifact produced by two tasks, a task requiring what it produces itself, and an entry
that is not a task declaration:

```
Property '__rtoError' is missing in type '{ tasks: … }' but required in type
'{ __rtoError: "artifact \"openApi\" is required but has no producer" }'
```

**At runtime**, `createTaskOrchestrator()` validates the same rules plus the ones the type system
cannot express (cycles), which is what protects a graph assembled dynamically. Every error carries a
machine readable code and context — see `OrchestratorErrors` in [`errors.ts`](./errors.ts):

```
EC_RTO_DUPLICATE_PRODUCER   EC_RTO_MISSING_PRODUCER     EC_RTO_CYCLIC_DEPENDENCY
EC_RTO_CONFLICTING_REQUIRE  EC_RTO_CONFLICTING_OUTPUT   EC_RTO_INVALID_TASK
EC_RTO_UNDECLARED_ARTIFACT  EC_RTO_MISSING_OUTPUT       EC_RTO_DEADLOCK
EC_RTO_RESULT_UNREACHABLE   EC_RTO_CANCELLED            EC_RTO_UNKNOWN_TASK
EC_RTO_ALREADY_RUNNING      EC_RTO_DISPOSED
```

## Reactive state

`rto.state` is a read-only projection of a `@vue/reactivity` store, so it can be consumed from
`computed()`, `watch()` or `effect()` in the host application — or from a Vue component, without the
engine knowing anything about Vue.

```ts
watch(() => rto.state.progress, (value) => renderProgressBar(value));

rto.state.status; // idle | running | completed | failed | cancelled
rto.state.tasks.genSchema; // { status, error, progress, message, attempt, startedAt, … }
rto.state.artifacts; // Readonly<Partial<Artifacts>>
rto.state.counters; // how many tasks are in each status
rto.state.progress; // 0..1, infinite tasks excluded
rto.state.settled; // every non-infinite scheduled task reached a terminal status
```

A task reports its own progress through the context:

```ts
run: async ({ progress }) => {
    progress(0.5, 'parsing');
    …
};
```

### Events

```ts
const off = rto.on('task:status', ({ taskId, status, previous }) => …);
rto.on('task:progress', ({ taskId, progress, message }) => …);
rto.on('artifact:published', ({ artifact, value, producer }) => …);
rto.on('status', ({ status, previous }) => …);
```

`task:status`, `task:progress` and `status` are *derived* from the reactive state by watchers, so
they cannot drift apart from what `state` reports. A throwing listener is isolated: it is reported
through `console.error` and never fails the producing task.

## Streaming and infinite tasks

A task can publish artifacts *while it runs* instead of returning them, which unblocks its consumers
immediately:

```ts
task({
    produces: { jsonSchema: true },
    streaming: true,
    run: async ({ publish, signal }) => {
        for await (const schema of watchFiles(signal)) publish('jsonSchema', schema);
    },
});
```

Add `infinite: true` for a task that is not expected to ever finish. Infinite tasks are excluded from
progress, settlement and deadlock accounting, so the orchestration completes normally around them;
they are aborted by `cancel()` and `dispose()`.

Re-publishing an artifact updates its value for observers and for tasks that have not started yet,
but never restarts a consumer that is already running.

## Lifecycle

```ts
await rto.run(); // resolves when the result node becomes computable
await rto.whenSettled(); // resolves when every non-infinite task has settled
await rto.retry('genOpenApi'); // re-run one task and its transitive dependents
await rto.retry(); // re-run every failed task and their dependents
rto.cancel('user aborted'); // abort in-flight tasks, reject a pending run()
rto.reset(); // back to a clean slate
rto.dispose(); // stop every effect; the instance becomes unusable
```

`run()` may resolve while unrelated branches are still executing — that is the point of the result
node. `state.status` becomes `completed` at that moment, while `state.settled` stays `false` until
the rest of the graph finishes. `cancel()` works after that too, which is how long-living producers
are stopped.

`retry()` resets only the target task and its transitive dependents, dropping only the artifacts
those tasks produced; everything else is preserved and is not recomputed.

### Options

```ts
createTaskOrchestrator(definition, {
    concurrency: 4, // max simultaneously running tasks; unlimited by default
    mode: 'lazy', // schedule only what the result node needs ('eager' by default)
    signal: controller.signal, // external cancellation
});
```

## Failures

A task that throws becomes `failed`; tasks that hard-require something it will never publish become
`blocked`, transitively. Independent branches keep running and their artifacts are preserved.

- With a result node: `run()` rejects with `EC_RTO_RESULT_UNREACHABLE` as soon as a result
  requirement can no longer be produced.
- Without a result node: `run()` rejects with the first task error once everything has settled, and
  resolves with a snapshot of all published artifacts otherwise.

A task that finishes without publishing everything it declared fails with `EC_RTO_MISSING_OUTPUT`,
and publishing something undeclared fails with `EC_RTO_UNDECLARED_ARTIFACT`.

## Notes

- Registry members must not be optional — an optional member would make a hard requirement arrive as
  `T | undefined` inside `run`.
- There is no barrel: import from `lib/rto/define`, `lib/rto/runner`, `lib/rto/errors` and
  `lib/rto/types` directly, as everywhere else in this library.
- Do not annotate the `tasks` record with a type (`const tasks: Rec<…> = {…}`): that collapses
  `keyof` to `string` and the literal task ids are lost. Use a bare `const`, or `satisfies`. For the
  same reason the `tasks` constraint is `Rec<object>` and not a task-shaped type — a tighter one
  becomes the contextual type of the literal and TypeScript then infers every `task()` call's type
  arguments from it, collapsing `requires`/`produces` to `any`.
- Artifact values are stored in a `shallowReactive` map and exposed through `shallowReadonly`, so
  they are never wrapped in a reactive proxy and never mutated by the engine.
