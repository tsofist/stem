import { ErrorCode, errorFrom, readErrorContextEx } from '../error';
import { ARec, PickByValueType, ShallowExact, URec } from '../index';
import {
    ErrorCodeFamily,
    ErrorCodeFamilySep,
    ErrorFamilyMember,
    ErrorInstanceFactory,
} from './types';

const ErrorFactoryFieldID = Symbol('ErrorFactoryFieldID');

const defaultErrorFactory: ErrorInstanceFactory = (code, context, message) => {
    return errorFrom.call(null, {
        code,
        context,
        message,
    });
};

export class ErrorFamily<
    ErrorCodePrefix extends ErrorCode,
    Sep extends ErrorCodeFamilySep,
    Family extends ErrorCodeFamily<ErrorCodePrefix, Sep>,
    Members extends {
        readonly [Code in Family]: ErrorFamilyMember<URec | undefined>;
    },
> {
    static member(message: string): ErrorFamilyMember;
    static member<Context extends URec>(
        message: string,
        contextDefaults?: Partial<Context>,
    ): ErrorFamilyMember<Context>;
    static member<Context extends URec>(
        message: string,
        contextDefaults?: Context,
    ): ErrorFamilyMember<any> {
        return [message, contextDefaults];
    }

    static declare<
        ErrorCodePrefix extends ErrorCode,
        Sep extends ErrorCodeFamilySep,
        Family extends ErrorCodeFamily<ErrorCodePrefix, Sep>,
        Members extends {
            readonly [Code in Family]: ErrorFamilyMember<any>;
        },
    >(
        prefix: Family,
        members: ShallowExact<{ [Code in Family]: ErrorFamilyMember<any> }, Members>,
    ) {
        const result = new this(prefix, members);
        return result as typeof result & {
            readonly [key in keyof Members]: key;
        };
    }

    protected alternativeErrorFactories = new WeakMap<ErrorInstanceFactory, this>();
    protected forkedTimes: number = 0;
    protected [ErrorFactoryFieldID]: ErrorInstanceFactory = defaultErrorFactory;

    protected constructor(
        readonly prefix: Family,
        protected readonly members: Members,
    ) {
        for (const code of Object.keys(members)) {
            (this as ARec)[code] = code;
        }
    }

    get forks() {
        return this.forkedTimes;
    }

    isMember(code: ErrorCode) {
        return code in this.members;
    }

    belongsTo(code: ErrorCode) {
        return code.startsWith(this.prefix);
    }

    msg(code: keyof Members): string | undefined {
        return this.members[code]?.[0];
    }

    raise<T extends keyof PickByValueType<Members, [any]>>(code: T): never;
    raise<T extends keyof Members>(code: T, context: Exclude<Members[T][1], undefined>): never;
    raise(code: keyof Members, context?: object) {
        throw this[ErrorFactoryFieldID](
            code as ErrorCode,
            this.getMergedContext(code, context),
            this.msg(code),
        );
    }

    readContext<T extends keyof Members>(code: T, source: unknown | Error): Members[T][1] {
        return readErrorContextEx(source, code as ErrorCode) as Members[T][1];
    }

    readContextWithDefaults<T extends keyof Members>(
        code: T,
        source: unknown | Error,
    ): Members[T][1] {
        return this.getMergedContext(code, this.readContext(code, source)) as Members[T][1];
    }

    /**
     * Use custom error factory for this family
     */
    withErrorFactory(factory: ErrorInstanceFactory): typeof this {
        let proxy = this.alternativeErrorFactories.get(factory);

        if (!proxy) {
            proxy = new Proxy(this, {
                get(target, prop, receiver) {
                    if (prop === ErrorFactoryFieldID) {
                        return factory;
                    }
                    return Reflect.get(target, prop, receiver);
                },
            });
            this.forkedTimes++;
            this.alternativeErrorFactories.set(factory, proxy);
        }

        return proxy;
    }

    protected getMergedContext(
        code: keyof Members,
        context: object | undefined,
    ): object | undefined {
        const defaults = this.members[code][1] as undefined | object;
        return context || defaults ? { ...defaults, ...context } : undefined;
    }
}
