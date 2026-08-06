import { useMemo } from "react"
import { SUBSYSTEM_ORDER, subsystems } from "#content/subsystems"
import type { Subsystem, SubsystemGroup } from "#content/types"
import { useI18n } from "@/i18n/context"
import { CargoBay } from "@/ui/CargoBay"
import { SegmentedGauge } from "@/ui/Gauge"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

/**
 * Logo source. Simple Icons' CDN takes the brand colour in the path, so the
 * logo already arrives on-theme and there is no sprite sheet to maintain.
 */
const logoUrl = (slug: string, color: string) =>
  `https://cdn.simpleicons.org/${slug}/${color.replace("#", "")}`

/** The stack, grouped by the part of the job each tool does. */
export function Subsystems() {
  const { t } = useI18n()

  const grouped = useMemo(() => {
    const map = new Map<SubsystemGroup, Subsystem[]>()
    for (const item of subsystems) {
      const bucket = map.get(item.group)
      if (bucket) bucket.push(item)
      else map.set(item.group, [item])
    }
    // Highest level first inside each group, so the strongest tools lead.
    for (const bucket of map.values()) bucket.sort((a, b) => b.level - a.level)
    return map
  }, [])

  return (
    <Stage id="stack" labelledBy="stack-title">
      <StageHeading
        id="stack-title"
        designation={t.stack.designation}
        title={t.stack.title}
        subtitle={t.stack.subtitle}
      />

      <CargoBay />

      <div className="flex flex-col gap-12">
        {SUBSYSTEM_ORDER.map((group) => {
          const items = grouped.get(group)
          if (!items || items.length === 0) return null

          return (
            <section key={group} aria-labelledby={`group-${group}`}>
              <div className="mb-5 flex items-center gap-4">
                <h3 id={`group-${group}`} className="readout text-sig">
                  {t.stack.group[group]}
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-line-soft" />
                <span className="readout text-ink-faint">{String(items.length).padStart(2, "0")}</span>
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((item, index) => (
                  <Reveal key={item.slug} as="li" delay={index * 40}>
                    <SubsystemCard item={item} />
                  </Reveal>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </Stage>
  )
}

function SubsystemCard({ item }: { item: Subsystem }) {
  const { t } = useI18n()

  return (
    <div className="panel panel-ticks relative flex h-full flex-col gap-4 p-4">
      {/* Brand colour as a hairline rather than a full border: it identifies the
          tool without pulling every card out of the console palette. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: item.color }}
      />

      <div className="flex items-start justify-between gap-3">
        <img
          src={logoUrl(item.slug, item.color)}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
          className="size-6 shrink-0"
        />
        <span className="readout text-ink-faint">
          {t.stack.sinceLabel} {item.since}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <span className="text-sm text-ink">{item.name}</span>
        <SegmentedGauge
          value={item.level}
          label={`${item.name} — ${t.stack.levelLabel} ${item.level}/5`}
          className="text-sig"
        />
      </div>
    </div>
  )
}
