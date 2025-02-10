import {
    isLocalISODateString,
    isLocalISODateTimeString,
    isLocalISOTimeString,
    isUTCOffsetString,
    isValidDateSource,
    isZuluISODateString,
    isZuluISODateTimeString,
    isZuluISOTimeString,
} from './guards';
import { parseTypedDateTimeString } from './parse';

describe('cldr/isUTCOffsetString', () => {
    it('should return true', () => {
        expect(isUTCOffsetString('+00:00')).toBe(true);
        expect(isUTCOffsetString('+01:30')).toBe(true);
        expect(isUTCOffsetString('-01:30')).toBe(true);
    });

    it('should return false', () => {
        expect(isUTCOffsetString('')).toBe(false);
        expect(isUTCOffsetString(null)).toBe(false);
        expect(isUTCOffsetString(undefined)).toBe(false);
        expect(isUTCOffsetString('00:00')).toBe(false);
        expect(isUTCOffsetString('+02')).toBe(false);
        expect(isUTCOffsetString('00:00:00')).toBe(false);
        expect(isUTCOffsetString('01:00')).toBe(false);
        expect(isUTCOffsetString('+01:00:00')).toBe(false);
        expect(isUTCOffsetString('01-30')).toBe(false);
        expect(isUTCOffsetString('A')).toBe(false);
    });
});

describe('cldr/isLocalISOTimeString', () => {
    it('should return true', () => {
        expect(isLocalISOTimeString('00:00:00')).toBe(true);
        expect(isLocalISOTimeString('12:34:56')).toBe(true);
        expect(isLocalISOTimeString('12:34:56.123')).toBe(true);
        expect(isLocalISOTimeString('12:34:56.123+01:00')).toBe(true);
        expect(isLocalISOTimeString('12:34:56.123-01:00')).toBe(true);
        expect(isLocalISOTimeString('12:34:56.123+00:00')).toBe(true);
    });

    it('should return false', () => {
        expect(isLocalISOTimeString('')).toBe(false);
        expect(isLocalISOTimeString(null)).toBe(false);
        expect(isLocalISOTimeString(undefined)).toBe(false);
        expect(isLocalISOTimeString('00:00')).toBe(false);
        expect(isLocalISOTimeString('01:00')).toBe(false);
        expect(isLocalISOTimeString('01-30')).toBe(false);
        expect(isLocalISOTimeString('A')).toBe(false);
    });
});

describe('cldr/isZuluISOTimeString', () => {
    it('should return true', () => {
        expect(isZuluISOTimeString('00:00:00Z')).toBe(true);
        expect(isZuluISOTimeString('12:34:56Z')).toBe(true);
        expect(isZuluISOTimeString('12:34:56.123Z')).toBe(true);
    });

    it('should return false', () => {
        expect(isZuluISOTimeString('')).toBe(false);
        expect(isZuluISOTimeString(null)).toBe(false);
        expect(isZuluISOTimeString(undefined)).toBe(false);
        expect(isZuluISOTimeString('00:00')).toBe(false);
        expect(isZuluISOTimeString('01:00')).toBe(false);
        expect(isZuluISOTimeString('01-30')).toBe(false);
        expect(isZuluISOTimeString('A')).toBe(false);
        expect(isZuluISOTimeString('00:00:00')).toBe(false);
        expect(isZuluISOTimeString('12:34:56')).toBe(false);
        expect(isZuluISOTimeString('12:34:56.123')).toBe(false);
        expect(isZuluISOTimeString('12:34:56.123+01:00')).toBe(false);
        expect(isZuluISOTimeString('12:34:56.123-01:00')).toBe(false);
        expect(isZuluISOTimeString('12:34:56.123+00:00')).toBe(false);
    });
});

describe('cldr/isLocalISODateString', () => {
    it('should return true', () => {
        expect(isLocalISODateString('2021-01-01')).toBe(true);
        expect(isLocalISODateString('2021-12-31')).toBe(true);
        expect(isLocalISODateString('2021-02-28')).toBe(true);
    });

    it('should return false', () => {
        expect(isLocalISODateString('')).toBe(false);
        expect(isLocalISODateString(null)).toBe(false);
        expect(isLocalISODateString(undefined)).toBe(false);
        expect(isLocalISODateString('2021-01-32')).toBe(false);
        expect(isLocalISODateString('2021-13-01')).toBe(false);
        expect(isLocalISODateString('2021-00-01')).toBe(false);
        expect(isLocalISODateString('2021-01-00')).toBe(false);
        expect(isLocalISODateString('2021-01-01T12:34:56')).toBe(false);
        // leap years
        expect(isLocalISODateString('2021-02-29')).toBe(false);
        expect(isLocalISODateString('2021-02-30')).toBe(false);
    });
});

