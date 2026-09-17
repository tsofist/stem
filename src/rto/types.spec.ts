import { defineOrchestration } from './define';
import { createTaskOrchestrator } from './runner';

type Artifacts = {
    jsonSchema: { schema: string };
    servicesMap: Map<string, string>;
    openApi: object;
    dbml: string;
};

const { task, result } = defineOrchestration<Artifacts>();

describe('rto: task declarations', () => {
    it('types the run context out of requires/optional/produces', () => {
        const typed = task({
            requires: { jsonSchema: true },
            optional: { dbml: true },
            produces: { openApi: true },
            run: ({ artifacts }) => {
                const hard: { schema: string } = artifacts.jsonSchema;
                const soft: string | undefined = artifacts.dbml;

                // @ts-expect-error It's OK: a soft requirement may be absent
                const wrong: string = artifacts.dbml;

                // @ts-expect-error It's OK: not declared in requires/optional
                const undeclared = artifacts.servicesMap;

                expect([hard, soft, wrong, undeclared]).toBeDefined();
                return { openApi: {} };
            },
        });

        expect(typed).toBeDefined();
    });

    it('rejects artifacts that are not in the registry', () => {
        const typed = task({
            // @ts-expect-error It's OK: "unknown" is not a declared artifact
            requires: { unknown: true },
            produces: { dbml: true },
            run: () => ({ dbml: '' }),
        });

        expect(typed).toBeDefined();
    });

    it('rejects an output that was not declared', () => {
        const typed = task({
            produces: { dbml: true },
            // @ts-expect-error It's OK: "openApi" is not declared in produces
            run: () => ({ dbml: '', openApi: {} }),
        });

        expect(typed).toBeDefined();
    });

    it('rejects a missing declared output', () => {
        const typed = task({
            produces: { dbml: true, openApi: true },
            // @ts-expect-error It's OK: "openApi" is declared but never returned
            run: () => ({ dbml: '' }),
        });

        expect(typed).toBeDefined();
    });

    it('rejects publishing an artifact the task does not produce', () => {
        const typed = task({
            produces: { dbml: true },
            streaming: true,
            run: ({ publish }) => {
                publish('dbml', '');
                // @ts-expect-error It's OK: "openApi" is not declared in produces
                publish('openApi', {});
            },
        });

        expect(typed).toBeDefined();
    });

    it('lets a streaming task return nothing', () => {
        const typed = task({
            produces: { dbml: true },
            streaming: true,
            run: ({ publish }) => {
                publish('dbml', '');
            },
        });

        expect(typed).toBeDefined();
    });
});

