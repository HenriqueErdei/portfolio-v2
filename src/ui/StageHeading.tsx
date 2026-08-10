import { Reveal } from "./Reveal"

/**
 * Section header — left-aligned editorial block. No instrument chrome: hiring
 * managers scan title + subtitle in two seconds.
 */
export function StageHeading({
  designation,
  title,
  subtitle,
  id,
}: {
  designation: string
  title: string
  subtitle?: string
  id: string
}) {
  return (
    <header className="section-header">
      <Reveal>
        <p className="section-eyebrow">{designation}</p>
      </Reveal>
      <Reveal delay={60}>
        <h2 id={id} className="section-title">
          {title}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={120}>
          <p className="section-subtitle">{subtitle}</p>
        </Reveal>
      ) : null}
    </header>
  )
}
