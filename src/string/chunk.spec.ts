import { chunkString } from './chunk';

describe('string/substr', () => {
    it('Edge cases', () => {
        expect(chunkString('123', 9, true)).toStrictEqual(['123']);
        expect(chunkString('123', 0, true)).toStrictEqual(['']);
        expect(chunkString('123', 9)).toStrictEqual(['123']);
        expect(chunkString('123', 0)).toStrictEqual(['']);
    });
    it('Left to right', () => {
        expect(chunkString('12345', 3)).toStrictEqual(['123', '45']);
        expect(chunkString('123456', 3)).toStrictEqual(['123', '456']);
    });
    it('Right to left', () => {
        expect(chunkString('12345', 3, true)).toStrictEqual(['12', '345']);
        expect(chunkString('123456', 3, true)).toStrictEqual(['123', '456']);
    });
});
