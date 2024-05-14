/**
 * @asType number
 */
export type Float = number;

/**
 * @asType number
 * @minimum 0
 */
export type NonNegativeFloat = number;

/**
 * @asType number
 * @exclusiveMaximum 0
 */
export type NegativeFloat = number;

/**
 * @asType integer
 */
export type Int = number;

/**
 * @minimum 1
 */
export type PositiveInt = Int;

/**
 * @minimum 0
 */
export type NonNegativeInt = Int;

/**
 * @maximum -1
 */
export type NegativeInt = Int;
