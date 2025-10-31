import { asArray } from '../as-array';
import type { ARec, ArrayMay, PRec, StringKeyOf } from '../index';

export type TextBuilderItem = number | string | undefined | null | false | Error;
export type TextBuilderPushData = TextBuilder | ArrayMay<TextBuilderItem | TextBuilder>;
export type TextBuilderTableCellAlign = 'left' | 'right';
export type TextBuilderTableOptions = {
    /** Relative to current level */
    level?: number;
    /** Table title */
    title?: string;
    /** Whether the first row is a header */
    header?: boolean;
    /** Column separator */
    colSep?: string;
    /** Header separator */
    headerSep?: string;
    /** Crossing (intersection) separator */
    intersectionSep?: string;
    /** Table title separator */
    titleSep?: string;
    /** Cell data alignment */
    align?: TextBuilderTableCellAlign;
    /** Header cell data alignment */
    alignHeader?: TextBuilderTableCellAlign;
};

export function txt(...data: ConstructorParameters<typeof TextBuilder>): TextBuilder {
    return new TextBuilder(...data);
}

export class TextBuilder {
    readonly #data: string[] = [];

    levelChar = ' ';
    levelSize = 2;
    baseLevel = 0;

    errorPrefixChar = '⭕';

    tColumnSeparator = ' │ ';
    tHeaderSeparator = '─';
    tIntersectionSeparator = '┼';
    tTitleSeparator = '┈';

    constructor(data?: ArrayMay<TextBuilderItem> | TextBuilder, level = 0) {
        if (data != null) this.a(data, level);
    }

    /**
     * Current size (number of lines)
     */
    get size() {
        return this.#data.length;
    }

    /**
     * Append line break(s)
     */
    br(lines = 1) {
        for (let i = 0; i < lines; i++) {
            this.a('');
        }
    }

    protected doAppend(
        sources: TextBuilderPushData,
        level: number = 0,
        container: Pick<string[], 'push'> = this.#data,
    ) {
        level = this.baseLevel + level;

        const append = (item: TextBuilder | TextBuilderItem, builder: TextBuilder) => {
            if (item != null && item !== false) {
                const { errorPrefixChar, levelChar, levelSize } = builder;
                let prefix = levelChar.repeat(level * levelSize);

                if (item instanceof TextBuilder) {
                    for (const innerItem of item.#data) {
                        container.push(`${prefix}${innerItem}`);
                    }
                } else if (item instanceof Error) {
                    if (errorPrefixChar) prefix += errorPrefixChar + ' ';
                    container.push(`${prefix}${String(item)}`);
                    if (item.stack) {
                        // eslint-disable-next-line prefer-spread
                        container.push.apply(container, item.stack.split('\n').slice(1));
                    }
                } else {
                    container.push(`${prefix}${String(item)}`);
                }
            }
        };

        for (const item of asArray(sources)) {
            append(item, this);
        }

        return this;
    }

    /**
     * Append element(s)
     */
    a(data: TextBuilderPushData, level = 0) {
        return this.doAppend(data, level);
    }

