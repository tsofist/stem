import type { DeepReadonly, PRec, Rec } from '../index';
import { entries } from './entries';

/**
 * Remap object values
 */
export function remap<V extends RemapValues, M extends RemapMap<V>>(map: M, values: V): Remap<M, V>;
/**
 * Remap object values
 */
export function remap<V extends RemapValues, R>(
    map: (values: DeepReadonly<V>, format: RemapRootFormatter<V>) => R,
    values: V,
): R;
export function remap<V extends RemapValues, M extends RemapMap<V>, R>(
    map: RemapMap<M> | ((values: V, format: RemapRootFormatter<V>) => R),
    values: V,
) {
    if (typeof map === 'function') {
        const formatter: RemapRootFormatter<V> = (key, fmt) => {
            const raw = values[key];
            return fmt(raw);
        };

        return map(values, formatter);
    } else {
        const result: Rec<unknown, RemapMapKey> = {};
        for (const [key, item] of entries(map)) {
            if (!item) continue;
            const itemType = typeof item;

            if (itemType === 'string' || itemType === 'symbol') {
                result[key] = values[item as string];
            } else if (itemType === 'function') {
                result[key] = (item as RemapFormater<any, any>)(values);
            } else if (itemType === 'object') {
                result[key] = remap(item as Remap<any, any>, values);
            }
        }
        return result;
    }
}

export type Remap<M extends RemapMap<V>, V extends RemapValues> = {
    readonly [K in keyof M]: M[K] extends string
        ? V[M[K]]
        : M[K] extends (...args: unknown[]) => unknown
          ? M[K] extends RemapFormater<V, infer R>
              ? R
              : never
          : M[K] extends RemapMap<V>
            ? Remap<M[K], V>
            : never;
};

export type RemapValues = PRec<unknown, string | symbol>;
export type RemapMap<V extends RemapValues> = Rec<RemapMapItem<V>, RemapMapKey>;

type RemapMapKey = string | symbol;
type RemapMapItem<V extends RemapValues> =
    | RemapFormater<V, unknown>
    | keyof V
    | { [K in RemapMapKey]: RemapMapItem<V> };

type RemapFormater<V, R> = (v: DeepReadonly<V>) => R;
type RemapRootFormatter<V extends RemapValues> = <K extends keyof V, R>(
    key: K,
    formatter: (raw: V[K]) => R,
) => R;
