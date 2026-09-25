import { pathnameFrom } from './pathname';

describe('pathnameFrom', () => {
    it('joins parts without duplicating separators', () => {
        expect(pathnameFrom(['/a/', 'a/', 'a', '/b/b'])).toBe('a/a/a/b/b');
    });

    it('drops empty parts', () => {
        expect(pathnameFrom(['/g/', '', '/h//', 'i'])).toBe('g/h/i');
    });

    it('drops nullish parts', () => {
        expect(pathnameFrom([undefined, undefined])).toBe('');
        expect(pathnameFrom([null, undefined])).toBe('');
        expect(pathnameFrom([null, 'sub', null])).toBe('sub');
        expect(pathnameFrom(['', 'sub', undefined])).toBe('sub');
        expect(pathnameFrom([undefined, '', 'sub', undefined])).toBe('sub');
        expect(pathnameFrom(['/root/', null, 'leaf'])).toBe('root/leaf');
    });

    it('handles no parts at all', () => {
        expect(pathnameFrom([])).toBe('');
    });

    it('handles a single part', () => {
        expect(pathnameFrom(['/single/path/'])).toBe('single/path/');
        expect(pathnameFrom(['/'])).toBe('');
        expect(pathnameFrom(['///multiple'])).toBe('multiple');
    });

    it('handles parts with multiple leading separators', () => {
        expect(pathnameFrom(['///multiple', 'slashes///here'])).toBe('multiple/slashes/here');
    });

    it('handles parts with no separators', () => {
        expect(pathnameFrom(['no', 'slashes', 'at', 'all'])).toBe('no/slashes/at/all');
    });

    it('handles complex nested parts', () => {
        expect(pathnameFrom(['/complex/', 'nested/path/', 'with//multiple/', '/slashes/'])).toBe(
            'complex/nested/path/with/multiple/slashes/',
        );
    });

    it('keeps the trailing separator of the last non-empty part', () => {
        expect(pathnameFrom(['/api/', '/v1//users/', 'profiles/'])).toBe('api/v1/users/profiles/');
        expect(pathnameFrom(['/root/', 'nested', 'leaf/'])).toBe('root/nested/leaf/');
        expect(pathnameFrom(['a', '/'])).toBe('a/');
        expect(pathnameFrom(['a/', 'b', '/'])).toBe('a/b/');
    });

    it('drops the trailing separator when the last non-empty part is not a directory one', () => {
        expect(pathnameFrom(['a/', 'b'])).toBe('a/b');
        expect(pathnameFrom(['/', 'b'])).toBe('b');
    });

    it('keeps the trailing separator when the following parts are empty', () => {
        expect(pathnameFrom(['a/', undefined])).toBe('a/');
        expect(pathnameFrom(['a/', ''])).toBe('a/');
        expect(pathnameFrom(['a/', '', null])).toBe('a/');
    });

    it('never keeps a leading separator', () => {
        expect(pathnameFrom(['/a/b'])).toBe('a/b');
        expect(pathnameFrom(['/', '/a'])).toBe('a');
    });

    it('treats spaces as a part of a segment', () => {
        expect(pathnameFrom(['a/ b c /d'])).toBe('a/ b c /d');
        expect(pathnameFrom([' /c//', 'd/', '/e//f '])).toBe(' /c/d/e/f ');
        expect(pathnameFrom(['   ', '    '])).toBe('   /    ');
        expect(pathnameFrom(['a/', ' '])).toBe('a/ ');
    });

    it('does not resolve dot-segments', () => {
        expect(pathnameFrom(['a', '../b'])).toBe('a/../b');
        expect(pathnameFrom(['/a/', './b'])).toBe('a/./b');
    });

    it('accepts a readonly array of parts', () => {
        const parts: readonly string[] = ['/api/', 'v1'];
        expect(pathnameFrom(parts)).toBe('api/v1');
        expect(pathnameFrom(['/api/', 'v1'] as const)).toBe('api/v1');
    });
});
