/**
 * UUID with string representation.
 *
 * Version: unspecified.
 *
 * @format uuid
 *
 * @see createUUID
 * @see UUIDv4
 * @see UUIDv7
 *
 * @see https://ru.wikipedia.org/wiki/UUID Wikipedia: UUID
 * @see https://www.ietf.org/archive/id/draft-ietf-uuidrev-rfc4122bis-00.html#section-5.4 UUIDv4 Byte Order RFC draft
 * @see https://www.ietf.org/archive/id/draft-ietf-uuidrev-rfc4122bis-00.html#section-5.7 UUIDv7 Byte Order RFC draft
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * UUID with binary representation.
 *
 * Version: unspecified.
 *
 * @see https://ru.wikipedia.org/wiki/UUID Wikipedia: UUID
 * @see https://www.ietf.org/archive/id/draft-ietf-uuidrev-rfc4122bis-00.html#section-5.4 UUIDv4 Byte Order RFC draft
 * @see https://www.ietf.org/archive/id/draft-ietf-uuidrev-rfc4122bis-00.html#section-5.7 UUIDv7 Byte Order RFC draft
 */
export type UUIDB = Uint8Array<ArrayBuffer> & { __brand: never };

/**
 * UUID with string representation.
 *
 * Version: 4.
 *
 * @format uuid
 *
 * @see createUUID
 * @see UUID
 * @see UUIDv7
 */
export type UUIDv4 = UUID;

/**
 * UUID with string representation.
 *
 * Version: 7.
 *
 * @format uuid
 *
 * @see createUUID
 * @see UUID
 * @see UUIDv4
 */
export type UUIDv7 = UUID;

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
