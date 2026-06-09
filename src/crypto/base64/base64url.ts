import { Buffer } from 'buffer';
import type { Nullable } from '../../index';

export function bufferFromBase64UrlString(source: Nullable<string>): Buffer {
    if (!source) return Buffer.alloc(0);

    return B64URLSupported
        ? Buffer.from(source, 'base64url')
        : Buffer.from(fromBase64Url(source), 'base64');
}

export function fromBase64Url(source: Nullable<string>): string {
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
