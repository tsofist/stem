import { effectScope, watch } from '@vue/reactivity';
import { deferred } from '../deferred';
import type { Rec, VoidFunction } from '../index';
import { noop } from '../noop';
import { defineOrchestration } from './define';
import { createTaskOrchestrator } from './runner';
import type { OrchestrationTaskStatus } from './types';

type Artifacts = {
    a: string;
    b: string;
    d: string;
};

const { task, result } = defineOrchestration<Artifacts>();

describe('rto: reactive state', () => {
    it('exposes state that the host application cannot mutate', async () => {
        // @vue/reactivity warns on every rejected write; that warning is the point of this test
        const warned = jest.spyOn(console, 'warn').mockImplementation(noop);
        const rto = createTaskOrchestrator({
            tasks: { makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }) },
        });

        await rto.run();

        const mutable = rto.state as unknown as {
            tasks: Rec<{ status: OrchestrationTaskStatus }>;
            artifacts: Partial<Artifacts>;
        };
        mutable.tasks.makeA.status = 'idle';
        mutable.artifacts.a = 'hacked';

        expect(rto.state.tasks.makeA.status).toBe('completed');
        expect(rto.state.artifacts.a).toBe('a');
        expect(warned).toHaveBeenCalledTimes(2);

        warned.mockRestore();
        rto.dispose();
    });

    it('recomputes counters, progress and settled', async () => {
        const gate = deferred<string>();
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: async () => ({ a: await gate.promise }),
                }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: artifacts.a }),
                }),
            },
        });

        expect(rto.state.progress).toBe(0);
        expect(rto.state.settled).toBe(true);

        const running = rto.run();
        await tick();

        expect(rto.state.counters).toStrictEqual({
            idle: 0,
            waiting: 1,
            running: 1,
            completed: 0,
            failed: 0,
            blocked: 0,
            cancelled: 0,
        });
        expect(rto.state.progress).toBe(0);
        expect(rto.state.settled).toBe(false);

        gate.resolver('a');
        await running;

        expect(rto.state.counters.completed).toBe(2);
        expect(rto.state.progress).toBe(1);
        expect(rto.state.settled).toBe(true);
        rto.dispose();
    });

    it('surfaces ctx.progress() reactively', async () => {
        const gate = deferred<string>();
        const seen: number[] = [];
        const scope = effectScope(true);

        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: async ({ progress }) => {
                        progress(0.25, 'quarter');
                        progress(0.75, 'most');
                        return { a: await gate.promise };
                    },
                }),
            },
        });

        scope.run(() => {
            watch(
                () => rto.state.tasks.makeA.progress,
                (value: number) => {
                    seen.push(value);
                },
            );
        });

        const running = rto.run();
        await tick();

        expect(rto.state.tasks.makeA.message).toBe('most');
        gate.resolver('a');
        await running;

        expect(seen).toStrictEqual([0.25, 0.75, 1]);
        scope.stop();
        rto.dispose();
    });

    it('clamps out-of-range progress values', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: ({ progress }) => {
                        progress(-1);
                        expect(rto.state.tasks.makeA.progress).toBe(0);
                        progress(42);
                        expect(rto.state.tasks.makeA.progress).toBe(1);
                        return { a: 'a' };
                    },
                }),
            },
        });

        await rto.run();
        rto.dispose();
    });
});

