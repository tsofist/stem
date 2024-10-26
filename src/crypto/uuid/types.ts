/**
 * @format uuid
 * @see createUUID
 * @see https://ru.wikipedia.org/wiki/UUID Wikipedia
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Nil UUID
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier#Nil_UUID Wikipedia
 */
export type NilUUID = '00000000-0000-0000-0000-000000000000';

/**
 * Max (omni) UUID
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier#Max_UUID Wikipedia
 */
export type MaxUUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

/**
 * Nil UUID
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier#Nil_UUID Wikipedia
 */
export const NIL_UUID: UUID = '00000000-0000-0000-0000-000000000000' satisfies NilUUID;

/**
 * Max (omni) UUID
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier#Max_UUID Wikipedia
 */
export const MAX_UUID: UUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff' satisfies MaxUUID;
