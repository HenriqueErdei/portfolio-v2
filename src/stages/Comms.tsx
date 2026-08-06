import { ArrowUp, ArrowUpRight, Check, Copy, FileDown, Mail } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { scrollToStage } from "@/lib/scrollTo"
import { ExternalLink } from "@/ui/ExternalLink"
import { Panel, PanelHead } from "@/ui/Panel"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

/**
 * S-06. Same Panel vocabulary as Notes / missions — instrument chrome over the
 * scene, not a one-off plate.
 */
export function Comms() {
  const { t, pick } = useI18n()

  return (
    <Stage id="contact" labelledBy="contact-title" className="pb-16">
      <StageHeading
        id="contact-title"
        designation={t.contact.designation}
        title={t.nav.contact}
        subtitle={t.contact.subtitle}
      />

      <Reveal>
        <Panel>
          <PanelHead code={t.contact.designation} right={<LocalClock compact />}>
            {profile.handle}
          </PanelHead>

          <div className="p-5 md:p-6">
            <h3 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              <span className="block">{t.contact.titleA}</span>
              <span className="mt-1 block text-sig">{t.contact.titleB}</span>
            </h3>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center gap-2 bg-sig px-5 py-3 text-sm font-medium tracking-wide text-void uppercase transition-opacity hover:opacity-90"
              >
                <Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />
                {t.contact.emailCta}
              </a>
              <CopyEmailButton email={profile.email} />
            </div>

            <div className="mt-10 grid gap-10 border-t border-line-soft pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
              <div className="min-w-0">
                <p className="readout mb-3 text-ink-dim">{t.contact.socials}</p>
                <ul className="flex flex-col">
                  {profile.socials.map((social) => {
                    const external = social.url.startsWith("http")
                    return (
                      <li key={social.url} className="border-t border-line-soft last:border-b">
                        <a
                          href={social.url}
                          {...(external
                            ? { target: "_blank", rel: "noreferrer noopener" }
                            : {})}
                          className="group flex w-full items-baseline justify-between gap-4 py-3.5"
                        >
                          <span className="font-display text-lg font-medium text-ink transition-colors group-hover:text-sig sm:text-xl">
                            {social.label}
                          </span>
                          <span className="readout flex items-center gap-2 text-ink-dim">
                            {social.handle ?? social.label}
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              strokeWidth={1.75}
                            />
                            {external ? (
                              <span className="sr-only"> ({t.a11y.externalLink})</span>
                            ) : null}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="md:text-right">
                <p className="readout mb-2 text-ink-dim">{t.contact.localTime}</p>
                <LocalClock />
                <p className="readout mt-2 text-ink-dim">{profile.location}</p>
              </div>
            </div>

            {profile.resumeUrl ? (
              <div className="mt-6">
                <ExternalLink href={profile.resumeUrl} showIcon={false} className="text-sm">
                  <FileDown aria-hidden="true" className="size-4" strokeWidth={1.5} />
                  {t.contact.resume}
                </ExternalLink>
              </div>
            ) : null}

            <footer className="mt-10 flex flex-col gap-4 border-t border-line-soft pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="readout text-ink-dim">
                  {profile.name} · {pick(profile.role)} · {new Date().getFullYear()}
                </p>
                <button
                  type="button"
                  onClick={() => scrollToStage("intro")}
                  className="link-console readout text-ink"
                >
                  <ArrowUp aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  {t.contact.backToTop}
                </button>
              </div>
              <p className="readout text-ink-dim">
                {t.contact.builtWith} React · TypeScript · Vite · Tailwind CSS · three.js
              </p>
            </footer>
          </div>
        </Panel>
      </Reveal>
    </Stage>
  )
}

const clockFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})

function LocalClock({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => clockFmt.format(new Date()))

  useEffect(() => {
    let timer: number

    const tick = () => {
      const date = new Date()
      setNow(clockFmt.format(date))
      timer = window.setTimeout(tick, 1000 - date.getMilliseconds())
    }

    tick()
    return () => window.clearTimeout(timer)
  }, [])

  if (compact) {
    return <span className="readout-value text-xs text-sig">{now}</span>
  }

  return (
    <time className="font-display text-4xl font-semibold tracking-tight text-sig sm:text-5xl">
      {now}
    </time>
  )
}

function CopyEmailButton({ email }: { email: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Address stays selectable in the button label.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-w-0 flex-1 items-center justify-between gap-3 border border-line px-4 py-3 font-mono text-xs tracking-wide text-ink-dim transition-colors hover:border-sig hover:text-sig sm:max-w-md"
      >
        <span className="truncate">{email}</span>
        {copied ? (
          <Check aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
        ) : (
          <Copy aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t.contact.copied : ""}
      </span>
    </>
  )
}
