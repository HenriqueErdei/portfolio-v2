import { useEffect } from "react"

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}

/**
 * Fires when the visitor types `word` anywhere on the page — except inside
 * form fields. Buffer resets after idle or on a mismatch tail.
 */
export function useSecretWord(word: string, onMatch: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const needle = word.toLowerCase()
    let buffer = ""
    let idle = 0

    const reset = () => {
      buffer = ""
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.length !== 1) return

      buffer = (buffer + event.key.toLowerCase()).slice(-needle.length)
      window.clearTimeout(idle)
      idle = window.setTimeout(reset, 2200)

      if (buffer === needle) {
        reset()
        window.clearTimeout(idle)
        onMatch()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.clearTimeout(idle)
    }
  }, [word, onMatch, enabled])
}
