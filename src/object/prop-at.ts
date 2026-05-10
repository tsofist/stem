import type { ARec, ExtractPropertyPaths, ExtractPropertyTypeByPath } from '../index';

/**
 * Returns the value at the specified property path of the source object,
 *   or the fallback value if the path does not exist or value is Nully.
 *
 * @example
 * ```ts
 *   const obj = { a: { b: { c: 42 } } };
 *   propAt(obj, 'a.b.x', 'default'); // returns 'default'
 *   propAt(obj, 'a.b.x', () => 'from factory'); // returns 'from factory'
 * ```
 *
 * @see Nully
 */
export function propAt<
    Target extends ARec,
    PropertyPath extends ExtractPropertyPaths<Target>,
    FallbackValue,
>(
    source: Target,
    propertyPath: PropertyPath,
    fallbackValue: FallbackValueOrFactory<FallbackValue>,
): ExtractPropertyTypeByPath<Target, PropertyPath> | FallbackValue;

/**
 * Returns the value at the specified property path of the source object,
 *   or `undefined` if the path does not exist or value is Nully.
 *
 * @example
 * ```ts
 *   const obj = { a: { b: { c: 42 } } };
 *   propAt(obj, 'a.b.c'); // returns 42
 *   propAt(obj, 'a.b.x'); // returns undefined
 * ```
 *
 * @see Nully
 */
export function propAt<Target extends ARec, PropertyPath extends ExtractPropertyPaths<Target>>(
    source: Target,
    propertyPath: PropertyPath,
): ExtractPropertyTypeByPath<Target, PropertyPath> | undefined;

export function propAt<
    Target extends ARec,
    PropertyPath extends ExtractPropertyPaths<Target>,
    FallbackValue,
>(
    source: Target,
    propertyPath: PropertyPath,
    fallbackValue?: FallbackValueOrFactory<FallbackValue>,
) {
    const parts = propertyPath.split('.');

    const node = parts.reduce<ARec | undefined>((current, name) => {
        const valid = current != null && typeof current === 'object' && name in current;
        return valid ? (current[name] as ARec) : undefined;
    }, source);

    return (
        node ??
        (typeof fallbackValue === 'function'
            ? (fallbackValue as () => FallbackValue)()
            : fallbackValue)
    );
}

type FallbackValueOrFactory<T> = T | (() => T);
