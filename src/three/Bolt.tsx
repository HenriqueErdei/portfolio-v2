import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, type RefObject } from "react"
import * as THREE from "three"
import { CORNERS, buildCornerBolts } from "./boltGeometry"
import { IMPACT, boltFade, boltReveal, flash } from "./sequence"
import { useThemeTokens } from "./tokens"

type Arm = {
  lines: THREE.BufferGeometry
  nodes: THREE.BufferGeometry
  totalVerts: number
  lineMat: THREE.LineBasicMaterial
  nodeMat: THREE.PointsMaterial
}

/**
 * Four geometric bolts charging in from the corners of the frame and meeting
 * at the geogram origin — a plexus that owns the whole stage on impact.
 */
export function Bolt({ progress }: { progress: RefObject<number> }) {
  const tokens = useThemeTokens()
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const coreMat = useRef<THREE.MeshBasicMaterial>(null)

  const arms = useMemo((): Arm[] => {
    return buildCornerBolts().map((buffers) => {
      const lines = new THREE.BufferGeometry()
      lines.setAttribute("position", new THREE.BufferAttribute(buffers.lines, 3))
      lines.setDrawRange(0, 0)

      const nodes = new THREE.BufferGeometry()
      nodes.setAttribute("position", new THREE.BufferAttribute(buffers.nodes, 3))

      return {
        lines,
        nodes,
        totalVerts: buffers.totalVerts,
        lineMat: new THREE.LineBasicMaterial({ transparent: true, depthWrite: false }),
        nodeMat: new THREE.PointsMaterial({
          size: 0.1,
          sizeAttenuation: true,
          transparent: true,
          depthWrite: false,
        }),
      }
    })
  }, [])

  useEffect(
    () => () => {
      for (const arm of arms) {
        arm.lines.dispose()
        arm.nodes.dispose()
        arm.lineMat.dispose()
        arm.nodeMat.dispose()
      }
    },
    [arms],
  )

  useEffect(() => {
    const daylight = tokens.theme === 1
    const tip = daylight ? tokens.sig.clone() : new THREE.Color(0xd8f8ff)

    for (const arm of arms) {
      arm.lineMat.color.copy(tokens.sig)
      arm.nodeMat.color.copy(tip)
      arm.lineMat.blending = daylight ? THREE.NormalBlending : THREE.AdditiveBlending
      arm.nodeMat.blending = daylight ? THREE.NormalBlending : THREE.AdditiveBlending
      arm.lineMat.needsUpdate = true
      arm.nodeMat.needsUpdate = true
    }
    if (coreMat.current) coreMat.current.color.copy(tip)
  }, [tokens, arms])

  useFrame(() => {
    const value = progress.current ?? 0
    const reveal = boltReveal(value)
    const fade = boltFade(value)
    const punch = flash(value)
    const daylight = tokens.theme === 1

    if (group.current) group.current.visible = fade > 0.01

    arms.forEach((arm, index) => {
      // Slight stagger so the four corners don't stamp in as one sprite.
      const local = THREE.MathUtils.clamp(reveal * 1.15 - index * 0.04, 0, 1)
      const verts = Math.floor(local * arm.totalVerts)
      arm.lines.setDrawRange(0, verts - (verts % 2))

      arm.lineMat.opacity = (0.5 + punch * 0.5) * fade * (daylight ? 0.65 : 1)
      arm.nodeMat.opacity = local * fade * (0.65 + punch * 0.35)
      arm.nodeMat.size = 0.1 + punch * 0.07
    })

    if (coreMat.current) {
      coreMat.current.opacity = reveal * fade * (0.4 + punch * 0.6)
    }
    if (core.current) {
      core.current.scale.setScalar(0.12 + punch * 0.7 + reveal * 0.18)
    }
  })

  return (
    <group ref={group} renderOrder={2}>
      {arms.map((arm, index) => (
        <group key={CORNERS[index]!.phase}>
          <lineSegments frustumCulled={false}>
            <primitive object={arm.lines} attach="geometry" />
            <primitive object={arm.lineMat} attach="material" />
          </lineSegments>
          <points frustumCulled={false}>
            <primitive object={arm.nodes} attach="geometry" />
            <primitive object={arm.nodeMat} attach="material" />
          </points>
        </group>
      ))}

      <mesh
        ref={core}
        position={[IMPACT.x, IMPACT.y, IMPACT.z]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          ref={coreMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
