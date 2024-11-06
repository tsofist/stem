import { Nullable } from '../index';
import { hasOwn } from './has-own';

/**
 * Returns the first key of the specified target object.
 */
export function objectFirstKey<T extends object>(
    target: Nullable<T>,
    onlyOwn = true,
): keyof T | undefined {
    if (target == null) return undefined;
    for (const key in target) {
        if (onlyOwn) {
            if (hasOwn(target, key)) return key;
        } else {
            return key;
        }
    }
    return undefined;
}
