import { STAGES } from "@/app/stages"
import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { cn } from "@/lib/cn"
import { scrollToStage } from "@/lib/scrollTo"
import { useActiveStage } from "@/lib/useActiveStage"
import { LangSwitch } from "./LangSwitch"
import { Lamp } from "./Lamp"
import { PaletteTrigger } from "./PaletteTrigger"
import { SoundToggle } from "./SoundToggle"
import { ThemeToggle } from "./ThemeToggle"

/**
 * Top chrome: identity, stage index, and controls. The stage links live here —
 * one menu, no duplicate rail of clock/progress chrome.
 */
export function TelemetryBar() {
  const { t } = useI18n()
  const active = useActiveStage()

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-void/80 backdrop-blur-md">
      <div className="shell flex h-12 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Lamp tone={profile.available ? "sig" : "warn"} pulse={profile.available} />
          <span className="readout truncate text-ink">{profile.name}</span>
        </div>

        <nav aria-label={t.a11y.navLabel} className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center justify-center gap-0.5 sm:gap-1 lg:gap-2">
            {STAGES.map((stage) => {
              const current = stage.id === active
              return (
                <li key={stage.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollToStage(stage.id)}
                    aria-current={current ? "true" : undefined}
                    className={cn(
                      "readout px-1.5 py-1 transition-colors duration-300 lg:px-2",
                      current ? "text-sig" : "text-ink-faint hover:text-ink",
                    )}
                  >
                    {t.nav[stage.id]}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <PaletteTrigger />
          <LangSwitch />
          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
