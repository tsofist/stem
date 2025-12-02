import type { UUID, UUIDv4, UUIDv7 } from './types';

/**
 * RegExp for UUID validation (any version)
 *
 * @see createUUID
 * @see createUUIDv7
 * @see UUID
 * @see UUIDv4
 * @see UUIDv7
 */
export const RE_UUID =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * RegExp for UUID v4 validation
 *
 * @see createUUID
 * @see UUIDv4
 */
export const RE_UUID_V4 =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

/**
 * RegExp for UUID v7 validation
 *
 * @see createUUIDv7
 * @see UUIDv7
 */
export const RE_UUID_V7 =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

/**
 * Value is valid UUID string (any version)
 */
export function isUUIDString(value: any): value is UUID {
    if (!value || typeof value !== 'string') return false;
    return RE_UUID.test(value);
}

/**
 * Value is valid UUIDv4 string
 */
export function isUUIDv4(value: any): value is UUIDv4 {
    if (!value || typeof value !== 'string') return false;
    return RE_UUID_V4.test(value);
}

/**
 * Value is valid UUIDv7 string
 */
export function isUUIDv7(value: any): value is UUIDv7 {
    if (!value || typeof value !== 'string') return false;
    return RE_UUID_V7.test(value);
}
