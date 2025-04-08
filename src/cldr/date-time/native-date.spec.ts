import { dateToTypedString, typedStringToDate } from './native-date';
import { TypedDateTimeString, ISODateTimeType } from './types';
import { minutesToUTCOffset } from './utc-offset';

describe('typedStringToDate', () => {
    it('converts LocalDate string to Date object', () => {
        const result = typedStringToDate('2024-07-23', ISODateTimeType.LocalDate);
        expect(result).toEqual(new Date('2024-07-23T00:00:00'));
    });

    it('returns undefined for nullable input', () => {
        expect(typedStringToDate(null, ISODateTimeType.LocalDate)).toBeUndefined();
        expect(typedStringToDate(undefined, ISODateTimeType.LocalDate)).toBeUndefined();
    });

    it('converts LocalTime string to Date object', () => {
        const result = typedStringToDate('22:15:00', ISODateTimeType.LocalTime);
        const e = new Date();
        e.setHours(22, 15, 0, 0);
        expect(result?.getHours()).toStrictEqual(e.getHours());
        expect(result?.getMinutes()).toStrictEqual(e.getMinutes());
        expect(result?.getSeconds()).toStrictEqual(e.getSeconds());
    });

    it('converts ZuluDate string to Date object', () => {
        const result = typedStringToDate('2024-07-23T23:00:50Z', ISODateTimeType.ZuluDate);
        expect(result).toEqual(new Date('2024-07-23T00:00:00Z'));
    });

    it('throws error for unknown ISODateTimeType', () => {
        expect(() =>
            typedStringToDate(
                '2024-07-23',
                // @ts-expect-error Testing unknown type
                999,
            ),
        ).toThrow('Unknown ISODateTimeType: 999');
    });
});

describe('dateToTypedString', () => {
    it('converts Date object to LocalDate string', () => {
        const date = new Date('2024-07-23T00:00:00');
        const result = dateToTypedString(date, ISODateTimeType.LocalDate);
        expect(result).toBe('2024-07-23');
    });

    it('returns undefined for nullable input', () => {
        expect(dateToTypedString(null, ISODateTimeType.LocalDate)).toBeUndefined();
        expect(dateToTypedString(undefined, ISODateTimeType.LocalDate)).toBeUndefined();
    });

    it('', () => {
        const randomType: ISODateTimeType =
            Math.random() > 0.5 ? ISODateTimeType.LocalDate : ISODateTimeType.LocalTime;

        const typesTest = [
            dateToTypedString(new Date(), randomType)!,
            dateToTypedString(new Date(), ISODateTimeType.LocalDateTime)!,
            dateToTypedString(new Date(), ISODateTimeType.ZuluDateTime)!,
        ] satisfies TypedDateTimeString[];
        expect(typesTest).toBeTruthy();
    });

    it('throws error for invalid input', () => {
        expect(() =>
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            dateToTypedString(
                // @ts-expect-error Testing invalid input
                'AAA',
                ISODateTimeType.LocalDate,
            ),
        ).toThrow('Invalid input: AAA');
    });

    it('converts Date object to LocalTime string', () => {
        const date = new Date();
        date.setHours(22, 15, 0, 0);
        const result = dateToTypedString(date, ISODateTimeType.LocalTime);
        expect(result).toBe(`22:15:00${minutesToUTCOffset(date.getTimezoneOffset())}`);
    });

    it('converts Date object to ZuluDate string', () => {
        const date = new Date('2024-07-23T23:45:59Z');
        const result = dateToTypedString(date, ISODateTimeType.ZuluDate);
        expect(result).toBe('2024-07-23T00:00:00Z');
    });

    it('throws error for unknown type', () => {
        const date = new Date('2024-07-23T00:00:00');
        expect(() =>
            dateToTypedString(
                date,
                // @ts-expect-error Testing unknown type
                999,
            ),
        ).toThrow('Unknown date type: 999');
    });
});
