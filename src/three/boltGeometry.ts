import * as THREE from "three"
import { IMPACT } from "./sequence"

/**
 * Four geometric bolts — one from each corner of the frame — converging on the
 * geogram origin. Together they fill the lens the way a single diagonal never
 * could: a plexus that claims the whole stage before the impact.
 */

/** How many diamond rings each bolt is built from. */
export const STATIONS = 16

/** Half-width of a diamond at the fat middle of a bolt. */
const GIRTH = 1.25

/**
 * Screen-corner origins in world space. Far enough out that the spines cross
 * most of the viewport before they meet at the impact.
 */
export const CORNERS = [
  { x: -8.6, y: 6.4, z: -3.2, phase: 0.0 },
  { x: 8.6, y: 6.2, z: -2.8, phase: 1.7 },
  { x: -8.4, y: -6.3, z: -3.0, phase: 3.1 },
  { x: 8.5, y: -6.5, z: -2.6, phase: 4.4 },
] as const

export type BoltBuffers = {
  readonly lines: Float32Array
  readonly nodes: Float32Array
  readonly spineVerts: number
  readonly totalVerts: number
  readonly nodeCount: number
}

function pushLine(out: number[], a: THREE.Vector3, b: THREE.Vector3) {
  out.push(a.x, a.y, a.z, b.x, b.y, b.z)
}

function diamond(
  center: THREE.Vector3,
  tangent: THREE.Vector3,
  radius: number,
  twist: number,
): THREE.Vector3[] {
  const up = Math.abs(tangent.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)
  const side = new THREE.Vector3().crossVectors(tangent, up).normalize()
  const binormal = new THREE.Vector3().crossVectors(tangent, side).normalize()

  const corners: THREE.Vector3[] = []
  for (let k = 0; k < 4; k += 1) {
    const angle = twist + (k * Math.PI) / 2
    corners.push(
      new THREE.Vector3()
        .copy(center)
        .addScaledVector(side, Math.cos(angle) * radius)
        .addScaledVector(binormal, Math.sin(angle) * radius),
    )
  }
  return corners
}

/** Spine from a corner origin into the shared impact point. */
function spineFor(
  origin: { readonly x: number; readonly y: number; readonly z: number },
  phase: number,
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []

  for (let i = 0; i <= STATIONS; i += 1) {
    const t = i / STATIONS
    const jag = Math.sin(t * Math.PI * 4.2 + phase) * (1.25 * (1 - t * 0.7))
    const lean = Math.sin(t * Math.PI * 2.3 + phase * 0.7) * 0.85 * (1 - t)
    const arc = Math.sin(t * Math.PI) * 0.55

    // Perpendicular jag so the path is a bolt, not a straight diagonal.
    const dx = IMPACT.x - origin.x
    const dy = IMPACT.y - origin.y
    const len = Math.hypot(dx, dy) || 1
    const px = (-dy / len) * jag
    const py = (dx / len) * jag

    points.push(
      new THREE.Vector3(
        origin.x + (IMPACT.x - origin.x) * t + px,
        origin.y + (IMPACT.y - origin.y) * t + py + arc * (1 - t),
        origin.z + (IMPACT.z - origin.z) * t + lean,
      ),
    )
  }

  points[points.length - 1] = new THREE.Vector3(IMPACT.x, IMPACT.y, IMPACT.z)
  return points
}

/** Builds one bolt from a corner. Deterministic — no `Math.random`. */
export function buildBolt(cornerIndex = 0): BoltBuffers {
  const corner = CORNERS[cornerIndex % CORNERS.length]!
  const lines: number[] = []
  const nodes: number[] = []
  const centers = spineFor(corner, corner.phase)

  for (let i = 0; i < centers.length - 1; i += 1) {
    pushLine(lines, centers[i]!, centers[i + 1]!)
  }
  const spineVerts = lines.length / 3

  let previous: THREE.Vector3[] | null = null

  for (let i = 0; i < centers.length; i += 1) {
    const center = centers[i]!
    const prev = centers[Math.max(0, i - 1)]!
    const next = centers[Math.min(centers.length - 1, i + 1)]!
    const tangent = new THREE.Vector3().subVectors(next, prev).normalize()

    const taper = Math.sin((i / (centers.length - 1)) * Math.PI)
    const tip = i / (centers.length - 1)
    const radius = GIRTH * (0.3 + taper * 0.7) * (1 - tip * 0.55)
    const twist = i * 0.22 + corner.phase
    const ring = diamond(center, tangent, radius, twist)

    for (let k = 0; k < 4; k += 1) pushLine(lines, ring[k]!, ring[(k + 1) % 4]!)

    if (previous) {
      for (let k = 0; k < 4; k += 1) pushLine(lines, previous[k]!, ring[k]!)

      if (i % 2 === 0) {
        for (let k = 0; k < 4; k += 1) {
          pushLine(lines, previous[k]!, ring[(k + 1) % 4]!)
          pushLine(lines, previous[(k + 1) % 4]!, ring[k]!)
        }
      }
    }

    for (let k = 0; k < 4; k += 1) {
      if ((i + k) % 2 === 0) {
        nodes.push(ring[k]!.x, ring[k]!.y, ring[k]!.z)
      }
    }

    previous = ring
  }

  const tip = centers[0]!
  const strike = centers[centers.length - 1]!
  nodes.push(tip.x, tip.y, tip.z, strike.x, strike.y, strike.z)

  return {
    lines: new Float32Array(lines),
    nodes: new Float32Array(nodes),
    spineVerts,
    totalVerts: lines.length / 3,
    nodeCount: nodes.length / 3,
  }
}

/** All four corner bolts, built once. */
export function buildCornerBolts(): readonly BoltBuffers[] {
  return CORNERS.map((_, index) => buildBolt(index))
}
