import {
    applyUTCOffset,
    minutesToUTCOffset,
    parseUTCOffset,
    utcOffsetToMinutes,
} from './utc-offset';

describe('minutesToUTCOffset', () => {
    it('converts positive minutes to UTC offset string', () => {
        expect(minutesToUTCOffset(150)).toBe('+02:30');
        expect(minutesToUTCOffset(155)).toBe('+02:35');
    });

    it('converts negative minutes to UTC offset string', () => {
        expect(minutesToUTCOffset(-150)).toBe('-02:30');
        expect(minutesToUTCOffset(-155)).toBe('-02:35');
    });

    it('converts zero minutes to UTC offset string', () => {
        expect(minutesToUTCOffset(0)).toBe('+00:00');
    });
});

describe('utcOffsetToMinutes', () => {
    it('converts positive UTC offset string to minutes', () => {
        expect(utcOffsetToMinutes('+02:30')).toBe(150);
        expect(utcOffsetToMinutes('+02:35')).toBe(155);
    });

    it('converts negative UTC offset string to minutes', () => {
        expect(utcOffsetToMinutes('-02:30')).toBe(-150);
        expect(utcOffsetToMinutes('-02:35')).toBe(-155);
    });

    it('converts zero UTC offset string to minutes', () => {
        expect(utcOffsetToMinutes('+00:00')).toBe(0);
    });
});

describe('parseUTCOffset', () => {
    it('parses valid UTC offset string', () => {
        expect(parseUTCOffset('2024-07-23T23:00:00+02:00')).toBe('+02:00');
        expect(parseUTCOffset('2024-07-23T23:00:00.500+02:00')).toBe('+02:00');
        expect(parseUTCOffset('2024-07-23T23:00:00.100Z')).toBe('+00:00');
        expect(parseUTCOffset('2024-07-23T23:00:00Z')).toBe('+00:00');

        expect(parseUTCOffset('23:00:00+02:00')).toBe('+02:00');
        expect(parseUTCOffset('23:00:00Z')).toBe('+00:00');

        expect(parseUTCOffset('2024-07-23T23:00:00')).toBeUndefined();
        expect(parseUTCOffset('2024-07-23T23:00:00.100')).toBeUndefined();
    });

    it('returns undefined for invalid UTC offset string', () => {
        expect(parseUTCOffset('invalid string')).toBeUndefined();
    });

    it('returns undefined for nullable input', () => {
        expect(parseUTCOffset(undefined)).toBeUndefined();
        expect(parseUTCOffset(null)).toBeUndefined();
    });
});

describe('applyUTCOffset', () => {
    it('applies UTC offset to date-time string', () => {
        expect(applyUTCOffset('2024-07-23T23:00:00', '+02:00')).toBe('2024-07-23T23:00:00+02:00');
        expect(applyUTCOffset('2024-07-23T23:00:00.100', '+02:00')).toBe(
            '2024-07-23T23:00:00.100+02:00',
        );
        expect(applyUTCOffset('2024-07-23T23:00:00', '')).toBe('2024-07-23T23:00:00');
        expect(applyUTCOffset('2024-07-23T23:00:00.500', '')).toBe('2024-07-23T23:00:00.500');
        expect(applyUTCOffset('2024-07-23T23:00:00', 'Z')).toBe('2024-07-23T23:00:00Z');
        expect(applyUTCOffset('2020-01-01T00:00:00.999', 'Z')).toBe('2020-01-01T00:00:00.999Z');
    });

    it('replaces existing UTC offset in date-time string', () => {
        expect(applyUTCOffset('2024-07-23T23:00:00Z', '+02:00')).toBe('2024-07-23T23:00:00+02:00');
        expect(applyUTCOffset('2024-07-23T23:00:00Z', '')).toBe('2024-07-23T23:00:00');
        expect(applyUTCOffset('2024-07-23T23:00:00Z', 'Z')).toBe('2024-07-23T23:00:00Z');
    });

    it('applies UTC offset to time string', () => {
        expect(applyUTCOffset('23:00:00', '+02:00')).toBe('23:00:00+02:00');
        expect(applyUTCOffset('23:00:00+01:00', '')).toBe('23:00:00');
        expect(applyUTCOffset('23:00:00+01:00', 'Z')).toBe('23:00:00Z');
    });
});
