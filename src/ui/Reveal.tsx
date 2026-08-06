import type { ElementType, ReactNode } from "react"
import { cn } from "@/lib/cn"
import { useReveal } from "@/lib/useReveal"

/**
 * Fades and lifts its children in once, when they first reach the viewport.
 * `delay` staggers siblings; keep it small, since a long stagger makes a fast
 * scroller read the page as unfinished.
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
}) {
  const ref = useReveal<HTMLDivElement>()

  /* See `Panel`: a union of every tag cannot be given props, so the render is
     typed as one representative tag. */
  const Tag = as as "div"

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
