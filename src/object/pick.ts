import type { ARec, PartialNullable } from '../index';
import { isNonNully } from '../nully';

/**
 * Pick fields from target to a new object
 */
export function pickProps<T extends ARec, F extends keyof T>(target: T, fields: F[]): Pick<T, F> {
    const result = {} as Pick<T, F>;

    for (const field of fields) {
        result[field] = target[field];
    }

    return result;
}

/**
 * Pick non-nully fields from target to a new object
 */
export function pickNonNullableProps<T extends ARec>(target: T): PartialNullable<T> {
    const result: ARec = {};

    for (const [key, value] of Object.entries(target)) {
        if (isNonNully(value)) {
            result[key] = target[key];
        }
    }

    return result as PartialNullable<T>;
}
