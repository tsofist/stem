# _all you need is_ `Stem`

This library is not from the world of nano trends, however, everything (or almost everything) in it is used in almost every project that I personally start. Therefore, perhaps you will need it too.


## What's included
All utilities are grouped by directories and the best way to get acquainted with the functionality is to just go through all the files in the `src` directory and see what is hidden there.

Don't forget about the `src/index.ts` file - there is probably everything that you will definitely use daily during active development.

## What should we pay attention to?

### `JSDoc` annotations
Most of the types in this library contain special annotations that can be used to generate JSON schemas (for example, using [@vega/ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator)).
This allows you to use these types to validate data at runtime, as well as to generate documentation.
In addition, these annotations are recommended for use in cases where the expressiveness of the TypeScript type system is not enough to describe your data.


### `Rec` vs `Record`

Most often used type is `Rec`. Yes, it is very similar to the built-in type `Record`, but it has important differences:

1. In the generic, it takes two parameters, but the type of the value comes first, not the key. The second parameter is the key type, and it is not required, since the `string` type is used by default. In my observations, this removes cognitive load, as this is the most common use of this type.
2. Type of keys is limited by `ObjectKey` tuple, which allows to use only `string`, `number` and `symbol` types. This is done in order to avoid the possibility of using, for example, `null` or `undefined` as a key, which can lead to unpredictable consequences.

Type `Rec` has several modifications: `PRec`, `URec`, `ARec`.
Perhaps the most used type is `PRec` - it differs from the original in that all its fields are optional.

In turn, `URec` and `ARec` are simple shortcuts for Rec with `unknown` and `any` as the value type respectively.

### `_`

As a rule, this library is enough to abandon the use of such libraries as `lodash`.

### Specific dependencies when used in the browser
Tools from the crypto directory actively use NodeJS modules, so when using in the browser, you will need to connect polyfills for `crypto` and `buffer`.
