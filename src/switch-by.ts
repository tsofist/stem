import type { EnumValue } from './enum';
import type { Rec } from './index';

/**
 * @example
 *  enum FValues { AN = 0, BN = 1, DS = 'D' }
 *  const translation1 = switchBy<FValues, string>(
 *    {
 *      [FValues.AN]: () => 'Value for AN',
 *      [FValues.BN]: 'Value for BN',
 *      [FValues.DS]: 'Value for DS',
 *    },
 *    FValues.DS,
 *  );
 *  // Value for DS
 */
export function switchBy<Enum extends EnumValue, R = unknown>(
    map: Rec<SwitchByExpr<R>, Enum>,
    value: Enum,
    fallbackValue: SwitchByFExpr<R>,
): R;

/**
 * @example
 *  enum FValues { AN = 0, BN = 1, DS = 'D' }
 *  const translation1 = switchBy<FValues, string>(
 *    {
 *      [FValues.AN]: () => 'Value for AN',
 *      [FValues.BN]: 'Value for BN',
 *      [FValues.DS]: 'Value for DS',
 *    },
 *    FValues.DS,
 *  );
 *  // Value for DS
 *
 *  const translation2 = switchBy<FValues, string>(
 *    {
 *      [FValues.AN]: () => 'Value for AN',
 *      [FValues.BN]: 'Value for BN',
 *      [FValues.DS]: 'Value for DS',
 *    },
 *    'missing' as FValues,
 *    '[ unknown ]',
 *  );
 *  // [ unknown ]
 */
export function switchBy<Enum extends EnumValue, R = unknown>(
    map: Rec<SwitchByExpr<R>, Enum>,
    value: Enum,
    fallbackValue?: SwitchByFExpr<R>,
): R | undefined;

export function switchBy<Enum extends EnumValue, R>(
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

type SwitchByExpr<T> = T | (() => T);
type SwitchByFExpr<T> = T | ((val: unknown) => T);

function switchByFallback(val: unknown): never {
    throw new Error(`No value for ${String(val)}`);
}
