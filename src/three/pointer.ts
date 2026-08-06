import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, type RefObject } from "react"
import * as THREE from "three"

/**
 * The cursor, as normalised device coordinates: -1 to 1 on both axes, with +y up.
 *
 * It lives at module scope with one shared listener because several layers want
 * it — camera, tower, shards — and duplicate `pointermove` handlers computing
 * the same two numbers would be waste.
 *
 * Each consumer still gets its own damped copy through `usePointerRef`, so they
 * can lag by different amounts. That gap (tower leading, camera trailing) is
 * what reads as depth.
 */

export type Pointer = { x: number; y: number }

const raw: Pointer = { x: 0, y: 0 }

let consumers = 0
let detach: (() => void) | null = null

function handleMove(event: PointerEvent) {
  // Touch and pen movement here is a scroll gesture, not aiming. Letting it
  // through would swing the whole scene sideways every time someone flicks the
  // page on a phone.
  if (event.pointerType !== "mouse") return

  raw.x = (event.clientX / window.innerWidth) * 2 - 1
  raw.y = -((event.clientY / window.innerHeight) * 2 - 1)
}

/** Recentres when the cursor leaves, so the scene does not stay held off-axis. */
function handleLeave() {
  raw.x = 0
  raw.y = 0
}

function attach() {
  consumers += 1
  if (detach) return

  // A coarse pointer has no hover position to track, and `matchMedia` is the only
  // honest way to ask — touch devices still fire `pointermove`.
  if (!window.matchMedia("(pointer: fine)").matches) return

  window.addEventListener("pointermove", handleMove, { passive: true })
  document.addEventListener("pointerleave", handleLeave)
  window.addEventListener("blur", handleLeave)

  detach = () => {
    window.removeEventListener("pointermove", handleMove)
    document.removeEventListener("pointerleave", handleLeave)
    window.removeEventListener("blur", handleLeave)
  }
}

function release() {
  consumers -= 1
  if (consumers > 0) return

  detach?.()
  detach = null
  handleLeave()
}

/**
 * A smoothed view of the cursor, damped inside the render loop.
 *
 * `lambda` is how eagerly this copy chases the real cursor — higher is snappier.
 * The returned object is mutated in place rather than replaced, so reading it
 * every frame costs no allocation.
 */
export function usePointerRef(lambda = 4): RefObject<Pointer> {
  const smoothed = useRef<Pointer>({ x: 0, y: 0 })

  useEffect(() => {
    attach()
    return release
  }, [])

  useFrame((_, delta) => {
    smoothed.current.x = THREE.MathUtils.damp(smoothed.current.x, raw.x, lambda, delta)
    smoothed.current.y = THREE.MathUtils.damp(smoothed.current.y, raw.y, lambda, delta)
  })

  return smoothed
}
