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
 * @see https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%BE%D0%BC%D0%B5%D0%B6%D1%83%D1%82%D0%BE%D0%BA_(%D0%BC%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0) Промежуток (RU)
 */
export type Interval<A, B = A> = [A, B];

/**
 * **[A, B]**
 *
 * Closed interval/Segment
 *
 * @example
 *   Строго A ≤ x ≤ B
 */
export type ClosedInterval<A, B = A> = Interval<A, B>;
/**
 * **(A, B)**
 *
 * Open interval
 *
 * @example
 *   Строго (A, B) = A < x < B
 */
export type OpenInterval<A, B = A> = Interval<A, B>;
/**
 * **(A, B]**
 *
 * Open on the left, closed on the right interval
 *
 * @example
 *   Строго (A, B] = A ≤ x < B
 */
export type LORCInterval<A, B = A> = Interval<A, B>;
/**
 * **[A, B)**
 *
 * Closed on the left, open on the right interval
 *
 * @example
 *   Строго [A, B) = A < x ≤ B
 */
export type LCROInterval<A, B = A> = Interval<A, B>;
