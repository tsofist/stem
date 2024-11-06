import { isPrimitive } from './is-primitive';
import { Nullable, PRec } from './index';

type EqualKeysTarget = unknown[] | Set<any> | Map<any, any> | PRec<any, PropertyKey>;

/**
 * Checks if two values have the same keys.
 *
 * Supported types: Array, Set, Map, and objects.
 */
export function isEqualKeys(
    value1: Nullable<EqualKeysTarget>,
    value2: Nullable<EqualKeysTarget>,
): boolean {
    if (value1 && value2 && !isPrimitive(value1) && !isPrimitive(value2)) {
        const k1 = extractKeys(value1);
        const k2 = extractKeys(value2);

        if (k1.size !== k2.size) return false;

        for (const key of k1) {
            if (!k2.has(key)) return false;
        }

        return true;
    }
    return false;
}

function extractKeys<T extends PropertyKey>(
    target: Set<T> | Map<T, any> | unknown[] | PRec<any, T>,
): Set<T> {
    if (Array.isArray(target)) {
        const result = new Set<T>();
        for (let i = 0; i < target.length; i++) {
            result.add(i as T);
        }
    } else if (target instanceof Set || target instanceof Map) {
        return new Set(target.keys());
    } else if (typeof target === 'object') {
        return new Set<T>([
            //
            ...(Object.keys(target) as T[]),
            ...(Object.getOwnPropertySymbols(target) as T[]),
        ]);
    }
    return new Set<T>();
}
