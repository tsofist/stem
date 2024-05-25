import { CompareResult, Nullable } from '../index.js';

/**
 * Type-safe version of Object.entries
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 */
export function entries<T, K extends keyof T>(
    target: Nullable<T>,
    sort?: (a: [K, T[K]], b: [K, T[K]]) => CompareResult,
): [K, T[K]][] {
    if (!target) return [];
    const result: [any, any][] =
        target instanceof Set || target instanceof Map
            ? Array.from(target.entries())
            : Object.entries(target);
    return sort ? result.sort(sort) : result;
}
