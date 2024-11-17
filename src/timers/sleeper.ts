export type Sleeper = {
    /** Wait for the end of the waiting period */
    waitFor: () => Promise<void>;
    /** Interrupt the waiting period prematurely */
    abort: () => boolean;
    /** The waiting was interrupted */
    readonly aborted: boolean;
};

class SleeperImpl implements Sleeper {
    readonly #promise: Promise<void>;

    #timer: NodeJS.Timeout | undefined = undefined;

    #resolver: VoidFunction | undefined = undefined;

    #aborted = false;

    #fulfilled = false;

    constructor(timeout: number) {
        this.#promise = new Promise((resolve) => (this.#resolver = resolve));
        this.#timer = setTimeout(() => {
            if (!this.#fulfilled) this.#fulfill();
        }, timeout);
        if (this.#timer.unref) this.#timer.unref();
    }

    get aborted() {
        return this.#aborted;
    }

    waitFor(): Promise<void> {
        return this.#promise;
    }

    abort(): boolean {
        if (!this.#fulfilled) {
            this.#aborted = true;
            this.#fulfill();
            return true;
        }
        return false;
    }

    #fulfill() {
        this.#fulfilled = true;
        if (this.#timer != null) {
            clearTimeout(this.#timer);
            this.#resolver!();
            this.#timer = undefined;
            this.#resolver = undefined;
        }
    }
}

/**
 * Returns an object that allows you to wait for a specified period of time
 *   with the ability to prematurely interrupt the wait
 *
 * **Important**: the accuracy of triggering depends entirely on the engine and the environment,
 *   since everything is tied to setTimeout
 */
export function sleeper(timeout: number): Sleeper {
    return new SleeperImpl(timeout);
}

/**
 * Returns an object that allows you to wait for a specific date
 *  with the ability to prematurely interrupt the wait
 *
 * **Important**: this implementation cannot boast of fulfilling the promise on time.
 *   Maximum time for which the promise can be delayed is specified in the corresponding parameter.
 *   However, the smaller this number, the more often the check for the deadline is performed and the more load on the event-loop
 *   The accuracy values set by default are sufficient in most cases
 */
export function deepSleeper(date: Date, accuracyMS: number = 10 * 1000): Sleeper {
    let timer: Sleeper;
    const promise = new Promise<void>((resolve) => {
        void (async () => {
            const till = date.getTime();
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (till <= Date.now()) {
                    resolve();
                    break;
                }
                await (timer = sleeper(accuracyMS)).waitFor();
            }
        })();
    });
    return {
        async waitFor() {
            return promise;
        },
        abort() {
            return timer?.abort() ?? false;
        },
        get aborted() {
            return timer?.aborted ?? false;
        },
    };
}
