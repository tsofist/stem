/**
 * Breaks text into blocks of a specified length.
 * Guaranteed non-zero length of the result.
 */
export function chunkString(str: string, size: number, rightToLeft = false): string[] {
    if (size <= 0) return [''];
    const result = [];
    if (rightToLeft) {
        for (let i = str.length; i > 0; i -= size) {
            const diff = i - size;
            result.push(str.substring(diff < 0 ? 0 : diff, diff < 0 ? diff + size : diff + size));
        }
        return result.reverse();
    }
    for (let i = 0; i < str.length; i += size) {
        result.push(str.substring(i, i + size));
    }
    return result;
}
