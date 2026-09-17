import { deferred } from '../deferred';
import { hasErrorCode, readErrorContext } from '../error';
import { defineOrchestration } from './define';
import { createTaskOrchestrator } from './runner';

type Artifacts = {
    a: string;
    b: string;
    c: string;
    d: string;
};

const { task, result } = defineOrchestration<Artifacts>();

describe('rto: execution order', () => {
    it('runs a chain in dependency order', async () => {
        const order: string[] = [];
        const rto = createTaskOrchestrator({
            tasks: {
                makeC: {
                    ...task({
                        requires: { b: true },
                        produces: { c: true },
                        run: ({ artifacts }) => {
                            order.push('makeC');
                            return { c: `${artifacts.b}c` };
                        },
                    }),
                },
                makeA: task({
                    produces: { a: true },
                    run: () => {
                        order.push('makeA');
                        return { a: 'a' };
                    },
                }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => {
                        order.push('makeB');
                        return { b: `${artifacts.a}b` };
                    },
                }),
            },
            result: result({
                requires: { c: true },
                collect: ({ artifacts }) => artifacts.c,
            }),
        });

        await expect(rto.run()).resolves.toBe('abc');
        expect(order).toStrictEqual(['makeA', 'makeB', 'makeC']);
        rto.dispose();
    });

    it('runs independent tasks in parallel', async () => {
        const started = { makeA: false, makeD: false };
        const gateA = deferred<string>();
        const gateD = deferred<string>();

        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: async () => {
                        started.makeA = true;
                        return { a: await gateA.promise };
                    },
                }),
                makeD: task({
                    produces: { d: true },
                    run: async () => {
                        started.makeD = true;
                        return { d: await gateD.promise };
                    },
                }),
            },
        });

        const running = rto.run();
        await tick();

        // Both are in flight at the same time: neither has been allowed to finish yet
        expect(started).toStrictEqual({ makeA: true, makeD: true });
        expect(rto.state.counters.running).toBe(2);

        gateA.resolver('a');
        gateD.resolver('d');
        await expect(running).resolves.toStrictEqual({ a: 'a', d: 'd' });
        rto.dispose();
    });

    it('respects the concurrency limit', async () => {
        const gate = deferred<string>();
        const rto = createTaskOrchestrator(
            {
                tasks: {
                    makeA: task({
                        produces: { a: true },
                        run: async () => ({ a: await gate.promise }),
                    }),
                    makeD: task({
                        produces: { d: true },
                        run: async () => ({ d: await gate.promise }),
                    }),
                },
            },
            { concurrency: 1 },
        );

        const running = rto.run();
        await tick();
        expect(rto.state.counters.running).toBe(1);
        expect(rto.state.counters.waiting).toBe(1);

        gate.resolver('x');
        await expect(running).resolves.toStrictEqual({ a: 'x', d: 'x' });
        rto.dispose();
    });

    it('resolves as soon as the result node is computable, while other tasks keep running', async () => {
        const gate = deferred<string>();
        let sideEffectFinished = false;

        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: `${artifacts.a}b` }),
                }),
                slowBranch: task({
                    requires: { a: true },
                    produces: { d: true },
                    run: async () => {
                        const value = await gate.promise;
                        sideEffectFinished = true;
                        return { d: value };
                    },
                }),
            },
            result: result({ requires: { b: true }, collect: ({ artifacts }) => artifacts.b }),
        });

        await expect(rto.run()).resolves.toBe('ab');
        expect(sideEffectFinished).toBe(false);
        expect(rto.state.status).toBe('completed');
        expect(rto.state.tasks.slowBranch.status).toBe('running');
        expect(rto.state.settled).toBe(false);

        gate.resolver('d');
        await rto.whenSettled();
        expect(sideEffectFinished).toBe(true);
        expect(rto.state.tasks.slowBranch.status).toBe('completed');
        rto.dispose();
    });

    it('collects the whole artifacts snapshot when there is no result node', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: `${artifacts.a}b` }),
                }),
            },
        });

        await expect(rto.run()).resolves.toStrictEqual({ a: 'a', b: 'ab' });
        rto.dispose();
    });

    it('schedules only what the result node needs in lazy mode', async () => {
        let unrelatedStarted = false;
        const rto = createTaskOrchestrator(
            {
                tasks: {
                    makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }),
                    unrelated: task({
                        produces: { d: true },
                        run: () => {
                            unrelatedStarted = true;
                            return { d: 'd' };
                        },
                    }),
                },
                result: result({ requires: { a: true }, collect: ({ artifacts }) => artifacts.a }),
            },
            { mode: 'lazy' },
        );

        await expect(rto.run()).resolves.toBe('a');
        expect(unrelatedStarted).toBe(false);
        expect(rto.state.tasks.unrelated.status).toBe('idle');
        rto.dispose();
    });
});

