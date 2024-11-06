import { PromiseMay } from '../index';
import { NonNegativeInt } from '../number/types';

export type SerialIntervalOptions = {
    /**
     * Calls immediately
     * @default false
     */
    immediate?: boolean;
    /**
     * Errors handler
     * @default console.error
     */
    onError?: (error: Error) => void;
};

export type SerialIntervalHandle = {
    /** Break the cycle */
    clear: () => void;
    /** Resume the cycle */
    resume: (immediate: boolean) => void;
};

/**
 * Serially calls an asynchronous callback with waiting for its completion through a given interval
 */
export function setSerialInterval(
    ms: NonNegativeInt,
    callback: () => PromiseMay<any>,
    options?: SerialIntervalOptions,
): SerialIntervalHandle {
    let timer: NodeJS.Timeout | undefined;
    let allowed = true;

    const onError = options?.onError || console.error.bind(console);

    const action = async () => {
        try {
            if (allowed) await callback();
        } catch (e) {
            onError(e);
        }
    };

    const step = async () => {
        await action();
        if (allowed) schedule();
    };

    const schedule = () => {
        clear();
        timer = setTimeout(step, ms);
        if (timer.unref) timer.unref();
    };

    const clear = () => {
        if (timer != null) {
            clearTimeout(timer);
            timer = undefined;
        }
    };

    if (options?.immediate) void action();
    if (allowed) schedule();

    return {
        clear() {
            allowed = false;
            clear();
        },
        resume(immediate = false) {
            allowed = true;
            if (immediate) void action();
            if (allowed) schedule();
        },
    };
}
