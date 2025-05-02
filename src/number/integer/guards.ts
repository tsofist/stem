import type { Int, NegativeInt, NonNegativeInt, PositiveInt } from './types';

/**
 * It is Int
 *
 * @see Int
 */
export function isInt(it: unknown): it is Int {
    return typeof it === 'number' && it % 1 === 0;
}

/**
 * It is PositiveInt
 *
 * @see PositiveInt
 */
export function isPositiveInt(it: unknown): it is PositiveInt {
    return typeof it === 'number' && isInt(it) && it > 0;
}

/**
 * It is NonNegativeInt
 *
 * @see NonNegativeInt
 */
export function isNonNegativeInt(it: unknown): it is NonNegativeInt {
    return typeof it === 'number' && isInt(it) && it >= 0;
}

/**
 * It is NegativeInt
 *
 * @see NegativeInt
 */
export function isNegativeInt(it: unknown): it is NegativeInt {
    return typeof it === 'number' && isInt(it) && it < 0;
}
