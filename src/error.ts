import { asArray } from './as-array';
import { ARec, ArrayMay, Primitive, URec } from './index';

export const ErrorCodePrefix = 'EC_';

/**
 * @pattern ^EC_[A-Z][a-zA-Z0-9\._\-|]{0,200}$
 */
export type ErrorCode = `${typeof ErrorCodePrefix}${string}`;
export type ErrorCodeSeparator = '_' | '.';

export type ErrorCodeFamily<
    TCode extends ErrorCode,
    Sep extends ErrorCodeSeparator = '_',
    _ extends string = `${TCode}${Sep}${string}`,
> = Sep extends '_' ? Uppercase<_> : _;

export function raise(message: string): never;
export function raise(message: string, code: ErrorCode): never;
export function raise(message: undefined, code: ErrorCode): never;
export function raise(message: string, context: ARec): never;
export function raise(message: string | undefined, meta?: ErrorCode | ARec): never {
    const metaIsString = typeof meta === 'string';
    const code = meta && metaIsString ? meta : undefined;
    const context = meta && !metaIsString ? meta : undefined;
    throw createError(code, context, message);
}

export function raiseEx<Ctx extends ARec = URec>(
    code: ErrorCode,
    context?: Ctx,
    message?: string,
): never {
    throw createError(code, context, message);
}

export function readErrorContext<T extends object = URec>(error: any): T | undefined;
export function readErrorContext<T = unknown>(error: any, field: string): T | undefined;
export function readErrorContext<T>(error: any, field?: string): T | undefined {
    if (error && error instanceof Error && 'context' in error) {
        const result = error.context as ARec;
        if (result && typeof result === 'object') {
            if (field == null) return result as T;
            else return result[field] as T;
        }
    }
    return undefined;
}

export function readErrorContextEx<T extends object = URec>(
    error: any,
    code: ErrorCode,
): T | undefined;
export function readErrorContextEx<T = unknown>(
    error: any,
    code: ErrorCode,
    field: string,
): T | undefined;
export function readErrorContextEx<T>(error: any, code: ErrorCode, field?: string): T | undefined {
    if (hasErrorCode(error, code)) {
        return readErrorContext(
            error,
            // @ts-expect-error It's OK
            field,
        );
    }
    return undefined;
}

export function hasErrorContext(error: any, field?: string, value?: Primitive) {
    if (
        error &&
        error instanceof Error &&
        'context' in error &&
        error.context != null &&
        typeof error.context === 'object'
    ) {
        if (!field) return true;
        if (value == null) return field in error.context;
        return (error.context as ARec)[field] === value;
    }
    return false;
}

export function readErrorCode(error: any): ErrorCode | undefined {
    if (error && error instanceof Error && 'code' in error) {
        const result = error.code;
        if (isErrorCode(result)) return result;
    }
    return undefined;
}

export function hasErrorCode(error: any, code: ErrorCode): boolean {
    return code != null && readErrorCode(error) === code;
}

export function matchErrorMessage(error: any, re: RegExp): RegExpMatchArray | string[] {
    if (error && error instanceof Error) {
        const message = error + '';
        return message.match(re) || [];
    }
    return [];
}

/**
 * Error message match to RegExp or text (case-insensitive)
 */
export function testErrorMessage(error: any, math: ArrayMay<RegExp | string>): boolean {
    if (error && error instanceof Error && math) {
        const message = error + '';
        return asArray(math).some((m) => {
            if (m instanceof RegExp) return m.test(message);
            return message.toLowerCase().includes(m.toLowerCase());
        });
    }
    return false;
}

export interface MatchErrorCondition {
    code?: ErrorCode;
    context?: [field: string, value: Primitive];
    message?: ArrayMay<string | RegExp>;
}

export function matchError(error: any, condition: MatchErrorCondition): boolean {
    const { code, context, message } = condition;
    if (code || context || message) {
        if (condition.code && !hasErrorCode(error, condition.code)) return false;
        if (condition.context && !hasErrorContext(error, ...condition.context)) return false;
        if (condition.message && !testErrorMessage(error, condition.message)) return false;
        return true;
    }
    return false;
}

function createError(code?: ErrorCode, context?: ARec, message?: string): Error {
    const result = new Error(message ?? code);

    if (code) {
        Object.defineProperty(result, 'code', {
            value: code,
            enumerable: true,
            writable: false,
            configurable: false,
        });
    }

    if (context) {
        Object.defineProperty(result, 'context', {
            value: context,
            enumerable: true,
            writable: false,
            configurable: false,
        });
    }

    return result;
}

export function errorFrom(source: any): Error {
    if (source instanceof Error) return source;

    const { code, context, message } = source || {};
    return createError(code, context, message);
}

export function isErrorCode(source: any): source is ErrorCode {
    return (
        typeof source === 'string' &&
        source.startsWith(ErrorCodePrefix) &&
        source.length > ErrorCodePrefix.length
    );
}
