import { Award, Briefcase, GraduationCap } from "lucide-react"
import type { TrajectoryKind } from "#content/types"
import { trajectory } from "#content/trajectory"
import { useI18n } from "@/i18n/context"
import { ExternalLink } from "@/ui/ExternalLink"
import { Lamp, type LampTone } from "@/ui/Lamp"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

const ICONS = {
  work: Briefcase,
  education: GraduationCap,
  credential: Award,
} as const satisfies Record<TrajectoryKind, unknown>

const TONES: Record<TrajectoryKind, LampTone> = {
  work: "sig",
  education: "plasma",
  credential: "warn",
}

/**
 * S-02. Work, study and credentials on one timeline rather than three separate
 * lists — the point is the shape of the path, and splitting it by type hides
 * that the pieces overlap in time.
 */
export function Trajectory() {
  const { t, pick } = useI18n()

  return (
    <Stage id="path" labelledBy="path-title">
      <StageHeading
        id="path-title"
        designation={t.path.designation}
        title={t.path.title}
        subtitle={t.path.subtitle}
      />

      <ol className="relative">
        {/* The spine. Decorative, so it is drawn rather than implied by borders
            on each item, which would break at the first and last entry. */}
        <span aria-hidden="true" className="absolute bottom-6 left-[5px] top-2 w-px bg-line" />

        {trajectory.map((entry, index) => {
          const Icon = ICONS[entry.kind]
          return (
            <Reveal
              key={entry.id}
              as="li"
              delay={index * 70}
              className="relative grid gap-2 pb-12 pl-8 last:pb-0 md:grid-cols-[10rem_1fr] md:gap-8 md:pl-10"
            >
              <span className="absolute left-0 top-1.5 md:top-2">
                <Lamp tone={TONES[entry.kind]} />
              </span>

              <div className="flex flex-col gap-1.5">
                <span className="readout-value text-sm text-ink">{entry.period}</span>
                <span className="readout flex items-center gap-1.5 text-ink-faint">
                  <Icon aria-hidden="true" className="size-3" strokeWidth={2} />
                  {t.path.kind[entry.kind]}
                </span>
              </div>

              <div>
                <h3 className="text-xl text-ink md:text-2xl">{pick(entry.title)}</h3>
                <p className="readout mt-1 text-sig">{entry.org}</p>

                <ul className="mt-3 flex flex-col gap-1.5">
                  {pick(entry.notes).map((note) => (
                    <li key={note} className="text-ink-dim before:mr-2 before:text-ink-faint before:content-['—']">
                      {note}
                    </li>
                  ))}
                </ul>

                {entry.url ? (
                  <p className="mt-3">
                    <ExternalLink href={entry.url} className="readout">
                      {t.path.viewCredential}
                    </ExternalLink>
                  </p>
                ) : null}
              </div>
            </Reveal>
          )
        })}
      </ol>
    </Stage>
  )
}
