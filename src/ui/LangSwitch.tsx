import { LOCALES } from "#content/types"
import { DICTIONARIES } from "@/i18n/dictionaries"
import { useI18n } from "@/i18n/context"
import { cn } from "@/lib/cn"
import { FlagIcon } from "./FlagIcon"

/**
 * Locale picker — flags instead of codes so the control stays compact and
 * scannable. Full language names live in aria-label / title for screen readers.
 */
export function LangSwitch() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div role="group" aria-label={t.a11y.langSwitch} className="lang-switch flex border border-line">
      {LOCALES.map((code) => {
        const active = code === locale
        const label = DICTIONARIES[code].meta.localeName

        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={cn(
              "lang-switch-btn transition-colors",
              active ? "bg-sig/10" : "hover:bg-ink/5",
            )}
          >
            <FlagIcon locale={code} className="lang-switch-flag" />
          </button>
        )
      })}
    </div>
  )
}
