export function capitalize(input: string, forceCase = false): string {
    input =
        input == null
            ? ''
            : // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
              String(input);

    if (input.length >= 1) {
        return (
            input.charAt(0).toUpperCase() +
            (forceCase ? input.substring(1).toLowerCase() : input.substring(1))
        );
    }

    return input;
}
