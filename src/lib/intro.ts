import { BEAT } from "@/three/sequence"
import { prefersReducedMotion } from "./capability"

/**
 * Entry choreography, Portfolio-b style: the spectacle plays once when you land,
 * then the page is handed to you. The beats (bolt → strike → impact → cascade)
 * are driven by a clock here; after that, scroll only evolves the cascade the
 * blast left behind.
 */

const SESSION_KEY = "portfolio:intro"

export type IntroPhase = "waiting" | "playing" | "done"

type Listener = () => void

const listeners = new Set<Listener>()
const revealListeners = new Set<Listener>()

let phase: IntroPhase = alreadyPlayed() ? "done" : "waiting"
/** Sequence progress, 0 → `BEAT.formed`. After the intro, the scene floors here. */
let progress = phase === "done" ? BEAT.formed : 0
let heroRevealed = phase === "done"
let raf = 0

/** Wall-clock length of the entry run, in milliseconds. Charge + strike need a
 *  beat to read; the settle should not linger. */
const DURATION = 8400

/** Hero copy comes in just after the flash, while the cascade is still settling. */
const REVEAL_AT = BEAT.peak + 0.02

function alreadyPlayed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1"
  } catch {
    return false
  }
}

function remember() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1")
  } catch {
    // Not remembering is the safe failure: the next visit just replays.
  }
}

function publish() {
  for (const listener of listeners) listener()
}

function revealHero() {
  if (heroRevealed) return
  heroRevealed = true
  for (const listener of revealListeners) listener()
}

export function getIntroPhase(): IntroPhase {
  return phase
}

export function getIntroProgress(): number {
  return progress
}

export function isHeroRevealed(): boolean {
  return heroRevealed
}

/**
 * Progress the three.js scene should read. During the entry it is the clock;
 * afterwards it is the cascade floor plus whatever the visitor has scrolled —
 * so the blast never fires again just because someone dragged the scrollbar.
 */
export function sceneProgress(scroll: number): number {
  if (phase === "playing" || phase === "waiting") return progress
  return BEAT.formed + Math.min(1, Math.max(0, scroll)) * (1 - BEAT.formed)
}

export function subscribeToIntro(listener: Listener): () => void {
  listeners.add(listener)
  listener()
  return () => listeners.delete(listener)
}

export function onHeroReveal(listener: Listener): () => void {
  if (heroRevealed) listener()
  revealListeners.add(listener)
  return () => revealListeners.delete(listener)
}

/**
 * Runs the entry sequence. Resolves when the cascade has settled and the page
 * can be unlocked. Safe to call more than once — a second call is a no-op.
 *
 * With reduced motion the blast is skipped: the scene snaps to the cascade and
 * the hero appears immediately, which is the honest reading of "less motion".
 */
export function playIntro(): Promise<void> {
  if (phase === "playing") {
    return new Promise((resolve) => {
      const off = subscribeToIntro(() => {
        if (phase === "done") {
          off()
          resolve()
        }
      })
    })
  }

  if (phase === "done") {
    revealHero()
    return Promise.resolve()
  }

  if (prefersReducedMotion()) {
    phase = "done"
    progress = BEAT.formed
    remember()
    revealHero()
    publish()
    return Promise.resolve()
  }

  phase = "playing"
  progress = 0
  publish()

  return new Promise((resolve) => {
    const started = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / DURATION)
      // Ease in-out so the transit and the settle both get a beat to read, and
      // the flash in the middle is not lingered on.
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      progress = eased * BEAT.formed

      if (progress >= REVEAL_AT) revealHero()

      publish()

      if (t < 1) {
        raf = requestAnimationFrame(tick)
        return
      }

      phase = "done"
      progress = BEAT.formed
      remember()
      revealHero()
      publish()
      resolve()
    }

    raf = requestAnimationFrame(tick)
  })
}

/** Cancels a run in flight. Used when the boot unmounts mid-play. */
export function cancelIntro() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}
