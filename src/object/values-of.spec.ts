import { nonNullableValuesOf } from './values-of';

describe('nonNullableValuesOf', () => {
    it('basic', () => {
        expect(nonNullableValuesOf({ a: 1, b: null, c: undefined })).toEqual([1]);
        expect(nonNullableValuesOf([1, null, undefined])).toEqual([1]);
        expect(nonNullableValuesOf(new Set([1, null, undefined]))).toEqual([1]);
        expect(
            nonNullableValuesOf(
                new Map([
                    [Math.random(), 1],
                    [Math.random(), null],
                    [Math.random(), undefined],
                ]),
            ),
        ).toEqual([1]);
    });

    it('edge cases', function () {
        expect(nonNullableValuesOf(null)).toEqual([]);
        expect(nonNullableValuesOf(undefined)).toEqual([]);
        expect(nonNullableValuesOf([])).toEqual([]);
        expect(nonNullableValuesOf([])).toEqual([]);
    });
});
