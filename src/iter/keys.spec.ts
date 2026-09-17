import { keysIteratorOf } from './keys';

describe('iter/keysIteratorOf', () => {
    it('returns start and end indices for ASCII strings', () => {
        const i = keysIteratorOf('abc');
        expect(i.next()).toStrictEqual({ value: [0, 1], done: false });
        expect(i.next()).toStrictEqual({ value: [1, 2], done: false });
        expect(i.next()).toStrictEqual({ value: [2, 3], done: false });
        expect(i.next()).toStrictEqual({ value: undefined, done: true });
    });

    it('iterates over all ASCII keys exactly once', () => {
        const s = 'abc';
        const i = keysIteratorOf(s);
        const r = [];
        let iterations = 0;

        for (const item of i) {
            iterations++;
            r.push(item);
        }

        expect(iterations).toStrictEqual(s.length);
        expect(iterations).toStrictEqual(r.length);
        expect(r).toStrictEqual([
            [0, 1],
            [1, 2],
            [2, 3],
        ]);
    });

    it('returns UTF-16 index pairs for emoji strings', () => {
        const s = '🔇🔈🔉🔊';
        const i = keysIteratorOf(s);
        const r = [];

        for (const item of i) {
            r.push(item);
        }

        expect(r).toStrictEqual([
            [0, 2],
            [2, 4],
            [4, 6],
            [6, 8],
        ]);
        expect(Array.from(new Set(s)).join('')).toStrictEqual(s);
    });

    it('returns correct index pairs for multi-codepoint grapheme clusters', () => {
        const s = '👩‍👧‍👧👪🧑‍🧑‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧒🧑‍🧒‍🧒';
        const e = [
            [0, 8],
            [8, 10],
            [10, 18],
            [18, 29],
            [29, 34],
            [34, 42],
        ];
        const i = keysIteratorOf(s);
        const r = [];

        for (const item of i) {
            r.push(item);
        }

        expect(r).toStrictEqual(e);
        expect(Array.from(new Set(s)).join('')).toStrictEqual('👩‍👧👪🧑🧒');
    });

    it('returns slices that reconstruct the original grapheme string', () => {
        const s = '👩‍👧‍👧👪🧑‍🧑‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧒🧑‍🧒‍🧒';
        const e = [
            [0, 8],
            [8, 10],
            [10, 18],
            [18, 29],
            [29, 34],
            [34, 42],
        ];
        const ed = ['👩‍👧‍👧', '👪', '🧑‍🧑‍🧒', '🧑‍🧑‍🧒‍🧒', '🧑‍🧒', '🧑‍🧒‍🧒'];
        const i = keysIteratorOf(s);
        const r = [];

        for (const item of i) {
            r.push(item);
        }

        expect(r).toStrictEqual(e);
        expect(e.map(([b, e]) => s.slice(b, e))).toStrictEqual(ed);
        expect(e.map(([b, e]) => s.slice(b, e)).join('')).toStrictEqual(s);
        expect(Array.from(new Set(s)).join('')).toStrictEqual('👩‍👧👪🧑🧒');
    });
});
