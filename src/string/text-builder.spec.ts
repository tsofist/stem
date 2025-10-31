import { substr } from './substr';
import { txt } from './text-builder';

describe('TextBuilder', () => {
    it('basic', () => {
        const t = txt();
        t.a('val-1.1', 0);
        t.a('val-2.1', 1);
        t.a('val-3.1', 2);
        t.a('val-2.2', 1);
        t.a('val-1.2', 0);

        expect(t.stringify()).toMatchSnapshot();
    });

    describe('error entries', () => {
        it('basic', () => {
            const msg = 'Something bad happened!';
            const t = txt();

            t.a(new URIError(msg));

            const v = String(t);
            const vLines = v.split('\n');

            expect(v.length).toBeGreaterThan(10);
            expect(v.charAt(0)).toBe(t.errorPrefixChar);
            expect(substr(v, ' ', '\n')).toStrictEqual(`URIError: ${msg}`);
            expect(vLines.filter((value) => value.startsWith('at ')).length).toStrictEqual(0);
        });

        it('table', () => {
            const t = txt();
            const e = new Error('Table generation failed!');

            t.at(Object.entries({ error: e }));

            expect(String(t)).toMatchSnapshot();
        });
    });

    describe('table from rows (at)', () => {
        it('basic', () => {
            const t = txt(['Basic Table:', '']);
            t.at(
                [
                    ['~ Col 1 ~', '~ Col 2 ~', '~ Col 3 ~'],
                    ['val-1.1', 'val-2.2', 'val-3.3'],
                    ['wide-val-2.1', 'wide-val-2.2', 'wide-val-2.3'],
                    [
                        'super-super-super-super-super-super-wide-val-3.1',
                        'extra-wide-val-3.2',
                        'val-3.3',
                    ],
                ],
                { level: 2, colSep: ' ' },
            );

            expect(String(t)).toMatchSnapshot();
        });

        it('basic w/ title', () => {
            const t = txt(['Basic Table with Title:', '']);
            t.at(
                [
                    ['~ Col 1 ~', '~ Col 2 ~', '~ Col 3 ~'],
                    ['val-1.1', 'val-2.2', 'val-3.3'],
                    ['wide-val-2.1', 'wide-val-2.2', 'wide-val-2.3'],
                    [
                        'super-super-super-super-super-super-wide-val-3.1',
                        'extra-wide-val-3.2',
                        'val-3.3',
                    ],
                ],
                { level: 2, colSep: ' ', title: 'Supertable:' },
            );

            expect(String(t)).toMatchSnapshot();
        });

        it('basic w/ title & header', () => {
            const t = txt(['Basic Table with Title & Header:', '']);
            t.at(
                [
                    ['~ Col 1 ~', '~ Col 2 ~', '~ Col 3 ~'],
                    ['val-1.1', 'val-2.2', 'val-3.3'],
                    ['wide-val-2.1', 'wide-val-2.2', 'wide-val-2.3'],
                    [
                        'super-super-super-super-super-super-wide-val-3.1',
                        'extra-wide-val-3.2',
                        'val-3.3',
                    ],
                ],
                { level: 2, colSep: ' ', title: 'Supertable:', header: true },
            );

            expect(String(t)).toMatchSnapshot();
        });

        it('basic w/ title & header & inner text builder', () => {
            const t = txt(['Basic Table with Title & Header & Inner TextBuilder:', '']);
            t.at(
                [
                    ['~ Col 1 ~', '~ Col 2 ~', '~ Col 3 ~'],
                    ['val-1.1', 'val-2.2', 'val-3.3'],
                    ['wide-val-2.1', 'wide-val-2.2', 'wide-val-2.3'],
                    [
                        'super-super-super-super-super-super-wide-val-3.1',
                        'extra-wide-val-3.2',
                        txt([
                            //
                            'a',
                            'b',
                            'c',
                            'super-super-super-super-super-super-wide-val-3.1',
                        ]),
                    ],
                ],
                { level: 2, colSep: ' ', title: 'Supertable:', header: true },
            );

            expect(String(t)).toMatchSnapshot();
        });

        it('grid table with header', () => {
            const t = txt(['Grid table with header:', '']);
            t.at(
                [
                    ['~ Col 1 ~', '~ Col 2 ~', '~ Col 3 ~'],
                    ['val-1.1', 'val-2.2', 'val-3.3'],
                    ['wide-val-2.1', 'wide-val-2.2', 'wide-val-2.3'],
                    [
                        'super-super-super-super-super-super-wide-val-3.1',
                        'extra-wide-val-3.2',
                        'val-3.3',
                    ],
                ],
                { level: 2, header: true },
            );

            expect(String(t)).toMatchSnapshot();
        });

        it('key-value table w/o header', () => {
            const t = txt(['Key-Value table w/o header:', '']);
            const tableAsKeyValueNoHeader = {
                'Col 1': 'val-1.1',
                'Col 2': 'val-2.2',
                'Col 3': 'val-3.3',
                'Wide Col 1': 'wide-val-2.1',
                'Wide Col 2': 'wide-val-2.2',
                'Wide Col 3': 'wide-val-2.3',
                'Super Wide Col 1': 'super-super-super-super-super-super-wide-val-3.1',
                'Extra Wide Col 2': 'extra-wide-val-3.2',
                'Col 3 Again': 'val-3.3',
            };
            t.at(Object.entries(tableAsKeyValueNoHeader), { level: 2, header: false });

            expect(String(t)).toMatchSnapshot();
        });

        it('key-value table w/ header', () => {
            const tableAsKeyValueWHeader = {
                'Characteristic': 'Value',
                'Col 1': 'val-1.1',
                'Col 2': 'val-2.2',
                'Col 3': 'val-3.3',
                'Wide Col 1': 'wide-val-2.1',
                'Wide Col 2': 'wide-val-2.2',
                'Wide Col 3': 'wide-val-2.3',
                'Super Wide Col 1': 'super-super-super-super-super-super-wide-val-3.1',
                'Extra Wide Col 2': 'extra-wide-val-3.2',
                'Col 3 Again': 'val-3.3',
            };

            const t = txt(['Key-Value table w/ header:', '']);
            t.at(Object.entries(tableAsKeyValueWHeader), { level: 2, header: true });

            expect(String(t)).toMatchSnapshot();
        });
    });

    describe('table from items (ati)', () => {
        type Item = { n: number; s: string; b: boolean; a: any };

        const n = () => {};
        const items: Item[] = [
            { n: 1, s: 'val-1.1', b: true, a: null },
            { a: {}, b: false, n: 2, s: 'val-2.2' },
            { b: true, n: 3, s: 'val-3.3', a: [] },
            { n: 4, s: 'val-4.4', b: true, a: 0 },
            { n: 5, s: 'val-5.5', b: true, a: undefined },
            { n: 6, s: 'val-6.6', b: true, a: n },
            { n: 7, s: 'val-7.7', b: true, a: BigInt(1_000) },
            { a: txt(['alpha', 'beta', 'gamma']), n: 8, s: 'val-8.8', b: true },
            {
                a: txt([0, '=0', '>3', '>2', '>1', false, null, undefined], 1),
                n: 100,
                s: 'v100',
                b: true,
            },
        ];

        it('basic', () => {
            const t = txt();
            t.ati(items);

            expect(String(t)).toMatchSnapshot();
        });

        it('w/ header', () => {
            const t = txt();
            t.ati(items, { header: true });

            expect(String(t)).toMatchSnapshot();
        });

        it('w/ head: projection', () => {
            const t = txt();
            t.ati(items, { header: true }, ['n', 's']);

            expect(String(t)).toMatchSnapshot();
        });

        it('w/ head: titles', () => {
            const t = txt();
            t.ati(items, { header: true }, { n: 'No.', s: 'String', b: 'Bool.' });

            expect(String(t)).toMatchSnapshot();
        });

        it('w/ head: projection + inner text builders [1]', () => {
            const t = txt();
            t.ati(items, { header: true }, ['n', 'b', 'a', 's']);

            expect(String(t)).toMatchSnapshot();
        });

        it('w/ head: projection + inner text builders [2]', () => {
            const t = txt();
            t.ati(items, { header: true }, ['a', 'n']);

            expect(String(t)).toMatchSnapshot();
        });
    });
});
