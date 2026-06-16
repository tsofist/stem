import { bufferFromBase64URLString } from '../base64/url';
import { segmentizeJSONWebToken } from './decoder';
import type { JSONWebToken } from './types';

export function hasJWTPayloadClaim(token: JSONWebToken, claim: string): token is JSONWebToken {
    if (!token?.length) return false;

    const segments = segmentizeJSONWebToken(token);
    if (!segments) return false;

    const payload = bufferFromBase64URLString(segments[1]).toString('binary');
    const pos = payload.indexOf(`"${claim}":`);
    if (pos < 0) return false;

    const pre = payload.charAt(pos - 1);
    return pre === '{' || pre === ',';
}
