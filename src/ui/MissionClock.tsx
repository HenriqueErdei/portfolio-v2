import { useEffect, useState } from "react"
import { profile } from "#content/profile"

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})

/**
 * Local time where I am. Ticks on a 1s interval aligned to the wall
 * clock, so the display never sits on a stale second the way a naive
 * `setInterval(fn, 1000)` does after the tab is throttled.
 */
export function MissionClock() {
  const [now, setNow] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    let timer: number

    const tick = () => {
      const date = new Date()
      setNow(formatter.format(date))
      timer = window.setTimeout(tick, 1000 - date.getMilliseconds())
    }

    tick()
    return () => window.clearTimeout(timer)
  }, [])

  // `time` carries no machine-readable datetime on purpose: this is a clock, not
  // a timestamp for an event.
  return <span className="readout-value text-xs">{now}</span>
}
