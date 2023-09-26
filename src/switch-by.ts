import { EnumValue } from './enum';
import { Rec } from './index';

type SwitchByExpr<T> = T | (() => T);
type SwitchByFExpr<T> = T | ((val: unknown) => T);

function switchByFallback(val: unknown): never {
    throw new Error(`No value for ${val}`);
}

/**
 * @example
 *  enum FValues {
 *    AN = 0,
 *    BN = 1,
 *    DS = 'D',
 *  }
 *  const translation = switchBy<FValues, string>(
 *    {
 *      [FValues.AN]: () => 'Value for AN',
 *      [FValues.BN]: 'Value for BN',
 *      [FValues.DS]: 'Value for DS',
 *    },
 *    FValues.DS,
 *  );
 *  console.log('Translation for FValues.DS', translation); // Value for DS
 */
export function switchBy<Enum extends EnumValue, R = void>(
    map: Rec<SwitchByExpr<R>, Enum>,
    value: Enum,
    fallbackValue: SwitchByFExpr<R>,
): R;
export function switchBy<Enum extends EnumValue, R = void>(
    map: Rec<SwitchByExpr<R>, Enum>,
    value: Enum,
    fallbackValue?: SwitchByFExpr<R>,
): R | undefined;
export function switchBy<Enum extends EnumValue, R = void>(
    map: Rec<SwitchByExpr<R>, Enum>,
    value: Enum,
    fallbackValue?: SwitchByFExpr<R>,
): R | undefined {
    const v = value in map ? map[value] : fallbackValue;
    if (typeof v === 'function') {
        if (v === fallbackValue) return (fallbackValue as (val: Enum) => R)(value);
        return (v as () => R)();
    }
    return v as R | undefined;
}

/**
 * @see switchBy
 */
export function strictSwitchBy<Enum extends EnumValue, R = void>(
    map: Rec<SwitchByExpr<R>, Enum>,
    value: Enum,
    fallbackValue: SwitchByFExpr<R> = switchByFallback,
) {
    return switchBy(map, value, fallbackValue);
}
