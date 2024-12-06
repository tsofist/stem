import { EllipsisSymbol, truncateString } from './truncate';

describe('string/truncateString', () => {
    it('Edge cases', () => {
        expect(truncateString('', 5)).toStrictEqual('');
        expect(truncateString('short', 10)).toStrictEqual('short');
        expect(truncateString('exactly', 7)).toStrictEqual('exactly');
        expect(truncateString('exactly', 7, '...')).toStrictEqual('exactly');
        expect(truncateString('short', 0)).toStrictEqual('');
        expect(truncateString('short', -1)).toStrictEqual('');

        expect(truncateString('Emoji 😊 string', 8)).toStrictEqual(`Emoji 😊 ${EllipsisSymbol}`);
        expect(truncateString('Emoji 😊 string', 7)).toStrictEqual(`Emoji 😊${EllipsisSymbol}`);
        expect(truncateString('Emoji 😊 string', 6)).toStrictEqual(`Emoji ${EllipsisSymbol}`);
        expect(truncateString('中文字符', 2)).toStrictEqual(`中文${EllipsisSymbol}`);
        expect(truncateString('中文字符', 1, '...')).toStrictEqual(`中...`);
    });

    it('Basics', () => {
        expect(truncateString('This is a long string', 11)).toStrictEqual(
            `This is a l${EllipsisSymbol}`,
        );
        expect(truncateString('This is a long string', 10, '...')).toStrictEqual(`This is a ...`);
        expect(truncateString('Another example', 7)).toStrictEqual(`Another${EllipsisSymbol}`);
        expect(truncateString('Another example', 7, '...')).toStrictEqual(`Another...`);
    });
});
