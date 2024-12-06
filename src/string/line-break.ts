import { PositiveInt } from '../number/types';

export function breakStringByLength(
    source: string,
    maxLength: PositiveInt,
    separator = '\n',
): string {
    if (maxLength <= 0) return '';

    const result = [];
    let count = 0;
    let chunk = '';

    for (const char of source) {
        count++;
        chunk += char;

        if (count === maxLength) {
            result.push(chunk);
            chunk = '';
            count = 0;
        }
    }

    if (chunk.length > 0) {
        result.push(chunk);
    }

    return result.join(separator);
}
