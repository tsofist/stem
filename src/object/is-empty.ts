import { hasOwnProperty } from '../index.js';

/**
 * Object has no own properties
 *
 * **Effective more than** *!Object.keys(t).length*
 */
export function isEmptyObject(target: any): boolean {
    if (target == null) return false;
    for (const key in target) {
        if (hasOwnProperty.call(target, key)) return false;
    }
    return true;
}
