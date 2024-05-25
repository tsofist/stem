import { setOf } from './set-of.js';

describe('setOf', () => {
    it('Edge cases', () => {
        const set1 = setOf(undefined);
        expect(set1.has(100)).toStrictEqual(false);
        expect(Object.keys(set1.values).length).toStrictEqual(0);
        expect(set1.isEmpty);

        const set2 = setOf<any>([]);
        expect(set2.isEmpty);
        expect(set2.has(100)).toStrictEqual(false);
        expect(Object.keys(set2.values).length).toStrictEqual(0);
    });

    it('Set of values from array', () => {
        const set = setOf<any>([1, 2, 3, 'd', 'd']);
        expect(Object.keys(set.values).length).toStrictEqual(4);
        expect(Object.values(set.values).reduce((a, b) => a! + b!, 0)).toStrictEqual(6);
        expect(!set.isEmpty);
        expect(set.has(100)).toStrictEqual(false);
        expect(set.has(1)).toStrictEqual(true);
        expect(set.has('d')).toStrictEqual(true);

        let r = '';
        for (const v of set) r += v;
        expect(r).toStrictEqual('123d');
    });
    it('Check coverage for empty set', () => {
        const set = setOf<any>([], true);
        expect(Object.keys(set.values).length).toStrictEqual(0);
        expect(set.isEmpty);
        expect(set.has(100)).toStrictEqual(true);
        expect(set.has(1)).toStrictEqual(true);
        expect(set.has('d')).toStrictEqual(true);
    });
});
