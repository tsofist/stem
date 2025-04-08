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

/**
 * Minimum Unix timestamp
 *
 * @see https://en.wikipedia.org/wiki/Unix_time Unix time
 * @see https://www.unixtimestamp.com/ Visual tool
 *
 * @const 1738886710
 */
const N_MIN_UNIX_TIMESTAMP = 1_738_886_710;

/**
 * Maximum Unix timestamp
 *
 * @see https://en.wikipedia.org/wiki/Unix_time Unix time
 * @see https://www.unixtimestamp.com/ Visual tool
 * @see https://en.wikipedia.org/wiki/Year_2038_problem Year 2038 problem
 *
 * @const 2147483647000
 */
const N_MAX_UNIX_TIMESTAMP = 2_147_483_647_000;

/**
 * Minimum Unix timestamp date.
 * **Preferred way to use in UI.*
 *
 * @see https://en.wikipedia.org/wiki/Unix_time
 * @see https://www.unixtimestamp.com/
 *
 * @see MIN_DATE
 */
export const MIN_UNIX_TIMESTAMP = new Date(N_MIN_UNIX_TIMESTAMP);

/**
 * Maximum Unix timestamp date.
 * **Preferred way to use in UI.*
 *
 * @see https://en.wikipedia.org/wiki/Unix_time
 * @see https://en.wikipedia.org/wiki/Year_2038_problem Year 2038 problem
 *
 * @see MAX_DATE
 */
export const MAX_UNIX_TIMESTAMP = new Date(N_MAX_UNIX_TIMESTAMP);

/**
 * ECMAScript limit: -100_000_000 days
 *
 * @see https://en.wikipedia.org/wiki/Unix_time Unix time
 * @see https://www.unixtimestamp.com/ Visual tool
 * @see https://en.wikipedia.org/wiki/Year_2038_problem Year 2038 problem
 *
 * @see MIN_UNIX_TIMESTAMP
 *
 * @const -8640000000000000
 */
export const MIN_DATE = new Date(-86_400_0000_0000_000);

/**
 * ECMAScript limit: +100_000_000 days
 *
 * @see https://en.wikipedia.org/wiki/Unix_time Unix time
 * @see https://www.unixtimestamp.com/ Visual tool
 * @see https://en.wikipedia.org/wiki/Year_2038_problem Year 2038 problem
 *
 * @see MAX_UNIX_TIMESTAMP
 *
 * @const 8640000000000000
 */
export const MAX_DATE = new Date(86_400_0000_0000_000);

/**
 * @internal
 */
export const CLDRRegExpGroups = (() => {
    // Time
    const Hour = `(0\\d|1\\d|2[0-3])`;
    const Minute = `(0\\d|[1-5]\\d)`;
    const Second = `(0\\d|[1-5]\\d)`;
    const Millisecond = `(\\.(00\\d|0[1-9]\\d|[1-9]\\d{2}))`;
    // UTC offset
    const Sign = '([+-])';
    const UTCOffset = `(${Sign}${Hour}:${Minute})`;
    // Date
    const Year = `(197\\d|19[89]\\d|20[0-2]\\d|203[0-8])`;
    const Month = `(0[1-9]|1[0-2])`;
    const Day = `(0[1-9]|[12]\\d|3[01])`;
    // Combined
    const Time = `(${Hour}:${Minute}:${Second}${Millisecond}?)`;
    const LocalTime = `(${Hour}:${Minute}:${Second}${Millisecond}?${UTCOffset}?)`;
    const ZuluTime = `${Hour}:${Minute}:${Second}${Millisecond}?Z`;
    const ZeroZuluTime = `(00):(00):(00)(\\.(000))?Z`;
    const AnyTime = `(${Hour}:${Minute}:${Second}${Millisecond}?((Z)|(${UTCOffset}))?)`;
    const Date = `(${Year}-${Month}-${Day})`;
    const DateWithAnyTime = `(${Date}T${AnyTime})`;
    const DateWithLocalTime = `(${Date}T${LocalTime})`;
    const DateWithZuluTime = `(${Date}T${ZuluTime})`;
    const ZuluDate = `(${Date}T${ZeroZuluTime})`;

    console.log('ZD:', ZuluDate);

    return {
        /* eslint-disable prettier/prettier */
        Hour, Minute, Second, Millisecond,
        Sign, UTCOffset,
        Year, Month, Day,
        Time, LocalTime, ZuluTime, AnyTime,
        Date, ZuluDate,
        DateWithAnyTime, DateWithLocalTime, DateWithZuluTime,
        /* eslint-enable prettier/prettier */
    } as const;
})();

/**
 * @see UTCOffsetString
 */
export const CLDR_UTC_OFFSET = new RegExp(`^${CLDRRegExpGroups.UTCOffset}$`);

/**
 * @see LocalISODateString
 */
export const CLDR_ISO_LOCAL_DATE = new RegExp(`^${CLDRRegExpGroups.Date}$`);

/**
 * @see LocalISOTimeString
 */
export const CLDR_ISO_LOCAL_TIME = new RegExp(`^${CLDRRegExpGroups.LocalTime}$`);

/**
 * @see LocalISODateTimeString
 */
export const CLDR_ISO_LOCAL_DATE_TIME = new RegExp(`^${CLDRRegExpGroups.DateWithLocalTime}$`);

/**
 * @see ZuluISODateString
 */
export const CLDR_ISO_ZULU_DATE = new RegExp(`^${CLDRRegExpGroups.ZuluDate}$`);

/**
 * @see ZuluISOTimeString
 */
export const CLDR_ISO_ZULU_TIME = new RegExp(`^${CLDRRegExpGroups.ZuluTime}$`);

/**
 * @see ZuluISODateTimeString
 */
export const CLDR_ISO_ZULU_DATE_TIME = new RegExp(`^${CLDRRegExpGroups.DateWithZuluTime}$`);
