/**
 * Converts any value to number.
 *
 * Returns `defaultValue` if value is nullable
 * Returns `nanValue` if result value is not a number
 */
export function asNum(it: any, defaultValue = 0, nanValue = 0): number {
    if (it == null) return defaultValue;
    switch (typeof it) {
        case 'boolean':
            return it ? 1 : 0;
        case 'number':
            return isNaN(it) ? nanValue : it;
        default: {
            const v = parseFloat(String(it));
            return isNaN(v) ? nanValue : v;
        }
    }
}
