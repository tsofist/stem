import { MSISDN, StringPhoneNumber } from './types.js';

export function msisdnToStringPhoneNumber(value: MSISDN): StringPhoneNumber {
    return `+${value}`;
}
