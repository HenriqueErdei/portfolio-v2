import { describe, expect, it } from "vitest"
import { LOCALES } from "#content/types"
import { en } from "./en"
import { es } from "./es"
import { pt } from "./pt"

/**
 * The `Dict` type already makes a missing key a compile error. These tests cover
 * what types cannot: a key that exists but was left as the Portuguese original,
 * and a translation that was accidentally emptied.
 */

const DICTS = { pt, en, es } as const

function flatten(value: unknown, prefix = ""): Record<string, string> {
  if (typeof value === "string") return { [prefix]: value }

  const out: Record<string, string> = {}
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    Object.assign(out, flatten(child, prefix ? `${prefix}.${key}` : key))
  }
  return out
}

describe("dictionaries", () => {
  it("covers every declared locale", () => {
    expect(Object.keys(DICTS).sort()).toEqual([...LOCALES].sort())
  })

  it("share exactly the same keys", () => {
    const reference = Object.keys(flatten(pt)).sort()

    for (const [locale, dict] of Object.entries(DICTS)) {
      expect(Object.keys(flatten(dict)).sort(), `locale ${locale}`).toEqual(reference)
    }
  })

  it("has no empty or whitespace-only strings", () => {
    for (const [locale, dict] of Object.entries(DICTS)) {
      for (const [key, value] of Object.entries(flatten(dict))) {
        expect(value.trim(), `${locale}.${key}`).not.toBe("")
      }
    }
  })

  /**
   * Some phrases really are spelled the same in Portuguese and Spanish. Listing
   * them keeps the check strict everywhere else — if one of these ever needs to
   * differ, removing the entry is what forces the translation.
   */
  const IDENTICAL_BY_DESIGN = new Set(["es:path.viewCredential"])

  it("does not leave Portuguese copy sitting in the other locales", () => {
    const portuguese = flatten(pt)

    // Designations like `S-03` and locale codes are identical on purpose, and
    // single words collide too often to be evidence of anything.
    const isTranslatable = (key: string, value: string) =>
      !key.endsWith("designation") && !key.startsWith("meta.") && value.length > 12

    for (const locale of ["en", "es"] as const) {
      const translated = flatten(DICTS[locale])

      for (const [key, value] of Object.entries(portuguese)) {
        if (!isTranslatable(key, value)) continue
        if (IDENTICAL_BY_DESIGN.has(`${locale}:${key}`)) continue

        expect(translated[key], `${locale}.${key} looks untranslated`).not.toBe(value)
      }
    }
  })
})
