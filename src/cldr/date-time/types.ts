import { EnumValues, extractEnumValues } from '../../enum';
import { DeepReadonly, NumericString } from '../../index';

/**
 * 24-hour clock value
 *
 * @asType integer
 * @minimum 0
 * @maximum 23
 *
 * @see https://en.wikipedia.org/wiki/24-hour_clock 24-hour clock
 *
 * @public
 */
export type N24HourClock =
    // eslint-disable-next-line prettier/prettier
    0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;

/**
 * 12-hour clock value
 *
 * @asType integer
 * @minimum 1
 * @maximum 12
 *
 * @see https://en.wikipedia.org/wiki/12-hour_clock 12-hour clock
 *
 * @public
 */
export type N12HourClock =
    // eslint-disable-next-line prettier/prettier
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * UTC offset string.
 *
 * UTC: Coordinated Universal Time (it is a time standard, not a time zone).
 * GMT: Greenwich Mean Time (it is a time zone).
 *
 * @example
 *   +00:00
 *   +01:00
 *   -12:00
 *   +12:45
 *   -09:30
 *
 * @see https://en.wikipedia.org/wiki/UTC_offset UTC offset
 * @see https://wikipedia.org/wiki/UTC+00:00 UTC+00:00
 * @see https://en.wikipedia.org/wiki/List_of_UTC_offsets List of UTC offsets
 *
 * @pattern ^(([+-])(0\d|1\d|2[0-3]):(0\d|[1-5]\d))$
 *
 * @public
 */
export type UTCOffsetString = `${'+' | '-'}${NumericString}:${NumericString}`;

/**
 * ISO local time string.
 *
 * Rules:
 *   * Date: NO
 *   * Time: YES
 *   * UTC offset: Optional
 *   * Microseconds: Optional
 *
 * @example
 *   00:00:00
 *   12:34:56
 *   12:34:56.789
 *   12:34:56.789-14:45
 *   12:34:56+01:00
 *   12:34:56-01:00
 *   12:34:56+00:00
 *
 * @see https://en.wikipedia.org/wiki/UTC_offset
 * @see https://en.wikipedia.org/wiki/List_of_UTC_offsets
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString Date.prototype.toISOString()
 *
 * @pattern ^(0\d|1\d|2[0-3]):(0\d|[1-5]\d):(0\d|[1-5]\d)(\.(00\d|0[1-9]\d|[1-9]\d{2}))?(([+-])(0\d|1\d|2[0-3]):(0\d|[1-5]\d))?$
 *
 * @public
 */
export type LocalISOTimeString =
    `${NumericString}:${NumericString}:${NumericString}${'' | InternalTimeDotMicroseconds | UTCOffsetString}`;

/**
 * ISO local date string.
 *
 * Rules:
 *  * Date: YES
 *  * Time: NO
 *  * UTC offset: NO
 *  * Microseconds: NO
 *
 * @example
 *   2021-01-01
 *   2021-12-31
 *   2021-02-28
 *
 * @pattern ^(197\d|19[89]\d|20[0-2]\d|203[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
 *
 * @public
 */
export type LocalISODateString = `${NumericString}-${NumericString}-${NumericString}`;

/**
 * ISO zulu time string (GMT time zone).
 *
 * Rules:
 *  * Date: NO
 *  * Time: YES
 *  * UTC offset: NO
 *  * Microseconds: Optional
 *
 * @example
 *  00:00:00Z
 *  12:34:56Z
 *  12:34:56.789Z
 *
 * @pattern ^(0\d|1\d|2[0-3]):(0\d|[1-5]\d):(0\d|[1-5]\d)(\.(00\d|0[1-9]\d|[1-9]\d{2}))?Z$
 *
 * @public
 */
export type ZuluISOTimeString = `${NumericString}:${NumericString}:${NumericString}Z`;

/**
 * ISO zulu date-time string (GMT time zone).
 *
 * Rules:
 * * Date: YES
 * * Time: YES
 * * UTC offset: NO
 * * Microseconds: Optional
 *
 * @example
 *   2021-01-01T00:00:00Z
 *   2021-12-31T23:59:59Z
 *   2021-02-28T12:34:56Z
 *   2021-02-28T12:34:56.123Z
 *
 * @pattern ^(197\d|19[89]\d|20[0-2]\d|203[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0\d|1\d|2[0-3]):(0\d|[1-5]\d):(0\d|[1-5]\d)(\.(00\d|0[1-9]\d|[1-9]\d{2}))?Z$
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
 *
 * @public
 */
export type ZuluISODateString = `${LocalISODateString}T${ZuluISOTimeString}`;

/**
 * ISO local date-time string.
 *
 * Rules:
 * * Date: YES
 * * Time: YES
 * * UTC offset: Optional
 * * Microseconds: Optional
 *
 * @example
 *   2021-01-01T00:00:00
 *   2021-12-31T23:59:59
 *   2021-02-28T12:34:56
 *   2021-02-28T12:34:56.123
 *   2021-02-28T12:34:56.123+01:00
 *   2021-02-28T12:34:56.123-01:00
 *
 * @pattern ^(197\d|19[89]\d|20[0-2]\d|203[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0\d|1\d|2[0-3]):(0\d|[1-5]\d):(0\d|[1-5]\d)(\.(00\d|0[1-9]\d|[1-9]\d{2}))?(([+-])(0\d|1\d|2[0-3]):(0\d|[1-5]\d))?$
 *
 * @public
 */
export type LocalISODateTimeString = `${LocalISODateString}T${LocalISOTimeString}`;

/**
 * ISO zulu date-time string (GMT time zone).
 *
 * Rules:
 * * Date: YES
 * * Time: YES
 * * UTC offset: NO
 * * Microseconds: Optional
 *
 * @example
 *   2021-01-01T00:00:00Z
 *   2021-12-31T23:59:59Z
 *   2021-02-28T12:34:56Z
 *   2021-02-28T12:34:56.123Z
 *
 * @pattern ^(197\d|19[89]\d|20[0-2]\d|203[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0\d|1\d|2[0-3]):(0\d|[1-5]\d):(0\d|[1-5]\d)(\.(00\d|0[1-9]\d|[1-9]\d{2}))?Z$
 * @faker date.anytime
 *
 * @public
 */
export type ZuluISODateTimeString = `${LocalISODateString}T${ZuluISOTimeString}`;

/**
 * ISO date-time type.
 *
 * @public
 */
export enum ISODateTimeType {
    LocalTime = 'LocalTimeString',
    ZuluTime = 'ZuluTimeString',
    LocalDate = 'LocalDateString',
    ZuluDate = 'ZuluDateString',
    LocalDateTime = 'LocalDateTimeString',
    ZuluDateTime = 'ZuluDateTimeString',
}

export type TypedDateTimeString = EnumValues<typeof ISODateTimeType>;

export const ISODateTimeTypes: ReadonlyArray<TypedDateTimeString> =
    extractEnumValues(ISODateTimeType);

export type TypedDateTimeDescription = DeepReadonly<{
    date?: {
        year: number;
        month: number;
        day: number;
    };
    time?: {
        hour: number;
        minute: number;
        second: number;
        ms: number;
        offset?: UTCOffsetString;
    };
    zulu?: boolean;
}>;

type InternalTimeDotMicroseconds = `.${NumericString}`;
