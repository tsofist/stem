import { pathnameSegmentsOf } from './segments';

describe('pathnameSegmentsOf', () => {
    it('reads segments of a plain pathname', () => {
        expect(pathnameSegmentsOf('/api/v1/users')).toStrictEqual(['api', 'v1', 'users']);
    });

    it('drops empty segments', () => {
        expect(pathnameSegmentsOf('//api///v1/users//')).toStrictEqual(['api', 'v1', 'users']);
    });

    it('keeps spaces as a part of a segment', () => {
        expect(pathnameSegmentsOf('/a b c/d')).toStrictEqual(['a b c', 'd']);
        expect(pathnameSegmentsOf(' /api// v1 /users/ ')).toStrictEqual([
            ' ',
            'api',
            ' v1 ',
            'users',
            ' ',
        ]);
        expect(pathnameSegmentsOf('   ')).toStrictEqual(['   ']);
    });

    it('passes dot-segments through literally', () => {
        expect(pathnameSegmentsOf('/a/../b/./c')).toStrictEqual(['a', '..', 'b', '.', 'c']);
    });

    it('returns an empty list for pathnames without segments', () => {
        expect(pathnameSegmentsOf('')).toStrictEqual([]);
        expect(pathnameSegmentsOf('/')).toStrictEqual([]);
        expect(pathnameSegmentsOf('///')).toStrictEqual([]);
    });

    it('appends to the target array instead of allocating a new one', () => {
        const target: string[] = ['api'];

        expect(pathnameSegmentsOf('/v1/', target)).toBe(target);
        pathnameSegmentsOf('users//profiles', target);

        expect(target).toStrictEqual(['api', 'v1', 'users', 'profiles']);
    });
});