describe('rto: streaming and infinite tasks', () => {
    it('unblocks a consumer before its producer finishes', async () => {
        const gate = deferred();
        let producerFinished = false;

        const rto = createTaskOrchestrator({
            tasks: {
                producer: task({
                    produces: { a: true },
                    streaming: true,
                    run: async ({ publish }) => {
                        publish('a', 'a');
                        await gate.promise;
                        producerFinished = true;
                    },
                }),
                consumer: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: `${artifacts.a}b` }),
                }),
            },
            result: result({ requires: { b: true }, collect: ({ artifacts }) => artifacts.b }),
        });

        await expect(rto.run()).resolves.toBe('ab');
        expect(producerFinished).toBe(false);
        expect(rto.state.tasks.producer.status).toBe('running');

        gate.resolver();
        await rto.whenSettled();
        expect(producerFinished).toBe(true);
        rto.dispose();
    });

    it('does not wait for an infinite task and aborts it on cancel', async () => {
        let aborted = false;
        const rto = createTaskOrchestrator({
            tasks: {
                ticker: task({
                    produces: { a: true },
                    streaming: true,
                    infinite: true,
                    run: ({ publish, signal }) => {
                        publish('a', 'tick');
                        return new Promise<void>((resolve) => {
                            signal.addEventListener('abort', () => {
                                aborted = true;
                                resolve();
                            });
                        });
                    },
                }),
                consumer: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: artifacts.a }),
                }),
            },
            result: result({ requires: { b: true }, collect: ({ artifacts }) => artifacts.b }),
        });

        await expect(rto.run()).resolves.toBe('tick');
        expect(rto.state.settled).toBe(true);
        expect(rto.state.tasks.ticker.status).toBe('running');
        expect(rto.state.progress).toBe(1);

        rto.cancel('done with it');
        await tick();

        expect(aborted).toBe(true);
        expect(rto.state.tasks.ticker.status).toBe('cancelled');
        rto.dispose();
    });

    it('keeps the latest value of a re-published artifact', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                producer: task({
                    produces: { a: true },
                    streaming: true,
                    run: ({ publish }) => {
                        publish('a', 'first');
                        publish('a', 'second');
                    },
                }),
            },
        });

        await expect(rto.run()).resolves.toStrictEqual({ a: 'second' });
        rto.dispose();
    });
});

describe('rto: events', () => {
    it('reports task status transitions with their previous value', async () => {
        const seen: string[] = [];
        const rto = createTaskOrchestrator({
            tasks: { makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }) },
        });

        rto.on('task:status', ({ taskId, status, previous }) => {
            seen.push(`${taskId}:${previous}->${status}`);
        });

        await rto.run();
        await tick();

        expect(seen).toStrictEqual([
            'makeA:idle->waiting',
            'makeA:waiting->running',
            'makeA:running->completed',
        ]);
        rto.dispose();
    });

    it('reports orchestrator status transitions, published artifacts and progress', async () => {
        const statuses: string[] = [];
        const artifacts: string[] = [];
        const progress: number[] = [];

        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: ({ progress: report }) => {
                        report(0.5);
                        return { a: 'a' };
                    },
                }),
            },
        });

        rto.on('status', ({ status, previous }) => statuses.push(`${previous}->${status}`));
        rto.on('artifact:published', ({ artifact, value, producer }) => {
            artifacts.push(`${producer}:${artifact}=${value}`);
        });
        rto.on('task:progress', ({ progress: value }) => progress.push(value));

        await rto.run();
        await tick();

        expect(statuses).toStrictEqual(['idle->running', 'running->completed']);
        expect(artifacts).toStrictEqual(['makeA:a=a']);
        expect(progress).toStrictEqual([0.5, 1]);
        rto.dispose();
    });

    it('stops calling a handler after it unsubscribes', async () => {
        const seen: string[] = [];
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }),
                makeB: task({
                    requires: { a: true },
                    produces: { b: true },
                    run: ({ artifacts }) => ({ b: artifacts.a }),
                }),
            },
        });

        let off: VoidFunction = noop;
        off = rto.on('artifact:published', ({ artifact }) => {
            seen.push(artifact);
            off();
        });

        await rto.run();
        expect(seen).toStrictEqual(['a']);
        rto.dispose();
    });

    it('isolates a faulty handler from the orchestration', async () => {
        const reported = jest.spyOn(console, 'error').mockImplementation(noop);
        const rto = createTaskOrchestrator({
            tasks: { makeA: task({ produces: { a: true }, run: () => ({ a: 'a' }) }) },
        });

        rto.on('artifact:published', () => {
            throw new Error('faulty listener');
        });

        await expect(rto.run()).resolves.toStrictEqual({ a: 'a' });
        expect(reported).toHaveBeenCalledTimes(1);

        reported.mockRestore();
        rto.dispose();
    });
});

describe('rto: disposal', () => {
    it('stops every effect and rejects the pending run', async () => {
        const gate = deferred<string>();
        const seen: number[] = [];
        const rto = createTaskOrchestrator({
            tasks: {
                makeA: task({
                    produces: { a: true },
                    run: async () => ({ a: await gate.promise }),
                }),
            },
        });

        rto.on('task:status', () => seen.push(1));

        const running = rto.run();
        await tick();
        rto.dispose();

        await expect(running).rejects.toThrow('Orchestrator has been disposed');

        const before = seen.length;
        gate.resolver('a');
        await tick();
        expect(seen.length).toBe(before);
    });
});

async function tick(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
}
