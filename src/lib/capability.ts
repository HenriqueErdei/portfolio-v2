/**
 * Device and preference probes. The 3D scene is the most expensive thing on the
 * page, so it has to be *possible* to say no to it — for people who asked for
 * less motion, for phones that would melt, and for browsers where WebGL is off.
 */

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function prefersReducedData(): boolean {
  return window.matchMedia("(prefers-reduced-data: reduce)").matches
}

/**
 * A mouse or trackpad, as opposed to a finger. Anything that only ever gets
 * tapped has no cursor to decorate and no hover state to react to.
 */
export function hasFinePointer(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

/**
 * A deliberately conservative guess. `deviceMemory` and `hardwareConcurrency`
 * are the only widely available signals, and both are absent on Safari — where
 * `undefined` means "assume capable" rather than blocking the scene outright.
 */
export function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }

  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) return true

  return false
}

/**
 * Creates a throwaway context instead of trusting `"WebGL2RenderingContext" in
 * window`: the constructor can exist while context creation still fails on
 * blocklisted drivers.
 */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    if (!gl) return false
    // Release it immediately; keeping it alive would burn one of the browser's
    // small pool of live contexts before the real scene asks for one.
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")
    lose?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Narrow viewports skip WebGL — the CSS grid carries the room instead, and
 * phones get a faster first paint without sacrificing readability.
 */
export function isMobileViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches
}

/** The single question the app asks before mounting the scene. */
export function shouldRenderScene(): boolean {
  return (
    !prefersReducedMotion() &&
    !prefersReducedData() &&
    !isLowPowerDevice() &&
    !isMobileViewport() &&
    hasWebGL()
  )
}
