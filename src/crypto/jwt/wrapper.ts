import type { ReadonlyMay, URec } from '../../index';
import { parseJSONWebTokenSegment, splitJSONWebTokenToSegments } from './decoder';
import { isJSONWebToken } from './is';
import type { JSONWebToken } from './types';

export function wrapJSONWebToken<Payload extends URec, Header extends URec>(
    value: string,
    claims?: ReadonlyMay<string[]>,
    headerParams?: ReadonlyMay<string[]>,
) {
    return new JSONWebTokenWrapperImpl<Payload, Header>(value, claims, headerParams);
}

class JSONWebTokenWrapperImpl<Payload extends URec, Header extends URec> {
    readonly requiredClaims: readonly string[];
    readonly headerParams: readonly string[];

    constructor(
        readonly value: JSONWebToken,
        requiredClaims?: ReadonlyMay<string[]>,
        headerParams?: ReadonlyMay<string[]>,
    ) {
        this.requiredClaims = requiredClaims ?? [];
        this.headerParams = headerParams ?? [];
    }

    get header(): Header | undefined {
        if (!this.valid) return undefined;
        if (!this.#header) {
            this.#header = parseJSONWebTokenSegment<Header>(this.segments!.header);
        }
        return this.#header;
    }

    get payload(): Payload | undefined {
        if (!this.valid) return undefined;
        if (!this.#payload) {
            this.#payload = parseJSONWebTokenSegment<Payload>(this.segments!.payload);
        }
        return this.#payload;
    }

    get valid() {
        if (this.#valid == null || this.#segments == null) {
            if (!this.value || typeof this.value !== 'string' || this.value.length === 0) {
                this.#valid = false;
            } else {
                const segments = this.segments;
                this.#valid = segments
                    ? isJSONWebToken(segments, this.requiredClaims, this.headerParams)
                    : false;
            }
        }
        return this.#valid;
    }

    get segments() {
        if (!this.valid) return undefined;
        if (!this.#segments) {
            const segments = splitJSONWebTokenToSegments(this.value);
            if (segments) {
                this.#segments = {
                    header: segments[0],
                    payload: segments[1],
                    signature: segments[2],
                };
            }
        }
        return this.#segments;
    }

    #valid: undefined | boolean = undefined;
    #segments:
        | undefined
        | {
              readonly header: string;
              readonly payload: string;
              readonly signature: string;
          } = undefined;

    #header: undefined | Header = undefined;
    #payload: undefined | Payload = undefined;
}
