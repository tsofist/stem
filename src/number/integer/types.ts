/**
 * Integer value.
 *
 * References:
 *   - PostgreSQL: less than bigint and greater than integer (without NaN and +/- Infinity)
 *
 * @see https://www.postgresql.org/docs/current/datatype-numeric.html PostgreSQL Numeric Types
 * @see https://www.postgresql.org/docs/7.4/datatype.html PostgreSQL Data Types
 *
 * @asType integer
 * @minimum -9007199254740991
 * @maximum 9007199254740991
 * @faker { 'number.int': [{ min: -9007199254740991, max: 9007199254740991 }] }
 */
export type Int = number;

/**
 * Positive integer value.
 *
 * @see Int
 *
 * @asType integer
 * @minimum 1
 * @maximum 9007199254740991
 * @faker { 'number.int': [{ min: 1, max: 10000 }] }
 */
export type PositiveInt = number;

/**
 * Negative integer value.
 *
 * @see Int
 *
 * @asType integer
 * @maximum -1
 * @minimum -9007199254740991
 * @faker { 'number.int': [{ min: -10000, max: -1 }] }
 */
export type NegativeInt = number;

/**
 * Non-negative integer value.
 *
 * @see Int
 *
 * @asType integer
 * @minimum 0
 * @maximum 9007199254740991
 * @faker { 'number.int': [{ min: 0, max: 10000 }] }
 */
export type NonNegativeInt = number;
