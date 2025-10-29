import type { Nullable } from '../index';

export function clampNum(value: Nullable<number>, min: number, def: number): number;
export function clampNum(value: Nullable<number>, min: number, def?: number): number | undefined;
export function clampNum(value: Nullable<number>, bound: MinMax, def: number): number;
export function clampNum(value: Nullable<number>, bound: MinMax, def?: number): number | undefined;
export function clampNum(value: Nullable<number>, bound: number | MinMax, def?: number) {
    let nan = Number.isNaN(value);

    if ((nan || value == null) && def != null) {
        value = def;
        nan = Number.isNaN(value);
    }

    if (nan || value == null) {
        return undefined;
    }

    const range: [min?: number, max?: number] = Array.isArray(bound) ? bound : [bound, undefined];
    const [min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER] = range;

    return Math.min(Math.max(value, min), max);
}

type MinMax = [min?: number, max?: number];
