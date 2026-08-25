import pretty, { Options } from 'pretty-ms';
import { raise } from '../error';
import type { Perfectionist, PerfectionistLap } from './types';

export function perf(): Perfectionist {
    return {
        start: doStart,

        end(label: symbol): PerfectionistLap {
            return doLap(label, true);
        },

        lap(label: symbol): PerfectionistLap {
            return doLap(label, false);
        },
    };
}

export function perfFor(label: string | symbol): PerfEnd {
    if (typeof label !== 'symbol') label = Symbol(label);

    currentLaps.set(label, nowMilliseconds());

    const result: PerfEnd = function LabeledPerf() {
        return doLap(label, true);
    };

    const toStringDescriptor: PropertyDescriptor = {
        value() {
            const lap = doLap(label, false);
            return pretty(lap.elapsed, PerfPrettifyOptions);
        },
        writable: false,
        enumerable: false,
        configurable: true,
    };

    Object.defineProperty(result, 'toString', toStringDescriptor);

    return result;
}

function doStart(label: symbol): void {
    currentLaps.set(label, nowMilliseconds());
}

function doLap(label: symbol, end: boolean, remove = end): PerfectionistLap {
    const lap = currentLaps.get(label) ?? noLap(label);
    const type = typeof lap;
    const now = nowMilliseconds();
    let result: PerfectionistLap;

    switch (type) {
        case 'object': {
            const currentLap = lap as PerfectionistLap;
            result = {
                ...currentLap,
                end: now,
                elapsed: now - currentLap.start,
            };

            if (end) currentLap.end = now;

            if (remove) currentLaps.delete(label);
            else currentLaps.set(label, result);

            break;
        }

        case 'number': {
            const start = lap as number;
            result = {
                label,
                start,
                end: end ? now : undefined,
                elapsed: now - start,
            };

            if (remove) currentLaps.delete(label);
            else currentLaps.set(label, result);

            break;
        }

        default:
            return noLap(label);
    }

    Object.defineProperty(result, 'toString', {
        value: function PerfToString() {
            return pretty(result.elapsed, PerfPrettifyOptions);
        },
        writable: false,
        enumerable: false,
        configurable: true,
    });

    return result;
}

type PerfEnd = () => PerfectionistLap;

const PerfPrettifyOptions: Options = {
    secondsDecimalDigits: 2,
};

const currentLaps = new WeakMap<any, number | PerfectionistLap>();

const nowMilliseconds =
    typeof performance === 'object' && typeof performance.now === 'function'
        ? () => performance.now()
        : () => Date.now();

function noLap(label: symbol): never {
    return raise(`[Perf] No lap found for label: ${String(label)}`);
}
