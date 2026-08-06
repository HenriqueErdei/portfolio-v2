import { describe, expect, it } from "vitest"
import { getScrollProgress, setScrollProgress } from "./scroll"

describe("scroll store", () => {
  it("clamps progress into 0…1", () => {
    setScrollProgress(-3)
    expect(getScrollProgress()).toBe(0)

    setScrollProgress(42)
    expect(getScrollProgress()).toBe(1)
  })

  it("keeps the value it was given inside the range", () => {
    setScrollProgress(0.375)
    expect(getScrollProgress()).toBe(0.375)
  })
})
