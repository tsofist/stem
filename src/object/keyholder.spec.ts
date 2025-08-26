import { keyholderOf, writableKeyholderOf } from './keyholder';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

describe('keyholderOf', () => {
    it('should create a keyholder for a simple object', () => {
        const obj = { a: 1, b: 2 };
        const kh = keyholderOf<any>(obj);
        expect(Array.isArray(kh.array)).toBe(true);
        expect(kh.array).toEqual(['a', 'b']);
        expect(kh.set instanceof Set).toBe(true);
        expect([...kh]).toEqual(['a', 'b']);
        expect(kh.map).toBe(obj);
    });

    it('should create a keyholder for an empty object', () => {
        const obj = {};
        const kh = keyholderOf<any>(obj);
        expect(kh.array).toEqual([]);
        expect([...kh]).toEqual([]);
        expect(kh.set.size).toBe(0);
    });

    it('should create a keyholder for object with symbol keys', () => {
        const sym = Symbol('s');
        const obj = { [sym]: 1 };
        const kh = keyholderOf<any>(obj);
        expect(kh.array).toEqual([]); // keysOf ignores symbols
        expect([...kh]).toEqual([]);
    });

    it('should work with inherited properties', () => {
        const proto = { p: 1 };
        const obj = Object.create(proto);
        obj.o = 2;
        const kh = keyholderOf<any>(obj);
        expect(kh.array).toEqual(['o']);
    });

    it('should handle null and undefined', () => {
        expect(() => keyholderOf<any>(null as any)).not.toThrow();
        expect(() => keyholderOf<any>(undefined as any)).not.toThrow();
    });
});

describe('writableKeyholderOf', () => {
    it('should allow mutation of array and set', () => {
        const obj = { x: 1 };
        const kh = writableKeyholderOf<any>(obj);
        kh.array.push('y');
        kh.set.add('y');
        expect(kh.array).toContain('y');
        expect(kh.set.has('y')).toBe(true);
    });

    it('should work with empty object', () => {
        const obj = {};
        const kh = writableKeyholderOf<any>(obj);
        expect(kh.array).toEqual([]);
        expect([...kh]).toEqual([]);
        expect(kh.set.size).toBe(0);
    });

    it('should ignore symbol keys', () => {
        const sym = Symbol('s');
        const obj = { [sym]: 1 };
        const kh = writableKeyholderOf<any>(obj);
        expect(kh.array).toEqual([]);
        expect([...kh]).toEqual([]);
    });

    it('should work with inherited properties', () => {
        const proto = { p: 1 };
        const obj = Object.create(proto);
        obj.o = 2;
        const kh = writableKeyholderOf<any>(obj);
        expect(kh.array).toEqual(['o']);
    });

    it('should handle null and undefined', () => {
        expect(() => writableKeyholderOf<any>(null as any)).not.toThrow();
        expect(() => writableKeyholderOf<any>(undefined as any)).not.toThrow();
    });
});
