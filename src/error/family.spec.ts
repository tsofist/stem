import { hasErrorCode, hasErrorContext, readErrorCode, readErrorContextEx } from '../error';
import { ErrorFamily } from './family';
import { ErrorCodeFamily, ErrorFamilyCode, ErrorInstanceFactory } from './types';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

describe('ErrorFamily', () => {
    it('example', () => {
        type AuthErrorCodeFamily = ErrorCodeFamily<'EC_AEF'>;
        const AuthErrorPrefix: AuthErrorCodeFamily = 'EC_AEF_';

        const AuthErrors = ErrorFamily.declare(AuthErrorPrefix, {
            EC_AEF_CODE_REDEEM_FAILED: ErrorFamily.member('Verification code redeem failed'),
            EC_AEF_CODE_THROTTLED: ErrorFamily.member('Verification code has been throttled'),
            EC_AEF_CONTINUE_WITH_AUTH_PROVIDER: ErrorFamily.member<{ throttleTimeout: number }>(
                'Continue sequence with auth provider',
            ),
            EC_AEF_MORE: ErrorFamily.member<{ param1: number }>('More'),
        });

        type AuthErrorCode = ErrorFamilyCode<typeof AuthErrors>;

        expect(AuthErrors).toBeDefined();

        expect(AuthErrors.isMember('EC_AEF_CODE_REDEEM_FAILED')).toBe(true);
        expect(AuthErrors.isMember('EC_AEF_SOME')).toBe(false);

        expect(AuthErrors.belongsTo('EC_AEF_SOME')).toBe(true);
        expect(AuthErrors.belongsTo('EC_AE_SOME')).toBe(false);

        expect(AuthErrors.EC_AEF_CODE_REDEEM_FAILED).toBe('EC_AEF_CODE_REDEEM_FAILED');

        const Codes: AuthErrorCode[] = [
            'EC_AEF_CODE_REDEEM_FAILED',
            'EC_AEF_CODE_THROTTLED',
            'EC_AEF_CONTINUE_WITH_AUTH_PROVIDER',
            'EC_AEF_MORE',
        ];
        expect(Codes).toBeDefined();

        // @ts-expect-error It's OK
        const NonExistentCode: AuthErrorCode = 'EC_AEF_SOME';
        expect(NonExistentCode).toBeDefined();

        expect(AuthErrors.msg('EC_AEF_CODE_REDEEM_FAILED')).toBe('Verification code redeem failed');
        expect(
            // @ts-expect-error It's OK
            AuthErrors.msg('EC_NO'),
        ).toBeUndefined();

        expect(() => AuthErrors.raise('EC_AEF_CODE_REDEEM_FAILED')).toThrow(
            'Verification code redeem failed',
        );

        expect(() =>
            AuthErrors.raise(
                'EC_AEF_CODE_THROTTLED',
                // @ts-expect-error It's OK
                { context: { some: 'value' } },
            ),
        ).toThrow('Verification code has been throttled');

        try {
            AuthErrors.raise('EC_AEF_CONTINUE_WITH_AUTH_PROVIDER', { throttleTimeout: 1000 });
        } catch (e) {
            expect(e).toBeDefined();
            expect(hasErrorCode(e, 'EC_AEF_CONTINUE_WITH_AUTH_PROVIDER')).toBe(true);
            expect(hasErrorContext(e, 'throttleTimeout', 1000)).toBe(true);
            expect(readErrorContextEx(e, 'EC_AEF_CONTINUE_WITH_AUTH_PROVIDER')).toStrictEqual({
                throttleTimeout: 1000,
            });
        }

        {
            const TypeErrorFactory: ErrorInstanceFactory = function (code, context, message) {
                const result = new TypeError(message) as unknown as TypeError & {
                    code: typeof code;
                    context: typeof context;
                };
                result.code = code;
                result.context = context;
                return result;
            };

            const errors = AuthErrors.withErrorFactory(TypeErrorFactory);
            expect(errors.forks).toStrictEqual(1);

            expect(AuthErrors.withErrorFactory(TypeErrorFactory)).toStrictEqual(errors);
            expect(errors.forks).toStrictEqual(1);

            try {
                errors.raise(errors.EC_AEF_CODE_THROTTLED);
            } catch (e) {
                expect(e).toBeDefined();
                expect(e).toBeInstanceOf(TypeError);
                expect(readErrorCode(e)).toBe('EC_AEF_CODE_THROTTLED');
            }
        }

        {
            type TEContext = { n: number; s: string };

            const ctx: TEContext = { n: 1, s: 's' };

            const TypeErrorFactoryWithContext: ErrorInstanceFactory<TypeError, TEContext> =
                function (code, context, message) {
                    const result = new TypeError(message) as unknown as TypeError & {
                        code: typeof code;
                        context: typeof context;
                        extra: TEContext;
                    };
                    result.code = code;
                    result.context = context;
                    result.extra = this;
                    return result;
                };

            const bounded = TypeErrorFactoryWithContext.bind(ctx);

            const errors = AuthErrors.withErrorFactory(bounded);
            expect(errors.forks).toStrictEqual(2);

            expect(AuthErrors.withErrorFactory(bounded)).toStrictEqual(errors);
            expect(errors.forks).toStrictEqual(2);

            try {
                errors.raise(errors.EC_AEF_CODE_THROTTLED);
            } catch (e) {
                expect(e).toBeDefined();
                expect(e).toBeInstanceOf(TypeError);
                expect(readErrorCode(e)).toBe('EC_AEF_CODE_THROTTLED');
                expect((e as any).extra).toBeDefined();
                expect((e as any).extra).toStrictEqual(ctx);
            }
        }
    });
});
