import { startsWithDigit, startsWithNonDigit } from './leading-digit';

describe('startsWithDigit', () => {
    it('should return true for strings starting with a digit', () => {
        expect(startsWithDigit('0abc')).toBe(true);
        expect(startsWithDigit('1abc')).toBe(true);
        expect(startsWithDigit('9xyz')).toBe(true);
    });

    it('should return false for strings not starting with a digit', () => {
        expect(startsWithDigit('-abc1')).toBe(false);
        expect(startsWithDigit('abc1')).toBe(false);
        expect(startsWithDigit('xyz9')).toBe(false);
    });

    it('should return false for null or empty strings or emojis', () => {
        expect(startsWithDigit(null)).toBe(false);
        expect(startsWithDigit('')).toBe(false);
        expect(startsWithDigit('👍')).toBe(false);
    });
});

describe('startsWithNonDigit', () => {
    it('should return true for strings not starting with a digit', () => {
        expect(startsWithNonDigit('-abc1')).toBe(true);
        expect(startsWithNonDigit('abc1')).toBe(true);
        expect(startsWithNonDigit('xyz9')).toBe(true);
    });

    it('should return false for strings starting with a digit', () => {
        expect(startsWithNonDigit('0abc')).toBe(false);
        expect(startsWithNonDigit('1abc')).toBe(false);
        expect(startsWithNonDigit('9xyz')).toBe(false);
    });

    it('should return true for null or empty strings or emojis', () => {
        expect(startsWithNonDigit(null)).toBe(true);
        expect(startsWithNonDigit('')).toBe(true);
        expect(startsWithNonDigit('👍')).toBe(true);
    });
});
