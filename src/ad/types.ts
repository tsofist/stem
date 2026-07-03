/**
 * AD: Security Accounts Manager Account Name
 * > Attribute: `sAMAccountName`
 *
 * @pattern ^[A-Za-z0-9][A-Za-z0-9._-]{0,19}$
 *
 * @example
 *   user1
 *   administrator
 *   john.smith
 *   svc_backup
 *
 * @see RE_AD_SAM_ACCOUNT_NAME
 */
export type ADSAMAccountName = string;

/**
 * AD: User Principal Name (UPN)
 * > Attribute: `userPrincipalName`
 *
 * @pattern ^[^@\\/\s]+@[^@\\/\s]+$
 *
 * @example
 *   user1@corp
 *   user1@corp.com
 *   john.smith@example.org
 *   svc_backup@company.local
 *   admin@test.internal
 *
 * @see RE_AD_USER_PRINCIPAL_NAME
 */
export type ADUserPrincipalName = `${string}@${string}`;

/**
 * AD: Windows Full Logon Name
 *
 * @pattern ^[A-Za-z0-9](?:[A-Za-z0-9-]{0,14})\\[A-Za-z0-9][A-Za-z0-9._-]{0,19}$
 *
 * @example
 *   CORP\user1
 *   DEV\administrator
 *   COMPANY\john.smith
 *   TEST-01\svc_backup
 *
 * @see RE_AD_DOWNLEVEL_LOGON_NAME
 */
export type ADDownLevelLogonName = `${string}\\${string}`;

/**
 * AD: Security Accounts Manager Account Name
 * @see ADSAMAccountName
 */
export const RE_AD_SAM_ACCOUNT_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,19}$/;

/**
 * AD: User Principal Name (UPN)
 * @see ADUserPrincipalName
 */
export const RE_AD_USER_PRINCIPAL_NAME = /^[^@\\/\s]+@[^@\\/\s]+$/;

/**
 * AD: Windows Full Logon Name
 * @see ADDownLevelLogonName
 */
export const RE_AD_DOWNLEVEL_LOGON_NAME =
    /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,14})\\[A-Za-z0-9][A-Za-z0-9._-]{0,19}$/;