    /**
     * Append array of items with table-like representation.
     *
     * @example
     *   type Item = {
     *        num: number;
     *        str: string;
     *        bool: boolean;
     *        any: any;
     *   };
     *
     *   const items: Item[] = [
     *       { num: 0, str: 'string value 00', bool: true, any: () => 0 },
     *       { num: 1, str: 'string value 01', bool: true, any: undefined },
     *       { num: 2, str: 'string value 02', bool: false, any: null },
     *       { num: 3, str: 'string value 03', bool: true, any: 0 },
     *       { num: 4, str: 'string value 04', bool: false, any: {} },
     *       { num: 5, str: 'string value 05', bool: true, any: [] },
     *       { num: 6, str: 'string value 06', bool: true, any: [1, 2, 3] },
     *       { num: 7, str: 'string value 07', bool: true, any: 'any string' },
     *       { num: 8, str: 'string value 08', bool: true, any: BigInt(1_000_000) },
     *       { num: 9, str: 'string value 09', bool: true, any: txt(['a', 'b', 'c']) },
     *       { num: 10, str: 'string value 10', bool: true, any: txt([0, 1, 2], 2) },
     *   ];
     *   const t = txt();
     *
     *   t.ati(items);
     *   t.stringify();
     *
     *   // Output:
     *   //
     *   //  0  │ string value 00 │ true │ () => 0
     *   //  1  │ string value 01 │ true │
     *   //  2  │ string value 02 │      │
     *   //  3  │ string value 03 │ true │ 0
     *   //  4  │ string value 04 │      │ [object Object]
     *   //  5  │ string value 05 │ true │
     *   //  6  │ string value 06 │ true │ 1,2,3
     *   //  7  │ string value 07 │ true │ any string
     *   //  8  │ string value 08 │ true │ 1000000
     *   //  9  │ string value 09 │ true │ a
     *   //                              │ b
     *   //                              │ c
     *   //  10 │ string value 10 │ true │     0
     *   //                              │     1
     *   //                              │     2
     *   //  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
     *
     * @example
     *    type Item = {
     *        num: number;
     *        str: string;
     *    };
     *
     *    const items: Item[] = [
     *        { num: 0, str: 'string value 00' },
     *        { num: 1, str: 'string value 01' },
     *        { num: 2, str: 'string value 02' },
     *        { num: 3, str: 'string value 03' },
     *    ];
     *    const t = txt();
     *
     *    t.ati(
     *        items,
     *        {
     *            title: 'Items Table:',
     *            header: true,
     *            titleSep: '═',
     *        },
     *        // projection + titles ->
     *        {
     *            num: 'No.',
     *            str: 'String Value',
     *        },
     *    );
     *    t.stringify();
     *
     *    // Output:
     *    //
     *    // ══ Items Table: ═════
     *    // No. │ String Value
     *    // ────┼────────────────
     *    // 0   │ string value 00
     *    // 1   │ string value 01
     *    // 2   │ string value 02
     *    // 3   │ string value 03
     *    // ═════════════════════
     *
     * @example
     *   type Item = {
     *       num: number;
     *       str: string;
     *   };
     *
     *   const items: Item[] = [
     *       { num: 0, str: 'string long-long-long-long value' },
     *       { num: 1, str: 'string long-long-long-long value' },
     *       { num: 2, str: 'string long-long-long-long value' },
     *       { num: 3, str: 'string long-long-long-long value' },
     *   ];
     *   const t2 = txt();
     *
     *   t2.ati(
     *       items,
     *       { title: 'Projection: str-field only' },
     *       ['str'] // <- projection
     *   );
     *   t2.stringify();
     *
     *   // Output:
     *   //
     *   // ┈┈ Projection: str-field only ┈┈
     *   // string long-long-long-long value
     *   // string long-long-long-long value
     *   // string long-long-long-long value
     *   // string long-long-long-long value
     *   // ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
     */
    ati<T extends ARec, K extends StringKeyOf<T>>(
        items: T[],
        options?: {
            level?: number;
            title?: string;
            header?: boolean;
            colSep?: string;
            headerSep?: string;
            intersectionSep?: string;
            titleSep?: string;
        },
        head?: K[] | PRec<string, K>,
    ) {
        let keys: string[];
        let titles: string[];

        if (Array.isArray(head)) {
            keys = titles = head;
        } else if (head && typeof head === 'object') {
            titles = Object.values(head);
            keys = Object.keys(head);
        } else {
            const probe = items.length ? items.find((v) => v != null) : undefined;
            keys = titles = probe ? Object.keys(probe) : [];
        }

        const rows: TextBuilderPushData[][] = options?.header ? [titles] : [];

        for (const item of items) {
            if (item) {
                const row: TextBuilderPushData[] = [];
                for (const key of keys) {
                    row.push(item[key] as TextBuilderPushData);
                }
                rows.push(row);
            }
        }

        return this.at(rows, options);
    }

