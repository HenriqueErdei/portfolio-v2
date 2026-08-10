import { STAGES } from "@/app/stages"
import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { cn } from "@/lib/cn"
import { scrollToStage } from "@/lib/scrollTo"
import { useActiveStage } from "@/lib/useActiveStage"
import { LangSwitch } from "./LangSwitch"
import { PaletteTrigger } from "./PaletteTrigger"
import { SoundToggle } from "./SoundToggle"
import { ThemeToggle } from "./ThemeToggle"

const NAV_STAGES = STAGES.filter((stage) => stage.id !== "intro")

/**
 * Top chrome — name as home, standard section labels, utility controls on the right.
 */
export function TelemetryBar() {
  const { t } = useI18n()
  const active = useActiveStage()

  return (
    <header className="site-header fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md">
      <div className="shell flex h-14 items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => scrollToStage("intro")}
          className="site-brand truncate"
        >
          {profile.name}
        </button>

        <nav aria-label={t.a11y.navLabel} className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-4">
            {NAV_STAGES.map((stage) => {
              const current = stage.id === active
              return (
                <li key={stage.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollToStage(stage.id)}
                    aria-current={current ? "true" : undefined}
                    className={cn("site-nav-link px-2 py-1.5 lg:px-2.5")}
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
