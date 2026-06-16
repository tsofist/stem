import { Buffer } from 'buffer';
import type { Base64String, Nullable } from '../../index';

export function bufferFromBase64URLString(source: Nullable<Base64URLString>): Buffer {
    if (!source) return Buffer.alloc(0);

    return B64URLSupported
        ? Buffer.from(source, 'base64url')
        : Buffer.from(fromBase64URLString(source), 'base64');
}

export function fromBase64URLString(source: Nullable<Base64URLString>): Base64String {
    if (!source) return '';

    let result = source.replace(RE_MINUS, '+').replace(RE_UNDERSCORE, '/');

    while (result.length % 4) {
        result += '=';
    }

    return result;
}

const RE_MINUS = /-/g;
const RE_UNDERSCORE = /_/g;
const B64URLSupported = Buffer.isEncoding('base64url');
