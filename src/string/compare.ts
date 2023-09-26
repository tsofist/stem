import { CompareResult } from '../index';

export function compareStringsAsc(a: string, b: string): CompareResult {
    return a === b ? 0 : a > b ? 1 : -1;
}

export function compareStringsDesc(a: string, b: string): CompareResult {
    return a === b ? 0 : a > b ? -1 : 1;
}
