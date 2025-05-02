import type { PRec, Rec, UniqueItemsArray } from '../index';
import type { Int } from '../number/integer/types';
import type { IANATimeZoneList } from './time-zone';

export type DateConstructorSource = string | Int | Date;

/**
 * ISO day of the week
 *
 * @see https://en.wikipedia.org/wiki/ISO_week_date Wikipedia
 *
 * @public
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

export type ISOWeekdaySet = UniqueItemsArray<ISOWeekday>;

export type ISODayOfMonth =
    /* eslint-disable prettier/prettier */
    | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
    | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
    | 31;
    /* eslint-enable prettier/prettier */

export type ISODayOfMonthSet = UniqueItemsArray<ISODayOfMonth>;

/**
 * IANA Time Zone Database identifier
 *
 * @see https://en.wikipedia.org/wiki/Time_zone wiki: Time Zone
 * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones wiki: IANA Time Zone Database
 * @see https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations wiki: Time Zone Abbreviations
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime#time_zones_and_offsets MDN
 */
export type IANATimeZoneId = (typeof IANATimeZoneList)[number];

export type IANATimeZoneIdSet = UniqueItemsArray<IANATimeZoneId>;
