import { useEffect, useRef } from "react"
import { ambientLift, getIntroPhase, getIntroProgress, subscribeToIntro } from "@/lib/intro"

/** Keeps `--intro-progress` (ambient lift) and `data-intro` on `.room` in sync. */
export function useRoomIntro() {
  const room = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sync = () => {
      const element = room.current
      if (!element) return
      element.dataset.intro = getIntroPhase()
      const lift = getIntroPhase() === "done" ? 1 : ambientLift(getIntroProgress())
      element.style.setProperty("--intro-progress", String(lift))
    }

    return subscribeToIntro(sync)
  }, [])

  return room
}
