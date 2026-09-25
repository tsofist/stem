import { rebaseURL } from './rebase';

describe('rebaseURL', () => {
    it('uses the base origin for a source path that starts with a slash', () => {
        expect(rebaseURL('/individual/userinfo', 'https://id.bank.com').href).toBe(
            'https://id.bank.com/individual/userinfo',
        );
    });

    it('joins a relative source path under the base pathname', () => {
        expect(rebaseURL('auth/token', 'http://localhost:8080/api/v1/').href).toBe(
            'http://localhost:8080/api/v1/auth/token',
        );
    });

    it('replaces the source origin while preserving the base pathname for an absolute URL source', () => {
        expect(
            rebaseURL('https://b.bank.com/individual/userinfo', 'http://localhost:8080/api/v1')
                .href,
        ).toBe('http://localhost:8080/api/v1/individual/userinfo');
    });

    it('accepts URL objects for both the source and the base', () => {
        expect(
            rebaseURL(
                new URL('/individual/userinfo', 'https://example.com'),
                new URL('https://api.example.com/v1'),
            ).href,
        ).toBe('https://api.example.com/v1/individual/userinfo');
    });

    it('normalizes duplicate slashes in the combined pathname while preserving a trailing slash', () => {
        expect(rebaseURL('/nested//path/', 'https://api.example.com/base/').href).toBe(
            'https://api.example.com/base/nested/path/',
        );
    });

    it('ignores query strings and hashes from the source URL when rebasing the pathname', () => {
        expect(
            rebaseURL(
                'https://source.example.com/individual/userinfo?tab=settings#top',
                'https://api.example.com/base',
            ).href,
        ).toBe('https://api.example.com/base/individual/userinfo');
    });

    it('preserves a trailing slash when the source path ends with a slash', () => {
        expect(rebaseURL('auth/', 'http://localhost:8080/api/v1').href).toBe(
            'http://localhost:8080/api/v1/auth/',
        );

        expect(rebaseURL('/individual/', 'https://id.bank.com').href).toBe(
            'https://id.bank.com/individual/',
        );
    });

    it('preserves a trailing slash for the root path', () => {
        expect(rebaseURL('/', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/',
        );
    });

    it('keeps the base pathname when the source is empty', () => {
        expect(rebaseURL('', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base',
        );

        expect(rebaseURL('', 'https://api.example.com/base/').href).toBe(
            'https://api.example.com/base/',
        );
    });

    it('normalizes the base pathname', () => {
        expect(rebaseURL('', 'https://api.example.com//a//b').href).toBe(
            'https://api.example.com/a/b',
        );

        expect(rebaseURL('c', 'https://api.example.com//a//b//').href).toBe(
            'https://api.example.com/a/b/c',
        );
    });

    it('treats whitespace as ordinary segment content', () => {
        expect(rebaseURL(' a/b', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/%20a/b',
        );

        // Trailing whitespace of the resulting URL is stripped by the URL parser itself
        expect(rebaseURL('a/b ', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/a/b',
        );

        expect(rebaseURL('   ', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/',
        );
    });
    it('resolves dot-segments of the source, so they never climb above the base path', () => {
        expect(rebaseURL('../../etc/passwd', 'https://api.example.com/api/v1').href).toBe(
            'https://api.example.com/api/v1/etc/passwd',
        );

        expect(rebaseURL('./a/./b', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/a/b',
        );
    });

    it('supports a base with an opaque origin', () => {
        expect(rebaseURL('c', 'file:///a/b/').href).toBe('file:///a/b/c');
        expect(rebaseURL('/d/', new URL('s://host/a/b')).href).toBe('s://host/a/b/d/');
    });

    it('discards the query and the hash of the base', () => {
        expect(rebaseURL('auth', 'https://api.example.com/base?v=2#top').href).toBe(
            'https://api.example.com/base/auth',
        );
    });

    it('ignores the query and the hash of a URL source', () => {
        expect(
            rebaseURL(
                new URL('https://source.example.com/individual/userinfo?tab=settings#top'),
                'https://api.example.com/base',
            ).href,
        ).toBe('https://api.example.com/base/individual/userinfo');
    });

    it('takes only the pathname of a protocol-relative source', () => {
        expect(rebaseURL('//other.example.com/x/y', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/x/y',
        );
    });

    it('takes only the pathname of a source with a non-special scheme', () => {
        expect(rebaseURL('s://host/x/y', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/x/y',
        );
    });

    it('percent-encodes the source pathname and keeps already encoded sequences as-is', () => {
        expect(rebaseURL('папка/файл', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/%D0%BF%D0%B0%D0%BF%D0%BA%D0%B0/%D1%84%D0%B0%D0%B9%D0%BB',
        );

        expect(rebaseURL('a b', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/a%20b',
        );

        expect(rebaseURL('a%2Fb', 'https://api.example.com/base').href).toBe(
            'https://api.example.com/base/a%2Fb',
        );
    });

    it('returns a new URL and never mutates the base', () => {
        const base = new URL('https://api.example.com/base?v=2#top');
        const result = rebaseURL('auth', base);

        expect(result).not.toBe(base);
        expect(base.href).toBe('https://api.example.com/base?v=2#top');
    });

    it('throws for a base which cannot be a base', () => {
        expect(() => rebaseURL('auth', 'mailto:someone@example.com')).toThrow('Invalid URL');
        expect(() => rebaseURL('auth', 'not-a-url')).toThrow('Invalid URL');
    });
});
