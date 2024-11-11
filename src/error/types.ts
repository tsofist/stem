import type { ErrorCode } from '../error';
import type { IsNever, PickFieldsWithPrefix, URec, ValuesOf } from '../index';
import type { ErrorFamily } from './family';

/**
 * Defines an error code family based on a shared prefix `TCode` and a separator `TSep`.
 *
 * This type enables defining a family of error codes with a standardized format, allowing the identification of
 * codes belonging to the same family.
 *
 * The separator (`TSep`) dictates the format of the error codes:
 *   - `_`: enforces that error codes are in uppercase (e.g., "EC_ERROR_CODE" or "EC_USER_SUSPENDED").
 *   - `.`: allows error codes to use any case (e.g., "EC_AUTH.User.Suspended" or "EC_USER.Blocked").
 *
 * @example
 *   // Example 1: Defining an error code family with `_` separator (uppercase)
 *   type AuthErrorCodeFamily = ErrorCodeFamily<'EC_A1'>;
 *
 *   const EC_A1_TOKEN_INVALID = 'EC_A1_TOKEN_INVALID' satisfies AuthErrorCodeFamily;
 *   const EC_A1_SESSION_EXPIRED = 'EC_A1_SESSION_EXPIRED' satisfies AuthErrorCodeFamily;
 *   const EC_A1_USER_DISABLED = 'EC_A1_USER_DISABLED' satisfies AuthErrorCodeFamily;
 *
 * @example
 *   // Example 2: Defining an error code family with `.` separator (mixed case)
 *   type AuthErrorCodeFamilyWithDot = ErrorCodeFamily<'EC_A2', '.'>;
 *
 *   const EC_A2_TOKEN_INVALID = 'EC_A2.TokenInvalid' satisfies AuthErrorCodeFamilyWithDot;
 *   const EC_A2_SESSION_EXPIRED = 'EC_A2.SessionExpired' satisfies AuthErrorCodeFamilyWithDot;
 *   const EC_A2_USER_DISABLED = 'EC_A2.User.Disabled' satisfies AuthErrorCodeFamilyWithDot;
 */
export type ErrorCodeFamily<
    TCode extends ErrorCode,
    TSep extends ErrorCodeFamilySep = '_',
    _ extends string = `${TCode}${TSep}${string}`,
> = TSep extends '_' ? Uppercase<_> : _;

export type ErrorCodeFamilySep = '_' | '.';

export type ErrorFamilyMember<Context extends URec | undefined = undefined> =
    Context extends undefined
        ? [publicMessage: string]
        : [publicMessage: string, contextDefaults?: Context];

/**
 * Extract all error codes from the family
 */
export type ErrorFamilyCode<Family extends AnyErrorFamily> = keyof PickFieldsWithPrefix<
    Family,
    Family['prefix']
>;

/**
 * Extract members type from the error family
 */
export type ErrorFamilyMembers<Family extends AnyErrorFamily> =
    Family extends ErrorFamily<any, any, any, infer Members> ? Members : never;

/**
 * Extract all parameters for raising errors from the family
 */
export type ErrorFamilyRaiseParams<
    F extends AnyErrorFamily,
    M extends ErrorFamilyMembers<F> = ErrorFamilyMembers<F>,
> = ValuesOf<ErrorFamilyRaiseParamsByCode<F, M>>;

export type ErrorFamilyRaiseParamsByCode<
    F extends AnyErrorFamily,
    M extends ErrorFamilyMembers<F> = ErrorFamilyMembers<F>,
> = {
    [Code in keyof M]: M[Code][1] extends undefined
        ? [Code]
        : [Code, Exclude<M[Code][1], undefined>];
};

export type ErrorFamilyContext<F extends AnyErrorFamily, C extends ErrorFamilyCode<F>> =
    F extends ErrorFamily<any, any, any, infer Members>
        ? IsNever<Exclude<Members[C][1], undefined>, undefined>
        : undefined;

/**
 * Factory function for creating error instances
 * You can use it to create custom error instances e.g.
 *   with additional fields or specific types such as NestJS exceptions
 */
export type ErrorInstanceFactory<R extends Error = Error, TCtx = void> = (
    this: TCtx,
    code: ErrorCode,
    context: object | undefined,
    message: string | undefined,
) => R;

/**
 * @see ErrorFamily
 */
export type AnyErrorFamily = ErrorFamily<ErrorCode, ErrorCodeFamilySep, any, any>;
