import { randomBytes, randomUUID } from 'crypto';
import { serializeUUID } from './serialize';
import type { UUIDB, UUIDv4 } from './types';

/**
 * Generate a real, cryptographically strong UUID v4
 * @see https://ru.wikipedia.org/wiki/UUID
 */
export function createUUID(): UUIDv4 {
    // nodejs
    if (randomUUID) return randomUUID();
    // browser
    if (crypto.randomUUID) return crypto.randomUUID();

    // local implementation
    const buf = randomBytes(16) as unknown as UUIDB;

    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;

    return serializeUUID(buf);
}
