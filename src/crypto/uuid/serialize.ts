import type { UUID, UUIDB } from './types';

/**
 * Serialize UUID from byte array to string representation
 */
export function serializeUUID<R extends UUID>(source: UUIDB, offset = 0): R {
    // noinspection PointlessArithmeticExpressionJS
    return (
        byteToHex[source[offset + 0]] +
        byteToHex[source[offset + 1]] +
        byteToHex[source[offset + 2]] +
        byteToHex[source[offset + 3]] +
        '-' +
        byteToHex[source[offset + 4]] +
        byteToHex[source[offset + 5]] +
        '-' +
        byteToHex[source[offset + 6]] +
        byteToHex[source[offset + 7]] +
        '-' +
        byteToHex[source[offset + 8]] +
        byteToHex[source[offset + 9]] +
        '-' +
        byteToHex[source[offset + 10]] +
        byteToHex[source[offset + 11]] +
        byteToHex[source[offset + 12]] +
        byteToHex[source[offset + 13]] +
        byteToHex[source[offset + 14]] +
        byteToHex[source[offset + 15]]
    ).toLowerCase() as R;
}

const byteToHex: string[] = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
