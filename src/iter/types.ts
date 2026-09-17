import type { PRec, ReadonlyMay } from '../index';
import type { CharPos } from '../string/iterator';

export type ValuesIteratorOf<T> =
    T extends ReadonlyMay<Map<any, infer V>>
        ? IterableIterator<V>
        : T extends ReadonlyMay<Set<infer V>>
          ? IterableIterator<V>
          : T extends string
            ? IterableIterator<string>
            : T extends ReadonlyMay<(infer V)[]>
              ? IterableIterator<V>
              : T extends PRec<infer V, any>
                ? IterableIterator<V>
                : never;

export type KeysIteratorOf<T> =
    T extends ReadonlyMay<Map<infer K, any>>
        ? IterableIterator<K>
        : T extends ReadonlyMay<Set<infer V>>
          ? IterableIterator<V>
          : T extends string
            ? IterableIterator<CharPos>
            : T extends ReadonlyMay<any[]>
              ? IterableIterator<number>
              : T extends PRec<any, infer K>
                ? IterableIterator<K>
                : never;
