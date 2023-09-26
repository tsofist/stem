/**
 * Create a string of random content
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number/toString radix
 */
export function randomString(length = 12, radix = 16): string {
    let result = '';
    let i: number;
    for (i = 0; i < length; i++) result += Math.ceil(Math.random() * (radix - 1)).toString(radix);
    return result;
}