describe('rto: failures', () => {
    it('blocks dependents and leaves an independent branch alone', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: () => {
                        throw new Error('nope');
                    },
                }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: artifacts.a }),
                }),
                independent: task({ produces: { d: true }, run: () => ({ d: 'd' }) }),
            },
        });

        await expect(rto.run()).rejects.toThrow('nope');
        expect(rto.state.tasks.makeA.status).toBe('failed');
        expect(rto.state.tasks.makeB.status).toBe('blocked');
        expect(rto.state.tasks.makeB.pending).toStrictEqual({ a: true });
        expect(rto.state.tasks.independent.status).toBe('completed');
        expect(rto.state.artifacts).toStrictEqual({ d: 'd' });
        rto.dispose();
    });

    it('reports an unreachable result', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: () => {
                        throw new Error('nope');
                    },
                }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: artifacts.a }),
                }),
            },
            result: result({ requires: { b: true }, collect: ({ artifacts }) => artifacts.b }),
        });

        const error = await rto.run().catch((e: unknown) => e);
        expect(hasErrorCode(error, 'EC_RTO_RESULT_UNREACHABLE')).toBe(true);
        expect(readErrorContext(error)).toStrictEqual({ artifact: 'b', producer: 'makeB' });
        rto.dispose();
    });

    it('fails a task that did not produce what it declared', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: () => undefined as never,
                }),
            },
        });

        const error = await rto.run().catch((e: unknown) => e);
        expect(hasErrorCode(error, 'EC_RTO_MISSING_OUTPUT')).toBe(true);
        expect(readErrorContext(error)).toStrictEqual({
            taskId: 'makeA',
            artifacts: { a: true },
        });
        rto.dispose();
    });

    it('fails a task that published an artifact it did not declare', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    streaming: true,
                    run: ({ publish }) => {
                        // Declaring an artifact the task does not produce is a compile-time error,
                        // so the runtime guard is checked through an erased signature
                        (publish as unknown as (name: string, value: unknown) => void)('b', 'b');
                    },
                }),
            },
        });

        const error = await rto.run().catch((e: unknown) => e);
        expect(hasErrorCode(error, 'EC_RTO_UNDECLARED_ARTIFACT')).toBe(true);
        expect(readErrorContext(error)).toStrictEqual({ taskId: 'makeA', artifact: 'b' });
        rto.dispose();
    });
});

