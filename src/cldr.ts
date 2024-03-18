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
 * @pattern ^(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$
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
 * @pattern ^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}Z$
 */
export type ISOTimeZString = `${number}-${number}-${number}Z`;

/**
 * ISO date with time with optional time-zone
 * @format iso-date-time
 */
export type ISODateTimeString = string;

/**
 * ISO date with time with optional time-zone
 * @pattern ^(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])Z$
 */
export type ISODateTimeZString = `${string}Z`;

/**
 * @minimum 0
 * @maximum 23
 * @see https://en.wikipedia.org/wiki/24-hour_clock 24-hour clock
 */
export type N24HourClock = number;

/**
 * @minimum 1
 * @maximum 12
 * @see https://en.wikipedia.org/wiki/12-hour_clock 12-hour clock
 */
export type N12HourClock = number;
