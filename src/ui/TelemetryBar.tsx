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
      <div className="shell flex flex-wrap items-center justify-between gap-x-3 md:h-14 md:flex-nowrap md:gap-4">
        <button
          type="button"
          onClick={() => scrollToStage("intro")}
          className="site-brand min-w-0 max-w-[42%] truncate py-3 md:max-w-none md:py-0"
        >
          {profile.name}
        </button>

        <div className="flex shrink-0 items-center gap-1.5 py-3 md:order-3 md:gap-2 md:py-0">
          <PaletteTrigger />
          <LangSwitch />
          <SoundToggle />
          <ThemeToggle />
        </div>

        <nav
          aria-label={t.a11y.navLabel}
          className="site-header-nav basis-full border-t border-line-soft md:order-2 md:min-w-0 md:flex-1 md:basis-auto md:overflow-x-auto md:border-t-0"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-0 py-1 md:flex-nowrap md:justify-center md:gap-2 md:py-0 lg:gap-4">
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
      </div>
    </header>
  )
}
