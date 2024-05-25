import { Float, Int, PositiveInt } from './types.js';

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
 * Value is Float number
 */
export function isFloat(it: any): it is Float {
    return typeof it === 'number' && it % 1 !== 0 && !Number.isNaN(it) && isFinite(it);
}
