import { isEqualKeys } from './equal-keys';

describe('isEqualKeys', () => {
    it('should return true for identical own string keys in both objects', () => {
        expect(isEqualKeys({ a: 1, b: 2 }, { a: 3, b: 4 })).toBe(true);
        expect(isEqualKeys({ name: 'John', age: 30 }, { age: 25, name: 'Doe' })).toBe(true);
    });

    it('should return false for different string keys in objects', () => {
        expect(isEqualKeys({ a: 1, b: 2 }, { a: 3, c: 4 })).toBe(false);
        expect(isEqualKeys({ name: 'John' }, { age: 25, name: 'Doe' })).toBe(false);
    });

    it('should handle identical Sets', () => {
        expect(isEqualKeys(new Set([1, null]), new Set([null, 1]))).toBe(true);
        expect(isEqualKeys(new Set([undefined, null]), new Set([null, undefined]))).toBe(true);
        expect(isEqualKeys(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
        expect(isEqualKeys(new Set(['a', 'b']), new Set(['a', 'b']))).toBe(true);
        expect(isEqualKeys(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
        const sym = Symbol('sym');
        expect(isEqualKeys(new Set([sym]), new Set([sym]))).toBe(true);
    });

    it('should handle Sets with different elements', () => {
        // eslint-disable-next-line no-new-wrappers
        expect(isEqualKeys(new Set([new String('H')]), new Set([new String('H')]))).toBe(false);
        expect(isEqualKeys(new Set([1, 2, 3]), new Set([1, 2]))).toBe(false);
        expect(isEqualKeys(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false);
        expect(isEqualKeys(new Set(['a']), new Set(['b']))).toBe(false);
        expect(isEqualKeys(new Set([1]), new Set([]))).toBe(false);
        expect(isEqualKeys(new Set([Symbol('sym1')]), new Set([Symbol('sym1')]))).toBe(false);
    });

    it('should handle identical Maps', () => {
        expect(
            isEqualKeys(
                new Map([
                    [null, 100],
                    [null, 1],
                ]),
                new Map([
                    [null, 'a'],
                    [null, 'b1'],
                ]),
            ),
        ).toBe(true);
        expect(
            isEqualKeys(
                new Map([
                    [1, 'a'],
                    [2, 'b'],
                ]),
                new Map([
                    [1, 'x'],
                    [2, 'y'],
                ]),
            ),
        ).toBe(true);
        expect(
            isEqualKeys(
                new Map([
                    ['a', 1],
                    ['b', 2],
                ]),
                new Map([
                    ['b', 3],
                    ['a', 4],
                ]),
            ),
        ).toBe(true);
        expect(isEqualKeys(new Map([[1, 'a']]), new Map([[1, 'a']]))).toBe(true);
    });

    it('should handle Maps with different keys', () => {
        expect(isEqualKeys(new Map([[[1], 'a']]), new Map([[[1], 'a']]))).toBe(false);
        expect(isEqualKeys(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false);
        expect(
            isEqualKeys(
                new Map([
                    [1, 'a'],
                    [2, 'b'],
                ]),
                new Map([
                    [2, 'b'],
                    [3, 'c'],
                ]),
            ),
        ).toBe(false);
    });

    it('should handle numerical keys correctly', () => {
        expect(isEqualKeys({ 1: 'one', 2: 'two' }, { 1: 'uno', 2: 'dos' })).toBe(true);
        expect(isEqualKeys({ 1: 'one', 2: 'two' }, { 1: 'uno' })).toBe(false);
        expect(isEqualKeys({ 1: 'one' }, { 1: 'one', 2: 'two' })).toBe(false);
    });

    it('should handle symbol keys correctly', () => {
        const sym1 = Symbol('sym1');
        const sym2 = Symbol('sym2');
        expect(
            isEqualKeys(
                { [sym1]: 'value1', [sym2]: 'value2' },
                { [sym1]: 'valueX', [sym2]: 'valueY' },
            ),
        ).toBe(true);
        expect(isEqualKeys({ [sym1]: 'value1' }, { [sym2]: 'value2' })).toBe(false);
    });

    it('should return false for different types', () => {
        expect(isEqualKeys(new Set([1, 2, 3]), { a: 1, b: 2 })).toBe(false);
        expect(isEqualKeys(new Map([[1, 'a']]), { a: 1 })).toBe(false);
        expect(isEqualKeys({ a: 1 }, null)).toBe(false);
        expect(isEqualKeys(undefined, undefined)).toBe(false);
    });

    it('should handle empty structures correctly', () => {
        expect(isEqualKeys(new Set(), new Set())).toBe(true);
        expect(isEqualKeys(new Map(), new Map())).toBe(true);
        expect(isEqualKeys({}, {})).toBe(true);
        expect(isEqualKeys(new Set(), new Map())).toBe(true);
    });

    it('should handle diverse edge cases', () => {
        expect(isEqualKeys({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        expect(isEqualKeys(new Map([[1, 'a']]), new Set([1]))).toBe(true);
        expect(isEqualKeys(new Map([[1, 'a']]), new Set(['a', 1]))).toBe(false);
        expect(isEqualKeys(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
        expect(
            isEqualKeys(
                new Map([
                    [1, 'a'],
                    [2, 'b'],
                ]),
                new Map([
                    [2, 'b'],
                    [1, 'c'],
                ]),
            ),
        ).toBe(true);
        expect(isEqualKeys({ [Symbol('sym')]: 1 }, { [Symbol('sym')]: 2 })).toBe(false);
        expect(isEqualKeys(new Map([[1, 2]]), new Map([[1, 3]]))).toBe(true);
        expect(isEqualKeys(new Set(['x', 'y']), new Set(['y', 'x']))).toBe(true);

        expect(isEqualKeys(new Array(10).fill(100), new Array(10).fill(-1))).toBe(true);
        expect(isEqualKeys(new Array(10).fill(100), new Array(5).fill(-1))).toBe(true);
    });

    it('should return false for unsupported types', () => {
        // @ts-expect-error Testing unsupported types
        expect(isEqualKeys('string', 'string')).toBe(false);
        // @ts-expect-error Testing unsupported types
        expect(isEqualKeys(true, false)).toBe(false);
        // @ts-expect-error Testing unsupported types
        expect(isEqualKeys(123, 456)).toBe(false);
        expect(isEqualKeys([], {})).toBe(true);
        expect(isEqualKeys({}, [])).toBe(true);
    });
});
