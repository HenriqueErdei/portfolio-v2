import * as THREE from "three"

/**
 * The background is one continuous sequence: four geometric bolts charge from
 * the corners, strike the geogram origin, the impact flash wakes the tower, and
 * the debris settles into the cascade. Every beat lives here as a pure function
 * of progress — timings stay in one place and can be tested without WebGL.
 */

/** Sequence positions, 0 → 1, where each beat lands. */
export const BEAT = {
  /** Bolt begins drawing from the sky. */
  charge: 0.02,
  /** Tip reaches the geogram origin. */
  strike: 0.13,
  /** Impact: core flash and shards peel outward. */
  ignition: 0.145,
  /** Brightest moment of the flash. */
  peak: 0.175,
  /** Debris stops flying outward and starts finding the column. */
  gather: 0.28,
  /** Cascade formed; tower fully awake. From here scroll only evolves it. */
  formed: 0.5,
} as const

const { smoothstep, clamp } = THREE.MathUtils

/** World-space point the bolt hits — also the tower's visual centre. */
export const IMPACT = { x: 0, y: 0.15, z: 0 } as const

/** 0 before the blast, 1 once it has fully fired. */
export function ignite(progress: number): number {
  return smoothstep(progress, BEAT.ignition, BEAT.gather)
}

/** 0 while the debris is still flying, 1 once it has joined the cascade. */
export function settle(progress: number): number {
  return smoothstep(progress, BEAT.gather, BEAT.formed)
}

/**
 * The flash, as a bell curve around the peak. Narrow on purpose: it covers the
 * instant the bolt vanishes and the shards take the stage.
 */
export function flash(progress: number): number {
  return Math.exp(-(((progress - BEAT.peak) / 0.028) ** 2))
}

/** Radius of the shockwave, 0 → 1. Starts at the peak and outruns the flash. */
export function shockwave(progress: number): number {
  return smoothstep(progress, BEAT.peak, BEAT.peak + 0.14)
}

/**
 * How much of the bolt is drawn. Spine first through the strike, then the cage
 * fills in just as the tip lands — so the structure reads as a strike, not a
 * progress bar that empties afterward.
 */
export function boltReveal(progress: number): number {
  const spine = smoothstep(progress, BEAT.charge, BEAT.strike) * 0.55
  const cage = smoothstep(progress, BEAT.charge + 0.04, BEAT.strike) * 0.45
  return clamp(spine + cage, 0, 1)
}

/**
 * Bolt opacity after the hit. Holds through the peak so the flash can cover the
 * hand-off, then clears so the tower owns the frame.
 */
export function boltFade(progress: number): number {
  const in_ = smoothstep(progress, BEAT.charge, BEAT.charge + 0.03)
  const out = 1 - smoothstep(progress, BEAT.peak, BEAT.gather)
  return clamp(in_ * out, 0, 1)
}

/**
 * Tower wake: starts at the impact and finishes as the cascade settles. Earlier
 * than `settle` so the geogram lights up *with* the strike, not after it.
 */
export function towerAwake(progress: number): number {
  return smoothstep(progress, BEAT.ignition, BEAT.formed)
}
