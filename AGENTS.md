# AGENTS.md / CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # rm -rf lib && tsc -p tsconfig.build.json
npm run dev:watch      # tsc --watch
npm run lint           # eslint . (WEB_BUDDY_STRICT=true)
npm run format         # eslint --fix (this is the formatter — there is no separate prettier script)
npm test               # jest
npm run test:cov       # jest --coverage
npm run test:watch

npx jest src/rto/graph.spec.ts            # a single spec file
npx jest -t 'setOf'                       # a single test by name
npx tsc -p tsconfig.build.json --noEmit   # typecheck only
```

Node v22 (`.nvmrc`). The husky `pre-commit` hook runs `lint && build && test` — all three must pass,
so run them before considering work finished. Commits follow conventional-commits (`feat:`,
`fix(scope):`); releases are cut by semantic-release.

## What this package is

`@tsofist/stem` — a dependency-light utility library of general-purpose TypeScript building blocks
(the author's replacement for lodash-style toolkits). Published as CommonJS, consumed via **deep
imports**: `@tsofist/stem/lib/object/keys`, `@tsofist/stem/lib/rto/runner`, …

## Architecture

### No barrels — `src/index.ts` is not one

`src/index.ts` contains **only global utility types** (plus `import '@total-typescript/ts-reset'` as
its first line) and re-exports nothing. Every module is reached by its own path. Do not add barrel
files, and do not re-export a new module from `src/index.ts`.

Intra-repo imports use relative paths ending in `/index` — `from '../index'`, never `from '..'` —
and carry **no `.js` extension** (CommonJS, classic resolution).

Before inventing a type, check `src/index.ts`: `Rec`/`PRec`/`ARec`/`URec`, `Nullable`, `Nully`,
`ArrayMay`, `PromiseMay`, `ValuesOf`, `StringKeyOf`, `ShallowExact`, `DeepReadonly`, `ReadonlyMay`,
`PickByValueType`, `VoidFunction` and ~60 more already exist. Numeric brands live in
`src/number/integer/types.ts` (`Int`, `PositiveInt`, `NonNegativeInt`).

### Module layout

A single-concept utility is one flat file at the root of `src/` (`deferred.ts`, `set-of.ts`,
`noop.ts`). A larger one is a directory:

```
src/<module>/types.ts      # types only — excluded from coverage, keep runtime code out
src/<module>/guards.ts     # isXxx type guards
src/<module>/<topic>.ts     # one concern per file, kebab-case
src/<module>/<topic>.spec.ts
```

`src/rto/` (Reactive Task Orchestrator) is the largest subsystem and the best worked example of the
house style — a dependency-driven task engine on `@vue/reactivity`. It has its own
[`src/rto/README.md`](src/rto/README.md); read that before touching it.

### Errors

No custom `Error` subclass. Errors are plain `Error` objects carrying non-enumerable `code` and
`context` properties, created through `src/error.ts`:

```ts
raise('message', 'EC_SOMETHING');            // throw with a code
raiseEx('EC_SOMETHING', { context }, 'msg');
readErrorCode(e); hasErrorCode(e, 'EC_X'); readErrorContext(e, 'field'); matchError(e, {...});
```

`ErrorCode` is the template type `` `EC_${string}` ``. A module with more than a couple of errors
declares an **error family** (`src/error/family.ts`) — see `src/rto/errors.ts` for a full example:

```ts
type MyFamily = ErrorCodeFamily<'EC_XX'>;             // '_' separator ⇒ codes must be UPPERCASE
export const MyErrors = ErrorFamily.declare('EC_XX_' as MyFamily, {
    EC_XX_SOMETHING: ErrorFamily.member<{ id: string }>('Human readable message'),
});
MyErrors.raise('EC_XX_SOMETHING', { id });            // context type is checked
```

There are no `assert*` helpers; the idiom is `if (!x) raise(…)` or `x ?? raise(…)`.

### JSDoc as schema source

Many exported types are plain aliases (`export type Int = number`) whose meaning lives in
JSON-Schema JSDoc annotations — `@pattern`, `@minimum`, `@asType integer`, `@minItems`,
`@uniqueItems`, `@format`, `@faker`. These are consumed by JSON-schema generators downstream, so
when adding a constrained alias, annotate it rather than encoding the constraint in the name. See
`src/ad/types.ts` and the `NonEmptyArray`/`UniqueItemsArray` entries in `src/index.ts`.

## Conventions

Run `npm run format` — it is the authority. What it enforces that is easy to get wrong:

- **`type`, not `interface`** (252 vs 3 in the codebase); the few interfaces carry an explicit
  opt-out comment.
- **`Rec`/`PRec` instead of `Record`** — `Record` is flagged by lint.
- **`== null` / `!= null`**, never `=== undefined` — flagged by lint.
- **Import order**: one contiguous alphabetized block, no blank lines between groups; `import type`
  for type-only imports.
- Prettier: 4 spaces, single quotes, printWidth 100, trailing commas, LF.
- `any` is allowed (widely used in overload implementation signatures); non-null `!` is allowed.
- `@ts-expect-error` **requires a description of ≥7 characters** — the house phrases are
  `// @ts-expect-error It's OK` and `// @ts-expect-error It's Safe`.

Style that is conventional rather than enforced:

- Public API is declared as a stack of **function overloads** over a wider implementation signature.
- Top-level exports are `function` declarations, not arrow consts. Prefer functions over classes:
  where a class is needed it stays unexported behind a type alias plus a factory
  (`export type Scheduler<T> = SchedulerImpl<T>`); `ErrorFamily` is the one exported class.
- Object-shaped "instances" are factories returning an object literal typed by a `type`, with
  members declared as **properties** (`start: (label) => void`), not methods.
- Naming vocabulary: `…Of` (`keysOf`, `valuesOf`, `setOf`, `ValuesOf`), `is…` guards, `as…`
  coercions, `has…`, `read…`, `create…`, and `…Ex` for the extended overload-heavy variant
  (`raiseEx`, `readErrorContextEx`).
- Module-private types go **at the bottom of the file**, unexported.
- **All comments and JSDoc are in English**, even when the conversation is not. Russian appears only
  in `.private.*.md` design notes, which are excluded from the published package.

## TypeScript config

TypeScript `~6.0`, `target: ES6`, `module: CommonJS`, `rootDir: src` → `outDir: lib`.
`strict` is on together with `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`,
`noUnusedLocals`, `noUnusedParameters`. **Not** enabled: `exactOptionalPropertyTypes`,
`noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `isolatedModules` — do not write code that
depends on them. `tsconfig.test.json` relaxes the unused-checks for specs.

## Testing

Jest 30 + ts-jest, config inline in `package.json`. Specs are colocated `*.spec.ts`
(`testRegex: .*\.spec\.ts$`, `roots: ["src"]`). One top-level `describe` named after the subject
(`describe('rto: buildOrchestrationGraph', …)`) with flat `it(…)` cases; `toStrictEqual` is the
default assertion. Type-level expectations are asserted inline with `// @ts-expect-error It's OK`
inside ordinary specs rather than in a separate type-test tool.
