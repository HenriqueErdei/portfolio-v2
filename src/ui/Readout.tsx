import { cn } from "@/lib/cn"

/**
 * A label/value pair in instrument type. Values are tabular-numbered so a
 * changing digit never shifts the ones next to it.
 */
export function Readout({
  label,
  value,
  tone = "ink",
  className,
}: {
  label: string
  value: string
  tone?: "ink" | "sig" | "warn" | "crit" | "plasma"
  className?: string
}) {
  const toneClass = {
    ink: "text-ink",
    sig: "text-sig",
    warn: "text-warn",
    crit: "text-crit",
    plasma: "text-plasma",
  }[tone]

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="readout">{label}</span>
      <span className={cn("readout-value text-sm", toneClass)}>{value}</span>
    </div>
  )
}
