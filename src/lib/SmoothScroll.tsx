import Lenis from "lenis"
import { useEffect, type ReactNode } from "react"
import { prefersReducedMotion } from "./capability"
import { registerScroller } from "./scrollTo"
import { setScrollProgress } from "./scroll"

/**
 * Owns scrolling for the whole page: Lenis for the weighted feel, and the same
 * loop feeds the scroll store so the readouts, CSS and the 3D scene all read one
 * consistent number.
 *
 * When reduced motion is requested Lenis never starts — native scrolling takes
 * over — but progress is still published, so the page stays fully functional
 * with none of the smoothing.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const publish = (scroll: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? scroll / max : 0)
    }

    if (prefersReducedMotion()) {
      const onScroll = () => publish(window.scrollY)
      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }

    const lenis = new Lenis({
      duration: 1.05,
      // Slightly under-damped: it settles quickly but keeps a trace of inertia,
      // which is what gives the page a sense of weight.
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      touchMultiplier: 1.6,
    })

    lenis.on("scroll", ({ scroll }: { scroll: number }) => publish(scroll))
    registerScroller(lenis)

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelAnimationFrame(frame)
      registerScroller(null)
      lenis.destroy()
    }
  }, [])

  return children
}
