import { MSISDN, StringPhoneNumber } from './types';

export function msisdnToStringPhoneNumber(value: MSISDN): StringPhoneNumber {
    return `+${value}`;
}
