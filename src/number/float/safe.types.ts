/**
 * Safe exact floating-point number.
 *
 * References:
 *   - PostgreSQL: float8, double precision, numeric(30,18)
 *
 * @see Float
 * @see https://www.postgresql.org/docs/current/datatype-numeric.html PostgreSQL Numeric Types
 * @see https://www.postgresql.org/docs/7.4/datatype.html PostgreSQL Data Types
 * @see https://mikemcl.github.io/big.js/ big.js
 *
 * @minLength 1
 * @maxLength 32
 * @faker { 'helpers.arrayElement': [[
 *     '-0.3',
 *     '0.3',
 *     '0',
 *     '-0.00000000000001',
 *     '0.00000000000001',
 *     '-1.23456789012345',
 *     '1.23456789012345',
 *     '-12345678.9012345',
 *     '12345678.9012345',
 *     '-0.0001234567890123',
 *     '0.0001234567890123',
 *     '-999999999999999.0',
 *     '999999999999999.0',
 *     '-42.00000000000001',
 *     '42.00000000000001',
 *     '-3141592.65358979',
 *     '3141592.65358979',
 *     '-2718281.82845904',
 *     '2718281.82845904',
 *     '-3.1415926535897931',
 *     '3.1415926535897931'
 * ]] }
 */
export type SafeFloat = `${number}`;

/**
 * Safe positive floating-point number.
 *
 * References:
 *   - PostgreSQL: float8, double precision, numeric(30,18)
 *
 * @see SafeFloat
 * @see Float
 * @see https://www.postgresql.org/docs/current/datatype-numeric.html PostgreSQL Numeric Types
 * @see https://www.postgresql.org/docs/7.4/datatype.html PostgreSQL Data Types
 *
 * @minLength 1
 * @maxLength 31
 * @faker { 'helpers.arrayElement': [[
 *     '1',
 *     '0.3',
 *     '1.23456789012345',
 *     '12345678.9012345',
 *     '0.0001234567890123',
 *     '999999999999999.0',
 *     '42.00000000000001',
 *     '3141592.65358979',
 *     '2718281.82845904',
 *     '3.1415926535897931'
 * ]] }
 */
export type PositiveSafeFloat = `${number}`;

/**
 * Safe negative floating-point number.
 *
 * References:
 *   - PostgreSQL: float8, double precision, numeric(30,18)
 *
 * @see SafeFloat
 * @see Float
 * @see https://www.postgresql.org/docs/current/datatype-numeric.html PostgreSQL Numeric Types
 * @see https://www.postgresql.org/docs/7.4/datatype.html PostgreSQL Data Types
 *
 * @minLength 1
 * @maxLength 31
 * @faker { 'helpers.arrayElement': [[
 *     '-1',
 *     '-0.3',
 *     '-1.23456789012345',
 *     '-12345678.9012345',
 *     '-0.0001234567890123',
 *     '-999999999999999.0',
 *     '-42.00000000000001',
 *     '-3141592.65358979',
 *     '-2718281.82845904',
 *     '-3.1415926535897931'
 * ]] }
 */
export type NegativeSafeFloat = `${number}`;

/**
 * Safe non-negative floating-point number.
 *
 * References:
 *   - PostgreSQL: float8, double precision, numeric(30,18)
 *
 * @see SafeFloat
 * @see Float
 * @see https://www.postgresql.org/docs/current/datatype-numeric.html PostgreSQL Numeric Types
 * @see https://www.postgresql.org/docs/7.4/datatype.html PostgreSQL Data Types
 *
 * @minLength 1
 * @maxLength 31
 * @faker { 'helpers.arrayElement': [[
 *     '0',
 *     '1',
 *     '0.3',
 *     '1.23456789012345',
 *     '12345678.9012345',
 *     '0.0001234567890123',
 *     '999999999999999.0',
 *     '42.00000000000001',
 *     '3141592.65358979',
 *     '2718281.82845904',
 *     '3.1415926535897931'
 * ]] }
 */
export type NonNegativeSafeFloat = `${number}`;
