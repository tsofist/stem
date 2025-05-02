import type { Float } from './types';

/**
 * Value is Float
 *
 * @see Float
 */
export function isFloat(it: unknown): it is Float {
    return typeof it === 'number' && it % 1 !== 0 && !Number.isNaN(it) && Number.isFinite(it);
}
