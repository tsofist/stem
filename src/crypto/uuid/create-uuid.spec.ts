import { createUUID } from './create-uuid';
import { createUUIDv7, createUUIDv7Hex } from './create-uuid-v7';
import { isUUIDString, isUUIDv4, isUUIDv7, RE_UUID, RE_UUID_V4, RE_UUID_V7 } from './guards';

describe('createUUID', () => {
    it('should return a valid UUID', () => {
        const uuid = createUUID();
        expect(uuid).toMatch(RE_UUID);
        expect(uuid).toMatch(RE_UUID_V4);
        expect(uuid).not.toMatch(RE_UUID_V7);
    });

    it('should be valid UUID v4', () => {
        const uuid = createUUID();
        expect(uuid).toMatch(RE_UUID);
        expect(uuid).toMatch(RE_UUID_V4);
        expect(uuid).not.toMatch(RE_UUID_V7);

        expect(isUUIDString(uuid)).toBe(true);
        expect(isUUIDv4(uuid)).toBe(true);
        expect(isUUIDv7(uuid)).toBe(false);
    });

    it('should be valid UUID v7', () => {
        const uuid = createUUIDv7();
        expect(uuid).toMatch(RE_UUID_V7);
        expect(isUUIDString(uuid)).toBe(true);
        expect(isUUIDv4(uuid)).toBe(false);
        expect(isUUIDv7(uuid)).toBe(true);
    });

    it('should return different UUIDs for each call (v4)', () => {
        const uuid1 = createUUID();
        const uuid2 = createUUID();

        expect(uuid1).not.toEqual(uuid2);
    });

    it('should return different UUIDs for each call (v7)', () => {
        const uuid1 = createUUIDv7();
        const uuid2 = createUUIDv7();

        expect(uuid1).not.toEqual(uuid2);
    });

    it('should be valid UUID v7 in hex format', () => {
        const hex = createUUIDv7Hex();

        expect(hex).toMatch(/^[a-f0-9]{32}$/);
        expect(isUUIDv7(hexToUUID(hex))).toBe(true);
    });

    it('should return different UUIDs for each call (v7 hex)', () => {
        expect(createUUIDv7Hex()).not.toEqual(createUUIDv7Hex());
    });
});

function hexToUUID(hex: string) {
    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
    ].join('-');
}
