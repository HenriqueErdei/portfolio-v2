/**
 * Lets anything on the page open a specific mission panel — the command palette
 * does, and a deep link would too. A single slot rather than a subscriber list:
 * there is exactly one missions section, and pretending otherwise would only
 * hide a bug where two of them fought over the same panel.
 */
type Listener = (id: string) => void

let listener: Listener | null = null

export function registerMissionOpener(next: Listener | null) {
  listener = next
}

export function openMission(id: string) {
  listener?.(id)
}
