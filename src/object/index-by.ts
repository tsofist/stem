import { Nullable, ObjectKey, PRec, SimpleValuesOf, WSimpleValueKeysOf } from '../index';

export type KeyValueExtractor<T, R extends ObjectKey> = (target: T) => R;

export function indexBy<T, K extends WSimpleValueKeysOf<T>>(
    target: Nullable<T[]>,
    keyField: K,
): PRec<T, SimpleValuesOf<T, K>>;
export function indexBy<T, KV extends ObjectKey, E extends KeyValueExtractor<T, KV>>(
    target: Nullable<T[]>,
    keyValueExtractor: E,
): PRec<T, ReturnType<E>>;
export function indexBy<T, R extends ObjectKey>(
    target: Nullable<T[]>,
    keyField: KeyValueExtractor<T, R> | keyof T,
): PRec<T> {
    const result: PRec<T> = Object.create(null);
    const fn = typeof keyField === 'function';

    if (target) {
        for (const item of target) {
            const keyValue = fn ? keyField(item) : item[keyField];
            if (keyValue != null) {
                // @ts-expect-error It's OK
                result[keyValue] = item;
            }
        }
    }

    return result;
}
