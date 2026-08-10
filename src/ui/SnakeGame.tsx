import { useCallback, useEffect, useRef, useState } from "react"
import { SNAKE_SCARE_MS, SNAKE_SCARE_URL } from "#content/snake"
import { useI18n } from "@/i18n/context"
import { blip } from "@/lib/audio"
import { SnakeScareFlash } from "./SnakeScareFlash"

const GRID = 18
const TICK_MS = 110
const COUNTDOWN_MS = 800
const STORAGE_KEY = "portfolio:snake-best"
const MIN_BOARD = 240
const MAX_BOARD = 640

type Phase = "countdown" | "playing"
type CountdownStep = 3 | 2 | 1 | "go"
type LossPhase = "none" | "scare" | "defeat"

type Point = { readonly x: number; readonly y: number }

const START: readonly Point[] = [
  { x: 9, y: 9 },
  { x: 8, y: 9 },
  { x: 7, y: 9 },
]

const DELTAS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
}

function same(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y
}

function spawnFood(snake: readonly Point[]): Point {
  const taken = new Set(snake.map((part) => `${part.x},${part.y}`))
  let spot: Point = { x: 0, y: 0 }
  let attempts = 0
  do {
    spot = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
    attempts += 1
  } while (taken.has(`${spot.x},${spot.y}`) && attempts < 512)
  return spot
}

function readBest(): number {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? Number.parseInt(raw, 10) || 0 : 0
  } catch {
    return 0
  }
}

function saveBest(score: number) {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(score))
  } catch {
    // Best score is a nice extra, not required.
  }
}

function palette(canvas: HTMLCanvasElement) {
  const root = canvas.closest(".snake-board") ?? document.documentElement
  const styles = getComputedStyle(root)
  return {
    void: styles.getPropertyValue("--c-void-deep").trim() || "#07080c",
    line: styles.getPropertyValue("--c-line-soft").trim() || "#1a1f28",
    snake: styles.getPropertyValue("--c-sig").trim() || "#4d9fff",
    head: styles.getPropertyValue("--c-ink").trim() || "#eef0f4",
    food: styles.getPropertyValue("--c-warn").trim() || "#e5a845",
  }
}

function applyDirection(next: Point, dirRef: { current: Point }, pendingRef: { current: Point }) {
  const current = dirRef.current
  if (current.x + next.x === 0 && current.y + next.y === 0) return
  pendingRef.current = next
}

