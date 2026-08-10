import { useEffect, useState } from "react"
import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { prefersReducedMotion, shouldRenderScene } from "@/lib/capability"
import {
  cancelIntro,
  getIntroPhase,
  getIntroProgress,
  introBlastGlow,
  introShockwave,
  introShockwaveEcho,
  playIntro,
  subscribeToIntro,
} from "@/lib/intro"
import { APPLE_KEYS } from "@/lib/palette"
import { setScrollLocked } from "@/lib/scrollTo"
import { LinearGauge } from "./Gauge"
import { Lamp } from "./Lamp"

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const CEILING = 4200
const MIN_BOOT_MS = 900

const ALL_CHECKS = [
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
      if (!shouldRenderScene()) return

      const deadline = performance.now() + 1800
      while (performance.now() < deadline) {
        if (document.querySelector("canvas.scene-canvas, .scene-canvas canvas, canvas")) return
        await wait(40)
      }
    },
  },
] as const

type CheckId = (typeof ALL_CHECKS)[number]["id"]
type Phase = "checklist" | "launch" | "clearing"

function bootChecks() {
  return shouldRenderScene() ? ALL_CHECKS : ALL_CHECKS.filter((check) => check.id !== "scene")
}

export function BootSequence() {
  const { t } = useI18n()

  const [checks] = useState(() => bootChecks())
  const [useCssBlast] = useState(() => !shouldRenderScene())
  const [skipped] = useState(() => getIntroPhase() === "done")
  const [done, setDone] = useState<readonly CheckId[]>([])
  const [phase, setPhase] = useState<Phase>("checklist")
  const [gone, setGone] = useState(false)
  const [flash, setFlash] = useState(0)
  const [wash, setWash] = useState(0)

  useEffect(() => {
    if (skipped) return

    setScrollLocked(true)
    const started = performance.now()
    let cancelled = false

    const finish = async () => {
      if (cancelled) return
      setPhase("clearing")
      setScrollLocked(false)
      await wait(560)
      if (!cancelled) setGone(true)
    }

    const launch = async () => {
      if (cancelled) return
      setPhase("launch")

      const off = subscribeToIntro(() => {
        const clock = getIntroProgress()
        setFlash(introBlastGlow(clock))
        setWash(introShockwave(clock) * 0.48 + introShockwaveEcho(clock) * 0.32)
      })

      try {
        await playIntro()
      } finally {
        off()
        setFlash(0)
        setWash(0)
      }

      await finish()
    }

    const ceiling = window.setTimeout(() => {
      void launch()
    }, CEILING)

    void Promise.all(
      checks.map(async (check) => {
        await check.settle()
        if (!cancelled) setDone((current) => (current.includes(check.id) ? current : [...current, check.id]))
      }),
    ).then(async () => {
      const dwell = prefersReducedMotion() ? 80 : 360
      const elapsed = performance.now() - started
      await wait(Math.max(MIN_BOOT_MS - elapsed, dwell, 0))
      window.clearTimeout(ceiling)
      await launch()
    })

    return () => {
      cancelled = true
      window.clearTimeout(ceiling)
      cancelIntro()
      setScrollLocked(false)
    }
  }, [checks, skipped])

  if (skipped || gone) return null

  const ready = done.length === checks.length
  const launching = phase === "launch" || phase === "clearing"

  return (
    <div
      className="boot"
      data-clearing={phase === "clearing"}
      data-launching={launching}
      role="status"
      aria-label={t.boot.label}
    >
      {launching ? (
        <>
          <div aria-hidden="true" className="boot-wash" style={{ opacity: wash }} />
          <div
            aria-hidden="true"
            className="boot-flash"
            style={{ opacity: useCssBlast ? flash : flash * 0.55 }}
          />
        </>
      ) : null}

      <div className="boot-panel panel panel-ticks" data-hidden={launching}>
        <div className="panel-head">
          <span className="readout text-sig">{t.boot.label}</span>
          <span className="readout text-ink-faint">{profile.name}</span>
        </div>

        <ul className="flex flex-col gap-3 p-5">
          {checks.map((check) => {
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
          <LinearGauge
            value={done.length / checks.length}
            label={t.boot.label}
            className="text-sig"
          />
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
