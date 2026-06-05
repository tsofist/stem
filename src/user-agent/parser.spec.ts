import { parseUserAgentString } from './parser';

describe('parseUserAgentString', () => {
    it('should parse user agent string into structured object', () => {
        const value = parseUserAgentString(
            [
                'My.SupeApp.Cli/1.2.0 (Dart; @api-store/service-api.cms 26.18.0-next.78)',
                'com.my-super-app.platform/5.17.2',
                'lib-a/5.0',
                'lib-a-compat/15 (Windows)',
                'Element/15481-stable',
                'Element.Compat/15481-rc.982',
                'Gecko/20100101',
                'Firefox/42.0',
            ].join(' '),
        );

        expect(String(value)).toMatchSnapshot();
    });

    it('should return empty object for null or empty string', () => {
        expect(parseUserAgentString(undefined).toString()).toStrictEqual('{}');
        expect(parseUserAgentString(null).toString()).toStrictEqual('{}');
        expect(parseUserAgentString('').toString()).toStrictEqual('{}');
    });
});
