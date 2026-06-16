import { hasJWTPayloadClaim } from './claim-has';

describe('hasJWTPayloadClaim', () => {
    const T1 =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gXCJHYW5nc3RlclwiIERvZSIsImlhdCI6MTUxNjIzOTAyMiwiZ2FuZ3N0ZXIiOnRydWV9.C0JSWV7sjnP6lYldPux_ADI4dkrzTyxr7xEzCH1ORFk';

    it('should return true for existing claim in JWT payload', () => {
        expect(hasJWTPayloadClaim(T1, 'name')).toBe(true);
        expect(hasJWTPayloadClaim(T1, 'iat')).toBe(true);
        expect(hasJWTPayloadClaim(T1, 'gangster')).toBe(true);
    });

    it('should return false for non-existent claim in JWT payload', () => {
        expect(hasJWTPayloadClaim(T1, 'email')).toBe(false);
    });

    it('should return false for invalid token', () => {
        const token = 'invalid.token';
        expect(hasJWTPayloadClaim(token, 'name')).toBe(false);
    });

    it('should return false for empty token', () => {
        expect(hasJWTPayloadClaim('', 'name')).toBe(false);
    });
});
