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
