import { prefersReducedMotion } from "./capability"

/**
 * Entry choreography — one linear clock drives everything:
 * checklist → blast (synced) → ambient lift → hero.
 */

const SESSION_KEY = "portfolio:intro"

export type IntroPhase = "waiting" | "playing" | "done"

/** Linear timeline, 0 → 1. Blast occupies the middle slice only. */
export const BLAST_START = 0.14
export const BLAST_END = 0.56

type Listener = () => void

const listeners = new Set<Listener>()
const revealListeners = new Set<Listener>()

let phase: IntroPhase = alreadyPlayed() ? "done" : "waiting"
/** Linear intro clock, 0 → 1. After intro, ambient is fully open. */
let progress = phase === "done" ? 1 : 0
let heroRevealed = phase === "done"
let raf = 0

/** Wall-clock length of the entry run, in milliseconds. */
export const INTRO_DURATION = 4000

/** Hero enters as the blast finishes expanding. */
const REVEAL_AT = 0.52

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

/** 0 → 1 progress inside the blast window; -1 outside it. */
function blastPhase(clock: number): number {
  if (clock < BLAST_START || clock > BLAST_END) return -1
  return (clock - BLAST_START) / (BLAST_END - BLAST_START)
}

/** Core flash — sharp peak early in the blast window. */
export function introFlash(clock: number): number {
  const p = blastPhase(clock)
  if (p < 0) return 0
  return Math.exp(-(((p - 0.32) / 0.14) ** 2))
}

/** Softer afterglow as the wave expands — same clock, second peak. */
export function introAfterglow(clock: number): number {
  const p = blastPhase(clock)
  if (p < 0) return 0
  return Math.exp(-(((p - 0.58) / 0.17) ** 2)) * 0.62
}

/** Primary shockwave ring. */
export function introShockwave(clock: number): number {
  const p = blastPhase(clock)
  if (p < 0) return 0
  const x = Math.min(1, Math.max(0, (p - 0.04) / 0.9))
  return x * x * (3 - 2 * x)
}

/** Trailing echo ring — derived from the same blast phase, offset. */
export function introShockwaveEcho(clock: number): number {
  const p = blastPhase(clock)
  if (p < 0) return 0
  const x = Math.min(1, Math.max(0, (p - 0.26) / 0.74))
  return x * x * (3 - 2 * x)
}

/** Combined flash strength for CSS overlays (still one clock). */
export function introBlastGlow(clock: number): number {
  return Math.min(1, introFlash(clock) + introAfterglow(clock) * 0.55)
}

/**
 * Ambient background lift — stays dark during the blast, opens afterward.
 * Used for grid, dust and room opacity.
 */
export function ambientLift(clock: number): number {
  if (phase === "done") return 1
  if (clock <= BLAST_END) return 0
  const x = (clock - BLAST_END) / (1 - BLAST_END)
  return x * x * (3 - 2 * x)
}

export function getIntroPhase(): IntroPhase {
  return phase
}

/** Linear intro clock (not remapped). */
export function getIntroProgress(): number {
  return progress
}

export function isHeroRevealed(): boolean {
  return heroRevealed
}

export function shouldAnimateHero(): boolean {
  return !alreadyPlayed() && !prefersReducedMotion()
}

/** Ambient scene progress — blast first, then scroll. */
export function sceneProgress(scroll: number): number {
  if (phase === "playing" || phase === "waiting") return ambientLift(progress)
  return Math.min(1, Math.max(0, scroll))
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
    progress = 1
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
      progress = Math.min(1, (now - started) / INTRO_DURATION)

      if (progress >= REVEAL_AT) revealHero()

      publish()

      if (progress < 1) {
        raf = requestAnimationFrame(tick)
        return
      }

      phase = "done"
      progress = 1
      remember()
      revealHero()
      publish()
      resolve()
    }

    raf = requestAnimationFrame(tick)
  })
}

export function cancelIntro() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}
