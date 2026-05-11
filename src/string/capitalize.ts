export function capitalize(input: string): string {
    input =
        input == null
            ? ''
            : // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
              String(input);
    return input.length >= 1 ? input.charAt(0).toUpperCase() + input.substring(1) : input;
}
