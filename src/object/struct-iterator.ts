import type { Nullable, PRec, ReadonlyMay } from '../index';

export type ValuesStruct<T = unknown> =
    | ReadonlyMay<Map<unknown, T>>
    | ReadonlyMay<Set<T>>
    | ReadonlyMay<T[]>
    | IterableIterator<T>
    | PRec<T, PropertyKey>
    | (T extends string ? string : never);

export type IndexedStruct<T = unknown> =
    | ReadonlyMay<Map<T, unknown>>
    | ReadonlyMay<Set<T>>
    | ReadonlyMay<T[]>
    | IterableIterator<T>
    | PRec<unknown, T extends PropertyKey ? T : never>
    | (T extends string ? string : never);

export function indexedStructIterator<T>(target: Nullable<IndexedStruct<T>>): IterableIterator<T>;
export function indexedStructIterator<K extends PropertyKey>(
    target: Nullable<PRec<unknown, K>>,
): IterableIterator<K>;
export function indexedStructIterator<T>(target: Nullable<IndexedStruct<T>>): IterableIterator<T> {
    let result: IterableIterator<any> | undefined;

    if (target) {
        if (target instanceof Map || target instanceof Set || Array.isArray(target)) {
            result = target.keys();
        } else {
            switch (typeof target) {
                case 'object':
                    result = Object.keys(target).values();
                    break;
                case 'string':
                    result = IntlSegmenter
                        ? IntlSegmenter.segment(target)[Symbol.iterator]()
                        : target[Symbol.iterator]();
                    break;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result ?? emptyIterator();
}

export function valuesStructIterator<T>(target: Nullable<ValuesStruct<T>>): IterableIterator<T> {
    let result: IterableIterator<T> | undefined;

    if (target) {
        if (target instanceof Map || target instanceof Set || Array.isArray(target)) {
            result = target.values();
        } else {
            switch (typeof target) {
                case 'object':
                    result = Object.values(target).values();
                    break;
                case 'string':
                    result = target[Symbol.iterator]() as IterableIterator<T>;
                    break;
            }
        }
    }

    return result ?? emptyIterator();
}

function emptyIterator<T>(): IterableIterator<T> {
    return {
        next(): IteratorResult<T> {
            return { done: true, value: undefined as never };
        },
        [Symbol.iterator]() {
            return this;
        },
    };
}

const IntlSegmenter =
    typeof (Intl as any)?.Segmenter === 'function'
        ? // es2022.intl
          // Intl.Segmenter is not supported in this environment
          new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        : undefined;
