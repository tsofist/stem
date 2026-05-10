import type { Gettable, Nullable, PRec } from '../index';
import { isGettable } from '../is-gettable';
import { isNonNully } from '../nully';

/**
 * Returns the first value from the specified props of the target that satisfies
 *   the predicate, or `undefined` if no such value is found
 *
 * @alias firstNonNullyProp
 * @see firstNonNullyProp
 */
export function coalesceProp<R>(
    target: Nullable<CoalesceFieldsTarget>,
    props: PropertyKey[],
    predicate: CoalescePropValuePredicate = isNonNully,
): R | undefined {
    if (target && props.length && typeof predicate === 'function') {
        const gettable = isGettable(target);

        for (const field of props) {
            const value = gettable ? target.get(field) : target[field];
            if (predicate(value)) {
                return value as R;
            }
        }
    }

    return undefined;
}

/**
 * Returns the first non-nully value from the specified props of the target
 *
 * @alias coalesceProp
 * @see coalesceProp
 */
export function firstNonNullyProp(target: Nullable<CoalesceFieldsTarget>, props: PropertyKey[]) {
    return coalesceProp(target, props, isNonNully);
}

type CoalescePropValuePredicate = (value: unknown) => boolean;
type CoalesceFieldsTarget<V = unknown> = Gettable<V> | PRec<V, PropertyKey>;
