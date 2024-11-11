import { hasErrorCode, hasErrorContext, readErrorCode, readErrorContextEx } from '../error';
import { ErrorFamily } from './family';
import {
    AnyErrorFamily,
    ErrorCodeFamily,
    ErrorFamilyCode,
    ErrorFamilyContext,
    ErrorFamilyRaiseParams,
    ErrorInstanceFactory,
} from './types';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

describe('ErrorFamily: examples', () => {
    it('example-1', () => {
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

describe('ErrorFamily: types', () => {
    type F1 = ErrorCodeFamily<'EC_F1'>;
    const F1Prefix: F1 = 'EC_F1_';
    type F1ErrorCode = ErrorFamilyCode<typeof F1Errors>;

    const F1Errors = ErrorFamily.declare(F1Prefix, {
        EC_F1_S1: ErrorFamily.member('Message for S1'),
        EC_F1_WITH_CTX1: ErrorFamily.member<{ n: number }>('Message for W_CTX1'),
        EC_F1_WITH_CTX2: ErrorFamily.member('Message for W_CTX2', { f1: 1 }),
        EC_F1_WITH_CTX3_1: ErrorFamily.member<{ f3_1: boolean }>('Message for W_CTX3_1'),
        EC_F1_WITH_CTX3_2: ErrorFamily.member<{ f3_1: boolean }>('Message for W_CTX3_2', {}),
        EC_F1_WITH_CTX3_3: ErrorFamily.member<{ f3_1: boolean }>('Message for W_CTX3_3', {
            f3_1: false,
        }),
        EC_F1_WITH_CTX4: ErrorFamily.member<{ f4: boolean; add: string }>('Message for W_CTX4', {
            add: 'add',
        }),
    });

    it('should correctly infer error codes', () => {
        expect([
            'EC_F1_S1',
            'EC_F1_WITH_CTX1',
            'EC_F1_WITH_CTX2',
            'EC_F1_WITH_CTX3_1',
            'EC_F1_WITH_CTX3_2',
            'EC_F1_WITH_CTX3_3',
            'EC_F1_WITH_CTX4',
        ] satisfies F1ErrorCode[]).toBeDefined();

        expect([
            // @ts-expect-error It's OK
            'EC',
            // @ts-expect-error It's OK
            'EC_F1',
            // @ts-expect-error It's OK
            'EC_F1_',
        ] satisfies F1ErrorCode[]).toBeDefined();
    });

    it('should correctly infer members context', () => {
        expect([
            //
            undefined satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_S1'>,
            // @ts-expect-error Expected
            {} satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_S1'>,
            { n: 100 } satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX1'>,
            // @ts-expect-error Expected
            { n: 0, b: false } satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX1'>,
            // @ts-expect-error Expected
            undefined satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX1'>,
            // @ts-expect-error Expected
            undefined satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX2'>,
            // @ts-expect-error Expected
            {} satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX2'>,
            // @ts-expect-error Expected
            { t: 11 } satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX2'>,
            { f1: 100 } satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX2'>,
            // @ts-expect-error Expected
            { f1: 100, f2: true } satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX2'>,
            // @ts-expect-error Expected
            { f1: 100, f2: true } satisfies ErrorFamilyContext<
                typeof F1Errors,
                'EC_F1_WITH_CTX3_1'
            >,
            // @ts-expect-error Expected
            {} satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX3_1'>,
            { f3_1: false } satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX3_1'>,
            { f3_1: true } satisfies ErrorFamilyContext<typeof F1Errors, 'EC_F1_WITH_CTX3_1'>,
        ]).toBeDefined();
    });

    it('should correctly infer raise params', () => {
        expect([
            //
            ['EC_F1_S1'],
            ['EC_F1_WITH_CTX1', { n: -1 }],
            ['EC_F1_WITH_CTX2', { f1: 1000 }],
            ['EC_F1_WITH_CTX3_1', { f3_1: false }],
            ['EC_F1_WITH_CTX3_3', { f3_1: true }],
            ['EC_F1_WITH_CTX4', { f4: true, add: 'add' }],
        ] satisfies ErrorFamilyRaiseParams<typeof F1Errors>[]).toBeDefined();

        expect([
            // @ts-expect-error Expected
            ['EC_F1_WITH_CTX2'],
            // @ts-expect-error Expected
            ['EC_F1_WITH_CTX2', {}],
            // @ts-expect-error Expected
            ['EC_F1_WITH_CTX3_2'],
            // @ts-expect-error Expected
            ['EC_F1_WITH_CTX2', undefined],
            // @ts-expect-error Expected
            ['EC_F1_WITH_CTX3_1', undefined],
            // @ts-expect-error Expected
            ['EC_F1_WITH_CTX3_1', {}],
            // @ts-expect-error Expected
            ['EC_F1_WITH_CTX3_1', { f3_1: undefined }],
        ] satisfies ErrorFamilyRaiseParams<typeof F1Errors>[]).toBeDefined();

        try {
            F1Errors.raise('EC_F1_S1');
            F1Errors.raise('EC_F1_WITH_CTX3_1', { f3_1: true });
            F1Errors.raise('EC_F1_WITH_CTX3_1', { f3_1: false });
        } catch (e) {
            expect(e).toBeDefined();
        }

        try {
            F1Errors.raise(
                'EC_F1_S1',
                // @ts-expect-error Expected
                {},
            );
            F1Errors.raise(
                'EC_F1_S1',
                // @ts-expect-error Expected
                undefined,
            );
            F1Errors.raise('EC_F1_WITH_CTX3_1', {
                // @ts-expect-error Expected
                f3_1: 12,
            });
            F1Errors.raise(
                'EC_F1_WITH_CTX3_1',
                // @ts-expect-error Expected
                {},
            );
            F1Errors.raise('EC_F1_WITH_CTX3_1', {
                // @ts-expect-error Expected
                f3_1: undefined,
            });
            // @ts-expect-error Expected
            F1Errors.raise('EC_F1_WITH_CTX3_1');
            F1Errors.raise(
                'EC_F1_WITH_CTX3_1',
                // @ts-expect-error Expected
                undefined,
            );
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    it('should correctly infer raise params as rest parameters', () => {
        function raiseInternalServerError<Family extends AnyErrorFamily>(
            errorFamily: Family,
            ...params: ErrorFamilyRaiseParams<typeof errorFamily>
        ) {
            return errorFamily
                .withErrorFactory((code) => {
                    throw new Error(code);
                })
                .raise(
                    // @ts-expect-error It's OK
                    ...params,
                );
        }

        try {
            raiseInternalServerError(F1Errors, 'EC_F1_S1');
            raiseInternalServerError(F1Errors, 'EC_F1_WITH_CTX1', { n: 22 });
            raiseInternalServerError(F1Errors, 'EC_F1_WITH_CTX3_1', { f3_1: true });
        } catch (e) {
            expect(e).toBeDefined();
        }

        try {
            raiseInternalServerError(
                F1Errors,
                // @ts-expect-error Expected
                'EC_F1_S1',
                undefined,
            );
            raiseInternalServerError(
                F1Errors,
                // @ts-expect-error Expected
                'EC_F1_WITH_CTX1',
                {},
            );
            raiseInternalServerError(F1Errors, 'EC_F1_WITH_CTX3_1', {
                // @ts-expect-error Expected
                no: true,
            });
        } catch (e) {
            expect(e).toBeDefined();
        }
    });
});
