import { CryptoString } from './crypto-string';

describe('CryptoString', () => {
    const cryptoKey = CryptoString.createCryptoKey();
    const cryptoString = new CryptoString(cryptoKey);
    const testValue = 'Hello, World!';

    it('should encrypt and decrypt a value correctly', () => {
        const encrypted = cryptoString.encrypt(testValue);
        const decrypted = cryptoString.decrypt(encrypted);
        expect(decrypted).toBe(testValue);
    });

    it('should throw an error if the crypto key is empty', () => {
        expect(() => new CryptoString('')).toThrow(
            'Crypto key must be non-empty base64 string (use openssl rand -base64 32)',
        );
    });
});
