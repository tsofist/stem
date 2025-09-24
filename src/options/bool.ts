/**
 * Resolve options with values like: T | boolean | undefined.
 *
 * @returns
 *   - `source` if it's neither `false` nor `undefined`;
 *   - `value` if provided and `source` is neither `false` nor `undefined`;
 *
 * @example
 *   type Options = {
 *       feature?: string | boolean | null;
 *   };
 *
 *   const opt1: Options = { feature: 'val' };
 *   const opt2: Options = { feature: true };
 *   const opt3: Options = { feature: false };
 *   const opt4: Options = { feature: undefined };
 *   const opt5: Options = {};
 *   const opt6: Options = { feature: null };
 *
 *   // Common usage:
 *   const r1_1 = ovBoolOrType(opt1.feature); // 'val'
 *   const r1_2 = ovBoolOrType(opt2.feature); // 'val'
 *   const r1_3 = ovBoolOrType(opt3.feature); // undefined
 *   const r1_4 = ovBoolOrType(opt4.feature); // undefined
 *   const r1_5 = ovBoolOrType(opt5.feature); // undefined
 *   const r1_6 = ovBoolOrType(opt6.feature); // null
 *
 *   const r2_1 = ovBoolOrType(opt1.feature, 'default'); // 'val'
 *   const r2_2 = ovBoolOrType(opt2.feature, 'default'); // 'default'
 *   const r2_3 = ovBoolOrType(opt3.feature, 'default'); // undefined
 *   const r2_4 = ovBoolOrType(opt4.feature, 'default'); // 'default'
 *   const r2_5 = ovBoolOrType(opt5.feature, 'default'); // 'default'
 *   const r2_6 = ovBoolOrType(opt6.feature, 'default'); // null
 *
 * @param source option source
 * @param value
 */
export function ovBoolOrType<T>(
    source: Source<T>,
    value?: T | ValueFn<SourceExact<T>, T>,
): T | undefined {
    const v = unwrap(source);
    if (v === false) return undefined;

    if (value !== undefined && typeof value === 'function') {
        value = (value as ValueFn<SourceExact<T>, T>)(v);
    }

    if (value === undefined) {
        if (v === true) return undefined;
        return v;
    }

    if (v === true) return value;
    if (v === null) return v;
    return v ?? value;
}

function unwrap<T, R>(source: T | ValueFn<T, R>, input: SourceExact<T>): R;
function unwrap<T>(value: Source<T>): SourceExact<T>;
function unwrap<T, R>(source: T | ValueFn<T, R>, input?: T): T {
    return typeof source === 'function' ? (source as (v?: T) => T)(input) : source;
}

type SourceExact<T> = T | boolean | undefined;
type SourceFn<T> = () => SourceExact<T>;
type Source<T> = SourceExact<T> | SourceFn<T>;

type ValueFn<T, R> = (value: SourceExact<T>) => R;
