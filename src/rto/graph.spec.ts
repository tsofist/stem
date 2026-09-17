import { readErrorCode, readErrorContext } from '../error';
import type { Rec } from '../index';
import { buildOrchestrationGraph, collectClosure } from './graph';
import type { AnyOrchestrationResult, OrchestrationTasks } from './types';

type Artifacts = {
    a: string;
    b: string;
    c: string;
    d: string;
};

describe('rto: buildOrchestrationGraph', () => {
    it('describes a linear topology', () => {
        const graph = buildOrchestrationGraph<Artifacts>(
            tasksOf({
                makeA: { produces: { a: true } },
                makeB: { requires: { a: true }, produces: { b: true } },
                makeC: { requires: { b: true }, produces: { c: true } },
            }),
            resultOf({ c: true }),
        );

        expect(graph.taskIds).toStrictEqual({ makeA: true, makeB: true, makeC: true });
        expect(graph.producerOf).toStrictEqual({ a: 'makeA', b: 'makeB', c: 'makeC' });
        expect(graph.dependenciesOf.makeC).toStrictEqual({ makeB: true });
        expect(graph.dependentsOf.makeA).toStrictEqual({ makeB: true });
        expect(graph.resultClosure).toStrictEqual({ makeA: true, makeB: true, makeC: true });
    });

    it('limits the result closure to what the result node needs', () => {
        const graph = buildOrchestrationGraph<Artifacts>(
            tasksOf({
                makeA: { produces: { a: true } },
                makeB: { requires: { a: true }, produces: { b: true } },
                makeD: { requires: { a: true }, produces: { d: true } },
            }),
            resultOf({ b: true }),
        );

        expect(graph.resultClosure).toStrictEqual({ makeA: true, makeB: true });
    });

    it('treats every task as needed when there is no result node', () => {
        const graph = buildOrchestrationGraph<Artifacts>(
            tasksOf({
                makeA: { produces: { a: true } },
                makeD: { produces: { d: true } },
            }),
        );

        expect(graph.resultClosure).toStrictEqual({ makeA: true, makeD: true });
    });

    it('allows a soft requirement without a producer', () => {
        const graph = buildOrchestrationGraph<Artifacts>(
            tasksOf({
                makeA: { optional: { d: true }, produces: { a: true } },
            }),
        );

        expect(graph.optionalOf.makeA).toStrictEqual({ d: true });
        expect(graph.dependenciesOf.makeA).toStrictEqual({});
    });

    it('rejects an artifact produced by more than one task', () => {
        const error = catchError(() =>
            buildOrchestrationGraph<Artifacts>(
                tasksOf({
                    makeA: { produces: { a: true } },
                    alsoMakeA: { produces: { a: true } },
                }),
            ),
        );

        expect(readErrorCode(error)).toBe('EC_RTO_DUPLICATE_PRODUCER');
        expect(readErrorContext(error)).toStrictEqual({
            artifact: 'a',
            tasks: { makeA: true, alsoMakeA: true },
        });
    });

    it('rejects a hard requirement nobody produces', () => {
        const error = catchError(() =>
            buildOrchestrationGraph<Artifacts>(
                tasksOf({
                    makeB: { requires: { a: true }, produces: { b: true } },
                }),
            ),
        );

        expect(readErrorCode(error)).toBe('EC_RTO_MISSING_PRODUCER');
        expect(readErrorContext(error)).toStrictEqual({
            artifact: 'a',
            requiredBy: { makeB: true },
        });
    });

    it('rejects a result requirement nobody produces', () => {
        const error = catchError(() =>
            buildOrchestrationGraph<Artifacts>(
                tasksOf({ makeA: { produces: { a: true } } }),
                resultOf({ b: true }),
            ),
        );

        expect(readErrorCode(error)).toBe('EC_RTO_MISSING_PRODUCER');
        expect(readErrorContext(error, 'artifact')).toBe('b');
    });

    it('rejects a cycle and reports its path', () => {
        const error = catchError(() =>
            buildOrchestrationGraph<Artifacts>(
                tasksOf({
                    makeA: { requires: { c: true }, produces: { a: true } },
                    makeB: { requires: { a: true }, produces: { b: true } },
                    makeC: { requires: { b: true }, produces: { c: true } },
                }),
            ),
        );

        expect(readErrorCode(error)).toBe('EC_RTO_CYCLIC_DEPENDENCY');
        expect(readErrorContext(error, 'path')).toStrictEqual(['makeA', 'makeC', 'makeB', 'makeA']);
    });

    it('rejects an artifact declared both as a hard and as a soft requirement', () => {
        const error = catchError(() =>
            buildOrchestrationGraph<Artifacts>(
                tasksOf({
                    makeA: { produces: { a: true } },
                    makeB: { requires: { a: true }, optional: { a: true }, produces: { b: true } },
                }),
            ),
        );

        expect(readErrorCode(error)).toBe('EC_RTO_CONFLICTING_REQUIRE');
        expect(readErrorContext(error)).toStrictEqual({ taskId: 'makeB', artifact: 'a' });
    });

    it('rejects a task requiring what it produces itself', () => {
        const error = catchError(() =>
            buildOrchestrationGraph<Artifacts>(
                tasksOf({
                    makeA: { requires: { a: true }, produces: { a: true } },
                }),
            ),
        );

        expect(readErrorCode(error)).toBe('EC_RTO_CONFLICTING_OUTPUT');
    });

    it('rejects a streaming task without outputs', () => {
        const error = catchError(() =>
            buildOrchestrationGraph<Artifacts>(tasksOf({ watch: { streaming: true } })),
        );

        expect(readErrorCode(error)).toBe('EC_RTO_INVALID_TASK');
    });

    it('rejects an infinite producer that is not streaming', () => {
        const error = catchError(() =>
            buildOrchestrationGraph<Artifacts>(
                tasksOf({ watch: { infinite: true, produces: { a: true } } }),
            ),
        );

        expect(readErrorCode(error)).toBe('EC_RTO_INVALID_TASK');
    });
});

describe('rto: collectClosure', () => {
    it('includes the seeds and everything reachable from them', () => {
        const adjacency = {
            a: { b: true, c: true },
            b: { d: true },
            c: {},
            d: {},
            e: { a: true },
        } as const;

        expect(collectClosure(adjacency as never, { a: true })).toStrictEqual({
            a: true,
            b: true,
            c: true,
            d: true,
        });
        expect(collectClosure(adjacency as never, { c: true })).toStrictEqual({ c: true });
    });

    it('terminates on a cyclic adjacency', () => {
        const adjacency = { a: { b: true }, b: { a: true } } as const;

        expect(collectClosure(adjacency as never, { a: true })).toStrictEqual({
            a: true,
            b: true,
        });
    });
});

function tasksOf(source: Rec<object>): OrchestrationTasks<Artifacts> {
    const result: Rec<object> = {};
    for (const [taskId, definition] of Object.entries(source)) {
        result[taskId] = { run: () => undefined, ...definition };
    }
    return result as OrchestrationTasks<Artifacts>;
}

function resultOf(requires: object): AnyOrchestrationResult<Artifacts> {
    return { requires, collect: () => undefined } as AnyOrchestrationResult<Artifacts>;
}

function catchError(action: () => unknown): unknown {
    try {
        action();
    } catch (e) {
        return e;
    }
    throw new Error('Expected an error to be thrown');
}
