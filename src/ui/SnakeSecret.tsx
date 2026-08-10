import { X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useI18n } from "@/i18n/context"
import { blip } from "@/lib/audio"
import { useSecretWord } from "@/lib/useSecretWord"
import { setScrollLocked } from "@/lib/scrollTo"
import { SnakeGame } from "./SnakeGame"

const CODE = "snake"

/**
 * Hidden snake game — type `snake` anywhere on the page (outside inputs).
 */
export function SnakeSecret() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  const openGame = useCallback(() => {
    blip(true)
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  useSecretWord(CODE, openGame, !open)

  useEffect(() => {
    if (!open) return

    document.documentElement.classList.add("snake-open")
    setScrollLocked(true)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.documentElement.classList.remove("snake-open")
      setScrollLocked(false)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  if (!open) return null

  return createPortal(
    <div className="snake-root">
      <div aria-hidden="true" className="palette-scrim" onClick={close} />

      <div role="dialog" aria-modal="true" aria-label={t.snake.title} className="snake-panel panel">
        <header className="snake-head">
          <div>
            <p className="section-eyebrow">{t.snake.eyebrow}</p>
            <h2 className="snake-title">{t.snake.title}</h2>
          </div>
          <button type="button" onClick={close} className="snake-close btn-ghost" aria-label={t.snake.close}>
            <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
          </button>
        </header>

        <SnakeGame />
      </div>
    </div>,
    document.body,
  )
}
