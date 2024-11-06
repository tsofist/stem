import { Nullable, ObjectKey, PRec, SimpleValuesOf, WSimpleValueKeysOf } from '../index';

export type KeyValueExtractor<T, R extends ObjectKey> = (target: T) => R;

export function indexBy<T, K extends WSimpleValueKeysOf<T>>(
    target: Nullable<T[] | Set<T> | Map<any, T>>,
    keyField: K,
): PRec<T, SimpleValuesOf<T, K>>;
export function indexBy<T, KV extends ObjectKey, E extends KeyValueExtractor<T, KV>>(
    target: Nullable<T[] | Set<T> | Map<any, T>>,
    keyValueExtractor: E,
): PRec<T, ReturnType<E>>;
export function indexBy<T, R extends ObjectKey>(
    target: Nullable<T[] | Set<T> | Map<unknown, T>>,
    keyField: KeyValueExtractor<T, R> | keyof T,
): PRec<T> {
    const isMap = target instanceof Map;
    const result = Object.create(null) as PRec<T>;
    const fn = typeof keyField === 'function';

    if (target) {
        for (let item of target) {
            item = isMap ? (item as [unknown, T])[1] : (item as T);
            const keyValue = fn ? keyField(item) : item[keyField];
            if (keyValue != null) {
                // @ts-expect-error It's OK
                result[keyValue] = item;
            }
        }
    }

    return result;
}
