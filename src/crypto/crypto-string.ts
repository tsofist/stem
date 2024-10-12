import { Buffer } from 'buffer';
import { BinaryLike, CipherKey, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { raise } from '../error';
import { Base64String } from '../index';

const CIPHER_ALGORITHM = 'aes-256-cbc';

/**
 * A class for encrypting and decrypting data using a crypto key.
 */
export class CryptoString {
    static createCryptoKey(): Base64String {
        return randomBytes(32).toString('base64');
    }

    readonly #cryptoKey: CipherKey;

    /**
     * @see CryptoString.createCryptoKey
     * @example
     *   openssl rand -base64 32
     */
    constructor(cryptoKey: Base64String) {
        if (!cryptoKey || cryptoKey.length < 44)
            raise('Crypto key must be non-empty base64 string (use openssl rand -base64 32)');
        this.#cryptoKey = Buffer.from(cryptoKey, 'base64');
    }

    encrypt(value: BinaryLike): string {
        const iv = randomBytes(16);
        const cipher = createCipheriv(CIPHER_ALGORITHM, this.#cryptoKey, iv);
        return Buffer.concat([iv, cipher.update(value), cipher.final()]).toString('base64');
    }

    decrypt(value: string): string {
        const data = Buffer.from(value, 'base64');
        const decipher = createDecipheriv(CIPHER_ALGORITHM, this.#cryptoKey, data.subarray(0, 16));
        return Buffer.concat([decipher.update(data.subarray(16)), decipher.final()]).toString();
    }
}
