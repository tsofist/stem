import { bufferFromBase64URLString } from '../base64/url';
import { segmentizeJSONWebToken } from './decoder';
import type { JSONWebToken } from './types';

export function extractJWTPayloadClaim<T extends ValueClass>(
    token: JSONWebToken,
    claim: string,
    Cls: T,
): ValueClassInstance<T> | undefined;

export function extractJWTPayloadClaim<T extends ValueClass>(
    token: JSONWebToken,
    claim: string,
): string | undefined;

export function extractJWTPayloadClaim<T extends ValueClass>(
    token: JSONWebToken,
    claim: string,
    Cls?: T,
) {
    if (!token?.length) return undefined;

    const segments = segmentizeJSONWebToken(token);
    if (!segments) return undefined;

    const payload = bufferFromBase64URLString(segments[1]).toString('binary');
    const pStart = payload.indexOf(`"${claim}":`);
    if (pStart < 0) return undefined;

    let pEnd = payload.indexOf(',', pStart);
    if (pEnd === -1) pEnd = payload.indexOf('}', pStart);
    if (pEnd < 0) return undefined;

    let result = payload.substring(pStart + claim.length + 3, pEnd);

    if (Cls == null) {
        return JSON.parse(result);
    } else if (result.length > 3 && result.startsWith('"') && result.endsWith('"')) {
        result = result.substring(1, result.length - 1).replace(RE_QUOTE, '"');
    }

    return Cls ? Cls(result) : JSON.parse(result);
}

type ValueClass = NumberConstructor | StringConstructor | BooleanConstructor;
type ValueClassInstance<T extends ValueClass> = T extends NumberConstructor
    ? number
    : T extends StringConstructor
      ? string
      : T extends BooleanConstructor
        ? boolean
        : never;

const RE_QUOTE = /\\"/g;
