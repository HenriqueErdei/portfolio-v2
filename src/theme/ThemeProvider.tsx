import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { ThemeContext, type Theme, type ThemeValue } from "./context"

const STORAGE_KEY = "portfolio:theme"

function detectTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "console" || stored === "daylight") return stored
  } catch {
    // Storage unavailable; the system preference is a fine answer.
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "daylight" : "console"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(detectTheme)

  // `data-theme` on <html> is what tokens.css keys off. index.html ships with
  // `console` already set, so the first paint is dark and only flips here if the
  // visitor's preference disagrees.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const set = useCallback((next: Theme) => {
    setTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignored on purpose — see detectTheme.
    }
  }, [])

  const toggle = useCallback(() => {
    set(document.documentElement.dataset.theme === "daylight" ? "console" : "daylight")
  }, [set])

  const value = useMemo<ThemeValue>(() => ({ theme, toggle, set }), [theme, toggle, set])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