describe('cldr/isZuluISODateString', () => {
    it('should return true', () => {
        expect(isZuluISODateString('2021-01-01T00:00:00Z')).toBe(true);
        expect(isZuluISODateString('2021-12-31T23:59:59Z')).toBe(true);
        expect(isZuluISODateString('2021-02-28T12:34:56Z')).toBe(true);
        expect(isZuluISODateString('2021-02-28T12:34:56.123Z')).toBe(true);
    });

    it('should return false', () => {
        expect(isZuluISODateString('')).toBe(false);
        expect(isZuluISODateString(null)).toBe(false);
        expect(isZuluISODateString(undefined)).toBe(false);
        expect(isZuluISODateString('2021-01-01')).toBe(false);
        expect(isZuluISODateString('2021-01-01T12:34:56')).toBe(false);
        expect(isZuluISODateString('2021-01-01T12:34:56.123')).toBe(false);
        expect(isZuluISODateString('2021-01-01T12:34:56.123+01:00')).toBe(false);
        expect(isZuluISODateString('2021-01-01T12:34:56.123-01:00')).toBe(false);
        expect(isZuluISODateString('2021-01-01T12:34:56.123+00:00')).toBe(false);
    });
});

describe('cldr/isLocalISODateTimeString', () => {
    it('should return true', () => {
        expect(isLocalISODateTimeString('2021-01-01T00:00:00')).toBe(true);
        expect(isLocalISODateTimeString('2021-12-31T23:59:59')).toBe(true);
        expect(isLocalISODateTimeString('2021-02-28T12:34:56')).toBe(true);
        expect(isLocalISODateTimeString('2021-02-28T12:34:56.123')).toBe(true);
        expect(isLocalISODateTimeString('2021-02-28T12:34:56.123+01:00')).toBe(true);
        expect(isLocalISODateTimeString('2021-02-28T12:34:56.123-01:00')).toBe(true);
        expect(isLocalISODateTimeString('2021-02-28T12:34:56.123+00:00')).toBe(true);
    });

    it('should return false', () => {
        expect(isLocalISODateTimeString('')).toBe(false);
        expect(isLocalISODateTimeString(null)).toBe(false);
        expect(isLocalISODateTimeString(undefined)).toBe(false);
        expect(isLocalISODateTimeString('2021-01-01')).toBe(false);
        expect(isLocalISODateTimeString('2021-01-01T12:34:56Z')).toBe(false);
        expect(isLocalISODateTimeString('2021-01-01T12:34:56.123Z')).toBe(false);
    });
});

describe('cldr/isZuluISODateTimeString', () => {
    it('should return true', () => {
        expect(isZuluISODateTimeString('2021-01-01T00:00:00Z')).toBe(true);
        expect(isZuluISODateTimeString('2021-12-31T23:59:59Z')).toBe(true);
        expect(isZuluISODateTimeString('2021-02-28T12:34:56Z')).toBe(true);
        expect(isZuluISODateTimeString('2021-02-28T12:34:56.123Z')).toBe(true);
    });

    it('should return false', () => {
        expect(isZuluISODateTimeString('')).toBe(false);
        expect(isZuluISODateTimeString(null)).toBe(false);
        expect(isZuluISODateTimeString(undefined)).toBe(false);
        expect(isZuluISODateTimeString('2021-01-01')).toBe(false);
        expect(isZuluISODateTimeString('2021-01-01Z')).toBe(false);
        expect(isZuluISODateTimeString('2021-01-01T12:34:56')).toBe(false);
        expect(isZuluISODateTimeString('2021-01-01T12:34:56.123')).toBe(false);
        expect(isZuluISODateTimeString('2021-01-01T12:34:56.123+01:00')).toBe(false);
        expect(isZuluISODateTimeString('2021-01-01T12:34:56.123-01:00')).toBe(false);
        expect(isZuluISODateTimeString('2021-01-01T12:34:56.123+00:00')).toBe(false);
    });
});

describe('cldr/isValidDateSource', () => {
    it('should return true', () => {
        expect(isValidDateSource('2021-01-01')).toBe(true);
        expect(isValidDateSource('2021-12-31')).toBe(true);
        expect(isValidDateSource('2021-02-28')).toBe(true);
        expect(isValidDateSource('2021-01-28T01:01:01')).toBe(true);
        expect(isValidDateSource('2021-02-28T01:01:01Z')).toBe(true);
        expect(isValidDateSource('2021-01-01T12:34:56+00:00')).toBe(true);
        expect(isValidDateSource('2021-01-01T12:34:56.789+00:00')).toBe(true);
        expect(isValidDateSource('2021-01-01T12:34:56.789Z')).toBe(true);
    });

    it('should return false', () => {
        expect(isValidDateSource('')).toBe(false);
        expect(isValidDateSource(null)).toBe(false);
        expect(isValidDateSource(undefined)).toBe(false);
        expect(isValidDateSource('2021-01-32')).toBe(false);
        expect(isValidDateSource('2021-00-01')).toBe(false);
        expect(isValidDateSource('2021-01-00')).toBe(false);
        expect(isValidDateSource('2021-01-01T')).toBe(false);
        expect(isValidDateSource('2021-01-01T12:34:56.789+90:00')).toBe(false);

        expect(isValidDateSource('2021-01-01Z')).toBe(false);

        // leap years
        expect(isValidDateSource('2021-02-29')).toBe(false);
        expect(isValidDateSource('2021-02-30')).toBe(false);
    });
});

