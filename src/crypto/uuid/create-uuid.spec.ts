import { createUUID } from './create-uuid';
import { RE_UUID } from './guards';

describe('createUUID', () => {
    it('should return a valid UUID', () => {
        const uuid = createUUID();
        expect(uuid).toMatch(RE_UUID);
    });

    it('should return different UUIDs for each call', () => {
        const uuid1 = createUUID();
        const uuid2 = createUUID();
        expect(uuid1).not.toEqual(uuid2);
    });
});