export function SnakeGame() {
  const { t } = useI18n()
  const boardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sizeRef = useRef(360)
  const snakeRef = useRef<Point[]>([...START])
  const dirRef = useRef<Point>({ x: 1, y: 0 })
  const pendingDirRef = useRef<Point>({ x: 1, y: 0 })
  const foodRef = useRef<Point>(spawnFood(START))
  const scoreRef = useRef(0)
  const overRef = useRef(false)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)

  const [score, setScore] = useState(0)
  const [best, setBest] = useState(readBest)
  const [lossPhase, setLossPhase] = useState<LossPhase>("none")
  const scareReadyRef = useRef(false)
  const [phase, setPhase] = useState<Phase>("countdown")
  const [countdown, setCountdown] = useState<CountdownStep>(3)
  const [countdownRun, setCountdownRun] = useState(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = sizeRef.current
    const colors = palette(canvas)
    const cell = size / GRID

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    ctx.fillStyle = colors.void
    ctx.fillRect(0, 0, size, size)

    ctx.strokeStyle = colors.line
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.35
    for (let index = 1; index < GRID; index += 1) {
      const offset = index * cell
      ctx.beginPath()
      ctx.moveTo(offset, 0)
      ctx.lineTo(offset, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, offset)
      ctx.lineTo(size, offset)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    const food = foodRef.current
    ctx.fillStyle = colors.food
    ctx.fillRect(food.x * cell + 2, food.y * cell + 2, cell - 4, cell - 4)

    snakeRef.current.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? colors.head : colors.snake
      ctx.globalAlpha = index === 0 ? 1 : 0.55 + (1 - index / snakeRef.current.length) * 0.35
      ctx.fillRect(part.x * cell + 1.5, part.y * cell + 1.5, cell - 3, cell - 3)
    })
    ctx.globalAlpha = 1
  }, [])

  const resizeBoard = useCallback(() => {
    const board = boardRef.current
    const canvas = canvasRef.current
    if (!board || !canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = board.clientWidth
    const size = Math.max(MIN_BOARD, Math.min(MAX_BOARD, Math.floor(width)))
    sizeRef.current = size
    canvas.width = Math.floor(size * dpr)
    canvas.height = Math.floor(size * dpr)
    draw()
  }, [draw])

  const reset = useCallback(() => {
    snakeRef.current = [...START]
    dirRef.current = { x: 1, y: 0 }
    pendingDirRef.current = { x: 1, y: 0 }
    foodRef.current = spawnFood(START)
    scoreRef.current = 0
    overRef.current = false
    setScore(0)
    setLossPhase("none")
    setCountdown(3)
    setCountdownRun((run) => run + 1)
    setPhase("countdown")
    resizeBoard()
  }, [resizeBoard])

  const triggerLoss = useCallback(() => {
    overRef.current = true
    blip(false)
    setLossPhase(scareReadyRef.current ? "scare" : "defeat")
  }, [])

  useEffect(() => {
    scareReadyRef.current = false
    const img = new Image()
    img.onload = () => {
      scareReadyRef.current = true
    }
    img.onerror = () => {
      scareReadyRef.current = false
    }
    img.src = SNAKE_SCARE_URL
  }, [])

  useEffect(() => {
    if (lossPhase !== "scare") return
    const id = window.setTimeout(() => setLossPhase("defeat"), SNAKE_SCARE_MS)
    return () => window.clearTimeout(id)
  }, [lossPhase])

  useEffect(() => {
    const board = boardRef.current
    if (!board) return

    resizeBoard()
    const observer = new ResizeObserver(resizeBoard)
    observer.observe(board)
    return () => observer.disconnect()
  }, [resizeBoard])

  useEffect(() => {
    if (phase !== "countdown") return

    const sequence: readonly CountdownStep[] = [3, 2, 1, "go"]
    let step = 0
    const id = window.setInterval(() => {
      step += 1
      if (step >= sequence.length) {
        window.clearInterval(id)
        setPhase("playing")
        blip(true)
        return
      }
      setCountdown(sequence[step]!)
      blip(true)
    }, COUNTDOWN_MS)

    return () => window.clearInterval(id)
  }, [phase, countdownRun])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const next = DELTAS[event.key]
      if (!next) return

      event.preventDefault()
      if (overRef.current) return
      applyDirection(next, dirRef, pendingDirRef)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (phase !== "playing" || overRef.current) return

    const tick = window.setInterval(() => {
      if (overRef.current) return

      dirRef.current = pendingDirRef.current
      const head = snakeRef.current[0]!
      const next = {
        x: head.x + dirRef.current.x,
        y: head.y + dirRef.current.y,
      }

      if (next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID) {
        triggerLoss()
        return
      }

      if (snakeRef.current.some((part) => same(part, next))) {
        triggerLoss()
        return
      }

      const ate = same(next, foodRef.current)
      snakeRef.current = [next, ...snakeRef.current]
      if (!ate) snakeRef.current.pop()
      else {
        foodRef.current = spawnFood(snakeRef.current)
        scoreRef.current += 1
        setScore(scoreRef.current)
        blip(true)
        setBest((prev) => {
          if (scoreRef.current <= prev) return prev
          saveBest(scoreRef.current)
          return scoreRef.current
        })
      }

      draw()
    }, TICK_MS)

    return () => window.clearInterval(tick)
  }, [phase, draw, triggerLoss])

  const onSwipeStart = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return
    swipeRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onSwipeEnd = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start || overRef.current) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    const threshold = 28
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return

    if (Math.abs(dx) > Math.abs(dy)) {
      applyDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }, dirRef, pendingDirRef)
    } else {
      applyDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 }, dirRef, pendingDirRef)
    }
  }

  return (
    <>
      <SnakeScareFlash show={lossPhase === "scare"} />

      <div className="snake-game">
        <div className="snake-hud">
        <span className="spec-label">
          {t.snake.score} <span className="font-mono text-ink">{score}</span>
        </span>
        <span className="spec-label">
          {t.snake.best} <span className="font-mono text-sig">{best}</span>
        </span>
        </div>

        <div ref={boardRef} className="snake-board panel">
        <canvas
          ref={canvasRef}
          className="snake-canvas"
          aria-hidden="true"
          onPointerDown={onSwipeStart}
          onPointerUp={onSwipeEnd}
          onPointerCancel={() => {
            swipeRef.current = null
          }}
        />
        {phase === "countdown" ? (
          <div className="snake-overlay snake-countdown" aria-live="polite">
            <p className="snake-countdown-value">{countdown === "go" ? t.snake.go : countdown}</p>
          </div>
        ) : null}
        {lossPhase === "defeat" ? (
          <div className="snake-overlay snake-overlay-end">
            <div className="snake-overlay-content">
              <p className="snake-game-over">{t.snake.gameOver}</p>
              <button type="button" className="btn-primary" onClick={reset}>
                {t.snake.restart}
              </button>
            </div>
          </div>
        ) : null}
        </div>

        <p className="snake-hint spec-label">{t.snake.hint}</p>
      </div>
    </>
  )
}
