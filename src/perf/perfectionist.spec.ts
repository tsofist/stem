import { perf, perfFor } from './perfectionist';
import { PerfectionistLap } from './types';

/* eslint-disable @typescript-eslint/restrict-plus-operands */

describe('perf', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns a function that ends the lap and can be stringified', () => {
        const now = jest.spyOn(performance, 'now');
        now.mockReturnValueOnce(100)
            .mockReturnValueOnce(210)
            .mockReturnValueOnce(320)
            .mockReturnValueOnce(60_100);

        const end = perfFor('test');

        expect(String(end)).toStrictEqual(`110ms`);
        expect(end + '').toStrictEqual(`220ms`);
        expect(end.toString()).toStrictEqual(`1m`);

        expect(JSON.stringify(end)).toStrictEqual(undefined);
        expect(JSON.stringify({ end })).toStrictEqual('{}');
    });

    it('starts and ends a lap', () => {
        const now = jest.spyOn(performance, 'now');
        now.mockReturnValueOnce(100).mockReturnValueOnce(275);

        const label = Symbol('test');
        const tracker = perf();

        tracker.start(label);

        expect(tracker.end(label)).toStrictEqual({
            label,
            start: 100,
            end: 275,
            elapsed: 175,
        } satisfies PerfectionistLap);
    });

    it('returns the current lap without ending it', () => {
        const now = jest.spyOn(performance, 'now');
        now.mockReturnValueOnce(110).mockReturnValueOnce(210).mockReturnValueOnce(320);

        const label = Symbol('job');
        const tracker = perf();

        tracker.start(label);

        expect(tracker.lap(label)).toStrictEqual({
            label,
            start: 110,
            end: undefined,
            elapsed: 100,
        } satisfies PerfectionistLap);

        expect(tracker.end(label)).toStrictEqual({
            label,
            start: 110,
            end: 320,
            elapsed: 210,
        } satisfies PerfectionistLap);
    });

    it('throws on unknown labels', () => {
        const label = Symbol('missing');
        const tracker = perf();

        expect(() => tracker.lap(label)).toThrow(`[Perf] No lap found for label: ${String(label)}`);
        expect(() => tracker.end(label)).toThrow(`[Perf] No lap found for label: ${String(label)}`);
    });
});
