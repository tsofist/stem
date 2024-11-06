import { Nullable, ObjectKey, PRec } from '../index';

export type GroupByKeyExtractor<TItem, R> = (item: TItem) => Nullable<R>;
export type GroupByTarget<T = unknown> = Set<T> | Map<any, T> | T[];

export function groupBy<T, K extends keyof T, KV extends ObjectKey>(
    target: Nullable<GroupByTarget<T>>,
    by: GroupByKeyExtractor<T, KV>,
    skipNullableKeys?: boolean,
): PRec<T[], KV>;
export function groupBy<T, K extends keyof T>(
    target: Nullable<GroupByTarget<T>>,
    by: K,
    skipNullableKeys?: boolean,
): PRec<T[], ObjectKey>;
export function groupBy<T, K extends keyof T, KV>(
    target: Nullable<GroupByTarget<T>>,
    by: K | GroupByKeyExtractor<T, KV>,
    skipNullableKeys = true,
): PRec<T[], PropertyKey> {
    const result = Object.create(null) as PRec<T[], PropertyKey>;

    if (target) {
        const isMap = target instanceof Map;
        const hasExtractor = typeof by === 'function';

        for (const raw of target) {
            const item = (isMap ? (raw as [unknown, T])[1] : raw) as T;
            const key = hasExtractor ? by(item) : item[by];

            if (skipNullableKeys && key == null) continue;

            (result[String(key)] ??= [] as T[]).push(item);
        }
    }

    return result;
}
