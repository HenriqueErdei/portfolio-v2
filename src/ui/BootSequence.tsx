import { useEffect, useState } from "react"
import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { prefersReducedMotion, shouldRenderScene } from "@/lib/capability"
import {
  cancelIntro,
  getIntroPhase,
  getIntroProgress,
  playIntro,
  subscribeToIntro,
} from "@/lib/intro"
import { APPLE_KEYS } from "@/lib/palette"
import { setScrollLocked } from "@/lib/scrollTo"
import { flash } from "@/three/sequence"
import { LinearGauge } from "./Gauge"
import { Lamp } from "./Lamp"

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

/** Hard ceiling so a hung font or a dead WebGL probe cannot trap the visitor. */
const CEILING = 4200

/**
 * Real readiness checks. The meter only advances when something the page
 * actually needs has settled — same honesty as before, now feeding a launch
 * rather than a fade-out.
 */
const CHECKS = [
  {
    id: "systems",
    settle: () =>
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true })),
  },
  { id: "type", settle: () => document.fonts.ready.then(() => undefined) },
  {
    id: "scene",
    settle: async () => {
      // Give the idle callback that mounts the Canvas a beat to fire, then wait
      // for the canvas itself. Without WebGL we still resolve — the intro then
      // skips the blast on its own via reduced-power paths.
      if (!shouldRenderScene()) return

      const deadline = performance.now() + 1800
      while (performance.now() < deadline) {
        if (document.querySelector("canvas.scene-canvas, .scene-canvas canvas, canvas")) return
        await wait(40)
      }
    },
  },
] as const

type CheckId = (typeof CHECKS)[number]["id"]
type Phase = "checklist" | "launch" | "clearing"

/**
 * Entry boot, Portfolio-b pattern: a checklist while the page comes up, then the
 * 3D sequence plays through the transparent shell (bolt → impact → cascade),
 * the hero is revealed mid-settling, and only then is the page unlocked.
 *
 * Once per session. Returning visitors land straight on the cascade.
 */
export function BootSequence() {
  const { t } = useI18n()

  const [skipped] = useState(() => getIntroPhase() === "done")
  const [done, setDone] = useState<readonly CheckId[]>([])
  const [phase, setPhase] = useState<Phase>("checklist")
  const [gone, setGone] = useState(false)
  const [blast, setBlast] = useState(0)

  useEffect(() => {
    if (skipped) return

    setScrollLocked(true)
    const started = performance.now()
    let cancelled = false

    const finish = async () => {
      if (cancelled) return
      setPhase("clearing")
      setScrollLocked(false)
      await wait(520)
      if (!cancelled) setGone(true)
    }

    const launch = async () => {
      if (cancelled) return
      setPhase("launch")

      // The clock that drives the strike also drives the white flash over the
      // lens — same beat Portfolio-b fires as the camera leaves the roof.
      const off = subscribeToIntro(() => setBlast(flash(getIntroProgress())))

      try {
        await playIntro()
      } finally {
        off()
      }

      await finish()
    }

    const ceiling = window.setTimeout(() => {
      void launch()
    }, CEILING)

    void Promise.all(
      CHECKS.map(async (check) => {
        await check.settle()
        if (!cancelled) setDone((current) => (current.includes(check.id) ? current : [...current, check.id]))
      }),
    ).then(async () => {
      // A short hold so the last lamp can be read before the charge starts.
      const dwell = prefersReducedMotion() ? 120 : 520
      await wait(Math.max(0, dwell - (performance.now() - started)))
      window.clearTimeout(ceiling)
      await launch()
    })

    return () => {
      cancelled = true
      window.clearTimeout(ceiling)
      cancelIntro()
      setScrollLocked(false)
    }
  }, [skipped])

  if (skipped || gone) return null

  const ready = done.length === CHECKS.length
  const launching = phase === "launch" || phase === "clearing"

  return (
    <div
      className="boot"
      data-clearing={phase === "clearing"}
      data-launching={launching}
      role="status"
      aria-label={t.boot.label}
    >
      {/* Flash sits above the checklist so the detonation washes the whole lens,
          then clears into the cascade underneath. */}
      <div aria-hidden="true" className="boot-flash" style={{ opacity: blast }} />

      <div className="boot-panel panel panel-ticks" data-hidden={launching}>
        <div className="panel-head">
          <span className="readout text-sig">{t.boot.label}</span>
          <span className="readout text-ink-faint">{profile.name}</span>
        </div>

        <ul className="flex flex-col gap-3 p-5">
          {CHECKS.map((check) => {
            const complete = done.includes(check.id)
            return (
              <li key={check.id} className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-3">
                  <Lamp tone={complete ? "sig" : "dim"} pulse={!complete} />
                  <span className="readout text-ink">{t.boot.step[check.id]}</span>
                </span>
                <span className="readout text-sig">{complete ? t.boot.ok : "···"}</span>
              </li>
            )
          })}

          <li className="mt-1 flex items-center justify-between gap-6">
            <span className="flex items-center gap-3">
              <Lamp tone={ready ? "sig" : "dim"} pulse={!ready} />
              <span className="readout text-ink">{t.boot.step.ready}</span>
            </span>
            <span className="readout text-sig">{ready ? t.boot.ok : "···"}</span>
          </li>
        </ul>

        <div className="px-5 pb-5">
          <LinearGauge value={done.length / CHECKS.length} label={t.boot.label} className="text-sig" />
        </div>

        <p className="flex items-center gap-2 border-t border-line px-5 py-3">
          <kbd className="readout border border-line px-1.5 py-0.5 text-ink-dim">
            {APPLE_KEYS ? "⌘K" : "Ctrl K"}
          </kbd>
          <span className="readout text-ink-faint">{t.boot.hint}</span>
        </p>
      </div>
    </div>
  )
}
