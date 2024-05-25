import { nonNullableValues } from './values.js';

describe('groupBy', () => {
    it('basic', () => {
        expect(nonNullableValues([1, null, undefined])).toEqual([1]);
        expect(nonNullableValues(new Set([1, null, undefined]))).toEqual([1]);
        expect(
            nonNullableValues(
                new Map([
                    [Math.random(), 1],
                    [Math.random(), null],
                    [Math.random(), undefined],
                ]),
            ),
        ).toEqual([1]);
    });

    it('edge cases', function () {
        expect(nonNullableValues(null)).toEqual([]);
        expect(nonNullableValues(undefined)).toEqual([]);
        expect(nonNullableValues([])).toEqual([]);
        expect(nonNullableValues([])).toEqual([]);
    });
});
