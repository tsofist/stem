import { Nullable } from '../../index';
import { setOf } from '../../set-of';
import { DateConstructorSource } from '../types';
import {
    CLDR_ISO_LOCAL_DATE,
    CLDR_ISO_LOCAL_DATE_TIME,
    CLDR_ISO_LOCAL_TIME,
    CLDR_ISO_ZULU_DATE,
    CLDR_ISO_ZULU_DATE_TIME,
    CLDR_ISO_ZULU_TIME,
    CLDR_UTC_OFFSET,
} from './constants';
import { isValidDateParts, parseTypedDateTimeStringRaw, TypedDateTimeStringKind } from './parse';
import {
    ISODateTimeType,
    LocalISODateString,
    LocalISODateTimeString,
    LocalISOTimeString,
    TypedDateTimeString,
    UTCOffsetString,
    ZuluISODateString,
    ZuluISODateTimeString,
    ZuluISOTimeString,
} from './types';

export function isUTCOffsetString(value: unknown): value is UTCOffsetString {
    return value != null && typeof value === 'string' && CLDR_UTC_OFFSET.test(value);
}

export function isLocalISODateString(value: unknown): value is LocalISODateString {
    return (
        value != null &&
        typeof value === 'string' &&
        CLDR_ISO_LOCAL_DATE.test(value) &&
        isValidDateSource(value)
    );
}

export function isLocalISOTimeString(value: unknown): value is LocalISOTimeString {
    return value != null && typeof value === 'string' && CLDR_ISO_LOCAL_TIME.test(value);
}

export function isLocalISODateTimeString(value: unknown): value is LocalISODateTimeString {
    return value != null && typeof value === 'string' && CLDR_ISO_LOCAL_DATE_TIME.test(value);
}

export function isZuluISODateString(value: unknown): value is ZuluISODateString {
    return value != null && typeof value === 'string' && CLDR_ISO_ZULU_DATE.test(value);
}

export function isZuluISOTimeString(value: unknown): value is ZuluISOTimeString {
    return value != null && typeof value === 'string' && CLDR_ISO_ZULU_TIME.test(value);
}

export function isZuluISODateTimeString(value: unknown): value is ZuluISODateTimeString {
    return value != null && typeof value === 'string' && CLDR_ISO_ZULU_DATE_TIME.test(value);
}

/**
 * Check if the value is a valid typed date-time string.
 *
 * @see TypedDateTimeString
 */
export function isValidTypedDateTimeString(value: unknown): value is TypedDateTimeString {
    const [kind, m] = parseTypedDateTimeStringRaw(value);
    if (!m) return false;

    switch (kind) {
        case TypedDateTimeStringKind.DateTime:
            return isValidDateParts(m[3], m[4], m[5]);
        case TypedDateTimeStringKind.Date:
            return isValidDateParts(m[2], m[3], m[4]);
        default:
            return true;
    }
}

/**
 * Check if the value is a valid Date constructor source.
 *
 * @see TypedDateTimeString
 */
export function isValidDateSource(
    source: Nullable<DateConstructorSource>,
): source is DateConstructorSource {
    if (source == null) return false;
    else if (source instanceof Date) return !Number.isNaN(source.getTime());
    else if (Number.isInteger(source)) return true;
    else {
        source = source as string;
        if (!isValidDateParts(source)) return false;
        if (Number.isNaN(new Date(source).getTime())) return false;
    }

    return true;
}

/**
 * Check if the type is a "local" ISO date/-time type.
 */
export function isLocalISODateTimeType(type: ISODateTimeType) {
    return LocalISODateTimeTypes.has(type);
}
/**
 * Check if the type is a "zulu" ISO date/-time type.
 */
export function isZuluISODateTimeType(type: ISODateTimeType) {
    return ZuluISODateTimeTypes.has(type);
}

/**
 * Check if the value of the specified type can contain a UTC offset.
 */
export function canContainUTCOffset(type: ISODateTimeType) {
    return SupportsUTCOffsetISODateTimeTypes.has(type);
}

const LocalISODateTimeTypes = setOf<ISODateTimeType>([
    ISODateTimeType.LocalDate,
    ISODateTimeType.LocalTime,
    ISODateTimeType.LocalDateTime,
]);

const ZuluISODateTimeTypes = setOf<ISODateTimeType>([
    ISODateTimeType.ZuluDate,
    ISODateTimeType.ZuluTime,
    ISODateTimeType.ZuluDateTime,
]);

const SupportsUTCOffsetISODateTimeTypes = setOf<ISODateTimeType>([
    ISODateTimeType.LocalTime,
    ISODateTimeType.LocalDateTime,
]);
