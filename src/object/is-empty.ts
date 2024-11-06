import { hasOwn } from './has-own';

/**
 * Object has no own properties.
 *
 * More efficient alternative to `Object.keys(target).length === 0`.
 *
 * Note: Symbol properties are ignored in the check for object emptiness,
 *   even if they are enumerable, because they are not included in
 *   JSON serialization and may not be handled in the same way as string-based
 *   properties in all contexts.
 */
export function isEmptyObject(target: unknown, onlyOwnProperties = true): boolean {
    if (target == null) return false;
    for (const key in target) {
        if (onlyOwnProperties) {
            if (hasOwn(target, key)) return false;
        } else {
            return false;
        }
    }
    return true;
}
