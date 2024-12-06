/**
 * Breaks text into blocks of a specified length.
 *
 * @param source The source text.
 * @param maxLength The maximum length of each block.
 * @param right Determines whether the text should be split into blocks starting from the end (right side).
 */
export function chunkString(source: string, maxLength: number, right = false): string[] {
    const result: string[] = [];
    if (maxLength <= 0) return [];

    const chars = Array.from(source);

    if (right) {
        for (let i = chars.length; i > 0; i -= maxLength) {
            const start = Math.max(i - maxLength, 0);
            result.push(chars.slice(start, i).join(''));
        }
        return result.reverse();
    }

    for (let i = 0; i < chars.length; i += maxLength) {
        result.push(chars.slice(i, i + maxLength).join(''));
    }

    return result;
}
