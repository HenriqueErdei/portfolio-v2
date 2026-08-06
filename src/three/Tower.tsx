import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, type RefObject } from "react"
import * as THREE from "three"
import { getScrollProgress } from "@/lib/scroll"
import { usePointerRef } from "./pointer"
import { flash, towerAwake } from "./sequence"
import { useThemeTokens } from "./tokens"
import { buildTower } from "./towerGeometry"

/**
 * How many full turns the tower makes across the whole page. One and a half is
 * enough to feel deliberate without making the lattice a blur.
 */
const TURNS = 1.35

/** Extra yaw kick when the bolt hits — the geogram “comes alive”. */
const WAKE_SPIN = 0.55

/** How far the cursor tilts the lattice, in radians. */
const POINTER_YAW = 0.42
const POINTER_PITCH = 0.22
/** Soft parallax shift so the structure feels solid in space, not a sprite. */
const POINTER_X = 0.4
const POINTER_Z = 0.25

/**
 * The geometric tower at the centre of the scene. Same lattice as before —
 * just larger so it owns the vertical axis behind the hero.
 */
export function Tower({ progress }: { progress: RefObject<number> }) {
  const tokens = useThemeTokens()
  const pointer = usePointerRef(4.2)
  const group = useRef<THREE.Group>(null)
  const frameMat = useRef<THREE.LineBasicMaterial>(null)
  const nodeMat = useRef<THREE.PointsMaterial>(null)
  const yaw = useRef(0)
  const tiltX = useRef(0)
  const tiltY = useRef(0)
  const shiftX = useRef(0)
  const shiftZ = useRef(0)
  const frameOpacity = useRef(0.7)
  const nodeOpacity = useRef(0.95)

  const buffers = useMemo(() => buildTower(), [])

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(buffers.lines, 3))
    return geometry
  }, [buffers])

  const nodeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(buffers.nodes, 3))
    return geometry
  }, [buffers])

  useEffect(
    () => () => {
      lineGeometry.dispose()
      nodeGeometry.dispose()
    },
    [lineGeometry, nodeGeometry],
  )

  useEffect(() => {
    if (!frameMat.current || !nodeMat.current) return

    const daylight = tokens.theme === 1
    frameOpacity.current = daylight ? 0.5 : 0.9
    nodeOpacity.current = daylight ? 0.72 : 1

    // Dark: console cyan. Light: the same green-teal family, darkened for paper.
    const tower = daylight ? new THREE.Color(0x0a8f9a) : tokens.sig
    frameMat.current.color.copy(tower)
    nodeMat.current.color.copy(tower)
    frameMat.current.blending = daylight ? THREE.NormalBlending : THREE.AdditiveBlending
    nodeMat.current.blending = daylight ? THREE.NormalBlending : THREE.AdditiveBlending
    frameMat.current.needsUpdate = true
    nodeMat.current.needsUpdate = true
  }, [tokens])

  useFrame((_, delta) => {
    const value = progress.current ?? 0
    const awake = towerAwake(value)
    const pulse = flash(value)
    const scroll = getScrollProgress()
    const targetYaw = awake * WAKE_SPIN + scroll * Math.PI * 2 * TURNS

    yaw.current = THREE.MathUtils.damp(yaw.current, targetYaw, 4, delta)

    const lean = awake
    tiltY.current = THREE.MathUtils.damp(
      tiltY.current,
      pointer.current.x * POINTER_YAW * lean,
      5,
      delta,
    )
    tiltX.current = THREE.MathUtils.damp(
      tiltX.current,
      -pointer.current.y * POINTER_PITCH * lean,
      5,
      delta,
    )
    shiftX.current = THREE.MathUtils.damp(
      shiftX.current,
      pointer.current.x * POINTER_X * lean,
      4.5,
      delta,
    )
    shiftZ.current = THREE.MathUtils.damp(
      shiftZ.current,
      pointer.current.y * POINTER_Z * lean,
      4.5,
      delta,
    )

    if (group.current) {
      group.current.visible = awake > 0.02
      group.current.rotation.y = yaw.current + tiltY.current
      group.current.rotation.x = tiltX.current
      group.current.rotation.z = tiltY.current * -0.12
      const rise = awake * awake
      group.current.position.x = shiftX.current
      group.current.position.y = buffers.height * 0.5 + (1 - rise) * 2.8
      group.current.position.z = shiftZ.current
      // Same feel as the original lattice — bumped ~35% so it fills the hero.
      group.current.scale.setScalar(0.75 + rise * 0.8 + pulse * 0.08)

      if (frameMat.current) {
        frameMat.current.opacity = frameOpacity.current * rise * (1 + pulse * 0.55)
      }
      if (nodeMat.current) {
        nodeMat.current.opacity = nodeOpacity.current * rise * (1 + pulse * 0.7)
        nodeMat.current.size = 0.12 + pulse * 0.08
      }
    }
  })

  return (
    <group ref={group} renderOrder={0}>
      <lineSegments frustumCulled={false}>
        <primitive object={lineGeometry} attach="geometry" />
        <lineBasicMaterial ref={frameMat} transparent depthWrite={false} />
      </lineSegments>

      <points frustumCulled={false}>
        <primitive object={nodeGeometry} attach="geometry" />
        <pointsMaterial
          ref={nodeMat}
          size={0.12}
          sizeAttenuation
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  )
}
