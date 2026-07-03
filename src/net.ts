/**
 * IP Address V4
 * @format ipv4
 */
export type IPV4String = string;

/**
 * IP Address V6
 * @format ipv6
 */
export type IPV6String = string;

/**
 * IP Address
 */
export type IPAddrString = IPV4String | IPV6String;

/**
 * DNS Domain Name
 *
 * @pattern ^(?=.{1,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$
 *
 * @example
 *   corp.com
 *   company.local
 *   example.org
 *   dev.internal
 *
 * @see RE_DNS_DOMAIN_NAME
 */
export type DNSDomainName = string;

/**
 * NetBIOS Domain Name
 *
 * @pattern ^[A-Za-z0-9](?:[A-Za-z0-9-]{0,14})$
 *
 * @example
 *   CORP
 *   DEV
 *   COMPANY
 *   TEST-01
 *
 * @see RE_NETBIOS_DOMAIN_NAME
 */
export type NetBIOSDomainName = string;

/**
 * DNS Domain Name
 * @see DNSDomainName
 */
export const RE_DNS_DOMAIN_NAME =
    /^(?=.{1,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

/**
 * NetBIOS Domain Name
 * @see NetBIOSDomainName
 */
export const RE_NETBIOS_DOMAIN_NAME = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,14})$/;
