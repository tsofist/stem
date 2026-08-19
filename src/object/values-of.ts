import type { Nullable } from '../index';
import { isNonNully } from '../nully';

/**
 * Returns non-nullable values of the target
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/values Object.values | MDN
 */
export function nonNullableValuesOf<T>(
    target: Nullable<ValuesOfTargetWithNully<T>>,
): NonNullable<T>[];

/**
 * Returns non-nullable values of the target
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/values Object.values | MDN
 */
export function nonNullableValuesOf<T, K extends keyof T>(target: Nullable<T>): NonNullable<T[K]>[];

export function nonNullableValuesOf<T>(target: Nullable<ValuesOfTargetWithNully<T>>) {
    return valuesOf(target, isNonNully);
}

/**
 * Returns values of the target that satisfy the predicate
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/values Object.values | MDN
 */
export function valuesOf<T>(target: Nullable<T[]>, predicate: ValuesOfArrayPredicate): T[];

/**
 * Returns values of the target that satisfy the predicate
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/values Object.values | MDN
 */
export function valuesOf<T, K>(
    target: Nullable<Map<K, T>>,
    predicate?: ValuesOfCollectionPredicate<K>,
): T[];

/**
 * Returns values of the target that satisfy the predicate
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/values Object.values | MDN
 */
export function valuesOf<T>(
    target: Nullable<Set<T>>,
    predicate?: ValuesOfCollectionPredicate<T>,
): T[];

/**
 * Returns values of the target that satisfy the predicate
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/values Object.values | MDN
 */
export function valuesOf<T, K extends keyof T>(
    target: Nullable<T>,
    predicate: ValuesOfArrayPredicate,
): T[K][];

export function valuesOf<T, K>(
    target: Nullable<ValuesOfTarget<T>>,
    predicate?: ValuesOfCollectionPredicate<K>,
): T[] {
    let result: T[];

    if (target != null) {
        const isArr = Array.isArray(target);
        const isColl = !isArr && (target instanceof Map || target instanceof Set);

        if (predicate) {
            const entries = isColl ? target.entries() : Object.entries(target);
            result = [];

            for (const [key, value] of entries) {
                if (predicate(value, key as K)) {
                    result.push(value);
                }
            }
        } else {
            result = isColl ? Array.from(target.values()) : Object.values(target);
        }
    } else {
        result = [];
    }

    return result;
}

export type ValuesOfTarget<T> = Map<unknown, T> | Set<T> | T[];
export type ValuesOfTargetWithNully<T> =
    Map<unknown, Nullable<T>> | Set<Nullable<T>> | Nullable<T>[];

type ValuesOfArrayPredicate = (item: unknown, index: number) => boolean;
type ValuesOfCollectionPredicate<K> = (value: unknown, key: K) => boolean;
