/**
 * The geometric tower: stacked diamond floors with columns and cross-bracing,
 * Portfolio-b's megastructure adapted to sit behind our glacial cascade.
 *
 * Built once, deterministically — no `Math.random`, so a reload never moves a
 * strut across the headline that was not there before.
 */

export const FLOORS = 22
const SPACING = 0.52
const BASE = 1.35

export type TowerBuffers = {
  readonly lines: Float32Array
  readonly nodes: Float32Array
  readonly lineVerts: number
  readonly nodeCount: number
  /** World-space height of the whole stack, for centering. */
  readonly height: number
}

function pushLine(out: number[], ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
  out.push(ax, ay, az, bx, by, bz)
}

function floorCorners(i: number): [number, number, number][] {
  const y = -i * SPACING
  const twist = i * 0.14
  const size = BASE * (0.82 + 0.2 * Math.sin(i * 0.48) + 0.12 * Math.sin(i * 0.19))
  const out: [number, number, number][] = []

  for (let k = 0; k < 4; k += 1) {
    const a = twist + k * (Math.PI / 2) + Math.PI / 4
    out.push([Math.cos(a) * size, y, Math.sin(a) * size])
  }

  return out
}

export function buildTower(): TowerBuffers {
  const lines: number[] = []
  const nodes: number[] = []

  let previous = floorCorners(0)

  for (let i = 0; i <= FLOORS; i += 1) {
    const current = floorCorners(i)

    for (let k = 0; k < 4; k += 1) {
      const a = current[k]!
      const b = current[(k + 1) % 4]!
      pushLine(lines, a[0], a[1], a[2], b[0], b[1], b[2])
    }

    if (i > 0) {
      for (let k = 0; k < 4; k += 1) {
        const a = previous[k]!
        const b = current[k]!
        pushLine(lines, a[0], a[1], a[2], b[0], b[1], b[2])
      }

      // Face braces every other bay — the X that makes it a lattice.
      if (i % 2 === 0) {
        for (let k = 0; k < 4; k += 1) {
          const a = previous[k]!
          const b = current[(k + 1) % 4]!
          const c = previous[(k + 1) % 4]!
          const d = current[k]!
          pushLine(lines, a[0], a[1], a[2], b[0], b[1], b[2])
          pushLine(lines, c[0], c[1], c[2], d[0], d[1], d[2])
        }
      }
    }

    if (i % 3 === 0) {
      const a = current[0]!
      const b = current[2]!
      const c = current[1]!
      const d = current[3]!
      pushLine(lines, a[0], a[1], a[2], b[0], b[1], b[2])
      pushLine(lines, c[0], c[1], c[2], d[0], d[1], d[2])
    }

    // Lit joints on a regular cadence so the tower reads as instrumented.
    for (let k = 0; k < 4; k += 1) {
      if ((i * 4 + k) % 5 === 0) {
        const p = current[k]!
        nodes.push(p[0], p[1], p[2])
      }
    }

    previous = current
  }

  // Tapered tip under the foundation.
  let tip = previous
  const lastY = -FLOORS * SPACING
  const TIP = 5

  for (let j = 1; j <= TIP; j += 1) {
    const shrink = (1 - j / TIP) ** 1.45
    const yy = lastY - j * (SPACING * 0.85)
    const tw = (FLOORS + j) * 0.14
    const current: [number, number, number][] = []

    for (let k = 0; k < 4; k += 1) {
      const a = tw + k * (Math.PI / 2) + Math.PI / 4
      const s = BASE * 1.05 * shrink
      current.push([Math.cos(a) * s, yy, Math.sin(a) * s])
    }

    for (let k = 0; k < 4; k += 1) {
      const a = current[k]!
      const b = current[(k + 1) % 4]!
      const c = tip[k]!
      pushLine(lines, a[0], a[1], a[2], b[0], b[1], b[2])
      pushLine(lines, c[0], c[1], c[2], a[0], a[1], a[2])
    }

    tip = current
  }

  const apex = tip[0]!
  nodes.push(apex[0], apex[1], apex[2])

  const height = FLOORS * SPACING + TIP * SPACING * 0.85

  return {
    lines: new Float32Array(lines),
    nodes: new Float32Array(nodes),
    lineVerts: lines.length / 3,
    nodeCount: nodes.length / 3,
    height,
  }
}
