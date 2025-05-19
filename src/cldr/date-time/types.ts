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
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
 *
 * @pattern ^(([+-])(0\d|1\d|2[0-3]):(0\d|[1-5]\d))$
 *
 * @public
 */
export type UTCOffsetString = `${'+' | '-'}${NumericString}:${NumericString}`;

/**
 * ISO local date string.
 *
 * Rules:
 *  * Date: YES
 *  * Time: NO
 *  * UTC offset: NO
 *  * Milliseconds: NO
 *
 * @example
 *   2021-01-01
 *   2021-12-31
 *   2021-02-28
 *
 * @see https://en.wikipedia.org/wiki/UTC_offset
 * @see https://en.wikipedia.org/wiki/List_of_UTC_offsets
 * @see https://wikipedia.org/wiki/UTC+00:00 UTC+00:00
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString Date.prototype.toISOString()
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
 *
 * @pattern ^(197\d|19[89]\d|20[0-2]\d|203[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
 *
 * @public
 */
export type LocalISODateString = `${NumericString}-${NumericString}-${NumericString}`;

/**
 * ISO local time string.
 *
 * Rules:
 *   * Date: NO
 *   * Time: YES
 *   * UTC offset: Optional
 *   * Milliseconds: Optional
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
 * @see https://wikipedia.org/wiki/UTC+00:00 UTC+00:00
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString Date.prototype.toISOString()
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
 *
 * @pattern ^(0\d|1\d|2[0-3]):(0\d|[1-5]\d):(0\d|[1-5]\d)(\.(00\d|0[1-9]\d|[1-9]\d{2}))?(([+-])(0\d|1\d|2[0-3]):(0\d|[1-5]\d))?$
 *
 * @public
 */
export type LocalISOTimeString =
    `${NumericString}:${NumericString}:${NumericString}${'' | InternalTimeDotMilliseconds | UTCOffsetString}`;

/**
 * ISO local date-time string.
 *
 * Rules:
 * * Date: YES
 * * Time: YES
 * * UTC offset: Optional
 * * Milliseconds: Optional
 *
 * @example
 *   2021-01-01T00:00:00
 *   2021-12-31T23:59:59
 *   2021-02-28T12:34:56
 *   2021-02-28T12:34:56.123
 *   2021-02-28T12:34:56.123+01:00
 *   2021-02-28T12:34:56.123-01:00
 *
 * @see https://en.wikipedia.org/wiki/UTC_offset
 * @see https://en.wikipedia.org/wiki/List_of_UTC_offsets
 * @see https://wikipedia.org/wiki/UTC+00:00 UTC+00:00
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString Date.prototype.toISOString()
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
 *
 * @pattern ^(197\d|19[89]\d|20[0-2]\d|203[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0\d|1\d|2[0-3]):(0\d|[1-5]\d):(0\d|[1-5]\d)(\.(00\d|0[1-9]\d|[1-9]\d{2}))?(([+-])(0\d|1\d|2[0-3]):(0\d|[1-5]\d))?$
 *
 * @public
 */
export type LocalISODateTimeString = `${LocalISODateString}T${LocalISOTimeString}`;

/**
 * ISO zulu time string (GMT time zone).
 *
 * Rules:
 *  * Date: NO
 *  * Time: YES
 *  * UTC offset: NO
 *  * Milliseconds: Optional
 *
 * @example
 *  00:00:00Z
 *  12:34:56Z
 *  12:34:56.789Z
 *
 * @see https://wikipedia.org/wiki/UTC+00:00 UTC+00:00
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString Date.prototype.toISOString()
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
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
 * * Milliseconds: Optional
 *
 * @example
 *   2021-01-01T00:00:00Z
 *   2021-02-28T00:00:00.000Z
 *
 * @see https://wikipedia.org/wiki/UTC+00:00 UTC+00:00
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString Date.prototype.toISOString()
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
 *
 * @pattern ^((197\d|19[89]\d|20[0-2]\d|203[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))T(00):(00):(00)(\.(000))?Z$
 *
 * @faker {
 *     'helpers.arrayElement': [[
 *          '2022-02-21T00:00:00Z',
 *          '2024-04-10T00:00:00Z',
 *          '2020-01-01T00:00:00Z'
 *     ]]
 * }
 *
 * @public
 */
