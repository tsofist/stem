import type { Nullable } from '../index';

/**
 * Resolves an absolute URL against a base one.
 *
 * @returns
 *   - the path below the base, with a leading separator and the query and hash of the target;
 *   - the absolute URL, when there is no base or the target is outside it;
 *
 * A target is within the base when the protocol, the host and the whole base path match it by
 * segments. Separators are collapsed where the base was cut, the ones deeper in the path are kept.
 *
 * @throws TypeError when the target or the base is not a valid URL
 *
 * @example
 *   relativeURL('https://example.com/api/users/42?a=1', 'https://example.com/api')
 *   // '/users/42?a=1'
 *   relativeURL('https://example.com/api', 'https://example.com/api/')
 *   // '/'
 *   relativeURL('https://other.example.com/api', 'https://example.com/api')
 *   // 'https://other.example.com/api'
 *   relativeURL('https://example.com/api/users')
 *   // 'https://example.com/api/users'
 */
export function relativeURL(absolute: string | URL, base?: Nullable<string | URL>): string {
    const uAbsolute = absolute instanceof URL ? absolute : new URL(absolute);
    if (base == null) return uAbsolute.href;

    const uBase = base instanceof URL ? base : new URL(base);
    if (uAbsolute.protocol !== uBase.protocol || uAbsolute.host !== uBase.host) {
        return uAbsolute.href;
    }

    const { pathname } = uAbsolute;

    let end = uBase.pathname.length;
    while (end > 0 && uBase.pathname.charCodeAt(end - 1) === CC_SLASH) end--;
    if (!pathname.startsWith(uBase.pathname.slice(0, end))) return uAbsolute.href;

    let start = end;
    if (start < pathname.length && pathname.charCodeAt(start) !== CC_SLASH) return uAbsolute.href;
    while (pathname.charCodeAt(start + 1) === CC_SLASH) start++;

    const path = start < pathname.length ? pathname.slice(start) : '/';

    return `${path}${uAbsolute.search}${uAbsolute.hash}`;
}

const CC_SLASH = 0x2f;
