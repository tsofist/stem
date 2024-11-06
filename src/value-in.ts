import { ARec, ArrayMay, Nullable, PRec, Primitive } from './index';

/**
 * Value in Enumeration checker
 * @param value
 * @param enumeration
 * @param field value container field name
 *
 * @example
 *      valueIn(1, [0, 1, 3]); // true
 *      valueIn('B', { A: true, B: true, C: true }); // true
 *      valueIn('two', { 0: 'zero', 1: 'one', 2: 'two' }); // false
 *      valueIn(1, [{ value: 1, other: 1 }, { value: 2, other: 1 }], 'value'); // true
 */
export function valueIn(value: any, enumeration: Nullable<any[]>, field?: PropertyKey): boolean;
/**
 * Value in Enumeration checker
 * @param value
 * @param enumeration
 * @param byValue find Value in object values (when true) or in object keys (when undefined)
 *
 * @example
 *      valueIn('two', { 0: 'zero', 1: 'one', 2: 'two' }, true); // true
 *
 *      enum Test { A = 'a', B = 'b' }
 *
 *      valueIn(Test.A, Test, true); // true
 *      valueIn('a', Test, true); // true
 */
export function valueIn(value: any, enumeration: Nullable<ARec>, byValue?: true): boolean;
export function valueIn(
    value: Primitive | PropertyKey,
    enumeration: Nullable<ArrayMay<PRec<any, PropertyKey>> | (typeof value)[]>,
    fieldOrByValue?: PropertyKey | true,
): boolean {
    if (enumeration) {
        if (Array.isArray(enumeration)) {
            // find by whole value
            if (fieldOrByValue === undefined || fieldOrByValue === true) {
                return enumeration.includes(value);
            }
            // find by field value
            for (const item of enumeration) {
                // @ts-expect-error It's OK
                if (value === item[fieldOrByValue]) return true;
            }
        } else if (fieldOrByValue) {
            for (const v of Object.values(enumeration)) {
                if (value === v) return true;
            }
        } else {
            return (value as PropertyKey) in enumeration;
        }
    }
    return false;
}
