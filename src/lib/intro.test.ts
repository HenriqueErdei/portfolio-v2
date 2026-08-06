import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { BEAT } from "@/three/sequence"

/**
 * The intro module keeps session state at module scope, so each test reloads it
 * through a fresh dynamic import after resetting modules and storage.
 */
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

  it("resumes on the cascade when the session has already played", async () => {
    sessionStorage.setItem("portfolio:intro", "1")
    const intro = await loadIntro()
    expect(intro.getIntroPhase()).toBe("done")
    expect(intro.getIntroProgress()).toBe(BEAT.formed)
    expect(intro.isHeroRevealed()).toBe(true)
    expect(intro.sceneProgress(0)).toBe(BEAT.formed)
    expect(intro.sceneProgress(1)).toBe(1)
  })

  it("maps scroll onto the cascade after the entry, never back through the blast", async () => {
    sessionStorage.setItem("portfolio:intro", "1")
    const intro = await loadIntro()
    const mid = intro.sceneProgress(0.5)
    expect(mid).toBeGreaterThan(BEAT.formed)
    expect(mid).toBeLessThan(1)
    // Halfway down the page is still past the ignition — the blast does not replay.
    expect(mid).toBeGreaterThan(BEAT.peak)
  })

  it("plays through to the cascade and reveals the hero once", async () => {
    vi.useFakeTimers()
    const intro = await loadIntro()

    let revealed = 0
    intro.onHeroReveal(() => {
      revealed += 1
    })

    const done = intro.playIntro()
    await vi.advanceTimersByTimeAsync(8000)
    await done

    expect(intro.getIntroPhase()).toBe("done")
    expect(intro.getIntroProgress()).toBe(BEAT.formed)
    expect(intro.isHeroRevealed()).toBe(true)
    expect(revealed).toBe(1)
    expect(sessionStorage.getItem("portfolio:intro")).toBe("1")
  })

  it("skips the blast under reduced motion", async () => {
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
    expect(intro.getIntroProgress()).toBe(BEAT.formed)
    expect(intro.isHeroRevealed()).toBe(true)
  })
})
