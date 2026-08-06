import { Moon, Sun } from "lucide-react"
import { useI18n } from "@/i18n/context"
import { useTheme } from "@/theme/context"

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const { t } = useI18n()
  const isDaylight = theme === "daylight"

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.a11y.themeToggle}
      aria-pressed={isDaylight}
      className="flex size-8 items-center justify-center border border-line text-ink-dim transition-colors hover:border-sig hover:text-sig"
    >
      {isDaylight ? (
        <Sun aria-hidden="true" className="size-4" strokeWidth={1.5} />
      ) : (
        <Moon aria-hidden="true" className="size-4" strokeWidth={1.5} />
      )}
    </button>
  )
}
