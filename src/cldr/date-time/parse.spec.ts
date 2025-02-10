import {
    parseTypedDateTimeString,
    parseTypedDateTimeStringRaw,
    TypedDateTimeStringKind,
} from './parse';

describe('parseTypedDateTimeStringRaw', () => {
    it('returns DateTime kind and match for valid DateTime string', () => {
        const result = parseTypedDateTimeStringRaw('2024-07-23T23:00:00');
        expect(result).toEqual([TypedDateTimeStringKind.DateTime, expect.any(Array)]);
    });

    it('returns Date kind and match for valid Date string', () => {
        const result = parseTypedDateTimeStringRaw('2024-07-23');
        expect(result).toEqual([TypedDateTimeStringKind.Date, expect.any(Array)]);
    });

    it('returns Time kind and match for valid Time string', () => {
        const result = parseTypedDateTimeStringRaw('23:00:00');
        expect(result).toEqual([TypedDateTimeStringKind.Time, expect.any(Array)]);
    });

    it('returns Invalid kind and undefined for invalid string', () => {
        const result = parseTypedDateTimeStringRaw('invalid string');
        expect(result).toEqual([TypedDateTimeStringKind.Invalid, undefined]);
    });

    it('returns Invalid kind and undefined for null input', () => {
        const result = parseTypedDateTimeStringRaw(null);
        expect(result).toEqual([TypedDateTimeStringKind.Invalid, undefined]);
    });

    it('returns Invalid kind and undefined for non-string input', () => {
        const result = parseTypedDateTimeStringRaw(12345);
        expect(result).toEqual([TypedDateTimeStringKind.Invalid, undefined]);
    });
});

describe('parseTypedDateTimeString', () => {
    it('returns DateTime description for valid DateTime string', () => {
        const result = parseTypedDateTimeString('2024-07-23T23:00:00');
        expect(result).toEqual({
            date: { year: 2024, month: 7, day: 23 },
            time: { hour: 23, minute: 0, second: 0, ms: 0, offset: undefined },
            zulu: false,
        });
    });

    it('returns Date description for valid Date string', () => {
        const result = parseTypedDateTimeString('2024-07-23');
        expect(result).toEqual({
            date: { year: 2024, month: 7, day: 23 },
            time: undefined,
        });
    });

    it('returns Time description for valid Time string', () => {
        const result = parseTypedDateTimeString('23:00:00');
        expect(result).toEqual({
            date: undefined,
            time: { hour: 23, minute: 0, second: 0, ms: 0, offset: undefined },
            zulu: false,
        });
    });

    it('returns undefined for invalid string', () => {
        const result = parseTypedDateTimeString('invalid string');
        expect(result).toBeUndefined();
    });

    it('returns undefined for null input', () => {
        const result = parseTypedDateTimeString(null);
        expect(result).toBeUndefined();
    });

    it('returns undefined for non-string input', () => {
        const result = parseTypedDateTimeString(12345);
        expect(result).toBeUndefined();
    });

    it('returns DateTime description with Zulu time', () => {
        const result = parseTypedDateTimeString('2024-07-23T23:00:00Z');
        expect(result).toEqual({
            date: { year: 2024, month: 7, day: 23 },
            time: { hour: 23, minute: 0, second: 0, ms: 0, offset: undefined },
            zulu: true,
        });
    });

    it('returns DateTime description with offset', () => {
        const result = parseTypedDateTimeString('2024-07-23T23:00:00+02:00');
        expect(result).toEqual({
            date: { year: 2024, month: 7, day: 23 },
            time: { hour: 23, minute: 0, second: 0, ms: 0, offset: '+02:00' },
            zulu: false,
        });
    });
});
