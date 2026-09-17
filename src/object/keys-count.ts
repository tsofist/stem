import type { IterableStruct, Nullable } from '../index';
import { keysIteratorOf } from '../iter/keys';
import type { PositiveInt } from '../number/integer/types';

export function keysCountOf<T extends IterableStruct>(
    target: Nullable<T>,
    limit: PositiveInt = Infinity,
): PositiveInt {
    if (target instanceof Map || target instanceof Set) {
        return target.size;
    }

    let result = 0;

    for (const _ of keysIteratorOf(target)) {
        result++;
        if (result >= limit) {
            break;
        }
    }

    return result;
}
