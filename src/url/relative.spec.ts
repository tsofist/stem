import { relativeURL } from './relative';

describe('relativeURL', () => {
    it('returns the absolute URL when no base is provided', () => {
        expect(relativeURL('https://example.com/api/users')).toBe('https://example.com/api/users');
        expect(relativeURL('https://example.com/api/users/')).toBe(
            'https://example.com/api/users/',
        );
        expect(relativeURL('https://example.com/api/users', null)).toBe(
            'https://example.com/api/users',
        );
    });

    it('converts a URL object to its string form when no base is provided', () => {
        const absolute = new URL('https://example.com/api/users?active=true');

        expect(relativeURL(absolute)).toBe(absolute.href);
    });

    it('returns the path below the base with a leading slash', () => {
        expect(relativeURL('https://example.com/api/users/42', 'https://example.com/api')).toBe(
            '/users/42',
        );
    });

    it('accepts a URL object as the base', () => {
        expect(
            relativeURL('https://example.com/api/users', new URL('https://example.com/api')),
        ).toBe('/users');
    });

    it('returns the root path for the base URL itself', () => {
        expect(relativeURL('https://example.com/api', 'https://example.com/api/')).toBe('/');
        expect(relativeURL('https://example.com/api/', 'https://example.com/api/')).toBe('/');
    });

    it('requires a complete path segment match', () => {
        expect(relativeURL('https://example.com/api-v2/users', 'https://example.com/api')).toBe(
            'https://example.com/api-v2/users',
        );
        expect(relativeURL('https://example.com/api-v2/users/', 'https://example.com/api')).toBe(
            'https://example.com/api-v2/users/',
        );
    });

    it('returns the absolute URL for a target above the base', () => {
        expect(relativeURL('https://example.com/', 'https://example.com/api')).toBe(
            'https://example.com/',
        );
    });

    it('returns URLs from another origin unchanged', () => {
        expect(relativeURL('https://other.example.com/api/users', 'https://example.com/api')).toBe(
            'https://other.example.com/api/users',
        );
    });

    it('compares the protocol and the host rather than the origin', () => {
        // Every opaque origin is the very same `null`, so it can never tell these two apart
        expect(relativeURL('file:///a/b/c', 's://host/a')).toBe('file:///a/b/c');
        expect(relativeURL('file:///a/b/c', 'file:///a/b')).toBe('/c');
        expect(relativeURL('s://host/a/b', 's://host/a')).toBe('/b');

        expect(relativeURL('http://example.com/api/users', 'https://example.com/api')).toBe(
            'http://example.com/api/users',
        );
        expect(relativeURL('https://example.com:8443/api/users', 'https://example.com/api')).toBe(
            'https://example.com:8443/api/users',
        );
    });

    it('normalizes the absolute URL it returns', () => {
        expect(relativeURL('https://other.example.com', 'https://example.com/api')).toBe(
            'https://other.example.com/',
        );
        expect(relativeURL(new URL('https://other.example.com'), 'https://example.com/api')).toBe(
            'https://other.example.com/',
        );
        expect(relativeURL('https://other.example.com')).toBe('https://other.example.com/');
    });

    it('includes the target query and hash in the relative path', () => {
        expect(
            relativeURL(
                'https://example.com/api/users?active=true#details',
                'https://example.com/api',
            ),
        ).toBe('/users?active=true#details');
        expect(
            relativeURL(
                'https://example.com/api/users/?active=true#details',
                'https://example.com/api',
            ),
        ).toBe('/users/?active=true#details');
        expect(relativeURL('https://example.com/api?active=true', 'https://example.com/api')).toBe(
            '/?active=true',
        );
    });

    it('discards the query and the hash of the base', () => {
        expect(
            relativeURL('https://example.com/api/users', 'https://example.com/api?v=2#top'),
        ).toBe('/users');
    });

    it('keeps the duplicate separators deeper in the path', () => {
        expect(relativeURL('https://example.com/api/deep//x', 'https://example.com/api')).toBe(
            '/deep//x',
        );
        expect(relativeURL('https://example.com/api/x//', 'https://example.com/api')).toBe('/x//');
    });

    it('collapses the separator run left where the base was cut', () => {
        expect(relativeURL('https://example.com/api/x', 'https://example.com/api//')).toBe('/x');
        expect(relativeURL('https://example.com/api//x', 'https://example.com/api')).toBe('/x');
        expect(relativeURL('https://example.com/api///x', 'https://example.com/api//')).toBe('/x');
    });

    it('returns the absolute URL for a target with duplicate leading separators', () => {
        expect(relativeURL('https://example.com//api//users', 'https://example.com/api')).toBe(
            'https://example.com//api//users',
        );
    });

    it('never returns a protocol-relative path', () => {
        // `//evil.example.com/x` would resolve to another origin when used as a link
        const relative = relativeURL(
            'https://example.com/api//evil.example.com/x',
            'https://example.com/api',
        );

        expect(relative).toBe('/evil.example.com/x');
        expect(new URL(relative, 'https://example.com/api/').href).toBe(
            'https://example.com/evil.example.com/x',
        );
    });

    it('matches the pathname the URL parser has already resolved dot-segments in', () => {
        expect(relativeURL('https://example.com/api/a/../b', 'https://example.com/api')).toBe('/b');
        expect(
            relativeURL('https://example.com/api/../etc/passwd', 'https://example.com/api'),
        ).toBe('https://example.com/etc/passwd');
        expect(relativeURL('https://example.com/api/%2e%2e/etc', 'https://example.com/api')).toBe(
            'https://example.com/etc',
        );
    });

    it('returns a string and never mutates its arguments', () => {
        const absolute = new URL('https://example.com/api/users?active=true#details');
        const base = new URL('https://example.com/api?v=2#top');

        expect(relativeURL(absolute, base)).toBe('/users?active=true#details');
        expect(absolute.href).toBe('https://example.com/api/users?active=true#details');
        expect(base.href).toBe('https://example.com/api?v=2#top');
    });

    it('throws for a target or a base which is not a valid URL', () => {
        expect(() => relativeURL('not-a-url')).toThrow('Invalid URL');
        expect(() => relativeURL('/users', 'https://example.com/api')).toThrow('Invalid URL');
        expect(() => relativeURL('https://example.com/api/users', 'not-a-url')).toThrow(
            'Invalid URL',
        );
    });
});
