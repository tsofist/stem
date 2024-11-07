import { isEmptyObject } from './is-empty';

describe('isEmptyObject', () => {
    it('should return true for an empty object', () => {
        const obj = {};
        expect(isEmptyObject(obj)).toBe(true);
    });

    it('should return false for an object with own properties', () => {
        const obj = { key: 'value' };
        expect(isEmptyObject(obj)).toBe(false);
    });

    it('should return true for an object with no own properties but with inherited properties (owning = true)', () => {
        const obj = Object.create({ inheritedKey: 'inheritedValue' });
        expect(isEmptyObject(obj, true)).toBe(true);
    });

    it('should return false for an object with inherited properties (owning = false)', () => {
        const obj = Object.create({ inheritedKey: 'inheritedValue' });
        expect(isEmptyObject(obj, false)).toBe(false);
    });

    it('should return false for null', () => {
        expect(isEmptyObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
        expect(isEmptyObject(undefined)).toBe(false);
    });

    it('should return true for an object created with Object.create(null)', () => {
        const obj = Object.create(null);
        expect(isEmptyObject(obj)).toBe(true);
    });

    it('should return true for an object with only symbol properties', () => {
        const sym = Symbol('key');
        const obj = { [sym]: 'value' };
        expect(isEmptyObject(obj)).toBe(true);
    });

    it('should return true for an object with enumerable symbol properties', () => {
        const sym = Symbol('enumerableSymbol');
        const obj = {};
        Object.defineProperty(obj, sym, {
            value: 'This is a symbol property',
            enumerable: true,
        });
        expect(isEmptyObject(obj)).toBe(true);
    });

    it('should return true for an object with non-enumerable symbol properties', () => {
        const sym = Symbol('nonEnumerableSymbol');
        const obj = {};
        Object.defineProperty(obj, sym, {
            value: 'This is a non-enumerable symbol property',
            enumerable: false,
        });
        expect(isEmptyObject(obj)).toBe(true);
    });

    it('should return true for an object with only symbol properties that are non-enumerable', () => {
        const sym = Symbol('onlySymbol');
        const obj = {};
        Object.defineProperty(obj, sym, {
            value: 'Symbol only property',
            enumerable: false,
        });
        expect(isEmptyObject(obj)).toBe(true);
    });

    it('should handle edge cases correctly', () => {
        expect(isEmptyObject('')).toBe(true);
        expect(isEmptyObject(true)).toBe(true);
        expect(isEmptyObject(false)).toBe(true);
        expect(isEmptyObject(42)).toBe(true);
        expect(isEmptyObject(Symbol('symbol'))).toBe(true);
        expect(isEmptyObject(null)).toBe(false);
        expect(isEmptyObject(undefined)).toBe(false);
        expect(isEmptyObject({})).toBe(true);
        expect(isEmptyObject({ false: false })).toEqual(false);
    });
});
