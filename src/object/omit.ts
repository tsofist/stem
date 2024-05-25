import { ObjectKey } from '../index.js';

/**
 * Remove specified properties from the target object
 *
 * **Important: always creates a shallow copy of the target object, and it is used as the result!**
 */
export function omitProps<T, Field extends ObjectKey>(target: T, fields: Field[]): Omit<T, Field> {
    return cutProps({ ...target }, fields);
}

/**
 * Remove specified properties from the target object
 *
 * **Important: this is a mutating method!**
 */
export function cutProps<T, Field extends ObjectKey>(target: T, fields: Field[]): Omit<T, Field> {
    for (const field of fields) {
        // @ts-expect-error It's OK
        delete target[field];
    }

    return target;
}
