import { ArrowDown, FileDown } from "lucide-react"
import { useEffect, useState } from "react"
import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { isHeroRevealed, onHeroReveal, shouldAnimateHero } from "@/lib/intro"
import { scrollToStage } from "@/lib/scrollTo"
import { ExternalLink } from "@/ui/ExternalLink"
import { HeroEnter } from "@/ui/HeroEnter"
import { Lamp } from "@/ui/Lamp"

/**
 * Hero — senior positioning first: role, outcome-focused headline, core stack,
 * clear CTAs for recruiters and hiring managers.
 */
export function Preflight() {
  const { t, pick } = useI18n()
  const headline = pick(profile.headline)
  const [ready, setReady] = useState(isHeroRevealed)
  const [animate] = useState(shouldAnimateHero)

  useEffect(() => onHeroReveal(() => setReady(true)), [])

  return (
    <section
      id="intro"
      tabIndex={-1}
      aria-labelledby="intro-title"
      data-preboot={animate && !ready ? "true" : "false"}
      data-hero-enter={animate && ready ? "true" : "false"}
      className="stage flex min-h-[100svh] items-center border-t-0 pt-14 focus-visible:outline-none"
    >
      <div className="shell w-full max-w-4xl">
        <HeroEnter className="flex flex-wrap items-center gap-3">
          <span className="hero-badge">
            <Lamp tone={profile.available ? "sig" : "warn"} pulse={profile.available} />
            {profile.available ? t.intro.available : t.intro.unavailable}
          </span>
          <span className="text-sm text-ink-faint">
            {profile.location} · {t.intro.remoteFriendly}
          </span>
        </HeroEnter>

        <HeroEnter delay={80}>
          <p className="mt-8 text-sm font-medium tracking-wide text-ink-faint">{profile.name}</p>
        </HeroEnter>

        <HeroEnter delay={120}>
          <p className="hero-role">{pick(profile.role)}</p>
        </HeroEnter>

        <h1 id="intro-title" className="mt-4">
          <span className="sr-only">
            {profile.name} — {pick(profile.role)}.{" "}
          </span>
          {headline.map((line, index) => (
            <HeroEnter
              key={line}
              as="span"
              delay={180 + index * 110}
              className="block text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink"
            >
              {line}
            </HeroEnter>
          ))}
        </h1>

        <HeroEnter delay={480}>
          <ul className="hero-stack" aria-label={t.intro.stackLabel}>
            {profile.focusStack.map((tool) => (
              <li key={tool} className="hero-stack-item">
                {tool}
              </li>
            ))}
          </ul>
        </HeroEnter>

        <HeroEnter delay={560} className="mt-10 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => scrollToStage("path")} className="btn-primary">
            {t.intro.primaryCta}
            <ArrowDown aria-hidden="true" className="size-4" strokeWidth={1.75} />
          </button>

          <button type="button" onClick={() => scrollToStage("contact")} className="btn-secondary">
            {t.intro.secondaryCta}
          </button>

          {profile.resumeUrl ? (
            <ExternalLink href={profile.resumeUrl} showIcon={false} className="btn-ghost">
              <FileDown aria-hidden="true" className="size-4" strokeWidth={1.75} />
              {t.intro.resumeCta}
            </ExternalLink>
          ) : null}
        </HeroEnter>
      </div>
    </section>
  )
}
