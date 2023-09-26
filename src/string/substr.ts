/**
 * Find a substring in a string with a position calculated by word
 * @example
 *      substr("My-15-tmp-str-89", "15", "89") // "-tmp-str-"
 *      substr("to be or not to be", "be", "to") // " or not "
 *      substr("LongStr", 4) // "Str"
 *      substr("MyStr", 0, 2) // "My"
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/substring String.substring
 */
export function substr(
    it: string | null | undefined,
    skipOrPos: string | number,
    lenOrPos?: string | number,
): string | undefined {
    if (it) {
        let l = 0;
        let skip: number;
        if (typeof skipOrPos === 'string') {
            l = skipOrPos.length;
            skip = it.indexOf(skipOrPos);
        } else {
            skip = skipOrPos;
        }
        if (skip != null && skip >= 0) {
            skip += l;
            if (lenOrPos == null) {
                return it.substring(skip);
            }
            if (typeof lenOrPos === 'string') {
                lenOrPos = it.indexOf(lenOrPos, skip);
                if (lenOrPos >= 0) {
                    return it.substring(skip, lenOrPos);
                }
            } else {
                return it.substring(skip, lenOrPos + skip);
            }
        }
    }
    return undefined;
}
