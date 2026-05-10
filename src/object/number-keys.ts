import type { Nullable, PRec } from '../index';

/**
 * Get object keys and convert them to numeric format
 */
export function numberKeysOf(target: Nullable<PRec<any, number>>): number[] {
    const result: number[] = [];

    if (target) {
        for (const key of Object.keys(target)) {
            const v = Number(key);
            if (!isNaN(v)) result.push(Number(key));
        }
    }

    return result;
}
