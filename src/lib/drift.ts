/**
 * Zero-gravity physics for the cargo bay: axis-aligned boxes that drift, bounce
 * off the walls and off each other, and can be grabbed and thrown.
 *
 * A real engine would be wasted here. Gravity is what makes physics hard —
 * resting contacts, friction, stacks that have to stay standing — and there is
 * none, so a couple of hundred lines cover it exactly and add no dependency.
 */

export interface DriftBody {
  /** Top-left corner, in bay coordinates. */
  x: number
  y: number
  readonly w: number
  readonly h: number
  /** Pixels per second. */
  vx: number
  vy: number
  /** Proportional to area, so a wide chip shoves a small one aside. */
  readonly mass: number
  /** True while the pointer owns it; treated as immovable. */
  held: boolean
}

export interface Bounds {
  readonly width: number
  readonly height: number
}

/** Velocity kept per second of drift. Space, but not perpetual motion. */
const DAMPING = 0.55

/** Energy kept through a bounce. Under 1, or the bay never settles. */
const RESTITUTION = 0.86

/** Ceiling on speed, so a hard throw cannot launch a chip through a wall. */
const MAX_SPEED = 900

const HELD_MASS = 1e6

const massOf = (body: DriftBody) => (body.held ? HELD_MASS : body.mass)

/** One tick. `dt` is in seconds and is clamped by the caller. */
export function step(bodies: readonly DriftBody[], bounds: Bounds, dt: number) {
  const decay = DAMPING ** dt

  for (const body of bodies) {
    if (body.held) continue

    body.x += body.vx * dt
    body.y += body.vy * dt
    body.vx *= decay
    body.vy *= decay

    bounce(body, bounds)
  }

  separate(bodies)

  for (const body of bodies) clampSpeed(body)
}

/** Keeps a body inside the bay, reflecting whatever velocity took it out. */
function bounce(body: DriftBody, bounds: Bounds) {
  const maxX = Math.max(0, bounds.width - body.w)
  const maxY = Math.max(0, bounds.height - body.h)

  if (body.x < 0) {
    body.x = 0
    body.vx = Math.abs(body.vx) * RESTITUTION
  } else if (body.x > maxX) {
    body.x = maxX
    body.vx = -Math.abs(body.vx) * RESTITUTION
  }

  if (body.y < 0) {
    body.y = 0
    body.vy = Math.abs(body.vy) * RESTITUTION
  } else if (body.y > maxY) {
    body.y = maxY
    body.vy = -Math.abs(body.vy) * RESTITUTION
  }
}

function separate(bodies: readonly DriftBody[]) {
  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const a = bodies[i]
      const b = bodies[j]
      if (!a || !b) continue

      const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
      if (overlapX <= 0) continue

      const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
      if (overlapY <= 0) continue

      // Pushed apart along whichever axis needs the least movement, which is what
      // stops a box from being squeezed out sideways through its neighbour.
      if (overlapX < overlapY) resolve(a, b, overlapX, "x")
      else resolve(a, b, overlapY, "y")
    }
  }
}

function resolve(a: DriftBody, b: DriftBody, overlap: number, axis: "x" | "y") {
  const velocity = axis === "x" ? "vx" : "vy"
  const size = axis === "x" ? "w" : "h"

  const massA = massOf(a)
  const massB = massOf(b)
  const total = massA + massB

  // Which one is on the low side of the axis decides the direction of the push.
  const leading = a[axis] + a[size] / 2 < b[axis] + b[size] / 2 ? -1 : 1

  if (!a.held) a[axis] += leading * overlap * (massB / total)
  if (!b.held) b[axis] -= leading * overlap * (massA / total)

  const ua = a[velocity]
  const ub = b[velocity]

  // Only exchange when they are actually closing on each other. Without this,
  // two boxes already moving apart get their velocities flipped back and buzz.
  const closing = (ub - ua) * leading > 0
  if (!closing) return

  if (!a.held) a[velocity] = (((massA - massB) * ua + 2 * massB * ub) / total) * RESTITUTION
  if (!b.held) b[velocity] = (((massB - massA) * ub + 2 * massA * ua) / total) * RESTITUTION
}

function clampSpeed(body: DriftBody) {
  const speed = Math.hypot(body.vx, body.vy)
  if (speed <= MAX_SPEED) return

  const scale = MAX_SPEED / speed
  body.vx *= scale
  body.vy *= scale
}

/**
 * Lays bodies out on the coarsest grid that fits them all, with a little jitter
 * so the opening frame does not look like a spreadsheet.
 */
export function scatter(bodies: readonly DriftBody[], bounds: Bounds, random = Math.random) {
  const columns = Math.max(1, Math.ceil(Math.sqrt(bodies.length * (bounds.width / bounds.height))))
  const rows = Math.max(1, Math.ceil(bodies.length / columns))

  const cellWidth = bounds.width / columns
  const cellHeight = bounds.height / rows

  bodies.forEach((body, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)

    const slackX = Math.max(0, cellWidth - body.w)
    const slackY = Math.max(0, cellHeight - body.h)

    body.x = column * cellWidth + slackX * (0.2 + random() * 0.6)
    body.y = row * cellHeight + slackY * (0.2 + random() * 0.6)

    // Slow enough that the bay reads as adrift rather than as a screensaver.
    body.vx = (random() - 0.5) * 60
    body.vy = (random() - 0.5) * 40

    bounce(body, bounds)
  })
}
