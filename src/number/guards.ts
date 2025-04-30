import { Float8, Int, PositiveInt } from './types';

/**
 * Value is Integer number
 */
export function isInt(it: any): it is Int {
    return typeof it === 'number' && it % 1 === 0;
}

/**
 * Value is Positive integer (natural) number
 */
export function isPositiveInt(it: any): it is PositiveInt {
    return typeof it === 'number' && isInt(it) && it > 0;
}

/**
 * Value is Float8 number
 */
export function isFloat(it: any): it is Float8 {
    return typeof it === 'number' && it % 1 !== 0 && !Number.isNaN(it) && Number.isFinite(it);
}
