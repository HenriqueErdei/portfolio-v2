import { createPortal } from "react-dom"
import { SNAKE_SCARE_URL } from "#content/snake"

/** Full-viewport jumpscare — portaled above the game modal. */
export function SnakeScareFlash({ show }: { show: boolean }) {
  if (!show) return null

  return createPortal(
    <div className="snake-scare" aria-hidden="true">
      <img src={SNAKE_SCARE_URL} alt="" decoding="sync" fetchPriority="high" />
    </div>,
    document.body,
  )
}
