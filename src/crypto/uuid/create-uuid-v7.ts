import { UUIDV7Sequence } from './sequense';
import { serializeUUID } from './serialize';
import type { UUIDv7 } from './types';

/**
 * Generate a real, cryptographically strong UUID v7
 * @see https://ru.wikipedia.org/wiki/UUID
 */
export function createUUIDv7(): UUIDv7 {
    if (!defaultV7Sequence) defaultV7Sequence = new UUIDV7Sequence();
    const buf = defaultV7Sequence.next();

    return serializeUUID(buf);
}

let defaultV7Sequence: UUIDV7Sequence;
