import { ArrowUpRight } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/cn"
import { useI18n } from "@/i18n/context"

/**
 * Outbound link with the arrow affordance and, crucially, a spoken warning that
 * it leaves the site — the icon alone only communicates that to sighted users.
 */
export function ExternalLink({
  href,
  children,
  className,
  showIcon = true,
}: {
  href: string
  children: ReactNode
  className?: string
  showIcon?: boolean
}) {
  const { t } = useI18n()

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn("link-console", className)}
    >
      {children}
      {showIcon ? <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} /> : null}
      <span className="sr-only"> ({t.a11y.externalLink})</span>
    </a>
  )
}
