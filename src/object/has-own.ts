import { Nullable } from '../index';

/**
 * Check if the target object has the specified property.
 *
 * This method works similarly to `Object.prototype.hasOwnProperty` (or `Object.hasOwn`):
 * - For primitives (string, number, boolean, etc.), JavaScript temporarily wraps the value
 *   in its corresponding object (e.g., `String`, `Number`), and the check is performed on that object.
 * - It does not check if the property is enumerable, only if it exists on the target object.
 */
export function hasOwn<T>(
    target: Nullable<T>,
    property: PropertyKey,
): target is T & { [K in keyof T]: T[K] } {
    if (target == null) return false;
    return Object.prototype.hasOwnProperty.call(target, property);
}
