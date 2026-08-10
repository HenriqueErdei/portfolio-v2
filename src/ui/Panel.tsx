import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { cn } from "@/lib/cn"

interface PanelProps extends ComponentPropsWithoutRef<"div"> {
  /** Raised panels sit on top of the room; flat ones recede into it. */
  raised?: boolean
  /** Corner ticks — off by default for a cleaner editorial layout. */
  ticks?: boolean
  as?: ElementType
}

export function Panel({ raised, ticks = false, as = "div", className, ...rest }: PanelProps) {
  /* `ElementType` is the union of every tag there is, and JSX asks props to
     satisfy every member of a union at once — which even `className` fails. The
     substitutes are all block-level tags with the same attributes, so the render
     is typed as one of them and the real tag goes through at runtime. */
  const Tag = as as "div"

  return (
    <Tag
      className={cn("panel", raised && "panel-raised", ticks && "panel-ticks", className)}
      {...rest}
    />
  )
}

export function PanelHead({
  code,
  children,
  right,
}: {
  /** Short designation shown on the left, e.g. `M-01`. */
  code?: string
  children?: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="panel-head">
      <div className="flex min-w-0 items-center gap-3">
        {code ? <span className="readout text-ink-faint shrink-0">{code}</span> : null}
        <span className="readout truncate">{children}</span>
      </div>
      {right ? <div className="flex shrink-0 items-center gap-3">{right}</div> : null}
    </div>
  )
}
