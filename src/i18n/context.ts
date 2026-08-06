import { createContext, useContext } from "react"
import type { Locale, Localized } from "#content/types"
import type { Dict } from "./dict"

export interface I18nValue {
  readonly locale: Locale
  /** The active dictionary. Named `t` so call sites read `t.work.title`. */
  readonly t: Dict
  readonly setLocale: (locale: Locale) => void
  /**
   * Reads the active language out of a piece of content. Content lives in
   * `content/` as `Localized<T>`; this is the only place that resolves it, so
   * components never branch on locale themselves.
   */
  readonly pick: <T>(value: Localized<T>) => T
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>")
  }
  return value
}
