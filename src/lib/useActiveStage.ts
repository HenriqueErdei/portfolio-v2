import { useEffect, useState } from "react"
import { STAGE_IDS, type StageId } from "@/app/stages"

/**
 * Which stage the visitor is looking at. Uses one IntersectionObserver over all
 * stages rather than measuring positions on scroll, so it costs nothing per
 * frame and stays correct when panels expand and change the page height.
 *
 * The band is the middle of the viewport: a stage becomes active when it crosses
 * the centre line, which matches where attention actually is.
 */
export function useActiveStage(): StageId {
  const [active, setActive] = useState<StageId>(STAGE_IDS[0] as StageId)

  useEffect(() => {
    const elements = STAGE_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // With a zero-height root margin band, at most one entry is intersecting
        // at a time; taking the last keeps the direction of travel sensible when
        // two fire together on a fast fling.
        const hit = entries.filter((entry) => entry.isIntersecting).at(-1)
        if (hit) setActive(hit.target.id as StageId)
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    )

    for (const element of elements) observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return active
}
