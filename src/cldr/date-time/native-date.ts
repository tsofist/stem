import { raise } from '../../error';
import { Nullable } from '../../index';
import { substr } from '../../string/substr';
import { DateConstructorSource } from '../types';
import { isValidTypedDateTimeString } from './guards';
import {
    ISODateTimeType,
    LocalISODateString,
    LocalISODateTimeString,
    LocalISOTimeString,
    TypedDateTimeString,
    ZuluISODateString,
    ZuluISODateTimeString,
    ZuluISOTimeString,
} from './types';
import { applyUTCOffset, minutesToUTCOffset } from './utc-offset';

/**
 * Converts a string to a date object.
 *
 * @see TypedDateTimeString
 */
export function typedStringToDate(
    value: Nullable<string | TypedDateTimeString>,
    type: ISODateTimeType,
    omitUTCOffset = false,
): Date | undefined {
    if (value == null) return undefined;
    if (typeof value !== 'string') raise(`Invalid input: ${String(value)}`);

    switch (type) {
        // 2024-07-23
        // 2020-12-31
        // 2020-01-01
        case ISODateTimeType.LocalDate: {
            return new Date(value + 'T00:00:00');
        }

        // 22:15:00
        // 22:15:00+03:00
        // 22:15:00+20:00
        case ISODateTimeType.LocalTime: {
            if (omitUTCOffset) value = applyUTCOffset(value, '');
            const source = `${substr(new Date().toISOString(), 0, 'T')!}T${value}`;
            return new Date(source);
        }

        // 2024-07-23T23:00:00
        // 2020-01-01T00:00:00
        // 2020-01-01T12:30:00+06:00
        case ISODateTimeType.LocalDateTime: {
            if (omitUTCOffset) value = applyUTCOffset(value, '');
            return new Date(value);
        }

        // 2024-07-23T23:00:00Z
        // 2020-12-31T00:00:00Z
        // 2020-01-01T23:00:00Z
        case ISODateTimeType.ZuluDate: {
            return new Date(applyUTCOffset(value, 'Z'));
        }

        // 22:15:00Z
        // 00:00:00Z
        case ISODateTimeType.ZuluTime: {
            const source = `${substr(new Date().toISOString(), 0, 'T')!}T${value}`;
            return new Date(source);
        }

        // 2024-07-23T23:00:00Z
        // 2020-01-01T00:00:00Z
        case ISODateTimeType.ZuluDateTime: {
            return new Date(value);
        }

        default:
            raise(`Unknown ISODateTimeType: ${type}`);
    }
}

export function dateToTypedString(
    value: Nullable<Date>,
    type: ISODateTimeType.LocalTime,
    omitUTCOffset?: boolean,
    omitSeconds?: boolean,
): LocalISOTimeString | undefined;
export function dateToTypedString(
    value: Nullable<Date>,
    type: ISODateTimeType.ZuluTime,
    omitUTCOffset?: boolean,
    omitSeconds?: boolean,
): ZuluISOTimeString | undefined;
export function dateToTypedString(
    value: Nullable<Date>,
    type: ISODateTimeType.LocalDate,
    omitUTCOffset?: boolean,
    omitSeconds?: boolean,
): LocalISODateString | undefined;
export function dateToTypedString(
    value: Nullable<Date>,
    type: ISODateTimeType.ZuluDate,
    omitUTCOffset?: boolean,
    omitSeconds?: boolean,
): ZuluISODateString | undefined;
export function dateToTypedString(
    value: Nullable<Date>,
    type: ISODateTimeType.LocalDateTime,
    omitUTCOffset?: boolean,
    omitSeconds?: boolean,
): LocalISODateTimeString | undefined;
export function dateToTypedString(
    value: Nullable<Date>,
    type: ISODateTimeType.ZuluDateTime,
    omitUTCOffset?: boolean,
    omitSeconds?: boolean,
): ZuluISODateTimeString | undefined;
export function dateToTypedString(
    value: Nullable<Date>,
    type: ISODateTimeType,
    omitUTCOffset?: boolean,
    omitSeconds?: boolean,
): TypedDateTimeString | undefined;
/**
 * Converts a date object to a TypedDateTimeString based on the specified type.
 *
 * @see TypedDateTimeString
 */
