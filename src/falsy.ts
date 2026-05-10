import type { Falsy } from './index';

/**
 * Checks if the target is "falsy"
 * @see Falsy
 * @see Nully
 */
export function isFalsy(target: unknown): target is Falsy {
    return !target;
}

/**
 * Checks if the target is "non-falsy"
 * @see Falsy
 * @see Nully
 */
export function isNonFalsy<T>(target: T): target is TSReset.NonFalsy<T> {
    return !!target;
}
