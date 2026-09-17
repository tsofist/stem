import type { Nullable, ReadonlyMay } from '../index';
import { keysOf } from './keys-of';

/**
 * Get array of Map/Set keys coercing them to numeric format
 */
export function numericKeysOf<K>(target: Nullable<Map<K, any> | Set<K>>, parse?: boolean): NList<K>;

/**
 * Get array keys coercing them to numeric format
 */
export function numericKeysOf(target: Nullable<ReadonlyMay<any[]>>, parse?: boolean): number[];

/**
 * Get object keys coercing them to numeric format
 */
export function numericKeysOf<T>(target: Nullable<T>, parse?: boolean): NList<keyof T>;

export function numericKeysOf(target: Nullable<object>, parse = false): number[] {
    const result: number[] = [];

    if (target) {
        for (const key of keysOf(target)) {
            const v = parse ? Number.parseFloat(key) : Number(key);
            if (!Number.isNaN(v)) {
                result.push(v);
            }
        }
    }

    return result;
}

type NList<K> = (K extends number ? K : number)[];
