import type { ARec, URec } from '../../index';
import { bufferFromBase64URLString } from '../base64/url';
import { JSONWebToken, JSONWebTokenSegmentName, JSONWebTokenSegments } from './types';

export function decodeJSONWebTokenPayload<T extends URec>(token: JSONWebToken) {
    const pStart = token.indexOf('.') + 1;
    const pEnd = token.indexOf('.', pStart);
    let source: string;

    if (pStart > 0 && pEnd > pStart && (source = token.substring(pStart, pEnd))) {
        return decodeJSONWebTokenSegment<T>(source);
    }

    return undefined;
}

export function decodeJSONWebTokenHeader<T extends URec>(token: JSONWebToken) {
    const pos = token.indexOf('.');
    let source: string;

    if (pos > 0 && (source = token.substring(0, pos))) {
        return decodeJSONWebTokenSegment<T>(source);
    }

    return undefined;
}

export function segmentizeJSONWebToken(token: JSONWebToken): JSONWebTokenSegments | undefined {
    const result = token.split('.');

    return result.length === 3 ? (result as unknown as JSONWebTokenSegments) : undefined;
}

export function decodeJSONWebTokenSegment<T extends ARec>(input: string): T | undefined {
    const buf = bufferFromBase64URLString(input);
    const result = JSON.parse(buf.toString('utf8'));

    return result && typeof result === 'object' ? (result as T) : undefined;
}

export function getJSONWebTokenSegment(
    token: JSONWebToken,
    segment: JSONWebTokenSegmentName,
): Base64URLString | undefined {
    const nSegment =
        typeof segment === 'number' ? segment : { header: 0, payload: 1, signature: 2 }[segment];

    if (nSegment >= 0 && nSegment <= 2) {
        let start = 0;

        for (let i = 0; i <= nSegment; i++) {
            const dotPos = i === 2 ? token.length : token.indexOf('.', start);
            if (dotPos < 0) return undefined;

            if (i === nSegment) {
                return token.substring(start, dotPos);
            }

            start = dotPos + 1;
        }
    }

    return undefined;
}
