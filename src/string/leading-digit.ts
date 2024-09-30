import { Nullable } from '../index';

export function startsWithDigit(value: Nullable<string>): boolean {
    if (value != null && value.length > 0) {
        const f = value.charCodeAt(0);
        return f >= 48 && f <= 57; // ASCII codes for '0' to '9'
    }
    return false;
}

export function startsWithNonDigit(value: Nullable<string>): boolean {
    return !startsWithDigit(value);
}