describe('rto: orchestration', () => {
    it('propagates the result type and the task ids', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                genSchema: task({
                    produces: { jsonSchema: true },
                    run: () => ({ jsonSchema: { schema: 'x' } }),
                }),
                genOpenApi: task({
                    requires: { jsonSchema: true },
                    produces: { openApi: true },
                    run: () => ({ openApi: {} }),
                }),
            },
            result: result({
                requires: { openApi: true },
                collect: ({ artifacts }) => ({ api: artifacts.openApi }),
            }),
        });

        const collected: { api: object } = await rto.run();
        expect(collected.api).toBeDefined();

        expect(rto.state.tasks.genSchema.status).toBe('completed');
        // @ts-expect-error It's OK: unknown task id
        expect(rto.state.tasks.nope).toBeUndefined();
        // @ts-expect-error It's OK: unknown task id
        expect(() => rto.retry('nope')).toThrow();

        rto.dispose();
    });

    /*
     * Each of the following is reported twice: by ValidateOrchestrationGraph at compile time (the
     * `@ts-expect-error` directives) and by the runtime validator, which is what protects a graph
     * assembled dynamically. The compile-time message is in the directive's description.
     */

    it('rejects a requirement with no producer', () => {
        expect(() =>
            createTaskOrchestrator(
                // @ts-expect-error It's OK: artifact "jsonSchema" is required but has no producer
                {
                    tasks: {
                        genOpenApi: task({
                            requires: { jsonSchema: true },
                            produces: { openApi: true },
                            run: () => ({ openApi: {} }),
                        }),
                    },
                },
            ),
        ).toThrow('Required artifact has no producer');
    });

    it('rejects two producers of the same artifact', () => {
        expect(() =>
            createTaskOrchestrator(
                // @ts-expect-error It's OK: artifact "dbml" is produced by more than one task
                {
                    tasks: {
                        one: task({ produces: { dbml: true }, run: () => ({ dbml: '' }) }),
                        two: task({ produces: { dbml: true }, run: () => ({ dbml: '' }) }),
                    },
                },
            ),
        ).toThrow('Artifact is produced by more than one task');
    });

    it('rejects a task requiring what it produces itself', () => {
        expect(() =>
            createTaskOrchestrator(
                // @ts-expect-error It's OK: task requires an artifact it produces itself
                {
                    tasks: {
                        loop: task({
                            requires: { dbml: true },
                            produces: { dbml: true },
                            run: () => ({ dbml: '' }),
                        }),
                    },
                },
            ),
        ).toThrow('Artifact is declared both as a requirement and as an output of the same task');
    });

    it('rejects a result requirement with no producer', () => {
        expect(() =>
            createTaskOrchestrator(
                // @ts-expect-error It's OK: artifact "openApi" is required but has no producer
                {
                    tasks: {
                        genDbml: task({ produces: { dbml: true }, run: () => ({ dbml: '' }) }),
                    },
                    result: result({
                        requires: { openApi: true },
                        collect: ({ artifacts }) => artifacts.openApi,
                    }),
                },
            ),
        ).toThrow('Required artifact has no producer');
    });

    it('rejects an entry that is not a task declaration', () => {
        expect(() =>
            createTaskOrchestrator(
                // @ts-expect-error It's OK: "broken" is not a task declared with "task()"
                {
                    tasks: {
                        genDbml: task({ produces: { dbml: true }, run: () => ({ dbml: '' }) }),
                        broken: { nothing: true },
                    },
                },
            ),
        ).toThrow('Task definition is invalid');
    });

    it('recovers the registry from tasks declared elsewhere', async () => {
        // Declarations carry the registry, so they can be built in another module and composed here
        const genSchema = task({
            produces: { jsonSchema: true },
            run: () => ({ jsonSchema: { schema: 'x' } }),
        });
        const audit = task({ requires: { jsonSchema: true }, run: () => undefined });

        const rto = createTaskOrchestrator({ tasks: { genSchema, audit } });

        const collected: Readonly<Partial<Artifacts>> = await rto.run();
        expect(collected.jsonSchema).toStrictEqual({ schema: 'x' });

        const artifacts: Readonly<Partial<Artifacts>> = rto.state.artifacts;
        expect(artifacts.jsonSchema).toBeDefined();
        expect(rto.state.tasks.audit.status).toBe('completed');
        // @ts-expect-error It's OK: unknown task id
        expect(rto.state.tasks.nope).toBeUndefined();

        rto.dispose();
    });

    it('recovers the registry from a record of streaming tasks only', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                stream: task({
                    produces: { dbml: true },
                    streaming: true,
                    run: ({ publish }) => {
                        publish('dbml', 'x');
                    },
                }),
            },
        });

        const collected: Readonly<Partial<Artifacts>> = await rto.run();
        expect(collected.dbml).toBe('x');
        rto.dispose();
    });

    it('returns the artifacts snapshot when there is no result node', async () => {
        const rto = createTaskOrchestrator({
            tasks: {
                genDbml: task({ produces: { dbml: true }, run: () => ({ dbml: 'x' }) }),
            },
        });

        const collected: Readonly<Partial<Artifacts>> = await rto.run();
        expect(collected.dbml).toBe('x');
        rto.dispose();
    });
});
