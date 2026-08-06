import type { ReactNode } from "react"
import { cn } from "@/lib/cn"
import type { StageId } from "@/app/stages"

/**
 * A stage of the sequence. `tabIndex={-1}` makes it a legal focus target so nav
 * clicks can move focus here, and `aria-labelledby` points at the visible
 * heading instead of duplicating it in an `aria-label`.
 */
export function Stage({
  id,
  labelledBy,
  children,
  className,
}: {
  id: StageId
  labelledBy: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={labelledBy}
      className={cn("stage focus-visible:outline-none", className)}
    >
      <div className="shell">{children}</div>
    </section>
  )
}
