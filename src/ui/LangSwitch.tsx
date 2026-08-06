import { LOCALES } from "#content/types"
import { useI18n } from "@/i18n/context"
import { cn } from "@/lib/cn"

const SHORT: Readonly<Record<string, string>> = { pt: "PT", en: "EN", es: "ES" }

/**
 * Three buttons rather than a dropdown: with only three options a select adds a
 * click and hides the current state. Grouped so assistive tech announces it as
 * one control with a label.
 */
export function LangSwitch() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div role="group" aria-label={t.a11y.langSwitch} className="flex border border-line">
      {LOCALES.map((code) => {
        const active = code === locale
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={cn(
              "readout px-2 py-1.5 transition-colors",
              active ? "bg-sig/10 text-sig" : "text-ink-faint hover:text-ink",
            )}
          >
            {SHORT[code]}
          </button>
        )
      })}
    </div>
  )
}
