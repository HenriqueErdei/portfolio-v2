import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { INTRO_DURATION } from "./intro"

async function loadIntro() {
  vi.resetModules()
  return import("./intro")
}

describe("intro director", () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("starts waiting with the scene cold on a first visit", async () => {
    const intro = await loadIntro()
    expect(intro.getIntroPhase()).toBe("waiting")
    expect(intro.getIntroProgress()).toBe(0)
    expect(intro.isHeroRevealed()).toBe(false)
    expect(intro.sceneProgress(0)).toBe(0)
  })

  it("resumes when the session has already played", async () => {
    sessionStorage.setItem("portfolio:intro", "1")
    const intro = await loadIntro()
    expect(intro.getIntroPhase()).toBe("done")
    expect(intro.getIntroProgress()).toBe(1)
    expect(intro.isHeroRevealed()).toBe(true)
    expect(intro.sceneProgress(0)).toBe(0)
    expect(intro.sceneProgress(1)).toBe(1)
  })

  it("maps scroll directly after the entry", async () => {
    sessionStorage.setItem("portfolio:intro", "1")
    const intro = await loadIntro()
    expect(intro.sceneProgress(0.5)).toBe(0.5)
  })

  it("keeps ambient dark during the blast window", async () => {
    const intro = await loadIntro()
    expect(intro.ambientLift(0.3)).toBe(0)
    expect(intro.ambientLift(0.8)).toBeGreaterThan(0.4)
  })

  it("peaks the blast inside its window", async () => {
    const intro = await loadIntro()
    const mid = intro.BLAST_START + (intro.BLAST_END - intro.BLAST_START) * 0.34
    expect(intro.introFlash(mid)).toBeGreaterThan(0.85)
    expect(intro.introFlash(0)).toBe(0)
  })

  it("plays through and reveals the hero once", async () => {
    vi.useFakeTimers()
    const intro = await loadIntro()

    let revealed = 0
    intro.onHeroReveal(() => {
      revealed += 1
    })

    const done = intro.playIntro()
    await vi.advanceTimersByTimeAsync(INTRO_DURATION + 100)
    await done

    expect(intro.getIntroPhase()).toBe("done")
    expect(intro.getIntroProgress()).toBe(1)
    expect(intro.isHeroRevealed()).toBe(true)
    expect(revealed).toBe(1)
    expect(sessionStorage.getItem("portfolio:intro")).toBe("1")
  })

  it("skips the fade under reduced motion", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
      })),
    )

    const intro = await loadIntro()
    await intro.playIntro()

    expect(intro.getIntroPhase()).toBe("done")
    expect(intro.getIntroProgress()).toBe(1)
    expect(intro.isHeroRevealed()).toBe(true)
  })
})