describe('cldr/parseTypedDateTimeString', () => {
    it('should be parsed normally with date-time', () => {
        expect(parseTypedDateTimeString('2020-01-01T00:23:59.999+14:45')).toStrictEqual({
            date: {
                year: 2020,
                month: 1,
                day: 1,
            },
            time: {
                hour: 0,
                minute: 23,
                second: 59,
                ms: 999,
                offset: '+14:45',
            },
            zulu: false,
        });

        expect(parseTypedDateTimeString('2020-01-01T00:23:59')).toStrictEqual({
            date: {
                year: 2020,
                month: 1,
                day: 1,
            },
            time: {
                hour: 0,
                minute: 23,
                second: 59,
                ms: 0,
                offset: undefined,
            },
            zulu: false,
        });

        expect(parseTypedDateTimeString('2020-01-01T00:23:59-11:15')).toStrictEqual({
            date: {
                year: 2020,
                month: 1,
                day: 1,
            },
            time: {
                hour: 0,
                minute: 23,
                second: 59,
                ms: 0,
                offset: '-11:15',
            },
            zulu: false,
        });

        expect(parseTypedDateTimeString('2020-01-01T00:23:59Z')).toStrictEqual({
            date: {
                year: 2020,
                month: 1,
                day: 1,
            },
            time: {
                hour: 0,
                minute: 23,
                second: 59,
                ms: 0,
                offset: undefined,
            },
            zulu: true,
        });

        expect(parseTypedDateTimeString('2020-01-01T00:00:00.100Z')).toStrictEqual({
            date: {
                year: 2020,
                month: 1,
                day: 1,
            },
            time: {
                hour: 0,
                minute: 0,
                second: 0,
                ms: 100,
                offset: undefined,
            },
            zulu: true,
        });

        expect(parseTypedDateTimeString('2020-01-01T00:00:00.001-03:00')).toStrictEqual({
            date: {
                year: 2020,
                month: 1,
                day: 1,
            },
            time: {
                hour: 0,
                minute: 0,
                second: 0,
                ms: 1,
                offset: '-03:00',
            },
            zulu: false,
        });
    });

    it('should be parsed normally with date', () => {
        expect(parseTypedDateTimeString('2020-01-01')).toStrictEqual({
            date: {
                year: 2020,
                month: 1,
                day: 1,
            },
            time: undefined,
        });
        expect(parseTypedDateTimeString('1970-01-01')).toStrictEqual({
            date: {
                year: 1970,
                month: 1,
                day: 1,
            },
            time: undefined,
        });
        expect(parseTypedDateTimeString('2038-01-01')).toStrictEqual({
            date: {
                year: 2038,
                month: 1,
                day: 1,
            },
            time: undefined,
        });
    });

    it('should be parsed normally with time', () => {
        expect(parseTypedDateTimeString('00:00:00.123')).toStrictEqual({
            date: undefined,
            time: {
                hour: 0,
                minute: 0,
                second: 0,
                ms: 123,
                offset: undefined,
            },
            zulu: false,
        });
        expect(parseTypedDateTimeString('00:00:00.123+12:45')).toStrictEqual({
            date: undefined,
            time: {
                hour: 0,
                minute: 0,
                second: 0,
                ms: 123,
                offset: '+12:45',
            },
            zulu: false,
        });
        expect(parseTypedDateTimeString('00:00:00')).toStrictEqual({
            date: undefined,
            time: {
                hour: 0,
                minute: 0,
                second: 0,
                ms: 0,
                offset: undefined,
            },
            zulu: false,
        });
        // '00:23:59.999-11:15',
        expect(parseTypedDateTimeString('00:23:59-11:45')).toStrictEqual({
            date: undefined,
            time: {
                hour: 0,
                minute: 23,
                second: 59,
                ms: 0,
                offset: '-11:45',
            },
            zulu: false,
        });
        // '00:23:59Z',
        expect(parseTypedDateTimeString('00:23:59Z')).toStrictEqual({
            date: undefined,
            time: {
                hour: 0,
                minute: 23,
                second: 59,
                ms: 0,
                offset: undefined,
            },
            zulu: true,
        });
    });

    it('should be correctly handle edge cases', () => {
        expect(parseTypedDateTimeString('AA:00:00')).toBeUndefined();
        expect(parseTypedDateTimeString('00:23:59.9999-11:15')).toBeUndefined();
        expect(parseTypedDateTimeString('00:23:59.-99-11:15')).toBeUndefined();
        expect(parseTypedDateTimeString('00:23:59-23')).toBeUndefined();
        expect(parseTypedDateTimeString('00:23:59-24:00')).toBeUndefined();
        expect(parseTypedDateTimeString('24:23:59Z')).toBeUndefined();
    });
});
