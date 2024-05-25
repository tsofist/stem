import { ArrayMay } from '../index.js';

export type TextBuilderItem = string | undefined | null | false;

export class TextBuilder {
    readonly #data: string[] = [];

    levelChar = ' ';

    levelSize = 2;

    constructor(data?: ArrayMay<TextBuilderItem> | TextBuilder, level = 0) {
        if (data != null) this.push(data, level);
    }

    static ne(value: TextBuilderItem, condition?: any): string | undefined {
        return ((arguments.length > 1 ? condition && value : value) && value) || undefined;
    }

    push(data: ArrayMay<TextBuilderItem | TextBuilder> | TextBuilder, level = 0) {
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

    stringify(separator = '\n') {
        return this.#data.join(separator);
    }

    linearize() {
        return this.stringify('. ').trim();
    }
}
