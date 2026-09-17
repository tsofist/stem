import type { OrchestrationArtifactsRegistry, OrchestrationBuilders } from './types';

/**
 * Create the `task()` and `result()` builders bound to a single artifacts registry.
 *
 * Both are identity functions at runtime: they exist only to attach the registry to a declaration
 * and to type its run context precisely. The currying is what makes that possible — TypeScript has
 * no partial type-argument inference, so a flat `task<Artifacts, …>({…})` would silently fall back
 * to the default (`never`) unions instead of inferring them from `requires`/`produces`.
 *
 * The builders carry no state, so they can be exported and used to declare tasks across many files.
 *
 * @see createTaskOrchestrator
 *
 * @example
 *   export const { task, result } = defineOrchestration<Artifacts>();
 */
export function defineOrchestration<
    A extends OrchestrationArtifactsRegistry,
>(): OrchestrationBuilders<A> {
    return {
        task: identity as OrchestrationBuilders<A>['task'],
        result: identity as OrchestrationBuilders<A>['result'],
    };
}

function identity<T>(source: T): T {
    return source;
}
