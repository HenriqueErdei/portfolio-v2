/**
 * The content contract. Everything under `content/` is plain typed data — no
 * CMS, no build step, no API key. Edit the data files and the site updates.
 *
 * Anything a visitor reads is `Localized`, so the compiler refuses a half-done
 * translation instead of shipping a blank paragraph.
 */

export const LOCALES = ["pt", "en", "es"] as const

export type Locale = (typeof LOCALES)[number]

export type Localized<T> = Readonly<Record<Locale, T>>

/** Flight status of a project, borrowed from mission telemetry. */
export type MissionStatus =
  /** Live, maintained, in production. */
  | "orbital"
  /** Being built right now. */
  | "ascent"
  /** Finished and parked — still works, no longer touched. */
  | "archived"

export interface MissionLink {
  readonly repo?: string
  readonly demo?: string
  readonly caseStudy?: string
}

/** A single readout shown on the mission panel, e.g. `LATÊNCIA · 40ms`. */
export interface MissionMetric {
  readonly label: Localized<string>
  readonly value: string
}

export interface Mission {
  readonly id: string
  /** Panel designation, e.g. `M-03`. Keep these stable; they are deep-linkable. */
  readonly code: string
  readonly name: string
  readonly year: number
  readonly status: MissionStatus
  readonly summary: Localized<string>
  /** Long-form, shown when the mission panel is expanded. */
  readonly briefing: Localized<readonly string[]>
  readonly stack: readonly string[]
  readonly links: MissionLink
  readonly metrics?: readonly MissionMetric[]
  /** Imported image module, so Vite fingerprints and optimises it. */
  readonly image?: string
  readonly imageAlt: Localized<string>
}

export type SubsystemGroup =
  | "propulsion"
  | "guidance"
  | "structure"
  | "comms"
  | "ground"

export interface Subsystem {
  readonly name: string
  /** Simple Icons slug, used to resolve the logo. */
  readonly slug: string
  /** Brand colour, drives the panel accent. */
  readonly color: string
  /** 1–5. Honest self-assessment, rendered as a segmented gauge. */
  readonly level: 1 | 2 | 3 | 4 | 5
  readonly since: number
  readonly group: SubsystemGroup
}

export type TrajectoryKind = "work" | "education" | "credential"

export interface TrajectoryEntry {
  readonly id: string
  readonly kind: TrajectoryKind
  /** `2026 —` for ongoing, `2024 – 2025` for closed. Rendered verbatim. */
  readonly period: string
  readonly org: string
  readonly title: Localized<string>
  readonly notes: Localized<readonly string[]>
  readonly url?: string
}

export interface SocialLink {
  readonly label: string
  readonly url: string
  /** Optional handle shown beside the label in the contact list. */
  readonly handle?: string
  /** lucide-react icon name, resolved in the contact section. */
  readonly icon: "github" | "linkedin" | "mail" | "instagram" | "globe"
}

export interface Profile {
  readonly name: string
  readonly handle: string
  readonly role: Localized<string>
  readonly location: string
  /** IANA zone — local time in the contact section. */
  readonly timezone: string
  readonly email: string
  /** Digits only, e.g. 11925815808 — rendered as tel:+55… in contact. */
  readonly phone?: string
  /** Hero copy, one line per element so it can be animated per-line. */
  readonly headline: Localized<readonly string[]>
  readonly bio: Localized<readonly string[]>
  readonly available: boolean
  readonly socials: readonly SocialLink[]
  readonly resumeUrl?: string
  /** Short list of core technologies shown on the hero. */
  readonly focusStack: readonly string[]
}
