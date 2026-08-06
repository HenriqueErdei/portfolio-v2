import { useEffect, useRef } from "react"

/**
 * Marks an element as shown the first time it scrolls into view, then stops
 * watching it. The animation itself lives in CSS (`.reveal[data-shown]`), so
 * reduced-motion users get the final state with no work done here.
 *
 * Returns a ref to attach to the element that carries the `reveal` class.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Elements already on screen at mount should not animate in — that reads as
    // a glitch rather than an entrance.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-shown", "true")
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
