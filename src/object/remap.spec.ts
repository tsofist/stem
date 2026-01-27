import { remap } from './remap';

describe('remap', () => {
    it('remaps flat object with key map', () => {
        const S1 = Symbol('s1');
        const S2 = Symbol('s2');
        const source = { a: 1, b: 'two', c: true, [S1]: 2, [S2]: 's2' };
        const result = remap(
            {
                x: 'a',
                y: 'b',
                z: 'c',
            },
            source,
        );

        result.x.toFixed();
        result.y.toUpperCase();
        result.z.valueOf();

        // @ts-expect-error TS2551: test
        result.Y;

        expect(result).toStrictEqual({
            x: 1,
            y: 'two',
            z: true,
        });
    });

    it('remaps flat object with formatter map', () => {
        const source = { a: 2, b: 3 };

        const result = remap(
            {
                sum: (vals: typeof source) => vals.a + vals.b,
                product: (vals: typeof source) => vals.a * vals.b,
            },
            source,
        );

        expect(result).toStrictEqual({
            sum: 5,
            product: 6,
        });
    });

    it('remaps nested object with mixed map', () => {
        const source = {
            a: 10,
            b: 20,
            c: { d: 30, e: 40 },
        };

        const result = remap(
            {
                first: 'a',
                second: (vals) => vals.b * 2,
                nested: {
                    third: 'b',
                    fourth: (vals) => vals.c.e + 10,
                },
            },
            source,
        );

        expect(result).toStrictEqual({
            first: 10,
            second: 40,
            nested: { third: 20, fourth: 50 },
        });
    });

    it('remaps using root formatter function', () => {
        const source = { x: 5, y: 15, additional: 100 };

        const result = remap((values, fmt) => {
            const additional = fmt('additional', (v) => v / 10);
            return {
                total: fmt('x', (v) => v + fmt('y', (w) => w)),
                difference: fmt('y', (v) => v - fmt('x', (w) => w)),
                add: {
                    initialX: values.x,
                    initialY: values.y,
                    additional,
                },
                pNull: null,
                pNum: 42,
                pBoolF: false,
                pBoolT: true,
            };
        }, source);

        expect(result).toStrictEqual({
            total: 20,
            difference: 10,
            add: {
                additional: 10,
                initialX: 5,
                initialY: 15,
            },
            pNull: null,
            pNum: 42,
            pBoolF: false,
            pBoolT: true,
        });
    });
});