    /**
     * Append array of rows sources with table-like representation.
     *
     * @example
     *   const kv = {
     *       Col1: 'Value for column 1',
     *       Col2: 'Value for column 2'
     *   };
     *   const t = txt();
     *
     *   t.at(Object.entries(kv), {
     *       title: 'Key-Value Table'
     *   });
     *
     *   t.stringify();
     *
     *   // Output:
     *   //
     *   // ┈┈ Key-Value Table ┈┈┈┈┈┈
     *   // Col1 │ Value for column 1
     *   // Col2 │ Value for column 2
     *   // ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
     *
     * @example
     *   const kv = {
     *       'Key (Column name)': 'Value (Example)',
     *       'Col1': 'Value for column 1',
     *       'Col2': 'Value for column 2',
     *   };
     *   const t2 = txt();
     *
     *   t2.at(Object.entries(kv), {
     *       title: 'Key-Value Table',
     *       header: true,
     *       align: 'right',
     *       alignHeader: 'left',
     *   });
     *
     *   t2.stringify();
     *
     *   // Output:
     *   //
     *   // ┈┈ Key-Value Table ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
     *   // Key (Column name) │ Value (Example)
     *   // ──────────────────┼───────────────────
     *   //              Col1 │ Value for column 1
     *   //              Col2 │ Value for column 2
     *   // ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
     *
     */
    at(rows: TextBuilderPushData[][], options: TextBuilderTableOptions = {}) {
        const level = this.baseLevel + (options.level ?? 0);
        const {
            colSep: sCol = this.tColumnSeparator,
            headerSep: sHeader = this.tHeaderSeparator,
            intersectionSep: sIntersection = this.tIntersectionSeparator,
            titleSep: sTitle = this.tTitleSeparator,
            header: separateHeader = false,
            align = 'l',
            alignHeader = align,
        } = options;

        const alignMethod = align === 'right' ? 'padStart' : 'padEnd';
        const headerAlignMethod = alignHeader === 'right' ? 'padStart' : 'padEnd';
        const cLen = rows.at(0)?.length ?? 0;
        const cSizes: number[] = new Array(cLen).fill(0);

        {
            for (const row of rows) {
                for (let i = 0; i < cLen; i++) {
                    const item = row[i];
                    this.doAppend(
                        //
                        item,
                        0,
                        {
                            push(item) {
                                cSizes[i] = Math.max(cSizes[i], item.length);
                                return 0;
                            },
                        },
                    );
                }
            }
        }

        if (options.title) {
            const title = `${sTitle.repeat(2)} ${options.title} `;
            const totalSize =
                cSizes.reduce((a, b) => a + b, 0) + sCol.length * (cSizes.length - 1) + 2;
            const titleLine =
                title.length >= totalSize
                    ? title
                    : title + sTitle.repeat(Math.max(0, totalSize - title.length - 2)) + ' ';
            this.doAppend(titleLine.trimEnd(), level);
        }

        const headerProcessed = separateHeader && rows.length > 1;

        for (let r = 0; r < rows.length; r++) {
            const am = r === 0 && headerProcessed ? headerAlignMethod : alignMethod;
            const row = rows[r];
            const line = row
                .map((item, i) => {
                    let text = '';
                    if (item instanceof TextBuilder) {
                        text = item.#data
                            .map((dataItem, index) => {
                                let line = '';
                                if (index === 0) {
                                    line = dataItem;
                                } else {
                                    const prefixSize = Math.max(
                                        0,
                                        cSizes.slice(0, i).reduce((a, b) => a + b, 0) +
                                            sCol.length * i +
                                            -sCol.length,
                                    );
                                    line =
                                        this.levelChar.repeat(level * this.levelSize) +
                                        item.levelChar.repeat(prefixSize) +
                                        (i === 0 ? '' : sCol) +
                                        dataItem;
                                }

                                const p =
                                    index === 0
                                        ? cSizes[i]
                                        : cSizes.slice(0, i + 1).reduce((a, b) => a + b, 0) +
                                          sCol.length * i;
                                // todo am instead of padEnd
                                return (
                                    line.padEnd(p, ' ') +
                                    (index === item.#data.length - 1 || i === cSizes.length - 1
                                        ? ''
                                        : sCol)
                                );
                            })
                            .join('\n');
                    } else if (item != null && item !== false) {
                        text = String(item);
                    }

                    return text[am](cSizes[i], ' ');
                })
                .join(sCol)
                .trimEnd();

            this.doAppend(line, level);

            if (headerProcessed && r === 0) {
                const sepLine = cSizes.reduce((acc, size, index) => {
                    const first = index === 0;
                    const last = index === cSizes.length - 1;

                    if (!first) acc += sIntersection;

                    const times =
                        size +
                        (first ? sIntersection.length + 1 : sCol.length) -
                        sIntersection.length +
                        (last ? -1 : 0);

                    acc += sHeader.repeat(times);

                    return acc;
                }, '');
                this.doAppend(sepLine, level);
            }
        }

        if (rows.length) {
            const totalSize =
                cSizes.reduce(
                    //
                    (a, b) => a + b,
                    0,
                ) +
                sCol.length * (cSizes.length - 1);

            this.doAppend(sTitle.repeat(totalSize).trimEnd(), level);
        }

        return this;
    }

    /**
     * @see a
     * @see br
     * @see at
     * @see ati
     * @deprecated alternatives: `.a` or `.at` or `.ati` or `.br`
     */
    push(data: TextBuilderPushData, level = 0) {
        return this.a(data, level);
    }

    stringify(separator = '\n') {
        return this.#data.join(separator);
    }

    linearize() {
        return this.stringify('. ').trim();
    }

    toString() {
        return this.stringify();
    }

    toJSON() {
        return [...this.#data];
    }
}
