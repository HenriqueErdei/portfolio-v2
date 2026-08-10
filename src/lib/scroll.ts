/**
 * The scroll store: one number, 0 → 1, describing how far down the page the
 * visitor has read. Everything animated is derived from it.
 *
 * It is deliberately *not* React state. Scroll fires up to once per frame, and
 * putting that in `useState` would re-render the tree 60 times a second. Instead
 * the value lives in a module-level store consumed imperatively (the three.js
 * scene reads every frame without re-rendering React).
 *
 * It also mirrors the raw value onto `--scroll-progress`, letting CSS animate
 * against scroll with no JavaScript in the loop at all.
 */

type Listener = (progress: number) => void

const listeners = new Set<Listener>()

let progress = 0
let frame = 0

function publish() {
  frame = 0
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4))
  for (const listener of listeners) listener(progress)
}

/** Called by the scroll driver. Coalesced to one publish per animation frame. */
export function setScrollProgress(next: number) {
  progress = Math.min(1, Math.max(0, next))
  if (frame === 0) frame = requestAnimationFrame(publish)
}

export function getScrollProgress(): number {
  return progress
}

export function subscribeToScroll(listener: Listener): () => void {
  listeners.add(listener)
  listener(progress)
  return () => listeners.delete(listener)
}
