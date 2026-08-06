import { Reveal } from "./Reveal"

/**
 * The header every stage shares: designation, title, and one line saying what
 * the visitor is looking at. The designation is `aria-hidden` because "S-03" read
 * aloud before the real title is noise, not information.
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
  /** Ties the section's `aria-labelledby` to the visible title. */
  id: string
}) {
  return (
    <header className="mb-10 md:mb-14">
      <Reveal className="flex items-baseline gap-4">
        <span aria-hidden="true" className="readout text-sig">
          {designation}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </Reveal>

      <Reveal delay={80}>
        <h2
          id={id}
          className="mt-4 text-4xl leading-[1.05] tracking-tight text-ink md:text-6xl"
        >
          {title}
        </h2>
      </Reveal>

      {subtitle ? (
        <Reveal delay={140}>
          <p className="mt-4 max-w-2xl text-base text-ink-dim md:text-lg">{subtitle}</p>
        </Reveal>
      ) : null}
    </header>
  )
}
