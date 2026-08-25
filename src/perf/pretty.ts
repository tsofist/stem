import pretty, { type Options } from 'pretty-ms';
import type { PerfectionistLap } from './types';

export function prettyPerf(
    source: PerfectionistLap | number,
    options: Options = DEF_OPTIONS,
): string {
    if (source == null) return '';
    const value = typeof source === 'number' ? source : source.elapsed;

    return pretty(value, options);
}

const DEF_OPTIONS: Options = {
    secondsDecimalDigits: 2,
};
