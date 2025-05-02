/**
 * Floating-point number.
 *
 * @see SafeFloat
 *
 * @asType number
 * @minimum -1.7976931348623157e+308
 * @maximum 1.7976931348623157e+308
 * @faker { 'number.float': [{ min: -10000, max: 10000 }] }
 */
export type Float = number;

/**
 * Positive floating-point number.
 *
 * @asType number
 * @exclusiveMinimum 0
 * @maximum 1.7976931348623157e+308
 * @faker { 'number.float': [{ min: 1, max: 10000 }] }
 */
export type PositiveFloat = number;

/**
 * Negative floating-point number.
 *
 * @asType number
 * @exclusiveMaximum 0
 * @minimum -1.7976931348623157e+308
 * @faker { 'number.float': [{ min: -10000, max: -1 }] }
 */
export type NegativeFloat = number;

/**
 * Non-negative floating-point number.
 *
 * @asType number
 * @minimum 0
 * @maximum 1.7976931348623157e+308
 * @faker { 'number.float': [{ min: 0, max: 10000 }] }
 */
export type NonNegativeFloat = number;
