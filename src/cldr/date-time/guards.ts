import { Nullable } from '../../index';
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
    LocalISODateString,
    LocalISODateTimeString,
    ZuluISODateTimeString,
    ZuluISODateString,
    LocalISOTimeString,
    UTCOffsetString,
    ZuluISOTimeString,
    ISODateTimeType,
} from './types';

export function isUTCOffsetString(value: unknown): value is UTCOffsetString {
    return value != null && typeof value === 'string' && CLDR_UTC_OFFSET.test(value);
}

export function isLocalISOTimeString(value: unknown): value is LocalISOTimeString {
    return value != null && typeof value === 'string' && CLDR_ISO_LOCAL_TIME.test(value);
}

export function isLocalISODateString(value: unknown): value is LocalISODateString {
    return (
        value != null &&
        typeof value === 'string' &&
        CLDR_ISO_LOCAL_DATE.test(value) &&
        isValidDateSource(value)
    );
}

export function isZuluISOTimeString(value: unknown): value is ZuluISOTimeString {
    return value != null && typeof value === 'string' && CLDR_ISO_ZULU_TIME.test(value);
}

export function isZuluISODateString(value: unknown): value is ZuluISODateString {
    return value != null && typeof value === 'string' && CLDR_ISO_ZULU_DATE.test(value);
}

export function isLocalISODateTimeString(value: unknown): value is LocalISODateTimeString {
    return value != null && typeof value === 'string' && CLDR_ISO_LOCAL_DATE_TIME.test(value);
}

export function isZuluISODateTimeString(value: unknown): value is ZuluISODateTimeString {
    return value != null && typeof value === 'string' && CLDR_ISO_ZULU_DATE_TIME.test(value);
}

export function isValidTypedDateTimeString(value: unknown): value is string {
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

export function isValidDateSource(source: Nullable<number | string | Date>): boolean {
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

export function isLocalISODateTimeType(type: ISODateTimeType) {
    return LocalISODateTimeTypes.includes(type);
}

export function supportsUTCOffsetISODateTimeType(type: ISODateTimeType) {
    return SupportsUTCOffsetISODateTimeTypes.includes(type);
}

const LocalISODateTimeTypes = [
    ISODateTimeType.LocalDate,
    ISODateTimeType.LocalTime,
    ISODateTimeType.LocalDateTime,
] satisfies ISODateTimeType[];

const SupportsUTCOffsetISODateTimeTypes = [
    ISODateTimeType.LocalTime,
    ISODateTimeType.LocalDateTime,
] satisfies ISODateTimeType[];
