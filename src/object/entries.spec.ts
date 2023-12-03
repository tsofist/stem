import { entries } from './entries';

describe('entries', () => {
    it('should return an empty array for null or undefined target', () => {
        expect(entries(null)).toEqual([]);
        expect(entries(undefined)).toEqual([]);
    });

    it('should return an array of key-value pairs for an object', () => {
        const obj = { a: 1, b: 'two', c: true };
        expect(entries(obj)).toEqual([
            ['a', 1],
            ['b', 'two'],
            ['c', true],
        ]);
    });

    it('should return an array of key-value pairs for a class instance', () => {
        class MyClass {
            a = 1;
            b = 'two';
            c = true;
        }

        const instance = new MyClass();
        expect(entries(instance)).toEqual([
            ['a', 1],
            ['b', 'two'],
            ['c', true],
        ]);
    });

    it('should return an array of key-value pairs for a Map object', () => {
        const map = new Map<string, number>([
            ['a', 1],
            ['b', 2],
            ['c', 3],
        ]);
        expect(entries(map)).toEqual([
            ['a', 1],
            ['b', 2],
            ['c', 3],
        ]);
    });

    it('should return an array of key-value pairs for a Set object', () => {
        const set = new Set<string>(['a', 'b', 'c']);
        expect(entries(set)).toEqual([
            ['a', 'a'],
            ['b', 'b'],
            ['c', 'c'],
        ]);
    });

    it('should be sorted by key if a sort function is provided', () => {
        const obj = { b: 'two', a: 1, c: true };
        expect(entries(obj, (a, b) => (a[0] < b[0] ? -1 : 1))).toEqual([
            ['a', 1],
            ['b', 'two'],
            ['c', true],
        ]);
        expect(entries(obj, (a, b) => (a[0] > b[0] ? -1 : 1))).toEqual([
            ['c', true],
            ['b', 'two'],
            ['a', 1],
        ]);
    });
});
