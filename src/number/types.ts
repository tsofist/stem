/**
 * @asType number
 * @exclusiveMinimum 0
 */
export type PositiveFloat = number;

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
 * @asType integer
 * @minimum 1
 */
export type PositiveInt = number;

/**
 * @asType integer
 * @minimum 0
 */
export type NonNegativeInt = number;

/**
 * @asType integer
 * @maximum -1
 */
export type NegativeInt = number;

/**
 * @deprecated use {@link Float8}
 * @description 64-bit float (IEEE 754)
 *
 * References:
 *   - PostgreSQL: DOUBLE PRECISION
 *   - MySQL: DOUBLE PRECISION
 *   - SQLite: REAL
 *   - Oracle: BINARY_DOUBLE
 *   - MongoDB: double
 *   - Go: float64
 *   - Rust: f64
 *   - Python: float
 *   - C: double
 *   - C#: double
 *   - Java: double
 *   - Kotlin: Double
 *
 * @asType number
 * @minimum -1.7976931348623157e+308
 * @maximum 1.7976931348623157e+308
 */
export type Float = Float8;

/**
 * @description 64-bit float (IEEE 754)
 *
 * References:
 *   - PostgreSQL: DOUBLE PRECISION
 *   - MySQL: DOUBLE PRECISION
 *   - SQLite: REAL
 *   - Oracle: BINARY_DOUBLE
 *   - MongoDB: double
 *   - Go: float64
 *   - Rust: f64
 *   - Python: float
 *   - C: double
 *   - C#: double
 *   - Java: double
 *   - Kotlin: Double
 *
 * @asType number
 * @minimum -1.7976931348623157e+308
 * @maximum 1.7976931348623157e+308
 */
export type Float8 = number;
