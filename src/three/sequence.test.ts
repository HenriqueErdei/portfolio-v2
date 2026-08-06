import { describe, expect, it } from "vitest"
import {
  BEAT,
  IMPACT,
  boltFade,
  boltReveal,
  flash,
  ignite,
  settle,
  shockwave,
  towerAwake,
} from "./sequence"

/**
 * The sequence is the one part of the scene that can be tested without a GPU, and
 * it is also the part where a wrong number is hardest to spot by eye — a beat
 * landing a hundredth of a page early looks like a rendering bug.
 */

const RAMPS = {
  ignite,
  settle,
  shockwave,
  boltReveal,
  boltFade,
  towerAwake,
} as const

describe("background sequence", () => {
  it("orders its beats", () => {
    const beats = [
      BEAT.charge,
      BEAT.strike,
      BEAT.ignition,
      BEAT.peak,
      BEAT.gather,
      BEAT.formed,
    ]
    expect(beats).toEqual([...beats].sort((a, b) => a - b))
  })

  it("keeps every ramp inside 0…1 across the whole page", () => {
    for (const [name, ramp] of Object.entries(RAMPS)) {
      for (let step = 0; step <= 200; step += 1) {
        const value = ramp(step / 200)
        expect(value, name).toBeGreaterThanOrEqual(0)
        expect(value, name).toBeLessThanOrEqual(1)
      }
    }
  })

  it("starts dark and ends as cascade + awake tower", () => {
    expect(ignite(0)).toBe(0)
    expect(settle(0)).toBe(0)
    expect(boltReveal(0)).toBe(0)
    expect(towerAwake(0)).toBe(0)

    expect(settle(1)).toBe(1)
    expect(towerAwake(1)).toBe(1)
    expect(boltFade(1)).toBe(0)
  })

  it("fully draws the bolt by the strike", () => {
    expect(boltReveal(BEAT.strike)).toBeGreaterThan(0.95)
    expect(boltFade(BEAT.strike)).toBeGreaterThan(0.9)
  })

  it("clears the bolt after the impact so the tower owns the frame", () => {
    expect(boltFade(BEAT.gather)).toBe(0)
    expect(towerAwake(BEAT.peak)).toBeGreaterThan(0)
  })

  it("peaks the flash at the impact", () => {
    expect(flash(BEAT.peak)).toBeGreaterThan(0.95)
    expect(flash(0)).toBeLessThan(0.01)
    expect(flash(1)).toBeLessThan(0.01)
  })

  it("lets the debris fly before it starts gathering", () => {
    expect(settle(BEAT.peak)).toBe(0)
    expect(ignite(BEAT.gather)).toBe(1)
  })

  it("wakes the tower with the strike, before the cascade settles", () => {
    expect(towerAwake(BEAT.ignition)).toBeLessThan(0.05)
    expect(towerAwake(BEAT.gather)).toBeGreaterThan(towerAwake(BEAT.peak))
    expect(towerAwake(BEAT.formed)).toBe(1)
  })

  it("keeps the impact at the geogram origin", () => {
    expect(IMPACT.x).toBe(0)
    expect(IMPACT.z).toBe(0)
  })
})
