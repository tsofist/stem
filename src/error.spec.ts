import {
    hasErrorContext,
    matchErrorMessage,
    raise,
    raiseEx,
    readErrorCode,
    readErrorContext,
    testErrorMessage,
} from './error';

describe('error', () => {
    it('raise', () => {
        const e = () => {
            raise('ERROR');
        };
        expect(e).toThrow('ERROR');
    });
    it('readErrorCode', () => {
        const code = 'EC_SOME_CODE';
        let error: any;
        try {
            raise('ERROR', code);
        } catch (e) {
            error = e;
        }
        expect(readErrorCode(error)).toStrictEqual(code);
    });
    it('readErrorCode with undefined message', () => {
        const code = 'EC_SOME_CODE';
        let error: any;
        try {
            raise(undefined, code);
        } catch (e) {
            error = e;
        }
        expect(readErrorCode(error)).toStrictEqual(code);
        expect(error.message).toStrictEqual(code);
    });
    it('readErrorCode with empty string message', () => {
        const code = 'EC_SOME_CODE';
        let error: any;
        try {
            raise('', code);
        } catch (e) {
            error = e;
        }
        expect(readErrorCode(error)).toStrictEqual(code);
        expect(error.message).toStrictEqual('');
    });
    it('raiseEx', () => {
        const code = 'EC_SOME_CODE';
        const message = 'ERROR';
        const context = { f: 1 };
        let error: any;
        try {
            raiseEx(code, context, message);
        } catch (e) {
            error = e;
        }
        expect(readErrorCode(error)).toStrictEqual(code);
        expect(readErrorContext(error)).toStrictEqual(context);
        expect(error.message).toStrictEqual(message);
    });
    it('readErrorContext field', () => {
        const context = { f: 1 };
        let error: any;
        try {
            raiseEx('EC_!', context);
        } catch (e) {
            error = e;
        }
        expect(readErrorContext(error)).toStrictEqual(context);
        expect(readErrorContext(error, 'f')).toStrictEqual(context.f);
        expect(readErrorContext(error, 'no')).toStrictEqual(undefined);
    });
    it('raiseEx with undefined message', () => {
        const code = 'EC_SOME_CODE';
        let error: any;
        try {
            raiseEx(code);
        } catch (e) {
            error = e;
        }
        expect(readErrorCode(error)).toStrictEqual(code);
        expect(readErrorContext(error)).toStrictEqual(undefined);
        expect(error.message).toStrictEqual(code);
    });
    it('raiseEx with empty string message', () => {
        const code = 'EC_SOME_CODE';
        let error: any;
        try {
            raiseEx(code, undefined, '');
        } catch (e) {
            error = e;
        }
        expect(readErrorCode(error)).toStrictEqual(code);
        expect(readErrorContext(error)).toStrictEqual(undefined);
        expect(error.message).toStrictEqual('');
    });
    it('hasErrorContext', () => {
        const context = { f: 1, m: 'val', b: false };
        let error: any;
        try {
            raiseEx('EC_!', context);
        } catch (e) {
            error = e;
        }
        expect(hasErrorContext(undefined)).toStrictEqual(false);
        expect(hasErrorContext(error)).toStrictEqual(true);
        expect(hasErrorContext(error, 'ff')).toStrictEqual(false);
        expect(hasErrorContext(error, 'f')).toStrictEqual(true);
        expect(hasErrorContext(error, 'f', '1')).toStrictEqual(false);
        expect(hasErrorContext(error, 'f', false)).toStrictEqual(false);
        expect(hasErrorContext(error, 'f', true)).toStrictEqual(false);
        expect(hasErrorContext(error, 'f', 1)).toStrictEqual(true);
        expect(hasErrorContext(error, 'm', 'val')).toStrictEqual(true);
        expect(hasErrorContext(error, 'b', false)).toStrictEqual(true);
        expect(hasErrorContext(error, 'b', true)).toStrictEqual(false);
    });
    it('testErrorMessage with text', () => {
        const error = new Error('This is Super-Error');
        expect(testErrorMessage(error, 'super')).toStrictEqual(true);
        expect(testErrorMessage(error, 'Super')).toStrictEqual(true);
        expect(testErrorMessage(error, 'do')).toStrictEqual(false);
    });
    it('testErrorMessage with text array', () => {
        const error = new Error('This is Super-Error');
        expect(testErrorMessage(error, ['super'])).toStrictEqual(true);
        expect(testErrorMessage(error, ['Super'])).toStrictEqual(true);
        expect(testErrorMessage(error, ['do'])).toStrictEqual(false);
        expect(testErrorMessage(error, ['do', 'Super'])).toStrictEqual(true);
    });
    it('testErrorMessage with RegExp', () => {
        const error = new Error('This is Super-Error');
        expect(testErrorMessage(error, /Super/)).toStrictEqual(true);
        expect(testErrorMessage(error, /super/)).toStrictEqual(false);
    });
    it('matchErrorMessage', () => {
        const error = new Error('Some problem with that');
        const match = matchErrorMessage(error, /(problem with) (.*)/);
        expect(match.length).toStrictEqual(3);
        expect(match[1]).toStrictEqual('problem with');
        expect(match[2]).toStrictEqual('that');
    });
});
