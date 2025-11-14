/**
 * Converting value to boolean type.
 * In case of Nully result defaultValue will be used.
 */
export function asBool(it: unknown, defaultValue = false): boolean {
    if (it == null) return defaultValue;

    switch (typeof it) {
        case 'boolean':
            return it;
        case 'number':
            return !isNaN(it) && it !== 0;
        case 'string': {
            const v = it.toLowerCase();
            if (v in BooleanLikeStringValues) {
                return BooleanLikeStringValues[v as BooleanLikeStringValue];
            }
            return defaultValue;
        }

        default:
            return defaultValue;
    }
}

/**
 * Checks whether the given value is a string representing a boolean-like value.
 * @see BooleanLikeStringValue
 * @see BooleanLikeStringValues
 */
export function isBooleanLikeString(it: unknown): it is BooleanLikeStringValue {
    return typeof it === 'string' && it.toLowerCase() in BooleanLikeStringValues;
}

export type BooleanLikeStringValue = keyof typeof BooleanLikeStringValues;

const BooleanLikeStringValues = {
    '0': false,
    '1': true,
    '-1': true,
    'no': false,
    'yes': true,
    'true': true,
    'false': false,
} as const;
