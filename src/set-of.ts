import { DropReadonly, Nullable, ObjectKey, PRec } from './index.js';

export interface SetOf<T extends ObjectKey> extends Iterable<T> {
    readonly values: Readonly<PRec<number, T>>;
    readonly isEmpty: boolean;
    has(value: T): boolean;
}

/**
 * Lightweight alternative for new Set([1, 2, 4]).has(1)
 * @param target
 * @param coverEmptyTarget consider existing values for empty target
 */
export function setOf<T extends ObjectKey>(
    target: Nullable<ReadonlyArray<T> | T[]>,
    coverEmptyTarget = false,
): SetOf<T> {
    target = target || [];
    const isEmpty = target.length === 0;
    let index: DropReadonly<SetOf<T>['values']>;

    return {
        get values() {
            if (index === undefined) {
                index = Object.create(null);
                let seq = 0;
                for (const item of target) {
                    if (item in index) continue;
                    index[item] = seq++;
                }
            }
            return index;
        },
        get isEmpty() {
            return isEmpty;
        },
        has(value: T) {
            return value in this.values || (isEmpty && coverEmptyTarget);
        },
        [Symbol.iterator]: function* () {
            const keys = Object.keys(this.values).sort(
                (a, b) => this.values[a as T]! - this.values[b as T]!,
            );
            for (const key of keys) {
                yield key as T;
            }
        },
    };
}
