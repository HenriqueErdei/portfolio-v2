import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef, type RefObject } from "react"
import * as THREE from "three"
import { getIntroPhase, sceneProgress, subscribeToIntro } from "@/lib/intro"
import { subscribeToScroll } from "@/lib/scroll"
import { Blast } from "./Blast"
import { Bolt } from "./Bolt"
import { NeonGrid } from "./NeonGrid"
import { Shards } from "./Shards"
import { Tower } from "./Tower"
import { usePointerRef } from "./pointer"
import { flash, settle, towerAwake } from "./sequence"

/**
 * The background, as one sequence: a geometric bolt strikes the geogram, the
 * impact wakes the tower, and the debris settles into the cascade.
 *
 * On first visit that sequence is the entry itself — a clock drives it while the
 * boot overlay gets out of the way. After that, scroll only evolves the cascade
 * the blast left behind. Nothing here holds React state per frame: progress
 * arrives through subscriptions into a ref, and every animation is applied
 * inside `useFrame`.
 */

/**
 * Shared, smoothed progress. During the entry the clock is already continuous,
 * so damping is light; against scroll it stays heavier, so a scrollbar drag does
 * not snap the cascade.
 */
function useProgressRef(): RefObject<number> {
  const scroll = useRef(0)
  const target = useRef(sceneProgress(0))
  const smoothed = useRef(sceneProgress(0))

  useEffect(() => {
    const sync = () => {
      target.current = sceneProgress(scroll.current)
      // Snap onto the clock while it is running — damping a staged timeline only
      // makes the beats late.
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
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target.current, 3.5, delta)
  })

  return smoothed
}

/**
 * Camera path: framed on the geogram. Closer than the “tiny tower” pass so the
 * larger lattice reads at hero scale without swallowing the bolt on entry.
 */
const FRAMING = 10.5

/**
 * How far the cursor swings the camera around the scene, in radians.
 */
const ORBIT_YAW = 0.24
const ORBIT_PITCH = 0.13

function Rig({ progress }: { progress: RefObject<number> }) {
  const pointer = usePointerRef(2.6)
  const base = useRef(new THREE.Vector3(0, 0, FRAMING))

  useFrame(({ camera, clock }, delta) => {
    const value = progress.current ?? 0
    const time = clock.elapsedTime
    const opened = settle(value)
    const awake = towerAwake(value)

    const climb = awake * 0.08
    const radius = FRAMING + opened * 2.2 + (1 - opened) * 2.0

    const yaw = pointer.current.x * ORBIT_YAW
    const pitch = pointer.current.y * ORBIT_PITCH

    const targetX = Math.sin(yaw) * Math.cos(pitch) * radius
    const targetY = climb + Math.sin(pitch) * radius * 0.3
    const targetZ = Math.cos(yaw) * Math.cos(pitch) * radius

    base.current.x = THREE.MathUtils.damp(base.current.x, targetX, 3, delta)
    base.current.y = THREE.MathUtils.damp(base.current.y, targetY, 3, delta)
    base.current.z = THREE.MathUtils.damp(base.current.z, targetZ, 3, delta)

    const kick = flash(value) * 0.07

    camera.position.set(
      base.current.x + Math.sin(time * 47) * kick,
      base.current.y + Math.sin(time * 39 + 1.1) * kick,
      base.current.z,
    )
    camera.lookAt(0, 0.2, 0)
    camera.rotateZ(-pointer.current.x * 0.015)
  })

  return null
}

function Contents() {
  const progress = useProgressRef()

  return (
    <>
      <NeonGrid progress={progress} />
      <Tower progress={progress} />
      <Bolt progress={progress} />
      <Shards progress={progress} />
      <Blast progress={progress} />
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
      camera={{ fov: 46, near: 0.1, far: 400, position: [0, 0, FRAMING] }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0)
      }}
    >
      <Contents />
    </Canvas>
  )
}
