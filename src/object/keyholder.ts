import type { DeepReadonlyObject, IsNever, IsTrue, PRec, Rec } from '../index';
import { keysOf } from './keys';

/**
 * Creates a keyholder from the given map object.
 *
 * @see writableKeyholderOf
 *
 * @example
 *   export type SomeImportantExtendableTypeA = {
 *       id?: number[];
 *       name?: string;
 *       skip?: number;
 *       limit?: number;
 *       orderBy?: string[];
 *   };
 *
 *   export type SomeImportantExtendableTypeB = {
 *       active?: boolean;
 *       writable?: boolean;
 *       description?: string;
 *   };
 *
 *   export const {
 *       //
 *       array: SomeImportantExtendableTypeAFieldList1,
 *   } = keyholderOf<SomeImportantExtendableTypeA>({
 *       id: true,
 *       name: true,
 *       skip: true,
 *       limit: true,
 *       orderBy: true,
 *   });
 *
 *   export const {
 *       //
 *       array: SomeImportantExtendableTypeAFieldList2,
 *   } = keyholderOf<SomeImportantExtendableTypeA & SomeImportantExtendableTypeB>({
 *       id: true,
 *       name: true,
 *       skip: true,
 *       limit: true,
 *       orderBy: true,
 *       active: true,
 *       writable: true,
 *       description: true,
 *       some: true, // <- error here as expected
 *   });
 *
 *   export const {
 *       //
 *       array: SomeImportantExtendableTypeAFieldList3,
 *   } = keyholderOf<SomeImportantExtendableTypeB>({
 *       active: true,
 *       writable: true,
 *       description: true,
 *       some: true, // <- error here as expected
 *   });
 */
export function keyholderOf<
    Source extends PRec<unknown, PropertyKey> = never,
    Struct extends Rec<unknown, keyof Source> = Rec<unknown, keyof Source>,
>(map: IsNever<Source, never, Struct>) {
    return writableKeyholderOf(map) as Keyholder<Source>;
}

/**
 * Creates a writable keyholder from the given map object.
 *
 * @see keyholderOf
 */
export function writableKeyholderOf<
    Source extends PRec<unknown, PropertyKey> = never,
    Struct extends Rec<unknown, keyof Source> = Rec<unknown, keyof Source>,
>(map: IsNever<Source, never, Struct>): WritableKeyholder<Source>;
export function writableKeyholderOf<
    Source extends PRec<any, PropertyKey>,
    Struct extends Rec<any, keyof Source>,
>(map: Struct): WritableKeyholder<Source> {
    type Key = keyof Source;

    const keys = keysOf(map) as Key[];
    let set: Set<Key>;

    return {
        [Symbol.iterator]() {
            return keys.values();
        },
        get set() {
            return (set ??= new Set(keys));
        },
        get array() {
            return keys;
        },
        get map() {
            return map;
        },
    };
}

/**
 * Readonly keyholder of the keys of Source.
 *
 * @see keyholderOf
 * @see writableKeyholderOf
 */
export type Keyholder<Source extends PRec<unknown, PropertyKey> = never> = InternalKeyHolder<
    true,
    Source
>;

/**
 * Writable keyholder of the keys of Source.
 *
 * @see keyholderOf
 * @see writableKeyholderOf
 */
export type WritableKeyholder<Source extends PRec<unknown, PropertyKey> = never> =
    InternalKeyHolder<false, Source>;

type InternalKeyHolder<
    RO extends boolean,
    T,
    Key extends keyof T = keyof T,
    Struct extends Rec<unknown, Key> = Rec<unknown, Key>,
> = Iterable<Key> & {
    /**
     * Set of keys of the struct.
     */
    readonly set: IsTrue<RO, ReadonlySet<Key>, Set<Key>>;
    /**
     * Array of keys of the struct.
     *
     * @uniqueItems
     * @readonly
     */
    readonly array: IsTrue<RO, ReadonlyArray<Key>, Key[]>;
    /**
     * Original struct.
     */
    readonly map: IsTrue<RO, DeepReadonlyObject<Struct>, Struct>;
};
