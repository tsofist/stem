import { extractJWTPayloadClaim } from './claim-extract';

describe('extractJWTPayloadClaim', () => {
    const T1 =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gXCJHYW5nc3RlclwiIERvZSIsImlhdCI6MTUxNjIzOTAyMiwiZ2FuZ3N0ZXIiOnRydWV9.C0JSWV7sjnP6lYldPux_ADI4dkrzTyxr7xEzCH1ORFk';

    it('should extract claim from JWT payload', () => {
        let claim: unknown = extractJWTPayloadClaim(T1, 'name');
        expect(claim).toBe('John "Gangster" Doe');
        claim = extractJWTPayloadClaim(T1, 'name', String);
        expect(claim).toBe('John "Gangster" Doe');
    });

    it('should extract numeric claim from JWT payload', () => {
        let claim: unknown = extractJWTPayloadClaim(T1, 'iat', Number);
        expect(claim).toBe(1516239022);
        claim = extractJWTPayloadClaim(T1, 'iat');
        expect(claim).toBe(1516239022);
    });

    it('should extract bool claim from JWT payload', () => {
        let claim: unknown = extractJWTPayloadClaim(T1, 'gangster');
        expect(claim).toBe(true);
        claim = extractJWTPayloadClaim(T1, 'gangster', String);
        expect(claim).toBe('true');
        claim = extractJWTPayloadClaim(T1, 'gangster', Boolean);
        expect(claim).toBe(true);
    });

    it('should return undefined for non-existent claim', () => {
        const claim = extractJWTPayloadClaim(T1, 'email');
        expect(claim).toBeUndefined();
    });

    it('should return undefined for invalid token', () => {
        const token = 'invalid.token';
        const claim = extractJWTPayloadClaim(token, 'name');
        expect(claim).toBeUndefined();
    });

    it('should return undefined for empty token', () => {
        const claim = extractJWTPayloadClaim('', 'name');
        expect(claim).toBeUndefined();
    });
});
