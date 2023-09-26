import { Buffer } from 'buffer';
import { timingSafeEqual } from 'crypto';

/**
 * Crypto-safe string comparison
 */
export function cryptoCompareStrings(input1: string, input2: string) {
    const input1Length = Buffer.byteLength(input1);
    const input2Length = Buffer.byteLength(input2);
    const input1Buffer = Buffer.alloc(input1Length, 0, 'utf8');
    input1Buffer.write(input1);
    const input2Buffer = Buffer.alloc(input1Length, 0, 'utf8');
    input2Buffer.write(input2);

    // @ts-expect-error It's OK
    return !!(timingSafeEqual(input1Buffer, input2Buffer) & (input1Length === input2Length));
}
