import { indexBy } from './index-by';

describe('indexBy', () => {
    const list = [
        { a: 'a', b: 1 },
        { a: 'c', b: 3, c: 1 },
        { a: 'c', b: 'non', c: 2 },
    ];

    it('string keyField', () => {
        expect(indexBy(list, 'a')).toEqual({
            a: { a: 'a', b: 1 },
            c: { a: 'c', b: 'non', c: 2 },
        });
        expect(indexBy(list, 'c')).toEqual({
            1: { a: 'c', b: 3, c: 1 },
            2: { a: 'c', b: 'non', c: 2 },
        });
    });
    it('function keyField', () => {
        expect(indexBy(list, () => 'a')).toEqual({
            a: { a: 'c', b: 'non', c: 2 },
        });
        expect(indexBy(list, (item) => (typeof item.b === 'string' ? 'STR' : 'NON-STR'))).toEqual({
            'NON-STR': { a: 'c', b: 3, c: 1 },
            'STR': { a: 'c', b: 'non', c: 2 },
        });
    });
    it('edge cases', () => {
        // @ts-expect-error It's OK
        expect(indexBy(null, '123')).toEqual({});
        // @ts-expect-error It's OK
        expect(indexBy(undefined, '123')).toEqual({});
        // @ts-expect-error It's OK
        expect(indexBy(list, '123')).toEqual({});
        // @ts-expect-error It's OK
        expect(indexBy(list, () => null)).toEqual({});
        // @ts-expect-error It's OK
        expect(indexBy(list, () => undefined)).toEqual({});
    });
});
