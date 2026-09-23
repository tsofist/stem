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

export function fromBase64String(source: Nullable<Base64String>): Base64URLString {
    if (!source) return '';

    return source.replace(RE_PLUS, '-').replace(RE_SLASH, '_').replace(RE_PADDING, '');
}

export function bufferFromBase64String(source: Nullable<Base64String>): Buffer {
    if (!source) return Buffer.alloc(0);

    return Buffer.from(source, 'base64');
}

const RE_MINUS = /-/g;
const RE_PLUS = /\+/g;
const RE_SLASH = /\//g;
const RE_PADDING = /=+$/;
const RE_UNDERSCORE = /_/g;

const B64URLSupported = Buffer.isEncoding('base64url');
