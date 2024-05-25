import { indexBy } from './index-by.js';

describe('indexBy', () => {
    const list: {
        a: string;
        b: number | string;
        c?: number;
    }[] = [
        { a: 'a', b: 1 },
        { a: 'c', b: 3, c: 1 },
        { a: 'c', b: 'non', c: 2 },
    ];
    const map = new Map(list.map((item) => [Math.random(), item]));
    const set = new Set(list);

    it('string keyField', () => {
        for (const target of [list, map, set]) {
            expect(indexBy(target, 'a')).toEqual({
                a: { a: 'a', b: 1 },
                c: { a: 'c', b: 'non', c: 2 },
            });
            expect(indexBy(target, 'c')).toEqual({
                1: { a: 'c', b: 3, c: 1 },
                2: { a: 'c', b: 'non', c: 2 },
            });
        }
    });
    it('function keyField', () => {
        for (const target of [list, map, set]) {
            expect(indexBy(target, () => 'a')).toEqual({
                a: { a: 'c', b: 'non', c: 2 },
            });
            expect(
                indexBy(target, (item) => (typeof item.b === 'string' ? 'STR' : 'NON-STR')),
            ).toEqual({
                'NON-STR': { a: 'c', b: 3, c: 1 },
                'STR': { a: 'c', b: 'non', c: 2 },
            });
        }
    });
    it('edge cases', () => {
        // @ts-expect-error It's OK
        expect(indexBy(null, '123')).toEqual({});
        // @ts-expect-error It's OK
        expect(indexBy(undefined, '123')).toEqual({});

        for (const target of [list, map, set]) {
            // @ts-expect-error It's OK
            expect(indexBy(target, '123')).toEqual({});
            // @ts-expect-error It's OK
            expect(indexBy(target, () => null)).toEqual({});
            // @ts-expect-error It's OK
            expect(indexBy(target, () => undefined)).toEqual({});
        }
    });
});
