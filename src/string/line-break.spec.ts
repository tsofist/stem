import { breakStringByLength } from './line-break';

describe('string/breakStringByLength', () => {
    it('Edge cases', () => {
        expect(breakStringByLength('', 5)).toStrictEqual('');
        expect(breakStringByLength('test', 0)).toStrictEqual('');
        expect(breakStringByLength('test', -1)).toStrictEqual('');
        expect(breakStringByLength('test', 5)).toStrictEqual('test');
        expect(breakStringByLength('中文字符', 2)).toStrictEqual('中文\n字符');
        expect(breakStringByLength('Emoji 😊 string 😎', 8)).toStrictEqual('Emoji 😊 \nstring 😎');
    });

    it('Basics', () => {
        expect(breakStringByLength('hello world', 5)).toStrictEqual('hello\n worl\nd');
        expect(breakStringByLength('hello world', 5, ' ')).toStrictEqual('hello  worl d');
        expect(breakStringByLength('hello', 2)).toStrictEqual('he\nll\no');
        expect(breakStringByLength('hello', 1)).toStrictEqual('h\ne\nl\nl\no');
        expect(breakStringByLength('hello', 10)).toStrictEqual('hello');
    });
});
