import { useEffect } from "react"
import { armSound, tick } from "@/lib/audio"

/** Anything worth a tick when it is clicked. */
const CONTROLS = "a[href], button, [role='option']"

const control = (target: EventTarget | null): Element | null =>
  target instanceof Element ? target.closest(CONTROLS) : null

/**
 * Wires the console's sound to the page without touching a single component:
 * clicks on controls tick, and the first gesture arms a remembered ambient pad.
 *
 * Renders nothing.
 */
export function SoundDeck() {
  useEffect(() => {
    // Autoplay policy: a visitor who left sound on last time can only have their
    // graph rebuilt from inside a genuine gesture, so the first one does it.
    window.addEventListener("pointerdown", armSound, { once: true })
    window.addEventListener("keydown", armSound, { once: true })

    const onClick = (event: Event) => {
      if (control(event.target)) tick()
    }

    document.addEventListener("click", onClick, true)

    return () => {
      window.removeEventListener("pointerdown", armSound)
      window.removeEventListener("keydown", armSound)
      document.removeEventListener("click", onClick, true)
    }
  }, [])

  return null
}
