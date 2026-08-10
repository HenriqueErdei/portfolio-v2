import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef, type RefObject } from "react"
import * as THREE from "three"
import { getIntroPhase, getIntroProgress, introFlash, sceneProgress, subscribeToIntro } from "@/lib/intro"
import { subscribeToScroll } from "@/lib/scroll"
import { Blast } from "./Blast"
import { Bokeh } from "./Bokeh"
import { Dust } from "./Dust"
import { NeonGrid } from "./NeonGrid"
import { usePointerRef } from "./pointer"

/**
 * Synced entry blast, then a calm ambient field: grid, bokeh and distant motes.
 */

function useAmbientProgress(): RefObject<number> {
  const scroll = useRef(0)
  const target = useRef(sceneProgress(0))
  const smoothed = useRef(sceneProgress(0))

  useEffect(() => {
    const sync = () => {
      target.current = sceneProgress(scroll.current)
      if (getIntroPhase() === "playing") smoothed.current = target.current
    }

    const offScroll = subscribeToScroll((value) => {
      scroll.current = value
      sync()
    })
    const offIntro = subscribeToIntro(sync)
    return () => {
      offScroll()
      offIntro()
    }
  }, [])

  useFrame((_, delta) => {
    if (getIntroPhase() === "playing") {
      smoothed.current = target.current
      return
    }
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target.current, 3.2, delta)
  })

  return smoothed
}

const FRAMING = 12
const ORBIT_YAW = 0.08
const ORBIT_PITCH = 0.05

function Rig({ progress }: { progress: RefObject<number> }) {
  const pointer = usePointerRef(2.4)
  const base = useRef(new THREE.Vector3(0, 0.35, FRAMING))
  const clock = useRef(getIntroProgress())

  useEffect(() => subscribeToIntro(() => {
    clock.current = getIntroProgress()
  }), [])

  useFrame(({ camera }, delta) => {
    const lift = progress.current ?? 0
    const kick = introFlash(clock.current) * 0.42
    const yaw = pointer.current.x * ORBIT_YAW * lift
    const pitch = pointer.current.y * ORBIT_PITCH * lift

    const targetX = Math.sin(yaw) * 1.0
    const targetY = 0.35 + pitch * 1.2 + lift * 0.25
    const targetZ = FRAMING - kick * 0.65

    base.current.x = THREE.MathUtils.damp(base.current.x, targetX, 2.8, delta)
    base.current.y = THREE.MathUtils.damp(base.current.y, targetY, 2.8, delta)
    base.current.z = THREE.MathUtils.damp(base.current.z, targetZ, 3.6, delta)

    camera.position.copy(base.current)
    camera.lookAt(0, lift * 0.12, 0)
  })

  return null
}

function Contents() {
  const progress = useAmbientProgress()

  return (
    <>
      <NeonGrid progress={progress} />
      <Dust progress={progress} />
      <Bokeh progress={progress} />
      <Blast />
      <Rig progress={progress} />
    </>
  )
}

export default function Scene() {
  return (
    <Canvas
      className="scene-canvas"
      aria-hidden="true"
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 46, near: 0.1, far: 400, position: [0, 0.35, FRAMING] }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0)
      }}
    >
      <Contents />
    </Canvas>
  )
}
