/**
 * Integer compatibility type.
 *
 * References:
 *   - PostgreSQL: integer
 *
 * @asType integer
 * @minimum -2147483648
 * @maximum 2147483647
 * @faker { 'number.int': [{ min: -2147483647, max: 2147483648 }] }
 */
export type CInt = number;

/**
 * Positive integer compatibility type.
 *
 * References:
 *   - PostgreSQL: integer
 *
 * @asType integer
 * @minimum 1
 * @maximum 2147483647
 * @faker { 'number.int': [{ min: 1, max: 2147483647 }] }
 */
export type CPositiveInt = number;

/**
 * Negative integer compatibility type.
 *
 * References:
 *   - PostgreSQL: integer
 *
 * @asType integer
 * @minimum -2147483648
 * @maximum -1
 * @faker { 'number.int': [{ min: -2147483648, max: -1 }] }
 */
export type CNegativeInt = number;

/**
 * Non-negative integer compatibility type.
 *
 * References:
 *   - PostgreSQL: integer
 *
 * @asType integer
 * @minimum 0
 * @maximum 2147483647
 * @faker { 'number.int': [{ min: 0, max: 2147483647 }] }
 */
export type CNonNegativeInt = number;

/**
 * Small integer compatibility type.
 *
 * References:
 *   - PostgreSQL: smallint
 *
 * @asType integer
 * @minimum -32768
 * @maximum 32767
 * @faker { 'number.int': [{ min: -32768, max: 32767 }] }
 */
export type CSInt = number;

/**
 * Positive small integer compatibility type.
 *
 * References:
 *   - PostgreSQL: smallint
 *
 * @asType integer
 * @minimum 1
 * @maximum 32767
 * @faker { 'number.int': [{ min: 1, max: 32767 }] }
 */
export type CSPositiveInt = number;

/**
 * Negative small integer compatibility type.
 *
 * References:
 *   - PostgreSQL: smallint
 *
 * @asType integer
 * @minimum -32768
 * @maximum -1
 * @faker { 'number.int': [{ min: -32768, max: -1 }] }
 */
export type CSNegativeInt = number;

/**
 * Non-negative small integer compatibility type.
 *
 * References:
 *   - PostgreSQL: smallint
 *
 * @asType integer
 * @minimum 0
 * @maximum 32767
 * @faker { 'number.int': [{ min: 0, max: 32767 }] }
 */
export type CSNonNegativeInt = number;

/**
 * Big integer compatibility type.
 *
 * References:
 *   - PostgreSQL: bigint
 *
 * @asType integer
 * @minimum -9223372036854775808
 * @maximum 9223372036854775807
 * @faker { 'number.int': [{ min: -9223372036854775808, max: 9223372036854775807 }] }
 */
export type CBigInt = number;

/**
 * Positive big integer compatibility type.
 *
 * References:
 *   - PostgreSQL: bigint
 *
 * @asType integer
 * @minimum 1
 * @maximum 9223372036854775807
 * @faker { 'number.int': [{ min: 1, max: 9223372036854775807 }] }
 */
export type CPositiveBigInt = number;

/**
 * Negative big integer compatibility type.
 *
 * References:
 *   - PostgreSQL: bigint
 *
 * @asType integer
 * @minimum -9223372036854775808
 * @maximum -1
 * @faker { 'number.int': [{ min: -9223372036854775808, max: -1 }] }
 */
export type CNegativeBigInt = number;

/**
 * Non-negative big integer compatibility type.
 *
 * References:
 *   - PostgreSQL: bigint
 *
 * @asType integer
 * @minimum 0
 * @maximum 9223372036854775807
 * @faker { 'number.int': [{ min: 0, max: 9223372036854775807 }] }
 */
export type CNonNegativeBigInt = number;
