import { divide, multiply } from './arith';

export function quartile(values: number[], percentile: number): number;
export function quartile<T>(
    values: T[],
    percentile: number,
    selector?: (value: T) => number,
): number;
export function quartile<T>(
    values: T[],
    percentile: number,
    selector?: (value: T) => number,
): number | undefined {
    const len = values.length;
    if (!len || percentile > 100 || percentile < 0) return undefined;

    percentile = divide(percentile, 100);
    const hasSelector = selector != null;
    const v: number[] = values
        .map((value) => (hasSelector ? selector(value) : (value as number)))
        .sort((a, b) => {
            return a === b ? 0 : a > b ? 1 : -1;
        });

    const p = multiply(len - 1, percentile);
    const b = Math.floor(p);
    const remainder = p - b;

    if (v[b + 1] !== undefined) {
        return v[b] + remainder * (v[b + 1] - v[b]);
    } else {
        return v[b];
    }
}
