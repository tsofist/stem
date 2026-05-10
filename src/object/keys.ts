import type { ARec, Nullable, PRec, URec } from '../index';

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
    if (target == null) {
        return [];
    }
    if (target instanceof Map || target instanceof Set) {
        return Array.from(target.keys()) as unknown[];
    }
    return Object.keys(target);
}

/**
 * Get keys of target as readonly array
 *
 * > Typesafe alternative to `Object.keys` with readonly array return type. Also works for `Map` and `Set`.
 *
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/keys Map.keys | MDN
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set/keys Set.keys | MDN
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/keys Object.keys | MDN
 */
export function readonlyKeysOf<K, R = K>(target: Nullable<Map<K, any> | Set<K>>): readonly R[];

/**
 * Get keys of target as readonly array
 *
 * > Typesafe alternative to `Object.keys` with readonly array return type. Also works for `Map` and `Set`.
 *
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/keys Map.keys | MDN
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set/keys Set.keys | MDN
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/keys Object.keys | MDN
 */
export function readonlyKeysOf<T extends ARec = URec, K extends keyof T = string>(
    target: Nullable<T>,
): readonly K[];

/**
 * Get keys of target as readonly array
 *
 * > Typesafe alternative to `Object.keys` with readonly array return type. Also works for `Map` and `Set`.
 *
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/keys Map.keys | MDN
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set/keys Set.keys | MDN
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/keys Object.keys | MDN
 */
export function readonlyKeysOf<K extends PropertyKey, R = K>(
    target: Nullable<PRec<unknown, K>>,
): readonly R[];

export function readonlyKeysOf(target: Nullable<object>) {
    return keysOf(target);
}
