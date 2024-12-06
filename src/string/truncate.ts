import { PositiveInt } from '../number/types';

export const EllipsisSymbol = '…';

export function truncateString(
    source: string,
    maxLength: PositiveInt,
    ellipsis: string = EllipsisSymbol,
): string {
    if (maxLength <= 0) return '';

    let count = 0;
    let result = '';

    for (const char of source) {
        count++;
        if (count > maxLength) {
            return result + ellipsis;
        }
        result += char;
    }

    return source;
}
