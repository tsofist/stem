/**
 * **(A, B) [A, B] (A, B] [A, B)**
 *
 * Interval
 * Can be open from any side
 * Can be infinite from any side (for this, it is enough to make Nullable<A>, Nullable<B>)
 *
 * @example
 *   (A, B) = A < x < B
 *   [A, B] = A ≤ x ≤ B
 *   (A, B] = A ≤ x < B
 *   [A, B) = A < x ≤ B
 *
 * @see https://en.wikipedia.org/wiki/Interval_(mathematics) Interval (EN)
 *
 * @minItems 2
 * @maxItems 2
 */
export type Interval<A, B = A> = [A, B];

/**
 * **[A, B]**
 *
 * Closed interval/Segment
 *
 * @example
 *   Strictly A ≤ x ≤ B
 */
export type ClosedInterval<A, B = A> = Interval<A, B>;
/**
 * **(A, B)**
 *
 * Open interval
 *
 * @example
 *   Strictly (A, B) = A < x < B
 */
export type OpenInterval<A, B = A> = Interval<A, B>;
/**
 * **(A, B]**
 *
 * Open on the left, closed on the right interval
 *
 * @example
 *   Strictly (A, B] = A ≤ x < B
 */
export type LORCInterval<A, B = A> = Interval<A, B>;
/**
 * **[A, B)**
 *
 * Closed on the left, open on the right interval
 *
 * @example
 *   Strictly [A, B) = A < x ≤ B
 */
export type LCROInterval<A, B = A> = Interval<A, B>;
