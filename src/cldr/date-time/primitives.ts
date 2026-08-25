import { multiply } from '../../math/arith';
import type { Int } from '../../number/integer/types';
import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_WEEK } from './constants';

/**
 * Seconds to milliseconds
 */
export function seconds(num: number): Int {
    return multiply(num, 1_000);
}

/**
 * Days to milliseconds
 */
export function days(num: number): Int {
    return multiply(num, ONE_DAY);
}

/**
 * Minutes to milliseconds
 */
export function minutes(num: number): Int {
    return multiply(num, ONE_MINUTE);
}

/**
 * Hours to milliseconds
 */
export function hours(num: number): Int {
    return multiply(num, ONE_HOUR);
}

/**
 * Weeks to milliseconds
 */
export function weeks(num: number): Int {
    return multiply(num, ONE_WEEK);
}
