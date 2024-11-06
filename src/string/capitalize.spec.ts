import { capitalize } from './capitalize';

describe('string/upperFirst', () => {
    it('Edge cases', () => {
        expect(capitalize(null as unknown as string)).toStrictEqual('');
        expect(capitalize(undefined as unknown as string)).toStrictEqual('');
        expect(capitalize(false as unknown as string)).toStrictEqual('False');
    });
    it('Basics', () => {
        expect(capitalize('Str')).toStrictEqual('Str');
        expect(capitalize('str')).toStrictEqual('Str');
        expect(capitalize('_str')).toStrictEqual('_str');
        expect(capitalize('❤️')).toStrictEqual('❤️');
        expect(capitalize('❤️this is a heart')).toStrictEqual('❤️this is a heart');
        expect(capitalize('❤')).toStrictEqual('❤');
        expect(capitalize('')).toStrictEqual('');
        expect(capitalize('@')).toStrictEqual('@');
        expect(capitalize('п')).toStrictEqual('П');
        expect(capitalize('hello world')).toStrictEqual('Hello world');
    });
});
