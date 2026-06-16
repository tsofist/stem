import {
    decodeJSONWebTokenHeader,
    decodeJSONWebTokenPayload,
    getJSONWebTokenSegment,
} from './decoder';

describe('decoder', () => {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    it('should decode header', () => {
        const header = decodeJSONWebTokenHeader(token);
        expect(header).toEqual({ alg: 'HS256', typ: 'JWT' });
    });

    it('should decode payload', () => {
        const payload = decodeJSONWebTokenPayload(token);
        expect(payload).toEqual({
            sub: '1234567890',
            name: 'John Doe',
            iat: 1516239022,
        });
    });

    it('should get segments', () => {
        expect(getJSONWebTokenSegment(token, 'header')).toBe(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        );
        expect(getJSONWebTokenSegment(token, 'payload')).toBe(
            'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
        );
        expect(getJSONWebTokenSegment(token, 'signature')).toBe(
            'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        );
    });
});
