/**
 * Create an empty iterable iterator that returns undefined when done
 */
export function emptyIterableIterator(): IterableIterator<unknown, undefined, unknown>;
/**
 * Create an empty iterable iterator that returns the provided `value` when done
 */
export function emptyIterableIterator<R>(value: R): IterableIterator<R, R, R>;
export function emptyIterableIterator<R>(value?: R): IterableIterator<R, R, R> {
    return {
        next(): IteratorResult<R> {
            return {
                done: true,
                // @ts-expect-error It's Safe
                value,
            } satisfies IteratorReturnResult<R>;
        },
        [Symbol.iterator]() {
            return this;
        },
    };
}
