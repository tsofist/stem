import { clampNum } from './clamp';

describe('clampNum', () => {
    it('clamp with min only', () => {
        expect(clampNum(5, 10, 0)).toBe(10);
        expect(clampNum(15, 10, 0)).toBe(15);
        expect(clampNum(null, 10, 0)).toBe(10);
        expect(clampNum(undefined, 10, 0)).toBe(10);
        expect(clampNum(NaN, 10, 0)).toBe(10);
    });

    it('clamp with min only without default', () => {
        expect(clampNum(5, 10)).toBe(10);
        expect(clampNum(15, 10)).toBe(15);
        expect(clampNum(null, 10)).toBeUndefined();
        expect(clampNum(undefined, 10)).toBeUndefined();
        expect(clampNum(NaN, 10)).toBeUndefined();
    });

    it('clamp with min and max', () => {
        expect(clampNum(5, [10, 20], 0)).toBe(10);
        expect(clampNum(15, [10, 20], 0)).toBe(15);
        expect(clampNum(25, [10, 20], 0)).toBe(20);
        expect(clampNum(null, [10, 20], 0)).toBe(10);
        expect(clampNum(undefined, [10, 20], 0)).toBe(10);
        expect(clampNum(NaN, [10, 20], 0)).toBe(10);
    });

    it('clamp with min and max without default', () => {
        expect(clampNum(5, [10, 20])).toBe(10);
        expect(clampNum(15, [10, 20])).toBe(15);
        expect(clampNum(25, [10, 20])).toBe(20);
        expect(clampNum(null, [10, 20])).toBeUndefined();
        expect(clampNum(undefined, [10, 20])).toBeUndefined();
        expect(clampNum(NaN, [10, 20])).toBeUndefined();
    });

    it('clamp with max only', () => {
        expect(clampNum(5, [undefined, 10], 0)).toBe(5);
        expect(clampNum(15, [undefined, 10], 0)).toBe(10);
        expect(clampNum(null, [undefined, 10], 0)).toBe(0);
        expect(clampNum(undefined, [undefined, 10], 0)).toBe(0);
        expect(clampNum(NaN, [undefined, 10], 0)).toBe(0);
    });

    it('clamp with max only without default', () => {
        expect(clampNum(5, [undefined, 10])).toBe(5);
        expect(clampNum(15, [undefined, 10])).toBe(10);
        expect(clampNum(null, [undefined, 10])).toBeUndefined();
        expect(clampNum(undefined, [undefined, 10])).toBeUndefined();
        expect(clampNum(NaN, [undefined, 10])).toBeUndefined();
    });
});
