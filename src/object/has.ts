import type { IterableStruct, ReadonlyMay } from '../index';
import { keysIteratorOf } from '../iter/keys';
import { charactersIteratorOf } from '../string/iterator';

export function hasAll<T extends string>(target: T, chars: ReadonlyMay<string[]>): boolean;
export function hasAll<T>(target: ReadonlyMay<Map<T, unknown>>, keys: ReadonlyMay<T>): boolean;
export function hasAll<T>(target: ReadonlyMay<Set<T>>, items: ReadonlyMay<T>): boolean;
export function hasAll<T>(target: ReadonlyMay<T[]>, items: ReadonlyMay<T>): boolean;
export function hasAll<T>(target: ReadonlyMay<T>, keys: ReadonlyMay<(keyof T)[]>): boolean;

export function hasAll(target: unknown, names: ReadonlyMay<unknown[]>): boolean {
    if (!target || !names.length) return false;

    const exists = new Set<unknown>(
        typeof target === 'string'
            ? charactersIteratorOf(target)
            : keysIteratorOf(target as IterableStruct),
    );

    for (const n of names) {
        if (!exists.has(n)) return false;
    }

    return true;
}
