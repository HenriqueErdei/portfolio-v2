/**
 * The command console is opened from two unrelated places — the keyboard, and the
 * button in the top bar — so the request travels as a DOM event rather than
 * through context. Nothing needs to re-render to make it work, and the button
 * stays a leaf that knows nothing about the console.
 */
const EVENT = "portfolio:palette"

export function togglePalette() {
  window.dispatchEvent(new Event(EVENT))
}

export function onTogglePalette(handler: () => void): () => void {
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}

/** True on the platforms whose modifier is ⌘ rather than Ctrl. */
export const APPLE_KEYS = /Mac|iPhone|iPad|iPod/u.test(navigator.userAgent)
