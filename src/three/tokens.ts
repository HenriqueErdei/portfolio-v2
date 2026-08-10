import { useEffect, useState } from "react"
import * as THREE from "three"

/**
 * The palette, read out of CSS rather than duplicated in JavaScript. The theme
 * switch only flips `data-theme` on the root element, so the scene watches that
 * attribute and re-reads the custom properties when it changes — which means a
 * colour is still defined in exactly one place, `tokens.css`.
 */

export type ThemeTokens = {
  sig: THREE.Color
  plasma: THREE.Color
  ink: THREE.Color
  warn: THREE.Color
  /** 0 for the dark theme, 1 for the light one. Shaders take it as a uniform. */
  theme: number
}

export function readThemeTokens(): ThemeTokens {
  const styles = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) =>
    new THREE.Color((styles.getPropertyValue(name) || fallback).trim())

  return {
    // Fallbacks mirror the dark theme in `tokens.css`; they only apply if the
    // stylesheet has not landed yet, which is a frame or two at most.
    sig: read("--c-sig", "#6ba3c7"),
    plasma: read("--c-plasma", "#8b7cb8"),
    ink: read("--c-ink", "#dfe7f5"),
    warn: read("--c-warn", "#ffc24d"),
    theme: document.documentElement.dataset.theme === "daylight" ? 1 : 0,
  }
}

export function useThemeTokens(): ThemeTokens {
  const [tokens, setTokens] = useState(readThemeTokens)

  useEffect(() => {
    const observer = new MutationObserver(() => setTokens(readThemeTokens()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
    return () => observer.disconnect()
  }, [])

  return tokens
}
