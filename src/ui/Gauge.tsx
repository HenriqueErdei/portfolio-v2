import { cn } from "@/lib/cn"

/**
 * Discrete level meter, 1–5. Rendered as a real `meter`-style widget for
 * assistive tech: the visual segments are decorative, and the accessible value
 * comes from the ARIA attributes rather than from counting lit boxes.
 */
export function SegmentedGauge({
  value,
  max = 5,
  label,
  className,
}: {
  value: number
  max?: number
  label: string
  className?: string
}) {
  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("gauge-segments", className)}
      style={{ gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: max }, (_, index) => (
        <span key={index} className="gauge-segment" data-on={index < value} aria-hidden="true" />
      ))}
    </div>
  )
}

/** Continuous bar, 0–1. Used for the scroll progress rail. */
export function LinearGauge({
  value,
  label,
  className,
}: {
  value: number
  label: string
  className?: string
}) {
  const percent = Math.round(value * 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("gauge-track text-sig", className)}
    >
      <span className="gauge-fill" style={{ width: `${percent}%` }} />
    </div>
  )
}
