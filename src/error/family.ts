import {
    ErrorCode,
    ErrorCodeFamily,
    ErrorCodeSeparator,
    raiseEx,
    readErrorContextEx,
} from '../error';
import { ARec, OmitByValueType, ShallowExact, URec } from '../index';

export type ErrorFamilyMember<Context extends URec> = readonly [
    publicMessage: string,
    contextDefaults?: Context,
];

export class ErrorFamily<
    ErrorCodePrefix extends ErrorCode,
    Sep extends ErrorCodeSeparator,
    Family extends ErrorCodeFamily<ErrorCodePrefix, Sep>,
    Members extends {
        readonly [Code in Family]: ErrorFamilyMember<any>;
    },
> {
    static member<Context extends URec = never>(
        message: string,
        contextDefaults?: Context,
    ): ErrorFamilyMember<Context> {
        return [message, contextDefaults];
    }

    static declare<
        ErrorCodePrefix extends ErrorCode,
        Sep extends ErrorCodeSeparator,
        Family extends ErrorCodeFamily<ErrorCodePrefix, Sep>,
        Members extends {
            readonly [Code in Family]: ErrorFamilyMember<any>;
        },
    >(
        prefix: Family,
        members: ShallowExact<{ [Code in Family]: ErrorFamilyMember<any> }, Members>,
    ) {
        const result = new ErrorFamily(prefix, members);
        return result as typeof result & {
            readonly [key in keyof Members]: key;
        };
    }

    protected constructor(
        readonly prefix: Family,
        protected readonly members: Members,
    ) {
        for (const code of Object.keys(members)) {
            (this as ARec)[code] = code;
        }
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

    raise<T extends keyof OmitByValueType<Members, [any, undefined]>>(code: T): never;
    raise<T extends keyof Members>(code: T, context: Members[T][1]): never;
    raise(code: keyof Members, context?: object) {
        const defaults = this.members[code][1] as undefined | object;
        return raiseEx(
            code as ErrorCode,
            context || defaults ? { ...defaults, ...context } : undefined,
            this.msg(code),
        );
    }

    readContext<T extends keyof Members>(code: T, source: unknown | Error): Members[T][1] {
        return readErrorContextEx(source, code as ErrorCode);
    }

    readContextWithDefaults<T extends keyof Members>(
        code: T,
        source: unknown | Error,
    ): Members[T][1] {
        return this.getMergedContext(code, this.readContext(code, source));
    }

    protected getMergedContext(
        code: keyof Members,
        context: object | undefined,
    ): object | undefined {
        const defaults = this.members[code][1] as undefined | object;
        return context || defaults ? { ...defaults, ...context } : undefined;
    }
}
