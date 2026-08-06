import { describe, expect, it } from "vitest"
import { scatter, step, type Bounds, type DriftBody } from "./drift"

const bounds: Bounds = { width: 400, height: 200 }

function body(over: Partial<DriftBody> = {}): DriftBody {
  return { x: 0, y: 0, w: 40, h: 20, vx: 0, vy: 0, mass: 800, held: false, ...over }
}

describe("step", () => {
  it("moves a body along its velocity", () => {
    const drifting = body({ x: 100, y: 50, vx: 60, vy: -20 })
    step([drifting], bounds, 0.5)

    expect(drifting.x).toBeCloseTo(130, 0)
    expect(drifting.y).toBeCloseTo(40, 0)
  })

  it("bounces off a wall instead of leaving the bay", () => {
    const escaping = body({ x: 380, y: 50, vx: 400 })
    step([escaping], bounds, 0.1)

    expect(escaping.x).toBeLessThanOrEqual(bounds.width - escaping.w)
    expect(escaping.vx).toBeLessThan(0)
  })

  it("keeps every body inside the bay over a long run", () => {
    const crowd = Array.from({ length: 12 }, (_, index) =>
      body({ x: index * 12, y: index * 6, vx: 300 - index * 40, vy: 220 - index * 30 }),
    )

    for (let frame = 0; frame < 600; frame += 1) step(crowd, bounds, 1 / 60)

    for (const item of crowd) {
      expect(item.x).toBeGreaterThanOrEqual(-0.001)
      expect(item.y).toBeGreaterThanOrEqual(-0.001)
      expect(item.x + item.w).toBeLessThanOrEqual(bounds.width + 0.001)
      expect(item.y + item.h).toBeLessThanOrEqual(bounds.height + 0.001)
    }
  })

  it("pushes two overlapping bodies apart along their shallowest axis", () => {
    const left = body({ x: 100, y: 50 })
    // Overlapping by 10 horizontally against 20 vertically, so the push is sideways.
    const right = body({ x: 130, y: 50 })

    step([left, right], bounds, 1 / 60)

    const gap = right.x - (left.x + left.w)
    expect(gap).toBeGreaterThanOrEqual(-0.001)
  })

  it("hands a moving body's momentum to the one it hits", () => {
    const moving = body({ x: 100, y: 50, vx: 200 })
    const still = body({ x: 138, y: 50 })

    step([moving, still], bounds, 1 / 60)

    expect(still.vx).toBeGreaterThan(0)
    expect(moving.vx).toBeLessThan(200)
  })

  it("leaves a held body exactly where the pointer put it", () => {
    const held = body({ x: 100, y: 50, vx: 500, vy: 500, held: true })
    const nudged = body({ x: 130, y: 50 })

    step([held, nudged], bounds, 1 / 60)

    expect(held.x).toBe(100)
    expect(held.y).toBe(50)
    // The one that is free absorbs the whole collision.
    expect(nudged.x).toBeGreaterThan(130)
  })

  it("slows a drifting body down rather than running forever", () => {
    const drifting = body({ x: 200, y: 100, vx: 100 })
    for (let frame = 0; frame < 120; frame += 1) step([drifting], bounds, 1 / 60)

    expect(drifting.vx).toBeLessThan(60)
    expect(drifting.vx).toBeGreaterThan(0)
  })
})

describe("scatter", () => {
  it("places every body inside the bay with a drift", () => {
    const crowd = Array.from({ length: 9 }, () => body())
    // Deterministic: a fixed midpoint stands in for the jitter.
    scatter(crowd, bounds, () => 0.5)

    for (const item of crowd) {
      expect(item.x).toBeGreaterThanOrEqual(0)
      expect(item.y).toBeGreaterThanOrEqual(0)
      expect(item.x + item.w).toBeLessThanOrEqual(bounds.width)
      expect(item.y + item.h).toBeLessThanOrEqual(bounds.height)
    }
  })

  it("does not stack two bodies in the same spot", () => {
    const crowd = Array.from({ length: 8 }, () => body())
    scatter(crowd, bounds, () => 0.5)

    const spots = new Set(crowd.map((item) => `${item.x}:${item.y}`))
    expect(spots.size).toBe(crowd.length)
  })
})
