import { Buffer } from 'buffer';
import type { ARec } from '../index';
import type { JSONWebToken } from './jwt';

/**
 * Checks whether the given value is a valid JSON Web Token
 *
 * @param value the value to check
 * @param claims array of claim names that must be present in the payload
 * @param headerParams array of header parameter names that must be present in the header
 */
export function isJSONWebToken(
    value: unknown,
    claims?: string[],
    headerParams?: string[],
): value is JSONWebToken {
    if (!value || typeof value !== 'string' || value.length === 0) return false;

    const parts = value.split('.');
    if (parts.length !== 3) return false;

    try {
        const header = parseJWTPart(parts[0]);
        const payload = parseJWTPart(parts[1]);

        if (!header || !payload) return false;

        if (claims?.length && !includeAll(claims, payload)) return false;
        if (headerParams?.length && !includeAll(headerParams, header)) return false;

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Checks whether the given value has a JSON Web Token-like format string
 */
export function isJSONWebTokenLike(value: unknown): value is JSONWebToken {
    return typeof value === 'string' && value.length > 0 && RE_JWT.test(value);
}

export const RE_JWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

function parseJWTPart(value: string): ARec | undefined {
    const v = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    return v && typeof v === 'object' ? v : undefined;
}

function includeAll(names: string[], target: ARec) {
    for (const name of names) {
        if (!(name in target)) return false;
    }
    return true;
}
