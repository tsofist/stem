import { Nullable } from '../index';

/**
 * Returns only non-Nullable values from collection (Set/Map/Array)
 */
export function nonNullableValues<T>(
    target: Nullable<Map<any, Nullable<T>> | Set<Nullable<T>> | Nullable<T>[]>,
): NonNullable<T>[];
/**
 * Object.values, returning only non-Nullable values
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/values
 */
export function nonNullableValues<T, K extends keyof T>(
    target: Nullable<T | Map<any, T> | Set<T>>,
): NonNullable<T[K]>[];
export function nonNullableValues<T>(
    target: Nullable<T | Map<any, T> | Set<T>>,
): NonNullable<unknown>[] {
    const result: NonNullable<unknown>[] = [];
    if (target != null) {
        const isMap = target instanceof Map;
        const isSet = target instanceof Set;
        for (const raw of isMap || isSet ? target : Object.values(target)) {
            const item = (isMap ? (raw as [unknown, T])[1] : raw) as T;

            if (item != null) result.push(item);
        }
    }
    return result;
}
