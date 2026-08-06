import { describe, expect, it } from "vitest"
import { IMPACT } from "./sequence"
import { CORNERS, STATIONS, buildBolt, buildCornerBolts } from "./boltGeometry"

describe("bolt geometry", () => {
  it("is deterministic", () => {
    const a = buildBolt(0)
    const b = buildBolt(0)
    expect(a.lines).toEqual(b.lines)
    expect(a.nodes).toEqual(b.nodes)
    expect(a.spineVerts).toBe(b.spineVerts)
  })

  it("builds four distinct corner bolts", () => {
    const bolts = buildCornerBolts()
    expect(bolts).toHaveLength(CORNERS.length)

    // Each corner should produce a different silhouette.
    expect(bolts[0]!.lines).not.toEqual(bolts[1]!.lines)
    expect(bolts[2]!.lines).not.toEqual(bolts[3]!.lines)
  })

  it("ends every bolt on the impact point", () => {
    for (const bolt of buildCornerBolts()) {
      const n = bolt.nodes
      expect(n[n.length - 3]!).toBeCloseTo(IMPACT.x, 5)
      expect(n[n.length - 2]!).toBeCloseTo(IMPACT.y, 5)
      expect(n[n.length - 1]!).toBeCloseTo(IMPACT.z, 5)
    }
  })

  it("builds a spine of diamond stations", () => {
    const bolt = buildBolt(0)
    expect(bolt.spineVerts).toBe(STATIONS * 2)
    expect(bolt.totalVerts).toBeGreaterThan(bolt.spineVerts)
    expect(bolt.nodeCount).toBeGreaterThan(STATIONS)
  })
})
