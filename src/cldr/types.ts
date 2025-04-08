import { PRec, Rec, UniqueItemsArray } from '../index';
import { Int } from '../number/types';

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

export type DateConstructorSource = string | Int | Date;
