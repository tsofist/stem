import type { PRec, Rec, StringKeyOf, URec } from '../index';

/**
 * Remap object values based on a mapping definition.
 */
export function remap<V extends PRec<unknown>, M extends RemapMap<V>>(
    map: M | ((formatter: RemapFormatWrapper<V>) => M),
    values: V,
): Remap<M, V> {
    type MK = StringKeyOf<M>;
    const result: URec = {};

    if (typeof map === 'function') {
        map = map(createFormatter(values));
    }

    for (const [mK, vK] of Object.entries(map) as [MK, RemapMapItem<V>][]) {
        switch (typeof vK) {
            case 'string':
                result[mK] = values[vK];
                break;
            case 'function':
                result[mK] = vK();
                break;
            default:
                result[mK] = vK;
        }
    }

    return result as Remap<M, V>;
}

export type Remap<M extends RemapMap<V>, V extends PRec<unknown>> = {
    readonly [K in keyof M]: M[K] extends string
        ? V[M[K]]
        : M[K] extends RemapFormatWrapperLike<keyof M, infer R>
          ? R
          : M[K];
};

function createFormatter<V extends PRec<unknown>>(values: V): RemapFormatWrapper<V> {
    return function format(key: string, fmt: (v: unknown) => unknown) {
        return () => {
            const raw = values[key];
            return fmt(raw);
        };
    } as RemapFormatWrapper<V>;
}

type RemapFormatWrapper<V extends PRec<unknown>> = <
    K extends keyof V,
    F extends (v: V[K]) => unknown,
>(
    key: keyof V,
    fmt: F,
) => typeof fmt extends (v: V[typeof key]) => infer R ? RemapFormater<R> : never;

type RemapFormatWrapperLike<K extends PropertyKey, R> = (key: K, formatter: RemapFormater<R>) => R;
type RemapFormater<R> = () => R;
type RemapMapItem<V extends PRec<unknown>> = RemapFormater<V> | object | keyof V;
type RemapMap<V extends PRec<unknown>> = Rec<RemapMapItem<V>>;
