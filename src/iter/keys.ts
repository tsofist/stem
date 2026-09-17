import { emptyIterableIterator } from '../empty-iterator';
import type { IterableStruct, Nullable } from '../index';
import { charactersPosIteratorOf } from '../string/iterator';
import type { KeysIteratorOf } from './types';

export function keysIteratorOf<T extends IterableStruct>(target: Nullable<T>): KeysIteratorOf<T>;

export function keysIteratorOf(target: unknown): KeysIteratorOf<any> {
    let result: IterableIterator<unknown> | undefined;

    if (target) {
        switch (typeof target) {
            case 'object':
                if (target instanceof Map || target instanceof Set || Array.isArray(target)) {
                    result = target.keys();
                } else {
                    result = keys(target);
                }
                break;

            case 'string':
                result = charactersPosIteratorOf(target);
                break;

            case 'function':
                result = keys(target);
                break;
        }
    }

    return result ?? emptyIterableIterator();
}

function* keys(target: object) {
    for (const name in target) {
        if (Object.prototype.hasOwnProperty.call(target, name)) {
            yield name;
        }
    }
}
