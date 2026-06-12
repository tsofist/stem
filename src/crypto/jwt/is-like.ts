import { JSONWebToken, RE_JWT } from './types';

/**
 * Checks whether the given value has a JSON Web Token-like format string
 */
export function isJSONWebTokenLike(value: unknown): value is JSONWebToken {
    return typeof value === 'string' && value.length > 0 && RE_JWT.test(value);
}
