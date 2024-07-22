import { PRec, Rec } from './index';

/**
 * ISO day of the week
 *
 * @see https://en.wikipedia.org/wiki/ISO_week_date Wikipedia
 */
export enum ISOWeekday {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7,
}

export type ISOWeekdayRec<T> = Rec<T, ISOWeekday>;
export type ISOWeekdayPRec<T> = PRec<T, ISOWeekday>;

/**
 * ISO date (without time)
 *
 * @pattern ^(?:19|20)\d{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])|(?:0[13-9]|1[0-2])-(?:30)|(?:0[13578]|1[02])-31)$
 * @see https://en.wikipedia.org/wiki/ISO_8601 ISO8601
 */
export type ISODateString = `${number}-${number}-${number}`;

/**
 * ISO time (without date) with optional time-zone
 * @format iso-time
 */
export type ISOTimeString = string;

/**
 * ISO time (without date) in UTC time-zone
 * @pattern ^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}(\.\d{1,3})?Z$
 */
export type ISOTimeZString = `${number}:${number}:${number}Z`;

/**
 * ISO date with time with optional time-zone
 * @format iso-date-time
 */
export type ISODateTimeString = string;

/**
 * ISO date with time UTC+0 (Zulu)
 * @pattern ^(?:19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,3})?Z$
 * @faker date.anytime
 */
export type ISODateTimeZString = `${string}Z`;

/**
 * @asType integer
 * @minimum 0
 * @maximum 23
 * @see https://en.wikipedia.org/wiki/24-hour_clock 24-hour clock
 */
export type N24HourClock = number;

/**
 * @asType integer
 * @minimum 1
 * @maximum 12
 * @see https://en.wikipedia.org/wiki/12-hour_clock 12-hour clock
 */
export type N12HourClock = number;

/**
 * One minute in milliseconds
 * @const 60000
 */
export const ONE_MINUTE = 60 * 1000;

/**
 * One hour in milliseconds
 * @const 3600000
 */
export const ONE_HOUR = 60 * ONE_MINUTE;

/**
 * One day in milliseconds
 * @const 86400000
 */
export const ONE_DAY = 24 * ONE_HOUR;

/**
 * One week in milliseconds
 * @const 604800000
 */
export const ONE_WEEK = 7 * ONE_DAY;
