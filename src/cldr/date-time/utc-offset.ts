import { Nullable, NumericString } from '../../index';
import { Int } from '../../number/types';
import { CLDRRegExpGroups } from './constants';
import { UTCOffsetString } from './types';

export function minutesToUTCOffset(minutes: Int): UTCOffsetString {
    const sign = minutes >= 0 ? '+' : '-';
    minutes = Math.abs(minutes);

    const h = Math.floor(minutes / 60)
        .toString(10)
        .padStart(2, '0') as NumericString;
    const m = (minutes % 60).toString(10).padStart(2, '0') as NumericString;

    return `${sign}${h}:${m}`;
}

export function utcOffsetToMinutes(offset: UTCOffsetString): Int {
    const sign = offset[0] === '+' ? 1 : -1;
    const [h, m] = offset.slice(1).split(':').map(Number);
    return sign * (h * 60 + m);
}

export function parseUTCOffset(value: Nullable<string>): UTCOffsetString | undefined {
    if (value) {
        if (value.endsWith('Z')) return '+00:00';
        const match = RE_TZ_OFFSET.exec(value);
        if (match) return match[1] as UTCOffsetString;
    }
    return undefined;
}

export function applyUTCOffset(value: string, offset: '' | 'Z' | UTCOffsetString): string {
    // 2020-01-01T00:00:00+03:00
    // 2024-07-23T23:00:00Z
    // 2024-07-23
    // 23:00:00
    // 23:00:00Z
    // 00:00:00+03:00
    // 00:00:00-06:00
    // 2020-01-01T00:00:00
    // 2020-01-01T00:00:00.999
    // 2020-01-01T00:00:00.000+03:00
    return RE_TZ_ASSIGNABLE.test(value)
        ? `${value}${offset}`
        : value.replace(RE_TZ_REPLACE, `$1${offset}`);
}

const RE_TZ_OFFSET = new RegExp(`^\\d{2,4}.*${CLDRRegExpGroups.UTCOffset}$`);
const RE_TZ_REPLACE = /^(.*)((Z)|([+|-]\d{2}:\d{2}))$/;
const RE_TZ_ASSIGNABLE = new RegExp(`^(${CLDRRegExpGroups.Date}T)?${CLDRRegExpGroups.Time}$`);
