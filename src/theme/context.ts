import { createContext, useContext } from "react"

/**
 * `console` is the dark, backlit theme, `daylight` is the printed page on the
 * desk. Both are intentional lighting conditions rather than a dark-mode toggle,
 * which is why they are not named dark/light.
 */
export type Theme = "console" | "daylight"

export interface ThemeValue {
  readonly theme: Theme
  readonly toggle: () => void
  readonly set: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeValue | null>(null)

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error("useTheme must be used inside <ThemeProvider>")
  }
  return value
}