export function dateToTypedString(
    value: Nullable<Date>,
    type: ISODateTimeType,
    omitUTCOffset = false,
    omitSeconds = true,
): string | undefined {
    if (value == null) return undefined;
    if (!(value instanceof Date)) raise(`Invalid input: ${String(value)}`);

    switch (type) {
        case ISODateTimeType.LocalDate:
            return substr(value.toISOString(), 0, 'T')!;

        case ISODateTimeType.ZuluDate: {
            const v = new Date(value);
            v.setSeconds(0);
            return v.toISOString().replace(/\.\d+Z$/, 'Z');
        }

        case ISODateTimeType.LocalTime: {
            const hours = value.getHours().toString(10).padStart(2, '0');
            const minutes = value.getMinutes().toString(10).padStart(2, '0');
            const seconds = omitSeconds ? '00' : value.getSeconds().toString(10).padStart(2, '0');
            let result = `${hours}:${minutes}:${seconds}`;

            if (!omitUTCOffset) {
                result += minutesToUTCOffset(value.getTimezoneOffset());
            }

            return result;
        }

        case ISODateTimeType.ZuluTime: {
            const v = new Date(value);
            if (omitSeconds) v.setSeconds(0);
            return substr(value.toISOString(), 'T')!.replace(/\.\d+Z$/, 'Z');
        }

        case ISODateTimeType.ZuluDateTime: {
            const v = new Date(value);
            if (omitSeconds) v.setSeconds(0);
            return v.toISOString().replace(/\.\d+Z$/, 'Z');
        }

        case ISODateTimeType.LocalDateTime: {
            const year = value.getFullYear();
            const month = (value.getMonth() + 1).toString().padStart(2, '0');
            const day = value.getDate().toString().padStart(2, '0');
            const hours = value.getHours().toString().padStart(2, '0');
            const minutes = value.getMinutes().toString().padStart(2, '0');
            const seconds = omitSeconds ? '00' : value.getSeconds().toString().padStart(2, '0');

            let result = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

            if (!omitUTCOffset) {
                result += minutesToUTCOffset(value.getTimezoneOffset());
            }

            return result;
        }

        default:
            raise(`Unknown date type: ${type}`);
    }
}

export function createTypedDateTimeString(
    type: ISODateTimeType.LocalDate,
    source: DateConstructorSource,
): LocalISODateString;
export function createTypedDateTimeString(
    type: ISODateTimeType.LocalTime,
    source: DateConstructorSource,
): LocalISOTimeString;
export function createTypedDateTimeString(
    type: ISODateTimeType.LocalDateTime,
    source: DateConstructorSource,
): LocalISODateTimeString;
export function createTypedDateTimeString(
    type: ISODateTimeType.ZuluDate,
    source: DateConstructorSource,
): ZuluISODateString;
export function createTypedDateTimeString(
    type: ISODateTimeType.ZuluTime,
    source: DateConstructorSource,
): ZuluISOTimeString;
export function createTypedDateTimeString(
    type: ISODateTimeType.ZuluDateTime,
    source: DateConstructorSource,
): ZuluISODateTimeString;
export function createTypedDateTimeString(
    type: ISODateTimeType,
    source: DateConstructorSource,
): TypedDateTimeString;
/**
 * Creates a TypedDateTimeString based on the specified type.
 *
 * @see TypedDateTimeString
 */
export function createTypedDateTimeString(
    type: ISODateTimeType,
    source: DateConstructorSource = new Date(),
): TypedDateTimeString {
    if (!(source instanceof Date)) {
        if (Number.isInteger(source)) source = new Date(source);
        else if (isValidTypedDateTimeString(source)) source = new Date(source);
        else raise(`Invalid source: ${source}`);
    }

    const result = dateToTypedString(source, type);
    if (result == null) raise(`Failed to create ${type}: ${String(source)}`);

    return result;
}
