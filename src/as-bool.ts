/**
 * Converting value to boolean type
 * In case of Nully result defaultValue will be used
 */
export function asBool(it: any, defaultValue = false): boolean {
    if (it == null) return defaultValue;
    switch (typeof it) {
        case 'boolean':
            return it;
        case 'number':
            return !isNaN(it) && it !== 0;
        case 'string':
            if (it.length === 1 || (it.length === 2 && it.charAt(0) === '-')) {
                if (!isNaN((it = parseInt(it)))) return it !== 0;
            } else if (it.length >= 4 && it.length <= 5) {
                if (it.toLowerCase() === 'true') return true;
                else if (it.toLowerCase() === 'false') return false;
            }
            return defaultValue;
        default:
            return defaultValue;
    }
}
