import { profile } from "#content/profile"
import { useI18n } from "@/i18n/context"
import { Panel, PanelHead } from "@/ui/Panel"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

/** The bio, plus a spec panel of the plain facts beside it. */
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

      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr] md:gap-16">
        <div className="flex flex-col gap-6">
          {pick(profile.bio).map((paragraph, index) => (
            <Reveal key={paragraph} as="p" delay={index * 90} className="text-lg leading-relaxed text-ink-dim">
              {paragraph}
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <Panel>
            <PanelHead code="01">{t.about.title}</PanelHead>
            <dl className="grid grid-cols-2 gap-5 p-5">
              <SpecItem label={t.about.spec.role} value={pick(profile.role)} />
              <SpecItem label={t.about.spec.location} value={profile.location} />
              <SpecItem
                label={t.about.spec.availability}
                value={profile.available ? t.intro.available : t.intro.unavailable}
              />
              <SpecItem label={t.about.spec.handle} value={profile.handle} />
            </dl>
          </Panel>
        </Reveal>
      </div>
    </Stage>
  )
}

/**
 * A definition pair rather than two spans: this is genuinely label/value data,
 * and `dl` is what lets assistive tech pair them.
 */
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="readout">{label}</dt>
      <dd className="readout-value text-sm text-ink">{value}</dd>
    </div>
  )
}
