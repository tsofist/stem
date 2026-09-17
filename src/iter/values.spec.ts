import { valuesIteratorOf } from './values';

describe('iter/valuesIteratorOf', () => {
    it('iterates over a string by code point values', () => {
        const i = valuesIteratorOf('🔇🔈🔉🔊');
        const r = [];

        for (const item of i) {
            r.push(item);
        }

        expect(r).toStrictEqual(['🔇', '🔈', '🔉', '🔊']);
    });

    it('preserves grapheme clusters and deduplicates iterator values', () => {
        const s = '👩‍👧‍👧👪🧑‍🧑‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧒🧑‍🧒‍🧒';
        const e = ['👩‍👧‍👧', '👪', '🧑‍🧑‍🧒', '🧑‍🧑‍🧒‍🧒', '🧑‍🧒', '🧑‍🧒‍🧒'];
        const i = valuesIteratorOf(s);
        const r = [];

        for (const item of i) {
            r.push(item);
        }

        expect(r).toStrictEqual(e);
        expect(e.join('')).toStrictEqual(s);
        expect(Array.from(new Set(s)).join('')).toStrictEqual('👩‍👧👪🧑🧒');
        expect(Array.from(new Set(valuesIteratorOf(s))).join('')).toStrictEqual(s);
    });
});
