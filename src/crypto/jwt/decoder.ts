import type { ARec, URec } from '../../index';
import { bufferFromBase64UrlString } from '../base64/url';
import { JSONWebToken, JSONWebTokenSegments } from './types';

export function decodeJSONWebTokenPayload<T extends URec>(token: JSONWebToken) {
    const pStart = token.indexOf('.') + 1;
    const pEnd = token.indexOf('.', pStart);
    let source: string;

    if (pStart <= 0 || pEnd <= pStart || !(source = token.substring(pStart, pEnd))) {
        return undefined;
    }

    return parseJSONWebTokenSegment<T>(source);
}

export function decodeJSONWebTokenHeader<T extends URec>(token: JSONWebToken) {
    const hEnd = token.indexOf('.');
    let source: string;

    if (hEnd <= 0 || !(source = token.substring(0, hEnd))) {
        return undefined;
    }

    return parseJSONWebTokenSegment<T>(source);
}

export function splitJSONWebTokenToSegments(token: JSONWebToken): JSONWebTokenSegments | undefined {
    const result = token.split('.');
    return result.length === 3 ? (result as unknown as JSONWebTokenSegments) : undefined;
}

export function parseJSONWebTokenSegment<T extends ARec>(input: string): T | undefined {
    const buf = bufferFromBase64UrlString(input);
    const result = JSON.parse(buf.toString('utf8'));

    if (!result || typeof result !== 'object') return undefined;

    return result as T;
}
