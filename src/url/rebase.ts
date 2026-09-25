import { pathnameFrom } from './pathname';

/**
 * Rebases a source pathname under a base URL while preserving directory semantics.
 *
 * Only the pathname of the source is used — its scheme, host, query and hash are discarded.
 * The query and hash of the base are discarded as well: the result carries the origin of the base
 * and the joined pathname only.
 *
 * Dot-segments of the source are resolved before joining, so `..` never climbs above the base path.
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

    return new URL(pathname ? `/${pathname}` : uBase.pathname, uBase);
}

/** Sentinel base for relative sources: only the resulting pathname is used */
const SOURCE_BASE = 's://s';

/**
 * Sources which cannot be treated as a plain pathname and require full URL parsing:
 * ones carrying a scheme, protocol-relative ones and ones with dot-segments
 */
const RE_OPAQUE_SOURCE = /^[A-Za-z][A-Za-z0-9+.-]*:|^\/\/|(^|\/)\.\.?(\/|$)/;

function readSourcePathname(source: string | URL): string {
    if (source instanceof URL) return source.pathname;

    const cut = source.search(/[?#]/);
    const pathname = cut === -1 ? source : source.slice(0, cut);

    return RE_OPAQUE_SOURCE.test(pathname) ? new URL(source, SOURCE_BASE).pathname : pathname;
}