export type ZuluISODateString = `${LocalISODateString}T00:00:00Z`;

/**
 * ISO zulu date-time string (GMT time zone).
 *
 * Rules:
 * * Date: YES
 * * Time: YES
 * * UTC offset: NO
 * * Milliseconds: Optional
 *
 * @example
 *   2021-01-01T00:00:00Z
 *   2021-12-31T23:59:59Z
 *   2021-02-28T12:34:56Z
 *   2021-02-28T12:34:56.123Z
 *
 * @see https://wikipedia.org/wiki/UTC+00:00 UTC+00:00
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString Date.prototype.toISOString()
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO-8601
 *
 * @pattern ^(197\d|19[89]\d|20[0-2]\d|203[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0\d|1\d|2[0-3]):(0\d|[1-5]\d):(0\d|[1-5]\d)(\.(00\d|0[1-9]\d|[1-9]\d{2}))?Z$
 *
 * @faker date.anytime
 *
 * @public
 */
export type ZuluISODateTimeString = `${LocalISODateString}T${ZuluISOTimeString}`;

/**
 * Type of ISO date/-time string.
 *
 * @public
 */
export enum ISODateTimeType {
    /**
     * Local date without time.
     *
     * This means that the date is in the local time zone.
     */
    LocalDate = 'LocalDateString',
    /**
     * Local time without date.
     *
     * This means that the time is in the local time zone.
     * Value can be with or without UTC offset.
     * Value can be with or without milliseconds.
     */
    LocalTime = 'LocalTimeString',
    /**
     * Local date with time.
     *
     * This means that the date and time are in the local time zone.
     * Value can be with or without UTC offset.
     * Value can be with or without milliseconds.
     */
    LocalDateTime = 'LocalDateTimeString',
    /**
     * Zulu date.
     *
     * This means that the date is in the GMT time zone.
     *
     * In fact, a value with this type always contains not only the date, but also the time in Zulu.
     * This is necessary to clearly determine which days the date refers to.
     * Format of the value with this type corresponds to the ZuluDateTime format.
     *
     * For example: if an event occurs on 2030-01-01,
     *   then depending on the time, it can occur on different days.
     *
     * This type differs from LocalDate in that the latter does not contain information about the time zone.
     * This type differs from ZuluDateTime in that they need to be entered and displayed differently.
     */
    ZuluDate = 'ZuluDateString',
    /**
     * Zulu time without date.
     *
     * This means that the time is in the GMT time zone.
     * Value can be with or without milliseconds.
     */
    ZuluTime = 'ZuluTimeString',
    /**
     * Zulu date with time.
     *
     * This means that the date and time are in the GMT time zone.
     * Value can be with or without milliseconds.
     */
    ZuluDateTime = 'ZuluDateTimeString',
}

/**
 * Common type for all types of ISO date/-time strings.
 */
export type TypedDateTimeString =
    | LocalISODateString
    | LocalISOTimeString
    | LocalISODateTimeString
    | ZuluISODateString
    | ZuluISOTimeString
    | ZuluISODateTimeString;

/**
 * Name of ISO date/-time type.
 */
export type ISODateTimeTypeName = EnumValues<typeof ISODateTimeType>;

/**
 * List of all ISO date/-time type names.
 */
export const ISODateTimeTypesNames: ReadonlyArray<ISODateTimeTypeName> =
    extractEnumValues(ISODateTimeType);

/**
 * Description of typed date-time string.
 */
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

type InternalTimeDotMilliseconds = `.${NumericString}`;
