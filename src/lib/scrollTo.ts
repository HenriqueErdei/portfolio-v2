import type Lenis from "lenis"
import { prefersReducedMotion } from "./capability"

/**
 * Programmatic scrolling has to go through the same engine as wheel scrolling,
 * or the two fight and the page stutters. `SmoothScroll` registers its instance
 * here on mount so nav buttons and skip links can borrow it.
 */
let instance: Lenis | null = null

export function registerScroller(lenis: Lenis | null) {
  instance = lenis
}

/**
 * Scrolls an element into view and, unless told otherwise, moves focus to it —
 * scrolling alone would leave a keyboard user tabbing from wherever they were.
 * Targets carry `tabIndex={-1}` to be valid destinations.
 */
export function scrollToElement(target: Element | null, options?: { focus?: boolean }) {
  if (!(target instanceof HTMLElement)) return

  if (instance) {
    instance.scrollTo(target, { offset: 0 })
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
  }

  if (options?.focus !== false) target.focus({ preventScroll: true })
}

export function scrollToStage(id: string) {
  scrollToElement(document.getElementById(id))
}

/**
 * Freezes the page under a modal. Lenis has to be stopped explicitly — it drives
 * scrolling itself, so `overflow: hidden` alone would not reach it — while the
 * class covers the reduced-motion path, where scrolling is the browser's own.
 */
export function setScrollLocked(locked: boolean) {
  if (locked) instance?.stop()
  else instance?.start()

  document.documentElement.classList.toggle("scroll-locked", locked)
}
