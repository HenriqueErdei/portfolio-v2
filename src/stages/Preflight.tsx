import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"
import { profile } from "#content/profile"
import { STAGES } from "@/app/stages"
import { useI18n } from "@/i18n/context"
import { isHeroRevealed, onHeroReveal } from "@/lib/intro"
import { scrollToStage } from "@/lib/scrollTo"
import { Lamp } from "@/ui/Lamp"
import { Reveal } from "@/ui/Reveal"

const [stage] = STAGES

/**
 * The cover: name, what I do, and one honest line about availability.
 *
 * Held invisible until the entry sequence reveals it — same hand-off
 * Portfolio-b uses between the camera descent and the hero copy — so the blast
 * gets the stage to itself for a moment before the page starts talking.
 */
export function Preflight() {
  const { t, pick } = useI18n()
  const headline = pick(profile.headline)
  const [ready, setReady] = useState(isHeroRevealed)

  useEffect(() => onHeroReveal(() => setReady(true)), [])

  return (
    <section
      id="intro"
      tabIndex={-1}
      aria-labelledby="intro-title"
      data-preboot={ready ? "false" : "true"}
      className="stage flex min-h-[100svh] items-center pt-12 focus-visible:outline-none"
    >
      <div className="shell w-full">
        <Reveal className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span aria-hidden="true" className="readout text-sig">
            {stage?.designation}
          </span>
          <span className="flex items-center gap-2">
            <Lamp tone={profile.available ? "sig" : "warn"} pulse={profile.available} />
            <span className="readout text-ink">
              {profile.available ? t.intro.available : t.intro.unavailable}
            </span>
          </span>
          <span className="readout text-ink-faint">
            {t.intro.basedIn} · {profile.location}
          </span>
        </Reveal>

        <h1 id="intro-title" className="mt-8 max-w-4xl">
          <span className="sr-only">
            {profile.name} — {pick(profile.role)}.{" "}
          </span>
          {headline.map((line, index) => (
            <Reveal
              key={line}
              as="span"
              delay={120 + index * 110}
              className="block text-[clamp(2.75rem,9vw,7rem)] font-medium leading-[0.95] tracking-[-0.03em] text-ink"
            >
              {line}
            </Reveal>
          ))}
        </h1>

        <Reveal delay={480} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={() => scrollToStage("work")}
            className="group flex items-center gap-2 border border-sig px-5 py-3 text-sm text-sig transition-colors hover:bg-sig hover:text-void"
          >
            {t.intro.primaryCta}
            <ArrowDown
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-y-0.5"
              strokeWidth={1.75}
            />
          </button>

          <button
            type="button"
            onClick={() => scrollToStage("contact")}
            className="link-console text-sm"
          >
            {t.intro.secondaryCta}
          </button>
        </Reveal>

        <Reveal delay={620} className="mt-16">
          <span className="readout text-ink-faint">{t.intro.scrollHint}</span>
        </Reveal>
      </div>
    </section>
  )
}
