import { useEffect, useRef, useState } from "react"
import { hasFinePointer, prefersReducedMotion } from "@/lib/capability"

/** How much of the remaining distance the reticle covers each frame. */
const LAG = 0.2

/** What counts as a target worth locking onto. */
const CONTROLS =
  "a[href], button, input, textarea, summary, [role='option'], [tabindex='0'], [data-grab]"

/**
 * A targeting reticle instead of an arrow: hairlines across the viewport, a box
 * that trails the pointer, and a live coordinate readout. It is the same
 * instrument language as the rest of the page, applied to the one element that is
 * on screen the whole time.
 *
 * Only on real pointers, and never at the cost of the system cursor for someone
 * who asked for less motion — they keep the arrow and get a reticle that tracks
 * without any trailing.
 */
export function Reticle() {
  // Read at mount rather than in an effect, so a touch device never renders the
  // markup at all and the switch to a mouse is still picked up below.
  const [fine, setFine] = useState(hasFinePointer)

  const root = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = (event: MediaQueryListEvent) => setFine(event.matches)

    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const frame = root.current
    if (!fine || !frame) return

    const eased = !prefersReducedMotion()
    // The native cursor only gives way to the drawn one when motion is welcome.
    if (eased) document.documentElement.classList.add("reticle-on")

    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight / 2
    let x = pointerX
    let y = pointerY
    let shown = false
    let locked = false
    let loop = 0

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY

      if (!shown) {
        shown = true
        frame.dataset.shown = "true"
      }

      const target = event.target
      const onControl = target instanceof Element && target.closest(CONTROLS) !== null
      if (onControl !== locked) {
        locked = onControl
        frame.dataset.lock = String(onControl)
      }
    }

    const onLeave = () => {
      shown = false
      frame.dataset.shown = "false"
    }

    const draw = () => {
      const pull = eased ? LAG : 1
      x += (pointerX - x) * pull
      y += (pointerY - y) * pull

      frame.style.setProperty("--pointer-x", `${pointerX}px`)
      frame.style.setProperty("--pointer-y", `${pointerY}px`)
      frame.style.setProperty("--reticle-x", `${x}px`)
      frame.style.setProperty("--reticle-y", `${y}px`)

      if (readout.current) {
        readout.current.textContent = `X ${pad(pointerX)}  Y ${pad(pointerY)}`
      }

      loop = requestAnimationFrame(draw)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    loop = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(loop)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
      document.documentElement.classList.remove("reticle-on")
    }
  }, [fine])

  if (!fine) return null

  return (
    <div ref={root} aria-hidden="true" className="reticle" data-shown="false" data-lock="false">
      <span className="reticle-hair reticle-hair-h" />
      <span className="reticle-hair reticle-hair-v" />
      <span className="reticle-box">
        <span className="reticle-dot" />
      </span>
      <span ref={readout} className="readout reticle-readout" />
    </div>
  )
}

/** Four digits, so the readout never changes width as the pointer moves. */
const pad = (value: number) => String(Math.round(value)).padStart(4, "0")
