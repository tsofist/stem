/**
 * String representation of an integer money value.
 *
 * Range: -9223372036854775808 – 9223372036854775807.
 *
 * References:
 *   - PostgreSQL: bigint
 *
 * @minLength 1
 * @maxLength 20
 * @pattern ^(0|[-]?[1-9][0-9]*)$
 * @faker { 'helpers.arrayElement': [[
 *   '0',
 *   '1',
 *   '-1',
 *   '9223372036854775807',
 *   '-9223372036854775808',
 *   '123456789',
 *   '-987654321',
 *   '1000000000000000000',
 *   '-1000000000000000000',
 *   '3141592653589793238'
 * ]] }
 */
export type SafeIntMoney = `${number}`;

/**
 * String representation of a floating point number with up to 2 decimal places.
 *
 * References:
 *   - PostgreSQL: usual numeric(12,2) or up to numeric(15,2)
 *
 * @minLength 1
 * @maxLength 17
 * @pattern ^-?((0|[1-9][0-9]{0,9}))(\.[0-9]{1,2})?$
 * @faker { 'helpers.arrayElement': [[
 *   '0.01',
 *   '100.00',
 *   '99999999.99',
 *   '12345678.90',
 *   '0.99',
 *   '500000.55',
 *   '42.42',
 *   '1.10',
 *   '999999.99',
 *   '123.45',
 *   '-100.00'
 * ]] }
 */
export type SafeMoney = `${number}`;

/**
 * String representation of a high precision floating point number with up to 18 decimal places.
 *
 * References:
 *   - PostgreSQL: usual numeric(30,18)
 *
 * @minLength 1
 * @maxLength 32
 * @pattern ^-?((0|[1-9][0-9]{0,9}))(\.[0-9])?$
 * @faker { 'helpers.arrayElement': [[
 *   '0.000000000000000001',
 *   '123456789.000000000123456789',
 *   '1.000000000000000000',
 *   '999999999999.999999999999999999',
 *   '0.123456789123456789',
 *   '500.000000000000000005',
 *   '314159265.358979323846264338',
 *   '0.000001000000000000',
 *   '987654321.123456789123456789',
 *   '100000000000.000000000000000001',
 *   '-100000000000.000000000000000001'
 * ]] }
 */
export type SafeHighPrecisionMoney = `${number}`;

/**
 * Positive string representation of a floating point number with up to 2 decimal places.
 *
 * References:
 *   - PostgreSQL: usual numeric(12,2) or up to numeric(15,2)
 *
 * @minLength 1
 * @maxLength 16
 * @pattern ^((0|[1-9][0-9]{0,9}))(\.[0-9]{1,2})?$
 * @faker { 'helpers.arrayElement': [[
 *   '0.01',
 *   '100.00',
 *   '99999999.99',
 *   '12345678.90',
 *   '0.99',
 *   '500000.55',
 *   '42.42',
 *   '1.10',
 *   '999999.99',
 *   '123.45'
 * ]] }
 */
export type SafePositiveMoney = `${number}`;

/**
 * Negative string representation of a floating point number with up to 2 decimal places.
 *
 * References:
 *   - PostgreSQL: usual numeric(12,2) or up to numeric(15,2)
 *
 * @minLength 1
 * @maxLength 17
 * @pattern ^-((0|[1-9][0-9]{0,9}))(\.[0-9]{1,2})?$
 * @faker { 'helpers.arrayElement': [[
 *   '-0.01',
 *   '-100.00',
 *   '-99999999.99',
 *   '-12345678.90',
 *   '-0.99',
 *   '-500000.55',
 *   '-42.42',
 *   '-1.10',
 *   '-999999.99',
 *   '-123.45'
 * ]] }
 */
export type SafeNegativeMoney = `${number}`;

/**
 * Non-negative string representation of a floating point number with up to 2 decimal places.
 *
 * References:
 *   - PostgreSQL: usual numeric(12,2) or up to numeric(15,2)
 *
 * @minLength 1
 * @maxLength 16
 * @pattern ^((0|[1-9][0-9]{0,9}))(\.[0-9]{1,2})?$
 * @faker { 'helpers.arrayElement': [[
 *   '0.00',
 *   '0.01',
 *   '100.00',
 *   '99999999.99',
 *   '12345678.90',
 *   '0.99',
 *   '500000.55',
 *   '42.42',
 *   '1.10',
 *   '999999.99',
 *   '123.45'
 * ]] }
 */
export type SafeNonNegativeMoney = `${number}`;
