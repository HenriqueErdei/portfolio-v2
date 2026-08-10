import { useMemo } from "react"
import { SUBSYSTEM_ORDER, subsystems } from "#content/subsystems"
import type { Subsystem, SubsystemGroup } from "#content/types"
import { useI18n } from "@/i18n/context"
import { subsystemLogoUrl } from "@/lib/subsystemLogo"
import { SegmentedGauge } from "@/ui/Gauge"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

/** Skills grouped by job function — no toy chrome, straight to the signal. */
export function Subsystems() {
  const { t } = useI18n()

  const grouped = useMemo(() => {
    const map = new Map<SubsystemGroup, Subsystem[]>()
    for (const item of subsystems) {
      const bucket = map.get(item.group)
      if (bucket) bucket.push(item)
      else map.set(item.group, [item])
    }
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

      <div className="flex flex-col gap-14">
        {SUBSYSTEM_ORDER.map((group) => {
          const items = grouped.get(group)
          if (!items || items.length === 0) return null

          return (
            <section key={group} aria-labelledby={`group-${group}`}>
              <h3 id={`group-${group}`} className="skill-group-title">
                {t.stack.group[group]}
              </h3>

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((item, index) => (
                  <Reveal key={item.name} as="li" delay={index * 35}>
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
    <div className="skill-card relative flex h-full flex-col gap-4 p-4">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: item.color }}
      />

      <div className="flex items-start justify-between gap-3">
        <img
          src={subsystemLogoUrl(item.slug, item.color)}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
          className="size-6 shrink-0"
        />
        <span className="font-mono text-[0.625rem] uppercase tracking-wide text-ink-faint">
          {t.stack.sinceLabel} {item.since}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{item.name}</span>
        <SegmentedGauge
          value={item.level}
          label={`${item.name} — ${t.stack.levelLabel} ${item.level}/5`}
          className="text-sig"
        />
      </div>
    </div>
  )
}
