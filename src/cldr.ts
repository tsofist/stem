import { PRec, Rec } from './index';

/**
 * ISO day of the week
 * @see https://en.wikipedia.org/wiki/ISO_week_date Wikipedia
 */
export enum Weekday {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7,
}

export type WeekdaySet<T> = Rec<T, Weekday>;
export type WeekdayPSet<T> = PRec<T, Weekday>;

/**
 * A string date (without time) in the native format for browsers: YYYY-MM-DD
 * @pattern (?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))
 * @see https://developer.mozilla.org/docs/Web/HTML/Element/input/date MDN HTMLInput
 * @see https://ru.wikipedia.org/wiki/ISO_8601 ISO8601
 * @see https://www.html5pattern.com/Dates html5pattern
 */
export type StringDate = `${number}-${number}-${number}`;

/**
 * A string time in the native format for browsers: HH:mm:ss
 * @pattern (0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}
 * @see https://www.html5pattern.com/Dates html5pattern
 */
export type StringTime = `${number}:${number}:${number}`;

/**
 * @format date
 * @see https://ajv.js.org/packages/ajv-formats.html formats
 */
export type SchematicDateString = string;

/**
 * @format time
 * @see https://ajv.js.org/packages/ajv-formats.html formats
 */
export type SchematicTimeString = string;

/**
 * @format date-time
 * @see https://ajv.js.org/packages/ajv-formats.html formats
 */
export type SchematicDateTimeString = string;

/**
 * @minimum 0
 * @maximum 23
 * @see https://en.wikipedia.org/wiki/24-hour_clock 24-hour clock
 */
export type N24HourClock = number;

/**
 * @minimum 1
 * @maximum 12
 * @see https://en.wikipedia.org/wiki/24-hour_clock 24-hour clock
 */
export type N12HourClock = number;
