import { isEmptyObject } from './is-empty.js';

describe('isEmptyObject', () => {
    it('simple', () => {
        expect(isEmptyObject({})).toEqual(true);
        expect(isEmptyObject(Object.create(null))).toEqual(true);
        expect(isEmptyObject({ false: false })).toEqual(false);
    });
    it('edge cases', () => {
        expect(isEmptyObject(undefined)).toEqual(false);
        expect(isEmptyObject(null)).toEqual(false);
        expect(isEmptyObject(false)).toEqual(true);
        expect(isEmptyObject('')).toEqual(true);
    });
});
