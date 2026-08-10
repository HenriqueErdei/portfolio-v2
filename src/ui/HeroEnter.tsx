import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * Staggered hero entrance — driven by the intro hand-off, not scroll spy.
 * IntersectionObserver would fire while the section is still hidden (opacity 0),
 * which is why Reveal cannot be used for the cover.
 */
export function HeroEnter({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: "div" | "span" | "p" | "h1"
}) {
  return (
    <Tag
      className={cn("hero-enter", className)}
      style={{ "--hero-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
