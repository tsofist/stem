import type { Nullable } from '../../index';
import { clampNum } from '../../number/clamp';
import { isJSONWebToken } from './is';
import { isJSONWebTokenLike } from './is-like';
import type { JSONWebToken } from './types';

/**
 * Formats a JWT token value for logging/etc., showing only the specified number of characters at the start and end.
 *
 * @param value the JWT token value to format
 * @param head number of characters to show at the start of the token (default: 6)
 * @param tail number of characters to show at the end of the token (default: 6)
 *
 * ```
 *   eyJhbG···p-QV30
 * ```
 */
export function maskJWTTokenValue(
    value: Nullable<JSONWebToken>,
    head?: number,
    tail?: number,
): string {
    if (!value) return '';

    const [h, t] = mParts(value, head, tail);
    return `${h}···${t}`;
}

/**
 * Formats a JWT token value for logging/etc., including validation hints.
 *
 * @param value the JWT token value to format
 * @param head number of characters to show at the start of the token (default: 6)
 * @param tail number of characters to show at the end of the token (default: 6)
 *
 * ```
 *   Value: "eyJhbG···p-QV30" ✓ valid jwt
 *   Value: "eyJhbG···p-QV30" ✓ malformed jwt
 *   Value: "eyJhbG···p-QV30" × invalid jwt format
 *   Value: "null" × is falsy
 *   Value: "" × is empty
 * ```
 */
export function maskJWTTokenValueExt(value: Nullable<JSONWebToken>, head?: number, tail?: number) {
    let hint: string;

    if (value === '') hint = `× is empty`;
    else if (!value) hint = `× is falsy`;
    else if (!isJSONWebTokenLike(value)) hint = `× invalid jwt format`;
    else if (!isJSONWebToken(value)) hint = `× malformed jwt`;
    else hint = `✓ valid jwt`;

    const masked = `"${maskJWTTokenValue(String(value), head, tail)}"`;

    return `Value: ${masked}${hint}`;
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
//   eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.
//   KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
function mParts(value: JSONWebToken, first?: number, last?: number): [head: string, tail: string] {
    first = clampNum(first, [1, 10], 6);
    last = clampNum(last, [1, 10], 6);

    return [value.substring(0, first), value.substring(value.length - last)];
}
