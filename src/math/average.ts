import { divide } from './index';

export function average(values: number[]): number;
export function average<T>(values: T[], selector?: (value: T) => number): number;
export function average<T>(values: T[], selector?: (value: T) => number): number {
    const len = values.length;
    if (!len) return 0;

    const hasSelector = selector != null;
    let sum = 0;
    for (const value of values) {
        sum += hasSelector ? selector(value) : (value as number);
    }

    return divide(sum, len);
}
