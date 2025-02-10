/**
 * Determines if a year is a leap year.
 */
export function isLeapYear(year: number): boolean {
    return !(year % 4 || (!(year % 100) && year % 400));
}
