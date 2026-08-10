import { Award, Briefcase, GraduationCap } from "lucide-react"
import type { TrajectoryKind } from "#content/types"
import { trajectory } from "#content/trajectory"
import { useI18n } from "@/i18n/context"
import { ExternalLink } from "@/ui/ExternalLink"
import { Panel } from "@/ui/Panel"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

const ICONS = {
  work: Briefcase,
  education: GraduationCap,
  credential: Award,
} as const satisfies Record<TrajectoryKind, unknown>

/** Experience, education and credentials on one timeline. */
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

      <ol className="flex flex-col gap-8">
        {trajectory.map((entry, index) => {
          const Icon = ICONS[entry.kind]
          return (
            <Reveal key={entry.id} as="li" delay={index * 70} className="timeline-item">
              <Panel>
                <div className="p-6 md:p-7">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="spec-label inline-flex items-center gap-1.5">
                      <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
                      {t.path.kind[entry.kind]}
                    </span>
                    <span className="font-mono text-xs text-ink-faint">{entry.period}</span>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                    {pick(entry.title)}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-sig">{entry.org}</p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {pick(entry.notes).map((note) => (
                      <li key={note} className="text-sm leading-relaxed text-ink-dim md:text-base">
                        {note}
                      </li>
                    ))}
                  </ul>

                  {entry.url ? (
                    <p className="mt-4">
                      <ExternalLink href={entry.url} className="text-sm">
                        {t.path.viewCredential}
                      </ExternalLink>
                    </p>
                  ) : null}
                </div>
              </Panel>
            </Reveal>
          )
        })}
      </ol>
    </Stage>
  )
}
