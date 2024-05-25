import { quartile } from './quartile.js';

describe('quartile', () => {
    it('should return the first quartile of a single-value array', () => {
        expect(quartile([1], 0)).toBe(1);
        expect(quartile([1], 25)).toBe(1);
        expect(quartile([1], 50)).toBe(1);
        expect(quartile([1], 75)).toBe(1);
        expect(quartile([1], 100)).toBe(1);
    });

    it('should return the first quartile of an even-length array', () => {
        expect(quartile([1, 2], 0)).toBe(1);
        expect(quartile([1, 2], 25)).toBe(1.25);
        expect(quartile([1, 2], 50)).toBe(1.5);
        expect(quartile([1, 2], 75)).toBe(1.75);
        expect(quartile([1, 2], 100)).toBe(2);
    });

    it('should return the first quartile of an odd-length array', () => {
        expect(quartile([1, 2, 3], 0)).toBe(1);
        expect(quartile([1, 2, 3], 25)).toBe(1.5);
        expect(quartile([1, 2, 3], 50)).toBe(2);
        expect(quartile([1, 2, 3], 75)).toBe(2.5);
        expect(quartile([1, 2, 3], 100)).toBe(3);
    });

    it('should handle a selector function', () => {
        const values = [{ value: 1 }, { value: 2 }, { value: 3 }];
        const selector = (obj: { value: number }) => obj.value;

        expect(quartile(values, 0, selector)).toBe(1);
        expect(quartile(values, 25, selector)).toBe(1.5);
        expect(quartile(values, 50, selector)).toBe(2);
        expect(quartile(values, 75, selector)).toBe(2.5);
        expect(quartile(values, 100, selector)).toBe(3);
    });

    it('should return NaN for an empty array', () => {
        expect(quartile([], 0)).toBeUndefined();
        expect(quartile([], 25)).toBeUndefined();
        expect(quartile([], 50)).toBeUndefined();
        expect(quartile([], 75)).toBeUndefined();
        expect(quartile([], 100)).toBeUndefined();
    });

    it('should return NaN for an invalid percentile', () => {
        expect(quartile([1], -1)).toBeUndefined();
        expect(quartile([1], 101)).toBeUndefined();
        expect(quartile([], -1)).toBeUndefined();
        expect(quartile([], 101)).toBeUndefined();
    });
});