describe('rto: lifecycle', () => {
    it('cancels waiting and running tasks and aborts their signals', async () => {
        const gate = deferred<string>();
        let aborted = false;

        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: async ({ signal }) => {
                        signal.addEventListener('abort', () => {
                            aborted = true;
                        });
                        return { a: await gate.promise };
                    },
                }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: artifacts.a }),
                }),
            },
        });

        const running = rto.run();
        await tick();
        rto.cancel('because');

        const error = await running.catch((e: unknown) => e);
        expect(hasErrorCode(error, 'EC_RTO_CANCELLED')).toBe(true);
        expect(readErrorContext(error, 'reason')).toBe('because');
        expect(aborted).toBe(true);
        expect(rto.state.status).toBe('cancelled');
        expect(rto.state.tasks.makeA.status).toBe('cancelled');
        expect(rto.state.tasks.makeB.status).toBe('cancelled');

        gate.resolver('a');
        await tick();
        expect(rto.state.artifacts).toStrictEqual({});
        rto.dispose();
    });

    it('cancels through an external signal', async () => {
        const controller = new AbortController();
        const gate = deferred<string>();
        const rto = createTaskOrchestrator(
            {
                tasks: {
                    makeA: task({
                        produces: { a: true },
                        run: async () => ({ a: await gate.promise }),
                    }),
                },
            },
            { signal: controller.signal },
        );

        const running = rto.run();
        await tick();
        controller.abort();

        await expect(running).rejects.toThrow();
        expect(rto.state.status).toBe('cancelled');
        rto.dispose();
    });

    it('resets to a clean slate and runs again independently', async () => {
        let runs = 0;
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: () => {
                        runs++;
                        return { a: `a${runs}` };
                    },
                }),
            },
        });

        await expect(rto.run()).resolves.toStrictEqual({ a: 'a1' });
        rto.reset();

        expect(rto.state.status).toBe('idle');
        expect(rto.state.tasks.makeA.status).toBe('idle');
        expect(rto.state.tasks.makeA.attempt).toBe(0);
        expect(rto.state.artifacts).toStrictEqual({});

        await expect(rto.run()).resolves.toStrictEqual({ a: 'a2' });
        rto.dispose();
    });

    it('retries only the affected subgraph and preserves unrelated artifacts', async () => {
        let independentRuns = 0;
        let failing = true;

        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: () => {
                        if (failing) throw new Error('flaky');
                        return { b: 'b' };
                    },
                }),
                makeC: task({
                    requires: { b: true },
                    produces: { c: true },
                    run: ({ artifacts }) => ({ c: `${artifacts.b}c` }),
                }),
                independent: task({
                    requires: { a: true },
                    produces: { d: true },
                    run: () => {
                        independentRuns++;
                        return { d: 'd' };
                    },
                }),
            },
            result: result({ requires: { c: true }, collect: ({ artifacts }) => artifacts.c }),
        });

        await expect(rto.run()).rejects.toThrow();
        expect(rto.state.tasks.makeB.status).toBe('failed');
        expect(rto.state.tasks.makeC.status).toBe('blocked');
        expect(independentRuns).toBe(1);

        failing = false;
        await expect(rto.retry('makeB')).resolves.toBe('bc');

        expect(independentRuns).toBe(1);
        expect(rto.state.tasks.makeA.attempt).toBe(1);
        expect(rto.state.tasks.makeB.attempt).toBe(2);
        expect(rto.state.artifacts).toStrictEqual({ a: 'a', b: 'b', c: 'bc', d: 'd' });
        rto.dispose();
    });

    it('retries every failed task by default', async () => {
        let failing = true;
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: () => {
                        if (failing) throw new Error('flaky');
                        return { a: 'a' };
                    },
                }),
            },
        });

        await expect(rto.run()).rejects.toThrow('flaky');
        failing = false;
        await expect(rto.retry()).resolves.toStrictEqual({ a: 'a' });
        rto.dispose();
    });

    it('refuses to start twice and to be used after disposal', async () => {
        const gate = deferred<string>();
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: async () => ({ a: await gate.promise }),
                }),
            },
        });

        const running = rto.run();
        expect(() => rto.run()).toThrow('Orchestration is already running');

        gate.resolver('a');
        await running;

        rto.dispose();
        expect(() => rto.run()).toThrow('Orchestrator has been disposed');
    });

    it('rejects an unknown task id on retry', () => {
        const rto = createTaskOrchestrator({
            tasks: { makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }) },
        });

        expect(() => rto.retry('nope' as never)).toThrow('Unknown task');
        rto.dispose();
    });
});

async function tick(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
}
