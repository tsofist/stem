import { parseSoftwareVersion } from './parser';

describe('parseSoftwareVersion', () => {
    it('should parse version with suffix', () => {
        const input = '26.18.0-next.78';
        const result = parseSoftwareVersion(input);
        expect(result).toEqual({
            raw: '26.18.0-next.78',
            value: '26.18.0',
            suffix: 'next.78',
        });
    });

    it('should parse version without suffix', () => {
        const input = '26.18.0';
        const result = parseSoftwareVersion(input);
        expect(result).toEqual({
            raw: '26.18.0',
            value: '26.18.0',
        });
    });

    it('should parse version with minor and suffix', () => {
        const input = '26.18-next.3';
        const result = parseSoftwareVersion(input);
        expect(result).toEqual({
            raw: '26.18-next.3',
            value: '26.18',
            suffix: 'next.3',
        });
    });

    it('should parse version with year only', () => {
        const input = '2026';
        const result = parseSoftwareVersion(input);
        expect(result).toEqual({
            raw: '2026',
            value: '2026',
        });
    });

    it('should return undefined for invalid version', () => {
        const input = 'invalid-version';
        const result = parseSoftwareVersion(input);
        expect(result).toBeUndefined();
    });

    it('should parse version with complex suffix', () => {
        const input = '10.3.120-alpha.3+feature-4752';
        const result = parseSoftwareVersion(input);
        expect(result).toEqual({
            raw: '10.3.120-alpha.3+feature-4752',
            value: '10.3.120',
            suffix: 'alpha.3+feature-4752',
        });
    });

    it('should parse version with build number suffix', () => {
        const input = '10.3.120+4870';
        const result = parseSoftwareVersion(input);
        expect(result).toEqual({
            raw: '10.3.120+4870',
            value: '10.3.120',
            suffix: '4870',
            build: 4870,
        });
    });
});
