import { chunkString } from './chunk';

describe('string/substr', () => {
    it('Edge cases', () => {
        expect(chunkString('123', 9, true)).toStrictEqual(['123']);
        expect(chunkString('123', 0, true)).toStrictEqual([]);
        expect(chunkString('123', 9)).toStrictEqual(['123']);
        expect(chunkString('123', 0)).toStrictEqual([]);
        expect(chunkString('', 5)).toStrictEqual([]);
        expect(chunkString('', 0)).toStrictEqual([]);
    });
    it('Left to right', () => {
        expect(chunkString('12345', 3)).toStrictEqual(['123', '45']);
        expect(chunkString('123456', 3)).toStrictEqual(['123', '456']);
    });
    it('Right to left', () => {
        expect(chunkString('12345', 3, true)).toStrictEqual(['12', '345']);
        expect(chunkString('1234567890', 3, true)).toStrictEqual(['1', '234', '567', '890']);
        expect(chunkString('123456', 3, true)).toStrictEqual(['123', '456']);
    });
    it('Unicode', () => {
        expect(chunkString('Hello, 🌍!', 3)).toStrictEqual(['Hel', 'lo,', ' 🌍!']);
        expect(chunkString('🌟🌟🌟🌟', 2)).toStrictEqual(['🌟🌟', '🌟🌟']);
        expect(chunkString('👨‍👩‍👧‍👦', 2)).toStrictEqual(['👨‍', '👩‍', '👧‍', '👦']); // '👨‍👩‍👧‍👦' === '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}'
        // expect(chunkString('🍏🍎🍐🍊🍋', 3)).toStrictEqual(['🍏🍎', '🍐🍊', '🍋']);
        // expect(chunkString('🍏🍎🍐🍊🍋', 3, true)).toStrictEqual(['🍏🍎', '🍐🍊', '🍋']);
    });
    it('Correct chunking of multibyte characters', () => {
        expect(chunkString('𠜎𠜏𠜐', 2)).toStrictEqual(['𠜎𠜏', '𠜐']);
    });
});
