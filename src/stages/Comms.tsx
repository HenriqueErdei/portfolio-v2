import { ArrowUp, ArrowUpRight, Check, Copy, FileDown, Mail, Phone } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { scrollToStage } from "@/lib/scrollTo"
import { ExternalLink } from "@/ui/ExternalLink"
import { Panel } from "@/ui/Panel"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

export function Comms() {
  const { t, pick } = useI18n()

  return (
    <Stage id="contact" labelledBy="contact-title" className="pb-16">
      <StageHeading
        id="contact-title"
        designation={t.contact.designation}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
      />

      <Reveal>
        <Panel>
          <div className="p-6 md:p-8">
            <p className="max-w-2xl text-lg leading-relaxed text-ink-dim md:text-xl">
              {t.contact.lede}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={`mailto:${profile.email}`} className="btn-primary">
                <Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />
                {t.contact.emailCta}
              </a>

              {profile.resumeUrl ? (
                <ExternalLink href={profile.resumeUrl} showIcon={false} className="btn-secondary">
                  <FileDown aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  {t.contact.resume}
                </ExternalLink>
              ) : null}

              {profile.phone ? (
                <a href={`tel:+55${profile.phone}`} className="btn-secondary">
                  <Phone aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  {t.contact.phoneCta}
                </a>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:max-w-xl">
              <CopyEmailButton email={profile.email} />
              {profile.phone ? <CopyPhoneButton phone={profile.phone} /> : null}
            </div>

            <div className="mt-12 grid gap-10 border-t border-line-soft pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
              <div className="min-w-0">
                <p className="spec-label mb-4">{t.contact.socials}</p>
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
                          <span className="text-base font-medium text-ink transition-colors group-hover:text-sig sm:text-lg">
                            {social.label}
                          </span>
                          <span className="flex items-center gap-2 font-mono text-xs text-ink-faint">
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
                <p className="spec-label mb-2">{t.contact.localTime}</p>
                <LocalClock />
                <p className="mt-2 text-sm text-ink-faint">
                  {profile.location} · {t.about.spec.timezoneValue}
                </p>
              </div>
            </div>

            <footer className="mt-10 flex flex-col gap-4 border-t border-line-soft pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-ink-faint">
                  {profile.name} · {pick(profile.role)} · {new Date().getFullYear()}
                </p>
                <button type="button" onClick={() => scrollToStage("intro")} className="btn-ghost">
                  <ArrowUp aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  {t.contact.backToTop}
                </button>
              </div>
              <p className="text-xs text-ink-faint">
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

function LocalClock() {
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

  return (
    <time className="font-display text-3xl font-semibold tracking-tight text-sig sm:text-4xl">
      {now}
    </time>
  )
}

function formatPhoneBR(digits: string) {
  const d = digits.replace(/\D/g, "")
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  return digits
}

function CopyContactButton({ value, copiedLabel }: { value: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Value stays selectable in the button label.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex w-full items-center justify-between gap-3 border border-line-soft px-4 py-3 font-mono text-xs text-ink-dim transition-colors hover:border-sig hover:text-sig"
      >
        <span className="truncate">{value}</span>
        {copied ? (
          <Check aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
        ) : (
          <Copy aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  )
}

function CopyEmailButton({ email }: { email: string }) {
  const { t } = useI18n()
  return <CopyContactButton value={email} copiedLabel={t.contact.copied} />
}

function CopyPhoneButton({ phone }: { phone: string }) {
  const { t } = useI18n()
  return (
    <CopyContactButton value={formatPhoneBR(phone)} copiedLabel={t.contact.copied} />
  )
}

