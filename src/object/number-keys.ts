import { Nullable, PRec } from '../index';

/**
 * Get object keys and convert them to numeric format
 */
export function numberKeys(target: Nullable<PRec<any, number>>): number[] {
    const result: number[] = [];
    if (target) {
        for (const key of Object.keys(target)) {
            result.push(Number(key));
        }
    }
    return result;
}
