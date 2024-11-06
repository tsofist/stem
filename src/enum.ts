import { startsWithNonDigit } from './string/leading-digit';
import { Nullable, URec } from './index';

export type EnumType = object;
export type EnumValue = string | number;

/**
 * Get keys of Enum type
 *
 * @example
 * enum Alpha { A, B, C}
 *
 * type AlphaKey = EnumKeys<typeof Alpha>; // "A" | "B" | "C"
 * const alphaKey1: AlphaKey = 'A'; // OK
 * const alphaKey2: AlphaKey = 'D'; // ERROR
 */
export type EnumKeys<TypeOfEnum extends EnumType> = keyof TypeOfEnum;

/**
 * Get values of Enum type
 *
 * @example
 * enum Alpha { A, B, C}
 *
 * type AlphaValues = EnumValues<typeof Alpha>; // 0 | 1 | 2
 * const alphaValue1: AlphaValues = 0; // OK
 * const alphaValue11: AlphaValues = Alpha.C; // OK
 * const alphaValue2: AlphaValues = 3; // ERROR
 *
 * enum Alpha2 { A = 'A', B = 'B', C = 'C'}
 *
 * type Alpha2Values = EnumValues<typeof Alpha2>; // "A" | "B" | "C"
 * const alpha2Value1: Alpha2Values = 'A'; // OK
 * const alpha2Value11: Alpha2Values = Alpha2.B // OK
 * const alpha2Value2: Alpha2Values = 'D'; // ERROR
 */
export type EnumValues<T extends EnumType, K extends keyof T = keyof T> = T[K] extends string
    ? `${T[K]}`
    : T[K];

/**
 * Extract keys of Enums
 * This is complicated. This is works with all types of Enums with physical representation:
 *   Numerics/Strings/Heterogeneous/Computed.
 *
 * **Warn**: Enums without physical representation (const enums w/o --preserveConstEnums compiler option) will not be recognized
 *   (compiler to warn you about this).
 * @see https://www.typescriptlang.org/docs/handbook/enums.html TS>Enums
 * @see https://www.typescriptlang.org/docs/handbook/compiler-options.html TSConfig
 */
export function extractEnumKeys<Enum extends EnumType>(value: Enum): (keyof Enum)[] {
    let nCount = 0;
    const strings: string[] = [];
    const keys = Object.keys(value);
    for (const item of keys) {
        // @ts-expect-error It's OK
        const v = value[item] as string | number;
        if (typeof v === 'number') nCount++;
        else strings.push(v);
    }
    let result: string[];
    if (nCount === 0) {
        result = keys;
    } else if (nCount !== strings.length) {
        result = keys.filter(startsWithNonDigit);
    } else {
        result = strings;
    }
    // @ts-expect-error It's OK
    return result.sort();
}

/**
 * Extract values of Enums
 *
 * Works with any types of Enums with physical representations - Numerics/Strings/Heterogeneous/Computed
 * @see https://www.typescriptlang.org/docs/handbook/enums.html TS>Enums
 * @see https://www.typescriptlang.org/docs/handbook/compiler-options.html TSConfig
 */
export function extractEnumValues<Enum extends EnumType>(value: Enum): Enum[keyof Enum][] {
    return extractEnumKeys(value).map((item) => value[item]);
}

/**
 * Extract Enum key by his value
 */
export function enumKeyByValue<T extends EnumType>(
    container: T,
    value: EnumValue,
): EnumKeys<T> | undefined {
    for (const [key, v] of Object.entries(container)) {
        if (v === value) return key as EnumKeys<T>;
    }
    return undefined;
}

/**
 * Extract enum Value by enum Key
 * @param container target enum
 * @param key enum key
 * @param fallbackValue value used for unknown keys
 */
export function enumValueByKey<T extends EnumType, K extends EnumKeys<T>>(
    container: T,
    key: Nullable<string>,
    fallbackValue?: T[K],
): T[K] | undefined {
    if (key == null) return fallbackValue;
    // @ts-expect-error It's OK
    return (container as URec)[key] ?? fallbackValue;
}
