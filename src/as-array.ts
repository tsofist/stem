import { ArrayMay } from './index';

export function asArray<T>(value: T | [T]): [T];
export function asArray<T>(value: ArrayMay<T>): T[];
export function asArray<T>(value: ArrayMay<T>): T[] {
    return Array.isArray(value) ? value : [value];
}
