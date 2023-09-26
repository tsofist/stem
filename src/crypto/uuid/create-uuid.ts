import { randomBytes } from 'crypto';
import { UUID } from './index';

/**
 * Generate a real, cryptographically strong UUID
 * @see https://ru.wikipedia.org/wiki/UUID
 */
export function createUUID(): UUID {
    const arr = randomBytes(16);

    arr[6] = (arr[6] & 0x0f) | 0x40;
    arr[8] = (arr[8] & 0x3f) | 0x80;

    return (arr.subarray(0, 4).toString('hex') +
        '-' +
        arr.subarray(4, 6).toString('hex') +
        '-' +
        arr.subarray(6, 8).toString('hex') +
        '-' +
        arr.subarray(8, 10).toString('hex') +
        '-' +
        arr.subarray(10).toString('hex')) as UUID;
}
