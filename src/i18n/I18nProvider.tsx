import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { LOCALES, type Locale, type Localized } from "#content/types"
import { I18nContext, type I18nValue } from "./context"
import { DICTIONARIES } from "./dictionaries"

const STORAGE_KEY = "portfolio:locale"

const isLocale = (value: string | null): value is Locale =>
  value !== null && (LOCALES as readonly string[]).includes(value)

/**
 * Resolution order: an explicit past choice wins, then the browser's preferred
 * languages in the order the user ranked them, then Portuguese. Read once on
 * mount — `useState` initialiser rather than an effect, so the first paint is
 * already in the right language and nothing flashes.
 */
function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Private mode or storage disabled — fall through to the browser hint.
  }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.slice(0, 2).toLowerCase()
    if (isLocale(base)) return base
  }

  return "pt"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not being able to remember the choice is not worth breaking the switch.
    }
  }, [])

  // Keeps `<html lang>` truthful, which is what screen readers use to pick a
  // pronunciation and what search engines read for the page language.
  useEffect(() => {
    document.documentElement.lang = DICTIONARIES[locale].meta.htmlLang
  }, [locale])

  const value = useMemo<I18nValue>(() => {
    const pick = <T,>(entry: Localized<T>): T => entry[locale]
    return { locale, t: DICTIONARIES[locale], setLocale, pick }
  }, [locale, setLocale])

  return <I18nContext value={value}>{children}</I18nContext>
}
