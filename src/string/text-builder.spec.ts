import { txt } from './text-builder';

describe('TextBuilder', () => {
    it('basic', () => {
        const t = txt();
        t.push('val-1.1', 0);
        t.push('val-2.1', 1);
        t.push('val-3.1', 2);
        t.push('val-2.2', 1);
        t.push('val-1.2', 0);
        expect(t.stringify()).toBe(
            'val-1.1\n' + '  val-2.1\n' + '    val-3.1\n' + '  val-2.2\n' + 'val-1.2',
        );
    });

    it('table', () => {
        const t0 = txt(['Basic Table:', '']);
        t0.at(
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

        const t01 = txt(['Basic table with Title:', '']);
        t01.at(
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
            { level: 2, colSep: ' ', title: 'Супертаблица ниже:' },
        );

        const t02 = txt(['Basic table with Title and header:', '']);
        t02.at(
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
            { level: 2, title: 'Супертаблица ниже:', header: true },
        );

        const t03 = txt(['Basic table with Title and header:', '']);
        t03.at(
            [
                ['~ Col ZERO ~', '~ Col 1 ~', '~ Col 2 ~', '~ Col 3 ~'],
                [' ', 'val-1.1', 'val-2.2', 'val-3.3'],
                [' ', 'wide-val-2.1', 'wide-val-2.2', 'wide-val-2.3'],
                [
                    ' ',
                    'super-super-super-super-super-super-wide-val-3.1',
                    'extra-wide-val-3.2',
                    // 'val-3.3',
                    txt([
                        //
                        'a',
                        'b',
                        'c',
                        'super-super-super-super-super-super-wide-val-3.1',
                    ]),
                ],
                [' ', 'val', 'val', 'val'],
            ],
            { level: 2, title: 'Супертаблица ниже:', header: true },
        );

        const t1 = txt(['Grid table with header:', '']);
        t1.at(
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

        const t2 = txt(['Key-Value table:', '']);
        const tableAsKeyValue = {
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
        t2.at(Object.entries(tableAsKeyValue), { level: 2 });

        const t3 = txt(['Key-Value table with header:', '']);
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
        t3.at(Object.entries(tableAsKeyValueWHeader), { level: 2, header: true });
    });
});
