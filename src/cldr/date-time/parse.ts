import { raise } from '../../error';
import { noop } from '../../noop';
import { isLeapYear } from '../leap-year';
import { CLDRRegExpGroups } from './constants';
import { TypedDateTimeDescription, UTCOffsetString } from './types';

export enum TypedDateTimeStringKind {
    Invalid,
    Date,
    Time,
    DateTime,
}

export function parseTypedDateTimeStringRaw(
    value: unknown,
): readonly [kind: TypedDateTimeStringKind, match: RegExpMatchArray | undefined] {
    if (value == null || typeof value !== 'string')
        return [TypedDateTimeStringKind.Invalid, undefined];

    const len = value.length;

    let kind = TypedDateTimeStringKind.Invalid;
    let match: RegExpMatchArray | null = null;

    if (len <= 29) {
        if (len >= 19 && value.at(10) === 'T') {
            match = value.match(R_DT);
            if (match) kind = TypedDateTimeStringKind.DateTime;
        } else if (len === 10 && value.at(4) === '-') {
            match = value.match(R_D);
            if (match) kind = TypedDateTimeStringKind.Date;
        } else if (len >= 8 && value.at(2) === ':') {
            match = value.match(R_T);
            if (match) kind = TypedDateTimeStringKind.Time;
        }
    }

    return [kind, match || undefined];
}

export function parseTypedDateTimeString(value: unknown): TypedDateTimeDescription | undefined {
    const [kind, m] = parseTypedDateTimeStringRaw(value);
    if (!m || kind === TypedDateTimeStringKind.Invalid) return undefined;

    switch (kind) {
        case TypedDateTimeStringKind.DateTime:
            return {
                date: parseDateParts(m[3], m[4], m[5]),
                time: {
                    hour: Number.parseInt(m[7]),
                    minute: Number.parseInt(m[8]),
                    second: Number.parseInt(m[9]),
                    ms: m[10] ? Number.parseInt(m[11]) : 0,
                    offset: m[14] as UTCOffsetString,
                },
                zulu: m[13] === 'Z',
            };

        case TypedDateTimeStringKind.Time:
            return {
                date: undefined,
                time: {
                    hour: Number.parseInt(m[2]),
                    minute: Number.parseInt(m[3]),
                    second: Number.parseInt(m[4]),
                    ms: m[5] ? Number.parseInt(m[6]) : 0,
                    offset: m[10] as UTCOffsetString,
                },
                zulu: m[7] === 'Z',
            };

        case TypedDateTimeStringKind.Date:
            return {
                date: parseDateParts(m[2], m[3], m[4]),
                time: undefined,
            };

        default:
            raise(`Unknown typed date-time kind: ${kind}`);
    }
}

export function isValidDateParts<P extends string | number>(y: P, m: P, d: P): boolean;
export function isValidDateParts(source: string): boolean;
export function isValidDateParts(): boolean {
    if (arguments.length === 1) {
        // eslint-disable-next-line prefer-rest-params
        const source = arguments[0];
        if (source != null && typeof source === 'string') {
            if (
                (source.length === 10 || source.length >= 19) &&
                source.charAt(4) === '-' &&
                source.charAt(7) === '-'
            ) {
                return (
                    parseDateParts(
                        source.substring(0, 4),
                        source.substring(5, 7),
                        source.substring(8, 10),
                        noop,
                    ) != null
                );
            }
        }
    } else if (arguments.length === 3) {
        // eslint-disable-next-line prefer-rest-params,@typescript-eslint/no-unsafe-argument
        return parseDateParts(arguments[0], arguments[1], arguments[2], noop) != null;
    }
    return false;
}

function parseDateParts(
    y: string | number,
    m: string | number,
    d: string | number,
): InternalDateParts;
function parseDateParts(
    y: string | number,
    m: string | number,
    d: string | number,
    onError: (e: Error) => void,
): InternalDateParts | undefined;
function parseDateParts(
    y: string | number,
    m: string | number,
    d: string | number,
    onError?: (e: Error) => void,
): InternalDateParts | undefined {
    const year = Number(y);
    const month = Number(m);
    const day = Number(d);

    const processError = (message: string) => {
        const error = new Error(message);
        if (onError) onError(error);
        else throw error;
        return undefined;
    };

    /* eslint-disable @typescript-eslint/no-confusing-void-expression */

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
        return processError(`Invalid ISO date source: ${y}, ${m}, ${d}`);
    }

    // check year
    if (year < 1970 || year > 2038) {
        return processError(`Invalid ISO date year: ${year}`);
    }

    // check month
    if (month < 1 || month > 12) {
        return processError(`Invalid ISO date month: ${month}`);
    }

    // check day
    if (month === 2) {
        if (day < 1 || day > 29) {
            return processError(
                `Invalid ISO date day: ${day} for month: ${month} in year: ${year} (range/february)`,
            );
        } else if (day === 29 && !isLeapYear(year)) {
            return processError(
                `Invalid ISO date day: ${day} for month: ${month} in year: ${year} (leap year)`,
            );
        }
    } else {
        const max = month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
        if (day < 1 || day > max) {
            return processError(
                `Invalid ISO date day: ${day} for month: ${month} in year: ${year} (range)`,
            );
        }
    }

    /* eslint-enable @typescript-eslint/no-confusing-void-expression */

    return { year, month, day };
}

type InternalDateParts = { year: number; month: number; day: number };

const R_D = new RegExp(`^${CLDRRegExpGroups.Date}$`);
const R_DT = new RegExp(`^${CLDRRegExpGroups.DateWithAnyTime}$`);
const R_T = new RegExp(`^${CLDRRegExpGroups.AnyTime}$`);
