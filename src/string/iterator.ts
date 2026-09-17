import { emptyIterableIterator } from '../empty-iterator';
import type { Nullable } from '../index';

export type CharPos = [start: number, end: number];

export function charactersIteratorOf(target: Nullable<string>): IterableIterator<string> {
    return create(target, false);
}

export function charactersPosIteratorOf(target: Nullable<string>): IterableIterator<CharPos> {
    return create(target, true);
}

function create(target: Nullable<string>, usePositions: true): IterableIterator<CharPos>;
function create(target: Nullable<string>, usePositions: false): IterableIterator<string>;
function create(
    target: Nullable<string>,
    usePositions: true | false,
): IterableIterator<string | CharPos> {
    let result: IterableIterator<string | CharPos> | undefined;

    if (target && typeof target === 'string') {
        if (IntlSegmenterInstance) {
            const segments = IntlSegmenterInstance.segment(target);
            result = usePositions ? positionsOf(segments) : segmentsOf(segments);
        } else {
            result = target[Symbol.iterator]();
        }
    }

    return result ?? emptyIterableIterator('');
}

function* segmentsOf(it: Intl.Segments) {
    for (const { segment } of it) {
        yield segment;
    }
}

function* positionsOf(it: Intl.Segments) {
    for (const { index, segment } of it) {
        yield [index, index + segment.length] satisfies CharPos;
    }
}

/**
 * TypeScript Lib: es2022.intl
 */
const IntlSegmenterInstance =
    typeof Intl === 'object' && typeof Intl.Segmenter === 'function'
        ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        : undefined;
