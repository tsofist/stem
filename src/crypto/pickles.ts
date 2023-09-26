import { Buffer } from 'buffer';
import { BinaryLike, createHmac, randomBytes, timingSafeEqual } from 'crypto';

export enum PicklesHashingAlgorithm {
    /** HMAC+SHA256 */
    HMACSha256 = 'A1.0',
    /** HMAC+SHA512 */
    HMACSha512 = 'A1.1',
}

export interface SaltedStringHash {
    alg: PicklesHashingAlgorithm;
    salt: string;
    hash: string;
}

export function createSaltedStringHash(
    value: BinaryLike,
    alg = PicklesHashingAlgorithm.HMACSha256,
): SaltedStringHash {
    switch (alg) {
        case PicklesHashingAlgorithm.HMACSha256: {
            const hmac = createHmac('sha256', value);
            const salt = randomBytes(32);

            return {
                alg,
                salt: salt.toString('base64'),
                hash: hmac.update(salt).digest().toString('base64'),
            };
        }
        case PicklesHashingAlgorithm.HMACSha512: {
            const hmac = createHmac('sha512', value);
            const salt = randomBytes(32);

            return {
                alg,
                salt: salt.toString('base64'),
                hash: hmac.update(salt).digest().toString('base64'),
            };
        }
        default:
            throw new Error(`Unknown algorithm: ${alg}`);
    }
}

export function verifySaltedHash(hash: SaltedStringHash, value: BinaryLike): boolean {
    try {
        const salt = Buffer.from(hash.salt, 'base64');
        const storedHash = Buffer.from(hash.hash, 'base64');

        switch (hash.alg) {
            case PicklesHashingAlgorithm.HMACSha256: {
                const hmac = createHmac('sha256', value);
                const computedHash = hmac.update(salt).digest();
                return timingSafeEqual(computedHash, storedHash);
            }
            case PicklesHashingAlgorithm.HMACSha512: {
                const hmac = createHmac('sha512', value);
                const computedHash = hmac.update(salt).digest();
                return timingSafeEqual(computedHash, storedHash);
            }
            default:
                throw new Error(`Unknown algorithm: ${hash.alg}`);
        }
    } catch (err) {
        return false;
    }
}
