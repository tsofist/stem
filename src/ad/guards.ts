import {
    type ADDownLevelLogonName,
    type ADSAMAccountName,
    type ADUserPrincipalName,
    RE_AD_DOWNLEVEL_LOGON_NAME,
    RE_AD_SAM_ACCOUNT_NAME,
    RE_AD_USER_PRINCIPAL_NAME,
} from './types';

export function isADSAMAccountName(value: unknown): value is ADSAMAccountName {
    return typeof value === 'string' && RE_AD_SAM_ACCOUNT_NAME.test(value);
}

export function isADUserPrincipalName(value: unknown): value is ADUserPrincipalName {
    return typeof value === 'string' && RE_AD_USER_PRINCIPAL_NAME.test(value);
}

export function isADNetBIOSLogonName(value: unknown): value is ADDownLevelLogonName {
    return typeof value === 'string' && RE_AD_DOWNLEVEL_LOGON_NAME.test(value);
}
