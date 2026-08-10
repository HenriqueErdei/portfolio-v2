import { ChevronDown } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { missions } from "#content/missions"
import type { Mission, MissionStatus } from "#content/types"
import { useI18n } from "@/i18n/context"
import { cn } from "@/lib/cn"
import { registerMissionOpener } from "@/lib/openMission"
import { scrollToElement } from "@/lib/scrollTo"
import { ExternalLink } from "@/ui/ExternalLink"
import { Lamp, type LampTone } from "@/ui/Lamp"
import { Panel, PanelHead } from "@/ui/Panel"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

const STATUS_TONE: Record<MissionStatus, LampTone> = {
  orbital: "sig",
  ascent: "warn",
  archived: "dim",
}

const panelId = (id: string) => `mission-${id}`

/**
 * S-03. Projects as mission panels, each with a report you can open.
 *
 * One report at a time: with several expanded the list stops being scannable, and
 * an accordion also gives the command palette somewhere unambiguous to land.
 */
export function Missions() {
  const { t } = useI18n()
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    registerMissionOpener((id) => {
      setOpenId(id)
      // The report has to be expanded before there is a final position to scroll
      // to, so the move waits for the frame that paints it.
      requestAnimationFrame(() => scrollToElement(document.getElementById(panelId(id))))
    })

    return () => registerMissionOpener(null)
  }, [])

  return (
    <Stage id="work" labelledBy="work-title">
      <StageHeading
        id="work-title"
        designation={t.work.designation}
        title={t.work.title}
        subtitle={t.work.subtitle}
      />

      {missions.length === 0 ? (
        <Panel>
          <p className="p-6 text-base leading-relaxed text-ink-dim md:p-8">{t.work.empty}</p>
        </Panel>
      ) : (
        <ul className="flex flex-col gap-4">
          {missions.map((mission, index) => (
            <Reveal key={mission.id} as="li" delay={index * 60}>
              <MissionPanel
                mission={mission}
                open={openId === mission.id}
                onToggle={() => setOpenId((current) => (current === mission.id ? null : mission.id))}
              />
            </Reveal>
          ))}
        </ul>
      )}
    </Stage>
  )
}

/**
 * A disclosure, built from a button plus a labelled region rather than
 * `<details>`: the report needs to animate open, and `details` cannot be
 * transitioned reliably across browsers yet.
 */
function MissionPanel({
  mission,
  open,
  onToggle,
}: {
  mission: Mission
  open: boolean
  onToggle: () => void
}) {
  const { t, pick } = useI18n()
  const reportId = useId()

  return (
    /* Focusable only programmatically: the palette scrolls here and lands focus
       on the panel, so the next Tab continues from the project. */
    <Panel id={panelId(mission.id)} tabIndex={-1} className="scroll-mt-20 outline-sig">
      <PanelHead
        code={mission.code}
        right={
          <span className="flex items-center gap-2">
            <Lamp tone={STATUS_TONE[mission.status]} pulse={mission.status === "ascent"} />
            <span className="readout">{t.work.status[mission.status]}</span>
          </span>
        }
      >
        {mission.year}
      </PanelHead>

      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl text-ink md:text-3xl">{mission.name}</h3>
            <p className="mt-2 max-w-2xl text-ink-dim">{pick(mission.summary)}</p>
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={reportId}
            className="readout flex shrink-0 items-center gap-2 border border-line px-3 py-2 text-ink-dim transition-colors hover:border-sig hover:text-sig"
          >
            {open ? t.work.collapse : t.work.expand}
            <ChevronDown
              aria-hidden="true"
              className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")}
              strokeWidth={2}
            />
          </button>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.work.stackLabel}>
          {mission.stack.map((tool) => (
            <li key={tool} className="readout border border-line-soft px-2 py-1 text-ink-dim">
              {tool}
            </li>
          ))}
        </ul>

        {/* `hidden` rather than unmounting: the report stays in the DOM so the
            browser's find-in-page and the expanded state survive re-renders. */}
        <div id={reportId} hidden={!open} className="mt-6 border-t border-line-soft pt-5">
          <h4 className="readout text-sig">{t.work.detailLabel}</h4>

          {mission.image ? (
            <img
              src={mission.image}
              alt={pick(mission.imageAlt)}
              className="mt-3 w-full border border-line-soft object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : null}

          <div className="mt-3 flex flex-col gap-3">
            {pick(mission.briefing).map((paragraph) => (
              <p key={paragraph} className="text-ink-dim">
                {paragraph}
              </p>
            ))}
          </div>

          {mission.metrics && mission.metrics.length > 0 ? (
            <dl className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {mission.metrics.map((metric) => (
                <div key={metric.value + pick(metric.label)} className="flex flex-col gap-1">
                  <dt className="readout">{pick(metric.label)}</dt>
                  <dd className="readout-value text-lg text-ink">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          {mission.links.demo ? (
            <ExternalLink href={mission.links.demo} className="text-sm">
              {t.work.demo}
            </ExternalLink>
          ) : null}
          {mission.links.repo ? (
            <ExternalLink href={mission.links.repo} className="text-sm">
              {t.work.repo}
            </ExternalLink>
          ) : null}
          {mission.links.caseStudy ? (
            <ExternalLink href={mission.links.caseStudy} className="text-sm">
              {t.work.caseStudy}
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </Panel>
  )
}
