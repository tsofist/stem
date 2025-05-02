import '@total-typescript/ts-reset';

/**
 * JS-primitive types
 * @see https://developer.mozilla.org/docs/Glossary/Primitive
 */
export type Primitive = undefined | null | boolean | number | string | symbol | bigint;
export type NonPrimitive = Exclude<object, Primitive>;
export type Nully = null | undefined;
export type Nullable<T> = T | null | undefined;

/** Returns IfNever if T is never, otherwise returns T or AltT */
export type IsNever<T, IfNever, AltT = T> = [T] extends [never] ? IfNever : AltT;

/** Returns never if T is never, otherwise returns T */
export type ExcludeNever<T> = T extends never ? never : T;

/** Merge all values from T without never-value members */
export type MergeNonNeverValues<T, R = ValuesOf<OmitByValueType<T, never>>> = {
    [K in keyof R]: R[K];
};

/**
 * Check if T is an empty object
 */
export type IsEmptyObject<T> = keyof T extends never ? true : false;

/**
 * Valid types of object keys
 * @deprecated use PropertyKey from standard library
 */
export type ObjectKey = string | number | symbol;

/**
 * @pattern .+
 */
export type NonEmptyString = string;

/**
 * @format uri
 *
 * @faker internet.url
 */
export type URIString = string;

/**
 * @pattern (https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})
 *
 * @faker internet.url
 */
export type URLString = string;

/**
 * @pattern ^\\/(?:[a-zA-Z0-9-._]+\\/)*[a-zA-Z0-9-._]*$
 */
export type URLAbsPathname = string;

/**
 * @pattern ^(?!\\/)(?:[a-zA-Z0-9-._]+\\/)*[a-zA-Z0-9-._]*$
 */
export type URLRelPathname = string;

/**
 * @pattern ^(\/?[a-zA-Z0-9_/-]*)(\?.*)?$
 *
 * @faker system.filePath
 */
export type URLPath = string;

/**
 * HTML href
 */
export type HRefString = URLString | URLPath;

/**
 * @pattern ^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$
 * @see https://en.wikipedia.org/wiki/Base64 Wikipedia
 */
export type Base64String = string;

/**
 * @format email
 * @see https://ajv.js.org/packages/ajv-formats.html formats
 *
 * @faker internet.email
 */
export type EmailString = string;

/**
 * @pattern ^https:\/\/t\.me\/
 */
export type TelegramLink = string;

/**
 * @pattern ^https:\/\/wa\.me\/
 */
export type WhatsAppLink = string;

/**
 * @pattern ^https?:\/\/(www\.)?(youtube\.com\/|youtu\.be\/)
 */
export type YouTubeLink = string;

/**
 * Hexadecimal string
 * @pattern ^([a-fA-F0-9]{2})+$
 * @faker { 'number.hex': [{ min: 0, max: 65535 }] }
 */
export type HexString = string;

export type Constructor<
    TInstance extends object,
    TConstructorParams extends any[] = any[],
> = ObjectConstructor & {
    new (...args: TConstructorParams): TInstance;
    prototype: TInstance;
};

export type VoidFunction = () => void;
export type AsyncFunction<R = void, Params extends Array<any> = Array<unknown>> = (
    ...args: Params
) => Promise<R>;

export type ArrayMay<TType = unknown> = TType | TType[];
export type ArrayValue<T> = T extends Array<infer U> ? U : T;
/** @minItems 1 */
export type NonEmptyArray<T> = T[];
/** @uniqueItems true */
export type UniqueItemsArray<T> = T[];
/**
 * @minItems 1
 * @uniqueItems true
 */
export type NonEmptyUniqueItemsArray<T> = T[];

export type PromiseMay<T = unknown> = T | Promise<T>;
export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

/**
 * Get String keys of T
 * Unlike keyof (which returns string|number|symbol),
 *   this type allows you to extract ONLY string keys of the passed type
 */
export type StringKeyOf<T> = T extends object ? Extract<keyof T, string> : never;

/**
 * Make K-keys of T required
 */
export type RequiredSome<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};

/**
 * Make K-keys of T optional
 */
export type PartialSome<T, K extends keyof T> = Omit<T, K> & {
    [P in K]?: T[P];
};

/**
 * Pick some items from T
 *
 * (for omitting items you can use just Exclude<A, B>)
 *
 * @example
 *   type L1 = 'a' | 'b' | 'c';
 *   type L1WithoutA = PickSome<L1, 'b' | 'c'>; // 'b' | 'c'
 */
export type PickStringLiteral<A extends string, B extends A> = B;

/**
 * Converts a string literal type into a template literal type.
 *
 * Ensures that the resulting type is treated as a `TemplateLiteralType`
 *   by the TypeScript Compiler, useful for working with template literals
 *   in advanced type scenarios.
 */
export type TemplateStringOf<T extends string> = `${T}`;

/**
 * Numeric string type
 */
export type NumericString<T extends number = number> = `${T}`;

/**
 * Pick all properties with values has a U-types
 */
export type PickByValueType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * Omit all properties with values has a U-types
 */
