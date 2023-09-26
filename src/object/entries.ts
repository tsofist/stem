import { Nullable } from '../index';

/**
 * Type-safe version of Object.entries
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 */
export function entries<T, K extends keyof T>(target: Nullable<T>): [K, T[K]][] {
    // @ts-expect-error It's OK
    return target == null ? [] : Object.entries(target);
}
