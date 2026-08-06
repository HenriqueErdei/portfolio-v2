import { Search } from "lucide-react"
import { useI18n } from "@/i18n/context"
import { APPLE_KEYS, togglePalette } from "@/lib/palette"

/**
 * The visible half of the ⌘K shortcut. Worth the space in the bar: a keyboard
 * shortcut nobody is told about is a shortcut nobody uses, and on touch it is the
 * only way in.
 */
export function PaletteTrigger() {
  const { t } = useI18n()

  return (
    <button
      type="button"
      onClick={togglePalette}
      aria-label={t.palette.open}
      aria-keyshortcuts="Meta+K Control+K"
      className="flex h-8 items-center gap-2 border border-line px-2 text-ink-dim transition-colors hover:border-sig hover:text-sig"
    >
      <Search aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
      <span aria-hidden="true" className="readout hidden sm:inline">
        {APPLE_KEYS ? "⌘K" : "CTRL K"}
      </span>
    </button>
  )
}
