import { useEffect, useRef, useState } from "react"
import { subsystems } from "#content/subsystems"
import { useI18n } from "@/i18n/context"
import { tick } from "@/lib/audio"
import { hasFinePointer, prefersReducedMotion } from "@/lib/capability"
import { cn } from "@/lib/cn"
import { scatter, step, type Bounds, type DriftBody } from "@/lib/drift"
import { PanelHead } from "./Panel"

const logoUrl = (slug: string, color: string) =>
  `https://cdn.simpleicons.org/${slug}/${color.replace("#", "")}`

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(0, max))

/**
 * The stack, adrift. Every tool is a module floating in a bay you can grab, throw
 * and knock into the others — the one place on the page that is a toy rather than
 * a document.
 *
 * It is deliberately `aria-hidden`: the same sixteen tools are listed underneath
 * with their levels, in a form that reads properly and works from a keyboard. This
 * is the decoration, and nothing here is the only copy of anything.
 *
 * Physics runs only where it makes sense — a mouse to grab with, and no request
 * for less motion. Otherwise the modules simply sit in a row.
 */
export function CargoBay() {
  const { t } = useI18n()

  // Decided once at mount: switching from a mouse to a finger mid-visit is not
  // worth tearing the simulation down for.
  const [live] = useState(() => hasFinePointer() && !prefersReducedMotion())

  const bay = useRef<HTMLDivElement>(null)
  const chips = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = bay.current
    if (!live || !container) return

    const elements = chips.current.filter((element): element is HTMLDivElement => element !== null)
    if (elements.length === 0) return

    let bounds: Bounds = { width: container.clientWidth, height: container.clientHeight }

    const bodies: DriftBody[] = elements.map((element) => ({
      x: 0,
      y: 0,
      w: element.offsetWidth,
      h: element.offsetHeight,
      vx: 0,
      vy: 0,
      mass: element.offsetWidth * element.offsetHeight,
      held: false,
    }))

    scatter(bodies, bounds)

    const place = () => {
      bodies.forEach((body, index) => {
        elements[index]?.style.setProperty("translate", `${body.x}px ${body.y}px`)
      })
    }

    place()
    container.dataset.ready = "true"

    /** One pointer at a time: a second grab just takes over from the first. */
    let drag: { index: number; offsetX: number; offsetY: number; x: number; y: number; at: number } | null = null

    const teardown: (() => void)[] = []

    elements.forEach((element, index) => {
      const body = bodies[index]
      if (!body) return

      const onDown = (event: PointerEvent) => {
        const frame = container.getBoundingClientRect()
        element.setPointerCapture(event.pointerId)
        body.held = true
        element.dataset.held = "true"
        drag = {
          index,
          offsetX: event.clientX - frame.left - body.x,
          offsetY: event.clientY - frame.top - body.y,
          x: event.clientX,
          y: event.clientY,
          at: performance.now(),
        }
        tick(0.5)
      }

      const onMove = (event: PointerEvent) => {
        if (drag?.index !== index) return

        const frame = container.getBoundingClientRect()
        body.x = clamp(event.clientX - frame.left - drag.offsetX, bounds.width - body.w)
        body.y = clamp(event.clientY - frame.top - drag.offsetY, bounds.height - body.h)

        // Velocity comes from how fast the pointer is actually travelling, which
        // is what lets the module be thrown rather than just placed.
        const now = performance.now()
        const elapsed = Math.max(8, now - drag.at) / 1000
        body.vx = (event.clientX - drag.x) / elapsed
        body.vy = (event.clientY - drag.y) / elapsed

        drag.x = event.clientX
        drag.y = event.clientY
        drag.at = now
      }

      const onRelease = () => {
        if (drag?.index !== index) return
        body.held = false
        element.dataset.held = "false"
        drag = null
      }

      element.addEventListener("pointerdown", onDown)
      element.addEventListener("pointermove", onMove)
      element.addEventListener("pointerup", onRelease)
      element.addEventListener("pointercancel", onRelease)

      teardown.push(() => {
        element.removeEventListener("pointerdown", onDown)
        element.removeEventListener("pointermove", onMove)
        element.removeEventListener("pointerup", onRelease)
        element.removeEventListener("pointercancel", onRelease)
      })
    })

    const resize = new ResizeObserver(() => {
      bounds = { width: container.clientWidth, height: container.clientHeight }
    })
    resize.observe(container)

    // No reason to simulate a bay nobody is looking at.
    let running = false
    let frame = 0
    let last = 0

    const loop = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000)
      last = now
      step(bodies, bounds, delta)
      place()
      frame = requestAnimationFrame(loop)
    }

    const watch = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false
        if (visible === running) return

        running = visible
        if (visible) {
          last = performance.now()
          frame = requestAnimationFrame(loop)
        } else {
          cancelAnimationFrame(frame)
        }
      },
      { rootMargin: "120px" },
    )
    watch.observe(container)

    return () => {
      cancelAnimationFrame(frame)
      watch.disconnect()
      resize.disconnect()
      for (const off of teardown) off()
    }
  }, [live])

  return (
    <div className="panel panel-ticks mb-12 overflow-hidden">
      <PanelHead code={t.stack.bayLabel} right={live ? <span className="readout">{t.stack.bayHint}</span> : null}>
        {String(subsystems.length).padStart(2, "0")}
      </PanelHead>

      <div
        ref={bay}
        aria-hidden="true"
        data-ready="false"
        className={cn("cargo-bay", live && "cargo-bay-live")}
      >
        {subsystems.map((item, index) => (
          <div
            key={item.slug}
            ref={(element) => {
              chips.current[index] = element
            }}
            data-grab={live ? "true" : undefined}
            data-held="false"
            className="cargo-chip"
            style={{ "--chip": item.color } as React.CSSProperties}
          >
            <img
              src={logoUrl(item.slug, item.color)}
              alt=""
              width={16}
              height={16}
              loading="lazy"
              decoding="async"
              className="size-4 shrink-0"
              draggable={false}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}
