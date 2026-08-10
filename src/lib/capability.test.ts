import { describe, expect, it, vi } from "vitest"
import { isMobileViewport, shouldRenderScene } from "./capability"

describe("capability", () => {
  it("skips the scene on narrow viewports", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("max-width: 767px"),
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
      })),
    )

    expect(isMobileViewport()).toBe(true)
    expect(shouldRenderScene()).toBe(false)

    vi.unstubAllGlobals()
  })

  it("allows the scene on desktop when WebGL is available", () => {
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

    const canvas = document.createElement("canvas")
    canvas.getContext = vi.fn().mockReturnValue({
      getExtension: vi.fn().mockReturnValue({ loseContext: vi.fn() }),
    })

    vi.spyOn(document, "createElement").mockImplementation((tag) =>
      tag === "canvas" ? canvas : document.createElement(tag),
    )

    expect(shouldRenderScene()).toBe(true)

    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })
})
