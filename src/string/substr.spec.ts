import { substr } from './substr.js';

describe('string/substr', () => {
    it('Edge cases', () => {
        expect(substr(undefined, 0)).toStrictEqual(undefined);
        expect(substr(null, 0)).toStrictEqual(undefined);
        expect(substr('Str', -100)).toStrictEqual(undefined);
        expect(substr('Str', 0, 0)).toStrictEqual('');
        expect(substr('Str', 0)).toStrictEqual('Str');
        expect(substr('Str', 0, 1000)).toStrictEqual('Str');
        expect(substr('MyStr', 'My', 'Str')).toStrictEqual('');
    });
    it('Skip', () => {
        expect(substr('LongStr', 4)).toStrictEqual('Str');
        expect(substr('LongStr', 'Long')).toStrictEqual('Str');
    });
    it('Length', () => {
        expect(substr('MyStr', 0, 2)).toStrictEqual('My');
        expect(substr('MyStr', 'My', 3)).toStrictEqual('Str');
        expect(substr('MyStr', 'My', 'tr')).toStrictEqual('S');
    });
    it('From/Till positions as string', () => {
        expect(substr('My-15-tmp-str-89', '15', '89')).toStrictEqual('-tmp-str-');
        expect(substr('89-My-15-tmp-str-89', '15', '89')).toStrictEqual('-tmp-str-');
        expect(substr('to be or not to be', 'be', 'to')).toStrictEqual(' or not ');
        expect(substr('housing-stock/.db/latest/002.schema.sql', '/.db/', '/')).toStrictEqual(
            'latest',
        );
    });
});
