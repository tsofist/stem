import { Nullable } from './index';

export interface SetOf<T> extends Iterable<T> {
    readonly rebuild: (values: Nullable<readonly T[]>) => this;
    readonly has: <U extends T>(value: U) => boolean;
    readonly findIndex: (value: T) => number | undefined;
    readonly isEmpty: boolean;
    readonly size: number;
    readonly join: (separator?: string) => string;
    readonly toString: (sizeOnly?: boolean) => string;
    readonly toJSON: () => T[];
}

/**
 * Alternative functionally equivalent to `new Set(values)`,
 *   but with a more predictable behavior.
 *
 * @param values the set of values. If empty and `universal` is `true`, the resulting set behaves as if it contains all possible values
 * @param universal if `true` and `target` is empty, `has()` will always return `true` (universal set behavior)
 *
 * @example
 *   const set1 = setOf(['a', 'b', 'c']);
 *   set1.has('a'); // true
 *   set1.has('d'); // false
 *
 *   const set2 = setOf([], true); // universal set
 *   set2.has('a'); // true
 */
export function setOf<T>(values: Nullable<readonly T[]>, universal = false): SetOf<T> {
    const index = new Map<T, number>();

    function rebuild(replacement: typeof values): void {
        replacement ??= [];
        index.clear();
        for (let i = 0; i < replacement.length; i++) {
            index.set(replacement[i], i);
        }
    }

    rebuild(values);

    return {
        [Symbol.iterator]() {
            return index.keys();
        },
        get isEmpty() {
            return index.size === 0;
        },
        get size() {
            return index.size;
        },
        rebuild(values) {
            rebuild(values);
            return this;
        },
        has(value) {
            const isEmpty = this.isEmpty;
            return (isEmpty && universal) || (!isEmpty && index.has(value));
        },
        findIndex(value) {
            return index.get(value);
        },
        join(separator = ',') {
            return Array.from(this).join(separator);
        },
        toString(sizeOnly = true) {
            return sizeOnly ? `SetOf(${this.size})` : this.join();
        },
        toJSON() {
            return Array.from(this);
        },
    };
}
