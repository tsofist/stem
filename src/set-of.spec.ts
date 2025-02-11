import { setOf } from './set-of';

describe('setOf', () => {
    it('Edge cases', () => {
        const set1 = setOf(undefined);
        expect(set1.has(100)).toStrictEqual(false);
        expect(set1.size).toStrictEqual(0);
        expect(set1.isEmpty);

        const set2 = setOf<any>([]);
        expect(set2.isEmpty);
        expect(set2.has(100)).toStrictEqual(false);
        expect(set2.size).toStrictEqual(0);
    });

    it('Set of values from array', () => {
        const set = setOf<string | number>([1, 2, 3, 'd', 'd']);
        expect(set.size).toStrictEqual(4);
        expect(
            Array.from(set).reduce((a, b) => {
                // @ts-expect-error testing purposes
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands,@typescript-eslint/no-unsafe-return
                return a + b;
            }, 0),
        ).toStrictEqual(`6d`);
        expect(!set.isEmpty);
        expect(set.has(100)).toStrictEqual(false);
        expect(set.has(1)).toStrictEqual(true);
        expect(set.has('d')).toStrictEqual(true);

        let r = '';
        for (const v of set) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            r += v;
        }
        expect(r).toStrictEqual('123d');
    });

    it('Check coverage for empty set', () => {
        const set = setOf<any>([], true);
        expect(set.size).toStrictEqual(0);
        expect(set.isEmpty);
        expect(set.has(100)).toStrictEqual(true);
        expect(set.has(1)).toStrictEqual(true);
        expect(set.has('d')).toStrictEqual(true);
    });

    it('should correctly join values', () => {
        const set = setOf([1, 2, 3]);
        expect(set.join()).toStrictEqual('1,2,3');
        expect(set.join(' ')).toStrictEqual('1 2 3');
        expect(set.join('')).toStrictEqual('123');
    });

    it('should return correct toString value', () => {
        expect(String(setOf(['a', 'b', 'c']))).toStrictEqual('SetOf(3)');
        expect(String(setOf([0, 0, 0]))).toStrictEqual('SetOf(1)');
        expect(setOf([1, 2, 3]).toString(true)).toStrictEqual('SetOf(3)');
        expect(setOf([1, 2, 3]).toString(false)).toStrictEqual('1,2,3');
    });

    it('should return correct toJSON value', () => {
        const v1 = ['a', 'b', 'c'];
        expect(JSON.stringify(setOf(v1))).toStrictEqual(JSON.stringify(v1));
        const v2 = [0, 0, 0];
        expect(JSON.stringify(setOf(v2))).toStrictEqual(JSON.stringify(Array.from(new Set(v2))));
    });
});
