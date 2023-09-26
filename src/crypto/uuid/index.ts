/**
 * @format uuid
 * @see createUUID
 * @see https://ru.wikipedia.org/wiki/UUID wiki
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier#Nil_UUID
 */
export const NIL_UUID: UUID = '00000000-0000-0000-0000-000000000000' as const;

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
export function isUUIDLike(value: any): value is UUID {
    if (!value || typeof value !== 'string') return false;
    return RE_UUID.test(value);
}
