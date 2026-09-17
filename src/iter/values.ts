import { emptyIterableIterator } from '../empty-iterator';
import type { ARec, IterableStruct, Nullable } from '../index';
import { charactersIteratorOf } from '../string/iterator';
import type { ValuesIteratorOf } from './types';

export function valuesIteratorOf<T extends IterableStruct>(
    target: Nullable<T>,
): ValuesIteratorOf<T>;

export function valuesIteratorOf(target: unknown): ValuesIteratorOf<any> {
    let result: IterableIterator<unknown> | undefined;

    if (target) {
        switch (typeof target) {
            case 'object':
                if (target instanceof Map || target instanceof Set || Array.isArray(target)) {
                    result = target.values();
                } else {
                    result = values(target);
                }
                break;

            case 'string':
                result = charactersIteratorOf(target);
                break;

            case 'function':
                result = values(target);
                break;
        }
    }

    return result ?? emptyIterableIterator();
}

function* values(target: ARec) {
    for (const name in target) {
        if (Object.prototype.hasOwnProperty.call(target, name)) {
            yield target[name];
        }
    }
}
