import { cn } from "@/lib/cn"

export type LampTone = "sig" | "plasma" | "warn" | "crit" | "dim"

/**
 * Status lamp. Purely decorative — the state it reflects is always spelled out
 * in adjacent text, because colour alone is not an accessible signal.
 */
export function Lamp({
  tone = "sig",
  pulse,
  className,
}: {
  tone?: LampTone
  pulse?: boolean
  className?: string
}) {
  const toneClass = {
    sig: "text-sig",
    plasma: "text-plasma",
    warn: "text-warn",
    crit: "text-crit",
    dim: "text-ink-faint",
  }[tone]

  return (
    <span
      aria-hidden="true"
      className={cn("lamp", pulse && "lamp-pulse", toneClass, className)}
    />
  )
}
