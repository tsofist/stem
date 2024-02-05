import { UUID } from './types';

/**
 * RegExp for UUID validation
 * @see https://wikipedia.org/wiki/Universally_unique_identifier
 * @see createUUID
 */
export const RE_UUID =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Value is UUID string
 */
export function isUUIDString(value: any): value is UUID {
    if (!value || typeof value !== 'string') return false;
    return RE_UUID.test(value);
}
