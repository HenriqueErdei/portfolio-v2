import { Award, Briefcase, GraduationCap } from "lucide-react"
import type { ReactNode } from "react"
import { profile } from "#content/profile"
import { trajectory } from "#content/trajectory"
import type { TrajectoryEntry, TrajectoryKind } from "#content/types"
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

const linkedInUrl = profile.socials.find((social) => social.icon === "linkedin")?.url

/** Experience then education — recruiters scan roles first, degrees second. */
export function Trajectory() {
  const { t } = useI18n()
  const work = trajectory.filter((entry) => entry.kind === "work")
  const education = trajectory.filter((entry) => entry.kind === "education")

  return (
    <Stage id="path" labelledBy="path-title">
      <StageHeading
        id="path-title"
        designation={t.path.designation}
        title={t.path.title}
        subtitle={t.path.subtitle}
      />

      <TrajectoryGroup headingId="path-work" title={t.path.workHeading}>
        <TrajectoryList entries={work} />
      </TrajectoryGroup>

      <TrajectoryGroup headingId="path-education" title={t.path.educationHeading}>
        <TrajectoryList entries={education} startDelay={work.length * 70} />
        {linkedInUrl ? (
          <Reveal delay={(work.length + education.length) * 70} className="path-courses">
            <p>{t.path.courses}</p>
            <p className="mt-2">
              <ExternalLink href={linkedInUrl} className="text-sm">
                {t.path.viewCredential}
              </ExternalLink>
            </p>
          </Reveal>
        ) : null}
      </TrajectoryGroup>
    </Stage>
  )
}

function TrajectoryGroup({
  headingId,
  title,
  children,
}: {
  headingId: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="path-group" aria-labelledby={headingId}>
      <h3 id={headingId} className="path-group-title">
        {title}
      </h3>
      {children}
    </section>
  )
}

function TrajectoryList({
  entries,
  startDelay = 0,
}: {
  entries: readonly TrajectoryEntry[]
  startDelay?: number
}) {
  const { t, pick } = useI18n()

  return (
    <ol className="flex flex-col gap-8">
      {entries.map((entry, index) => {
        const Icon = ICONS[entry.kind]
        return (
          <Reveal key={entry.id} as="li" delay={startDelay + index * 70} className="timeline-item">
            <Panel>
              <div className="p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="spec-label inline-flex items-center gap-1.5">
                    <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
                    {t.path.kind[entry.kind]}
                  </span>
                  <span className="font-mono text-xs text-ink-faint">{entry.period}</span>
                </div>

                <h4 className="mt-3 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {pick(entry.title)}
                </h4>
                <p className="mt-1 text-sm font-medium text-sig">{entry.org}</p>

                <ul className="mt-4 flex flex-col gap-2">
                  {pick(entry.notes).map((note) => (
                    <li key={note} className="text-sm leading-relaxed text-ink-dim md:text-base">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          </Reveal>
        )
      })}
    </ol>
  )
}
