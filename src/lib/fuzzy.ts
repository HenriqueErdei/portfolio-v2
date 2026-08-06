/**
 * Matching for the command palette. Not a general-purpose fuzzy finder: it ranks
 * a few dozen fixed commands, so a scored subsequence match is both enough and
 * predictable. A query that does not fit is rejected outright rather than ranked
 * last, which is what keeps the list short enough to read.
 */

/** Drops accents and case, so "trajetória" answers to `trajetoria`. */
export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

/** Characters that start a new word, and so deserve a bonus when matched. */
const BOUNDARY = /[\s\-_/·.,:()[\]]/

/**
 * `null` when `query` is not a subsequence of `text`; otherwise a score where
 * higher is a better match. Three things earn points: matching at all, matching
 * consecutive characters, and landing on the start of a word. Skipping ahead
 * costs, so `pow` prefers "Power BI" over "Python · Pandas".
 *
 * An empty query scores 0 — every command passes, none is favoured, and the
 * caller's own order survives.
 */
export function score(text: string, query: string): number | null {
  const target = fold(text)
  const needle = fold(query).replace(/\s+/gu, "")
  if (needle === "") return 0

  let cursor = 0
  let total = 0
  let run = 0

  for (const char of needle) {
    const hit = target.indexOf(char, cursor)
    if (hit === -1) return null

    const adjacent = hit === cursor
    const boundary = hit === 0 || BOUNDARY.test(target.charAt(hit - 1))

    run = adjacent ? run + 1 : 0
    total += 4 + run * 3 + (boundary ? 6 : 0) - Math.min(hit - cursor, 8)
    cursor = hit + 1
  }

  return total
}
