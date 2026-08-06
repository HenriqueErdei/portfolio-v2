import { describe, expect, it } from "vitest"
import { FLOORS, buildTower } from "./towerGeometry"

describe("buildTower", () => {
  it("builds a non-empty lattice with lit joints", () => {
    const tower = buildTower()
    expect(tower.lineVerts).toBeGreaterThan(FLOORS * 8)
    expect(tower.nodeCount).toBeGreaterThan(8)
    expect(tower.height).toBeGreaterThan(8)
  })

  it("is deterministic — same geometry every call", () => {
    const a = buildTower()
    const b = buildTower()
    expect(a.lines).toEqual(b.lines)
    expect(a.nodes).toEqual(b.nodes)
  })

  it("keeps every vertex finite", () => {
    const tower = buildTower()
    for (const value of tower.lines) expect(Number.isFinite(value)).toBe(true)
    for (const value of tower.nodes) expect(Number.isFinite(value)).toBe(true)
  })
})
