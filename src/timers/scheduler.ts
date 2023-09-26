import { parseExpression, ParserOptions } from 'cron-parser';
import { NonEmptyString } from '../index';
import { deepSleeper, Sleeper } from './sleeper';

type CronExpression = ReturnType<typeof parseExpression>;

export type SchedulerRunner<TParams> = (
    this: Scheduler<TParams>,
    params: TParams | undefined,
) => Promise<void>;

export type SchedulerOptions = {
    /** Arbitrary task name */
    name?: NonEmptyString;
    /**
     * Option allows to build a sequence of tasks executed by scheduler
     * That means next task will not be started until previous one is finished
     * @default false
     */
    serial?: boolean;
    /**
     * Error handler for operations
     * Errors will be sent to console if no handler is provided
     */
    onError?(error: Error): void;
    /**
     * Accuracy of event triggering
     * @see deepSleeper
     */
    accuracyMS?: number;
    /**
     * Default options for cron-parser
     * @see https://github.com/harrisiirak/cron-parser#options cron-parser on GitHub
     */
    defaultCronParserOptions?: ParserOptions;
};

type SchedulerJob = {
    abort(): void;
};

class SchedulerImpl<TParams> {
    #currentIntervalExpression: string | undefined = undefined;

    #currentJob: SchedulerJob | undefined = undefined;

    #currentParams: TParams | undefined = undefined;

    readonly #options: SchedulerOptions;

    constructor(
        readonly name: string,
        private readonly runner: SchedulerRunner<TParams>,
        options?: SchedulerOptions,
    ) {
        this.#options = { ...options };
    }

    get scheduled() {
        return this.#currentJob != null;
    }

    /**
     * @param crontabExpression Crontab expression
     * @param params Params for runner
     * @param options cron-parser options
     * @see https://crontab.guru/
     * @see https://wikipedia.org/wiki/Cron wiki
     * @see https://github.com/harrisiirak/cron-parser#supported-format format
     */
    schedule(crontabExpression: string, params?: TParams, options?: ParserOptions): boolean {
        crontabExpression = crontabExpression.trim();
        if (crontabExpression !== this.#currentIntervalExpression) {
            this.stop();

            const interval = parseExpression(
                crontabExpression,
                options || this.#options.defaultCronParserOptions,
            );

            this.#currentParams = params;
            this.#currentJob = this.#createJob(interval);
            this.#currentIntervalExpression = crontabExpression;

            return true;
        }
        return false;
    }

    stop() {
        this.#currentJob?.abort();
        this.#currentJob = undefined;
        this.#currentIntervalExpression = undefined;
    }

    setParams(params: TParams | undefined) {
        this.#currentParams = params;
    }

    #createJob(interval: CronExpression): SchedulerJob {
        let aborted = false;
        let sleeper: Sleeper | undefined;

        void (async () => {
            // eslint-disable-next-line no-unmodified-loop-condition
            while (!aborted && interval.hasNext()) {
                try {
                    const till = interval.next() as unknown as Date;
                    await (sleeper = deepSleeper(till, this.#options.accuracyMS)).waitFor();

                    if (aborted) break;
                    const promise = this.runner(this.#currentParams);
                    if (aborted) break;

                    if (this.#options.serial) await promise;
                    else promise.catch((error) => this.#onError(error));
                } catch (e: any) {
                    this.#onError(e);
                }
            }
        })();

        return {
            abort() {
                aborted = true;
                sleeper?.abort();
            },
        };
    }

    #onError(error: Error) {
        if (!this.#options.onError)
            console.error(`[Scheduler STEP RUN ERROR for ${this.name}]`, error);
        else this.#options.onError(error);
    }
}

export type Scheduler<TParams = void> = SchedulerImpl<TParams>;

/**
 * Runs task by schedule
 * @param runner Task executed by schedule
 * @param options Options for task execution (or task name)
 * @param name Arbitrary task name
 */
export function scheduler<TParams = void>(
    runner: SchedulerRunner<TParams>,
    options?: SchedulerOptions | NonEmptyString,
    name?: NonEmptyString,
): Scheduler<TParams> {
    const optsIsName = typeof options === 'string';
    name = optsIsName ? options : options?.name || name || 'UNNAMED';

    return new SchedulerImpl<TParams>(name, runner, optsIsName ? undefined : options);
}
