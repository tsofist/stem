import { hasOwn } from './has-own';

describe('hasOwn', () => {
    it('should return true for an object with string property', () => {
        const obj = { key: 'value' };
        expect(hasOwn(obj, 'key')).toBe(true);
    });

    it('should return false for an object without string property', () => {
        const obj = { key: 'value' };
        expect(hasOwn(obj, 'nonexistent')).toBe(false);
    });

    it('should return true for an object with numeric property', () => {
        const obj = { 1: 'one', 2: 'two' };
        expect(hasOwn(obj, 1)).toBe(true);
    });

    it('should return false for an object without numeric property', () => {
        const obj = { 1: 'one' };
        expect(hasOwn(obj, 2)).toBe(false);
    });

    it('should return true for an object with symbol property', () => {
        const sym = Symbol('symbolKey');
        const obj = { [sym]: 'symbolValue' };
        expect(hasOwn(obj, sym)).toBe(true);
    });

    it('should return false for an object without symbol property', () => {
        const sym = Symbol('symbolKey');
        const obj = { key: 'value' };
        expect(hasOwn(obj, sym)).toBe(false);
    });

    it('should return true for an object with a symbol property that is enumerable', () => {
        const sym = Symbol('symbolKey');
        const obj = {};
        Object.defineProperty(obj, sym, { value: 'symbolValue', enumerable: true });
        expect(hasOwn(obj, sym)).toBe(true);
    });

    it('should return true for an object with symbol property that is not enumerable', () => {
        const sym = Symbol('symbolKey');
        const obj = {};
        Object.defineProperty(obj, sym, { value: 'symbolValue', enumerable: false });
        expect(hasOwn(obj, sym)).toBe(true);
    });

    it('should return false for an empty object', () => {
        const obj = {};
        expect(hasOwn(obj, 'key')).toBe(false);
    });

    it('should handle edge cases correctly', () => {
        const sym = Symbol('symbolKey');

        expect(hasOwn('', 'key')).toBe(false);
        expect(hasOwn('string', 'length')).toBe(true);
        expect(hasOwn(null, 'key')).toBe(false);
        expect(hasOwn(undefined, 'key')).toBe(false);
        expect(hasOwn({ key: 'value' }, 'key')).toBe(true);
        expect(hasOwn({ 1: 'one' }, 1)).toBe(true);
        expect(hasOwn({ [sym]: 'symbol' }, sym)).toBe(true);
        expect(hasOwn({ [sym]: 'symbol' }, 'nonexistent')).toBe(false);
        expect(hasOwn('string', 'toString')).toBe(false);
        expect(hasOwn(42, 'toString')).toBe(false);
        expect(hasOwn(true, 'toString')).toBe(false);
        expect(hasOwn(Symbol('sym'), 'toString')).toBe(false);
    });
});
