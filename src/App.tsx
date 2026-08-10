import { Suspense, lazy, useEffect, useState } from "react"
import { useI18n } from "@/i18n/context"
import { shouldRenderScene } from "@/lib/capability"
import { useRoomIntro } from "@/lib/useRoomIntro"
import { scrollToStage } from "@/lib/scrollTo"
import { Comms } from "@/stages/Comms"
import { Missions } from "@/stages/Missions"
import { Payload } from "@/stages/Payload"
import { Preflight } from "@/stages/Preflight"
import { Subsystems } from "@/stages/Subsystems"
import { Trajectory } from "@/stages/Trajectory"
import { SceneBoundary } from "@/three/SceneBoundary"
import { BootSequence } from "@/ui/BootSequence"
import { CommandPalette } from "@/ui/CommandPalette"
import { Reticle } from "@/ui/Reticle"
import { SnakeSecret } from "@/ui/SnakeSecret"
import { SoundDeck } from "@/ui/SoundDeck"
import { TelemetryBar } from "@/ui/TelemetryBar"

// Split out so three.js is never in the critical path: the page is fully
// readable before the scene's chunk has even been requested.
const Scene = lazy(() => import("@/three/Scene"))

export function App() {
  const { t } = useI18n()
  const room = useRoomIntro()
  const [sceneEnabled, setSceneEnabled] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)

  // Decided after mount, and after paint: asking about WebGL creates a context,
  // which is exactly the kind of work that should not happen before first paint.
  useEffect(() => {
    const id = requestIdleCallbackShim(() => setSceneEnabled(shouldRenderScene()))
    return () => cancelIdleCallbackShim(id)
  }, [])

  return (
    <div ref={room} className="room" data-scene={sceneEnabled && !sceneFailed ? "on" : "off"}>
      <a
        href="#about"
        className="skip-link readout"
        onClick={(event) => {
          event.preventDefault()
          scrollToStage("about")
        }}
      >
        {t.a11y.skipToContent}
      </a>

      {sceneEnabled && !sceneFailed ? (
        <SceneBoundary onFail={() => setSceneFailed(true)}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      ) : null}

      <div aria-hidden="true" className="room-grid" />
      <div aria-hidden="true" className="room-vignette" />

      <TelemetryBar />
      <CommandPalette />
      <SnakeSecret />
      <Reticle />
      <SoundDeck />
      <BootSequence />

      <main aria-label={t.a11y.mainLabel}>
        <Preflight />
        <Payload />
        <Trajectory />
        <Missions />
        <Subsystems />
        <Comms />
      </main>

      {/* Announced only if the scene was expected and could not start. Sighted
          users simply see no animation, which needs no explanation. */}
      <p role="status" aria-live="polite" className="sr-only">
        {sceneFailed ? t.error.sceneFailed : ""}
      </p>
    </div>
  )
}

/* `requestIdleCallback` is still unimplemented in Safari, and the fallback only
   needs to be "later than paint" rather than genuinely idle. */

type IdleHandle = { kind: "idle"; id: number } | { kind: "timeout"; id: number }

function requestIdleCallbackShim(callback: () => void): IdleHandle {
  // Checked on the property rather than with `in`: the DOM types declare the
  // method as always present, so `in` narrows the browser without it to `never`.
  if (typeof window.requestIdleCallback === "function") {
    return { kind: "idle", id: window.requestIdleCallback(callback, { timeout: 1200 }) }
  }
  return { kind: "timeout", id: window.setTimeout(callback, 200) }
}

function cancelIdleCallbackShim(handle: IdleHandle) {
  if (handle.kind === "idle") window.cancelIdleCallback(handle.id)
  else window.clearTimeout(handle.id)
}
