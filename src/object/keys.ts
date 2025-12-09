import type { Nullable, Rec, URec } from '../index';

/**
 * Get array of Map/Set keys
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/keys Map.keys
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set/keys Set.keys
 */
export function keysOf<K>(target: Nullable<Map<K, any> | Set<K>>): K[];
/**
 * Typesafe version of Object.keys
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */
export function keysOf<T>(target: Nullable<T>): (keyof T)[];
export function keysOf(target: Nullable<object>): unknown[] {
    if (target == null) return [];
    if (target instanceof Map || target instanceof Set) {
        return Array.from(target.keys()) as unknown[];
    }
    return Object.keys(target);
}

export function roKeysOf<K, R = K>(target: Nullable<Map<K, any> | Set<K>>): readonly R[];
export function roKeysOf(target: Nullable<URec>): readonly string[];
export function roKeysOf<K extends PropertyKey, R = K>(
    target: Nullable<Rec<unknown, K>>,
): readonly R[];
export function roKeysOf(target: Nullable<object>): readonly unknown[] {
    return keysOf(target);
}
