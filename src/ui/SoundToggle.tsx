import { Volume2, VolumeX } from "lucide-react"
import { useI18n } from "@/i18n/context"
import { useSound } from "@/lib/audio"

export function SoundToggle() {
  const { on, toggle } = useSound()
  const { t } = useI18n()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.a11y.soundToggle}
      aria-pressed={on}
      className="flex size-8 items-center justify-center border border-line text-ink-dim transition-colors hover:border-sig hover:text-sig"
    >
      {on ? (
        <Volume2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
      ) : (
        <VolumeX aria-hidden="true" className="size-4" strokeWidth={1.5} />
      )}
    </button>
  )
}
