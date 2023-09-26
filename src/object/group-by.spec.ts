import { groupBy } from './group-by';

describe('groupBy', () => {
    const targetA = [
        { a: 1, b: 'A', c: 1 },
        { a: 1, b: 'B', c: 1 },
        { a: 2, b: 'C', c: 2 },
        { a: 2, b: 'D', c: 2 },
        { a: 3, b: 'F' },
    ];
    const targetM = new Map(targetA.map((item) => [Math.random(), item]));

    it('basic for Array', () => {
        expect(groupBy(targetA, 'c')).toEqual({
            1: [
                { a: 1, b: 'A', c: 1 },
                { a: 1, b: 'B', c: 1 },
            ],
            2: [
                { a: 2, b: 'C', c: 2 },
                { a: 2, b: 'D', c: 2 },
            ],
        });
        expect(groupBy(targetA, 'a')).toEqual({
            1: [
                { a: 1, b: 'A', c: 1 },
                { a: 1, b: 'B', c: 1 },
            ],
            2: [
                { a: 2, b: 'C', c: 2 },
                { a: 2, b: 'D', c: 2 },
            ],
            3: [{ a: 3, b: 'F' }],
        });
    });

    it('basic for Map', function () {
        expect(groupBy(targetM, 'c', false)).toEqual({
            1: [
                { a: 1, b: 'A', c: 1 },
                { a: 1, b: 'B', c: 1 },
            ],
            2: [
                { a: 2, b: 'C', c: 2 },
                { a: 2, b: 'D', c: 2 },
            ],
            undefined: [{ a: 3, b: 'F' }],
        });
        expect(groupBy(targetM, 'a')).toEqual({
            1: [
                { a: 1, b: 'A', c: 1 },
                { a: 1, b: 'B', c: 1 },
            ],
            2: [
                { a: 2, b: 'C', c: 2 },
                { a: 2, b: 'D', c: 2 },
            ],
            3: [{ a: 3, b: 'F' }],
        });
    });

    it('for Set with extractor', function () {
        expect(groupBy(new Set([1.75, 1.5, 2.3, 4]), Math.floor)).toEqual({
            1: [1.75, 1.5],
            2: [2.3],
            4: [4],
        });

        expect(groupBy(new Set(['1.75', '4']), parseInt)).toEqual({
            1: ['1.75'],
            4: ['4'],
        });
    });

    it('edge cases', function () {
        expect(groupBy(null, '' as any)).toEqual({});
        expect(groupBy(undefined, '' as any)).toEqual({});
        expect(groupBy([], '' as any)).toEqual({});
        expect(groupBy([], () => null)).toEqual({});
    });
});
