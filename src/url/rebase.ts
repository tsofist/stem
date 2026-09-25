import { pathnameFrom } from './pathname';

/**
 * Rebases a source pathname under a base URL while preserving directory semantics.
 *
 * Only the pathname of the source is used — its scheme, host, query and hash are discarded.
 * The query and hash of the base are discarded as well: the result carries the origin of the base
 * and the joined pathname only.
 *
 * Both pathnames come from the URL parser, so dot-segments are already resolved and `..` never
 * climbs above the base path. Separators are collapsed at the seam between the two only.
 *
 * @throws TypeError when the base is not a valid URL or cannot be a base (`mailto:`, `urn:`, …)
 *
 * @example
 *   rebaseURL('auth/token', 'http://localhost:8080/api/v1/')
 *   // 'http://localhost:8080/api/v1/auth/token'
 *   rebaseURL('/individual/userinfo', 'https://id.bank.com')
 *   // 'https://id.bank.com/individual/userinfo'
 *   rebaseURL('https://b.bank.com/individual/userinfo', 'http://localhost:8080/api/v1')
 *   // 'http://localhost:8080/api/v1/individual/userinfo'
 *   rebaseURL('auth/', 'https://api.example.com/base')
 *   // 'https://api.example.com/base/auth/'
 *   rebaseURL('../../etc/passwd', 'https://api.example.com/api/v1')
 *   // 'https://api.example.com/api/v1/etc/passwd'
 */
export function rebaseURL(source: string | URL, base: string | URL): URL {
    const uBase = base instanceof URL ? base : new URL(base);

    const pathname = pathnameFrom([uBase.pathname, readSourcePathname(source)]);
    if (pathname) return new URL(`/${pathname}`, uBase);

    // Nothing but separators was joined, so the base pathname is the root one, if it has any
    return new URL(uBase.pathname ? '/' : '', uBase);
}

/** Sentinel base for relative sources: only the resulting pathname is used */
const SOURCE_BASE = 's://s';

/**
 * Sources the URL parser would change in any way: ones opening with an authority, carrying a
 * character it would encode, strip or read as a delimiter, or holding a dot-segment to resolve.
 * Everything else already is its own pathname, up to the leading separator the seam absorbs.
 */
const RE_NEEDS_PARSING = /^\/\/|[^\w\-./~]|(^|\/)\.\.?(\/|$)/;

function readSourcePathname(source: string | URL): string {
    if (source instanceof URL) return source.pathname;

    return RE_NEEDS_PARSING.test(source) ? new URL(source, SOURCE_BASE).pathname : source;
}
