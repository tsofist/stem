import type { ARec, ReadonlyMay } from '../../index';
import { decodeJSONWebTokenSegment, segmentizeJSONWebToken } from './decoder';
import type { JSONWebToken, JSONWebTokenSegments } from './types';

/**
 * Checks whether the given value is a valid JSON Web Token
 *
 * @param value the value to check
 * @param claims array of claim names that must be present in the payload
 * @param headerParams array of header parameter names that must be present in the header
 */
export function isJSONWebToken(
    value: unknown | string | JSONWebTokenSegments,
    claims?: ReadonlyMay<string[]>,
    headerParams?: ReadonlyMay<string[]>,
): value is JSONWebToken {
    if (!value) return false;

    let segments: JSONWebTokenSegments | undefined;

    if (Array.isArray(value)) {
        if (value.length !== 3) return false;
        segments = value as unknown as JSONWebTokenSegments;
    } else if (typeof value !== 'string') {
        return false;
    } else {
        segments = segmentizeJSONWebToken(value);
    }

    if (!segments) return false;

    try {
        const header = decodeJSONWebTokenSegment(segments[0]);
        const payload = decodeJSONWebTokenSegment(segments[1]);

        if (!header || !payload) return false;
        if (claims?.length && !hasAll(claims, payload)) return false;
        if (headerParams?.length && !hasAll(headerParams, header)) return false;

        return true;
    } catch (e) {
        return false;
    }
}

function hasAll(keys: ReadonlyMay<string[]>, target: ARec) {
    for (const name of keys) {
        if (!(name in target)) return false;
    }
    return true;
}
