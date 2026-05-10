import type { Gettable } from './index';

/**
 * Checks if the target is a Gettable
 * @see Gettable
 */
export function isGettable<V>(target: unknown): target is Gettable<V> {
    return (
        !!target &&
        typeof target === 'object' &&
        'get' in target &&
        typeof target.get === 'function'
    );
}
