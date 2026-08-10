import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { Panel } from "@/ui/Panel"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

/** About — bio plus a compact facts card for recruiters. */
export function Payload() {
  const { t, pick } = useI18n()

  return (
    <Stage id="about" labelledBy="about-title">
      <StageHeading
        id="about-title"
        designation={t.about.designation}
        title={t.about.title}
        subtitle={t.about.subtitle}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <Panel>
            <div className="flex flex-col gap-6 p-6 md:p-8">
              {pick(profile.bio).map((paragraph) => (
                <p key={paragraph} className="text-base leading-[1.75] text-ink-dim md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={120}>
          <Panel className="spec-card h-full">
            <dl className="grid gap-6 p-6 md:p-8">
              <SpecItem label={t.about.spec.role} value={pick(profile.role)} />
              <SpecItem label={t.about.spec.location} value={profile.location} />
              <SpecItem label={t.about.spec.timezone} value={t.about.spec.timezoneValue} />
              <SpecItem
                label={t.about.spec.availability}
                value={profile.available ? t.intro.available : t.intro.unavailable}
              />
              <SpecItem label={t.about.spec.email} value={profile.email} />
            </dl>
          </Panel>
        </Reveal>
      </div>
    </Stage>
  )
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-line-soft pb-5 last:border-b-0 last:pb-0">
      <dt className="spec-label">{label}</dt>
      <dd className="text-sm font-medium text-ink md:text-base">{value}</dd>
    </div>
  )
}
