import { matchErrorMessage, raise, readErrorCode, testErrorMessage } from './error';

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
