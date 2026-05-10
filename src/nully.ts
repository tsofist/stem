import type { Nully } from './index';

/**
 * Checks if the target is null or undefined
 * @see Nully
 * @see Falsy
 */
export function isNully(target: unknown): target is Nully {
    return target == null;
}

/**
 * Checks if the target is not null and not undefined
 * @see Nully
 * @see Falsy
 */
export function isNonNully<T>(target: T): target is NonNullable<T> {
    return target != null;
}
