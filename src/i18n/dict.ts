import type { pt } from "./pt"

/**
 * Widens the literal types that `as const` produced on the Portuguese source
 * into plain `string`s. Without this, `const en: Dict` would demand the exact
 * Portuguese wording; with it, `Dict` describes the *shape* only — so a missing
 * or misspelled key is a compile error while the copy stays free.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> }

export type Dict = Widen<typeof pt>
