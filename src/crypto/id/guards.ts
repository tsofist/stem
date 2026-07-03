import { NanoID, RE_NANO_ID, RE_ULID, ULID } from './types';

export function isULID(value: unknown): value is ULID {
    return typeof value === 'string' && RE_ULID.test(value as string);
}

export function isNanoID(value: unknown): value is NanoID {
    return typeof value === 'string' && RE_NANO_ID.test(value as string);
}
