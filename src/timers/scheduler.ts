import { CronExpression, CronExpressionOptions, CronExpressionParser } from 'cron-parser';
import type { ZuluISODateTimeString } from '../cldr/date-time/types';
import type { IsNever, NonEmptyString } from '../index';
import { createDeepSleeper, Sleeper } from './sleeper';

/**
 * @see https://github.com/harrisiirak/cron-parser#options cron-parser on GitHub
 */
export type CronOptions = Omit<CronExpressionOptions, 'expression'>;

/**
 * Job runner function
 */
export type SchedulerJobRunner<TParams> = (
    this: Scheduler<TParams>,
    params: TParams,
) => Promise<void>;

export type Scheduler<TParams = never> = SchedulerImpl<TParams>;

/**
 * Job Scheduler options
 */
export type SchedulerOptions = {
    /** Job name */
    name?: NonEmptyString;
    /**
     * Option allows to build a sequence of jobs executed by scheduler.
     * That means next job will not be started until previous one is finished.
     *
     * @default false
     */
    serial?: boolean;
    /**
     * Default error handler for operations.
     * Note: errors will be sent to console if no handler is provided.
     */
    onError?: (error: Error) => void;
    /**
     * Accuracy of event triggering
     * @see createDeepSleeper
     */
    accuracyMS?: number;
    /**
     * Default options for cron-parser
     * @see https://github.com/harrisiirak/cron-parser#options cron-parser on GitHub
     */
    defaultCronParserOptions?: CronOptions;
};

type SchedulerJob = {
    readonly interval: CronExpression;
    readonly abort: () => void;
};

class SchedulerImpl<TParams> {
    #currentIntervalExpression: string | undefined = undefined;
    #currentJob: SchedulerJob | undefined = undefined;
    #currentParams: TParams | undefined = undefined;

    readonly #options: SchedulerOptions;

    constructor(
        readonly name: string,
        private readonly runner: SchedulerJobRunner<TParams>,
        options?: SchedulerOptions,
    ) {
        this.#options = { ...options };
    }

    /**
     * Job is currently scheduled
     */
    get scheduled() {
        return this.#currentJob != null;
    }

    /**
     * Next invocation time
     * @see ZuluISODateTimeString
     */
    get nextInvocation() {
        const v = this.#currentJob?.interval.next().toISOString();
        return (v || undefined) as ZuluISODateTimeString | undefined;
    }

    /**
     * Job has next invocation
     */
    get hasNextInvocation() {
        return this.#currentJob?.interval.hasNext() ?? false;
    }

    /**
     * Schedule a job to run periodically based on a crontab expression.
     *
     * @param crontabExpression Crontab expression
     * @param params Params for runner
     * @param options cron options
     *
     * @see https://crontab.guru/
     * @see https://wikipedia.org/wiki/Cron wiki
     * @see https://github.com/harrisiirak/cron-parser#supported-format cron format
     *
     * @returns true if rescheduling was successful
     */
    schedule: IsNever<
        TParams,
        (crontabExpression: string, params?: undefined, options?: CronExpressionOptions) => boolean,
        (crontabExpression: string, params: TParams, options?: CronExpressionOptions) => boolean
    > = (
        crontabExpression: string,
        params: TParams | undefined,
        options: CronExpressionOptions | undefined,
    ): boolean => {
        crontabExpression = crontabExpression.trim();
        if (crontabExpression !== this.#currentIntervalExpression) {
            this.stop();

            const interval = CronExpressionParser.parse(
                crontabExpression,
                options || this.#options.defaultCronParserOptions,
            );

            this.#currentParams = params;
            this.#currentJob = this.#createJob(interval);
            this.#currentIntervalExpression = crontabExpression;

            return true;
        }
        return false;
    };

    /**
     * Unschedule job execution.
     */
    stop() {
        this.#currentJob?.abort();
        this.#currentJob = undefined;
        this.#currentParams = undefined;
        this.#currentIntervalExpression = undefined;
    }

    /**
     * Assign new parameters for the next job execution.
     */
    setParams(params: TParams) {
        this.#currentParams = params;
    }

    #createJob(interval: CronExpression): SchedulerJob {
        let aborted = false;
        let sleeper: Sleeper | undefined;

        void (async () => {
            // eslint-disable-next-line no-unmodified-loop-condition
            while (!aborted && interval.hasNext()) {
                try {
                    if (aborted) break;

                    const till = interval.next().toDate();

                    if (till < new Date()) {
                        // If the next scheduled time is in the past, skip it
                        continue;
                    }

                    await (sleeper = createDeepSleeper(till, this.#options.accuracyMS)).waitFor();
                    if (aborted) break;

                    const promise = this.runner(
                        // @ts-expect-error Params already defined
                        this.#currentParams,
                    );
                    if (aborted) break;

                    if (this.#options.serial) {
                        await promise;
                    } else {
                        promise.catch((error) => this.#onError(error as Error));
                    }
                } catch (e: any) {
                    this.#onError(e as Error);
                }
            }
        })();

        return {
            interval,
            abort() {
                aborted = true;
                sleeper?.abort();
            },
        };
    }

    #onError(error: Error) {
        if (!this.#options.onError) {
            console.error(`[Scheduler STEP RUN ERROR for ${this.name}]`, error);
        } else {
            this.#options.onError(error);
        }
    }
}

/**
 * Create a job scheduler.
 * @example
 *      // Basic usage
 *      const s1 = createScheduler(
 *          async function onRum(params) {
 *              console.log(`${this.name} executed with params: ${params}`);
 *              await delay(1);
 *          },
 *          {
 *              name: 'JOB 1',
 *              serial: true,
 *          },
 *      );
 *
 *      s1.schedule('20 * * * *', undefined);
 *      s1.schedule('20 * * * *';
 *
 *      // Example with parameters
 *      const task2 = createScheduler<{ a: number; b: number }>(
 *          async (params) => {
 *              console.log('Task 1 executed with params:', params);
 *              await delay(1);
 *          },
 *          {
 *              name: 'Task 1',
 *              serial: true,
 *          },
 *      );
 *
 *      task2.schedule('20 * * * *', { a: 1, b: 2 });
 *      task2.schedule('20 * * * *'); // <- TSC error: you should provide params here.
 */
export function createScheduler<TParams = never>(
    jobRunner: SchedulerJobRunner<TParams>,
    options?: SchedulerOptions | NonEmptyString,
    name?: NonEmptyString,
): Scheduler<TParams> {
    const optsIsName = typeof options === 'string';
    name = optsIsName ? options : options?.name || name || `SCHEDULED JOB #${++jobCount}`;

    return new SchedulerImpl<TParams>(name, jobRunner, optsIsName ? undefined : options);
}

let jobCount = 0;
