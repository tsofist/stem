import type { ArrayMay } from '../index';

export type TextBuilderItem = string | undefined | null | false;
export type TextBuilderPushData = TextBuilder | ArrayMay<TextBuilderItem | TextBuilder>;

export function txt(...data: ConstructorParameters<typeof TextBuilder>): TextBuilder {
    return new TextBuilder(...data);
}

export class TextBuilder {
    readonly #data: string[] = [];

    levelChar = ' ';
    levelSize = 2;
    baseLevel = 0;

    constructor(data?: ArrayMay<TextBuilderItem> | TextBuilder, level = 0) {
        if (data != null) this.a(data, level);
    }

    static ne(value: TextBuilderItem, condition?: unknown): string | undefined {
        return ((arguments.length > 1 ? !!condition && value : value) && value) || undefined;
    }

    get size() {
        return this.#data.length;
    }

    /**
     * Append element(s)
     */
    a(data: TextBuilderPushData, level = 0) {
        level = this.baseLevel + level;

        if (!Array.isArray(data)) {
            if (data instanceof TextBuilder) data = [...data.#data];
            else data = [data];
        }
        const push = (item: TextBuilderItem) =>
            item != null &&
            item !== false &&
            this.#data.push((this.levelChar.repeat(level * this.levelSize) + item).trimEnd());

        for (const item of data) {
            if (item instanceof TextBuilder) for (const dataItem of item.#data) push(dataItem);
            else push(item);
        }
        return this;
    }

    tColumnSeparator = ' │ ';
    tHeaderSeparator = '─';
    tIntersectionSeparator = '┼';
    tTitleSeparator = '┈';

    /**
     * Append element as table
     */
    at(
        rows: TextBuilderPushData[][],
        options: {
            level?: number;
            title?: string;
            header?: boolean;
            colSep?: string;
            headerSep?: string;
            intersectionSep?: string;
            titleSep?: string;
        },
    ) {
        const level = this.baseLevel + (options.level ?? 0);
        const {
            colSep: sCol = this.tColumnSeparator,
            headerSep: sHeader = this.tHeaderSeparator,
            intersectionSep: sIntersection = this.tIntersectionSeparator,
            titleSep: sTitle = this.tTitleSeparator,
            header: separateHeader = false,
        } = options;

        const cLen = rows[0].length;
        const cSizes: number[] = new Array(cLen).fill(0);

        for (const row of rows) {
            for (let i = 0; i < cLen; i++) {
                const item = row[i];
                if (item instanceof TextBuilder) {
                    for (const dataItem of item.#data) {
                        if (
                            dataItem != null &&
                            // @ts-expect-error TS2367 - OK
                            dataItem !== false
                        ) {
                            cSizes[i] = Math.max(cSizes[i], String(dataItem).length);
                        }
                    }
                } else if (item != null && item !== false) {
                    cSizes[i] = Math.max(cSizes[i], String(item).length);
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
                    : title + sTitle.repeat(Math.max(0, totalSize - title.length - 1)) + ' ';
            this.#data.push((this.levelChar.repeat(level * this.levelSize) + titleLine).trimEnd());
            this.#data.push('');
        }

        const headerProcessed = separateHeader && rows.length > 1;

        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            const line = row
                .map((item, i) => {
                    let text = '';
                    if (item instanceof TextBuilder) {
                        text = item.#data
                            .map((dataItem, index) => {
                                if (index === 0) return String(dataItem);
                                const prefixSize =
                                    cSizes.slice(0, i).reduce((a, b) => a + b, 0) +
                                    sCol.length * i +
                                    1;
                                return (
                                    this.levelChar.repeat(prefixSize) +
                                    sCol +
                                    String(dataItem)
                                ).trimEnd();
                            })
                            .join('\n');
                    } else if (item != null && item !== false) {
                        text = String(item);
                    }
                    return text.padEnd(cSizes[i], ' ');
                })
                .join(sCol);

            this.#data.push((this.levelChar.repeat(level * this.levelSize) + line).trimEnd());

            if (headerProcessed && r === 0) {
                const sepLine = cSizes.reduce((acc, size, index) => {
                    if (index > 0) acc += sIntersection;
                    const times =
                        size +
                        (index > 0 ? sCol.length : sIntersection.length + 1) -
                        sIntersection.length;
                    acc += sHeader.repeat(times);
                    return acc;
                }, '');
                this.#data.push(
                    (this.levelChar.repeat(level * this.levelSize) + sepLine).trimEnd(),
                );
            }
        }

        {
            const totalSize =
                cSizes.reduce((a, b) => a + b, 0) + sCol.length * (cSizes.length - 1) + 1;
            this.#data.push(
                (
                    this.levelChar.repeat(level * this.levelSize) + sTitle.repeat(totalSize)
                ).trimEnd(),
            );
        }

        return this;
    }

    /**
     * @see a
     * @deprecated use `.a` instead
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
}