export type OmitByValueType<T, U> = {
    [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Reintroduces properties from type R into type T,
 *    replacing any properties in T that share the same name with those in R.
 * R can include additional properties that are not present in T.
 *
 * @example
 *   type A = { x: number; y: string };
 *   type B = { y: number; z: boolean };
 *   type C = Reintroduce<A, B>; // Result: { x: number; y: number; z: boolean }
 */
export type Reintroduce<T extends object, R extends object> = Omit<T, keyof R> & R;

/**
 * Reintroduces properties from type R into type T exactly,
 *    replacing any properties in T that share the same name with those in R.
 * R may only contain properties that exist in T, ensuring that no extra properties are included.
 *
 * @example
 *   type G = { x: number; y: string };
 *   type H = { y: number };
 *   type I = ReintroduceExact<G, H>; // Result: { x: number; y: number }
 */
export type ReintroduceExact<
    T extends object,
    R extends ShallowExact<PRec<any, keyof T>, R>,
> = Omit<T, keyof R> & R;

/**
 * Get all types from values of T
 */
export type ValuesOf<T, K extends keyof T = keyof T> = T[K];

/**
 * Get all types from values of T assignable to object keys
 */
export type SimpleValuesOf<T, K extends keyof T = keyof T> = Exclude<
    Extract<T[K], ObjectKey>,
    null | undefined
>;

/**
 * Weak-version (for supports "partial" Objects) of SimpleValuesOf
 * @see SimpleValuesOf
 */
export type WSimpleValuesOf<T, K extends keyof T = keyof T> = Exclude<
    Extract<T[K], ObjectKey | undefined | unknown>,
    null
>;

/**
 * Get all keys of T with values assignable to object keys
 */
export type SimpleValueKeysOf<T> = keyof PickByValueType<T, SimpleValuesOf<T>>;

/**
 * Get all keys of T with values assignable to object keys
 */
export type WSimpleValueKeysOf<T> = keyof PickByValueType<T, WSimpleValuesOf<T>>;

/**
 * Extract all fields from T without methods
 */
export type OmitMethods<T extends object> = Pick<
    T,
    { [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K }[keyof T]
>;

/**
 * Get all existing keys from T specified in K
 */
export type PickExistsKeys<T, K extends ObjectKey> = {
    [P in keyof T]: P extends K ? P : never;
}[keyof T];

/**
 * Get all existing fields from T specified in K
 */
export type PickExists<T, K extends ObjectKey> = Pick<T, PickExistsKeys<T, K>>;

/**
 * Extract all methods from T
 */
export type PickMethods<T extends object> = Pick<
    T,
    { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T]
>;

/**
 * Extract all fields from T with names starts with Prefix
 */
export type PickFieldsWithPrefix<T extends object, Prefix extends string> = {
    [K in keyof T as K extends `${Prefix}${string}` ? K : never]: T[K];
};

/**
 * Extract all fields from T with names starts with Prefix and drop Prefix from names
 */
export type PickExplicitFieldsWithPrefix<T extends object, Prefix extends string> = {
    [K in keyof T as K extends `${Prefix}${infer Rest}` ? Rest : never]: T[K];
};

/**
 * Drop readonly modifier from a target object
 */
export type DropReadonly<T extends object, K extends keyof T = keyof T> = {
    -readonly [P in K]: T[P];
};

/**
 * Deep-version of a Partial type
 * @see Partial
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export type DeepReadonlyObject<T> = {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
};

/**
 * Deep-version of Readonly type
 * @see Readonly
 */
export type DeepReadonly<T> = T extends Primitive
    ? T
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<K, V>
      : T extends Set<infer M>
        ? ReadonlySet<M>
        : DeepReadonlyObject<T>;

/**
 * Easy version of Record type
 *
 * @see Record
 * @example
 *   enum Names { Alice, Bob, Dylan }
 *
 *   const numbers: Rec<number> = { a: 1, b: 2, c: 3 };
 *
 *   const names: Rec<string, Names> = {
 *     [Names.Alice]: 'Some Last Name',
 *     [Names.Bob]: 'Some Last Name',
 *     [Names.Dylan]: 'Some Last Name',
 *   };
 */
export type Rec<V, K extends ObjectKey = string> = {
    [Key in K]: V;
};

/**
 * Any-version of Rec
 *
 * **BEWARE OF THIS TYPE OF ABUSE**
 * @see Rec
 */
export type ARec = Rec<any>;

/**
 * Unknown-version of Rec
 * @see Rec
 */
export type URec = Rec<unknown>;

/**
 * Partial keys version of Rec
 * @see Rec
 */
export type PRec<V, K extends ObjectKey = string> = {
    [Key in K]?: V;
};

/**
 * Object without any fields
 */
export type EmptyRec = Rec<never, ObjectKey>;

/**
 * Universal comparator result type
 */
export type CompareResult = -1 | 0 | 1;

/**
 * Type containing only elements present in both set T and set U.
 * This makes type U a subset of T or, in other words, narrows down set U to match set T.
 *
 * @see https://www.sandromaglione.com/articles/covariant-contravariant-and-invariant-in-typescript Covariant, Contravariant, and Invariant in Typescript
 * @see https://github.com/microsoft/TypeScript/pull/48240 Optional variance annotations
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/ TypeScript 4.7
 */
export type ShallowExact<T, U extends T = T> = {
    [Key in keyof U]: Key extends keyof T ? U[Key] : never;
};

/**
 * Deep version of ShallowExact
 *
 * @see ShallowExact
 */
export type DeepExact<T, U extends T = T> = {
    [Key in keyof U]: Key extends keyof T
        ? U[Key] extends object
            ? DeepExact<T[Key], U[Key]>
            : U[Key]
        : never;
};
