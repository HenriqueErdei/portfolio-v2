import { STAGES } from "@/app/stages"
import { useI18n } from "@/i18n/context"
import { cn } from "@/lib/cn"
import { scrollToStage } from "@/lib/scrollTo"
import { useActiveStage } from "@/lib/useActiveStage"

/**
 * Vertical stage index, pinned to the right edge of the viewport. Hidden below
 * `lg` rather than reflowed into a hamburger: on a phone the page is short enough
 * to scroll, and a second nav would just cover content.
 *
 * Anchored to the screen edge — not the content column — so it reads as chrome
 * rather than as something floating in the middle of the page.
 *
 * `aria-current="true"` is what tells a screen reader which stage is in view —
 * the colour change is only the sighted half of that signal.
 */
export function NavRail() {
  const { t } = useI18n()
  const active = useActiveStage()

  return (
    <nav
      aria-label={t.a11y.navLabel}
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block xl:right-6"
    >
      <ul className="flex flex-col gap-1">
        {STAGES.map((stage) => {
          const current = stage.id === active
          return (
            <li key={stage.id}>
              <button
                type="button"
                onClick={() => scrollToStage(stage.id)}
                aria-current={current ? "true" : undefined}
                className="group flex w-full items-center justify-end gap-3 py-1"
              >
                <span
                  className={cn(
                    "readout transition-all duration-300",
                    current
                      ? "text-sig opacity-100"
                      : "text-ink-faint opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  {t.nav[stage.id]}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px transition-all duration-300",
                    current ? "w-8 bg-sig" : "w-4 bg-line group-hover:w-6 group-hover:bg-ink-dim",
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
