import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, type RefObject } from "react"
import * as THREE from "three"
import { GRID_FRAGMENT, GRID_VERTEX } from "./shaders"
import { useThemeTokens } from "./tokens"

/**
 * The floor. One large plane with a procedural grid that streams toward the
 * camera as you scroll, which is what gives the cascade something to fall past —
 * without a ground plane the column has no scale and no sense of speed.
 *
 * The grid is generated in the fragment shader rather than sampled from a
 * texture, so the lines stay exactly one pixel wide all the way to the horizon
 * instead of collapsing into moiré.
 */

const SIZE = 190
const HEIGHT = -3.4

export function NeonGrid({ progress }: { progress: RefObject<number> }) {
  const tokens = useThemeTokens()

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: GRID_VERTEX,
        fragmentShader: GRID_FRAGMENT,
        transparent: true,
        // No depth writing, so the shards falling below the floor stay visible
        // through it. The grid is light, not a surface.
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uNear: { value: new THREE.Color() },
          uFar: { value: new THREE.Color() },
          uTheme: { value: 0 },
        },
      }),
    [],
  )

  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    material.uniforms.uNear!.value.copy(tokens.sig)
    material.uniforms.uFar!.value.copy(tokens.plasma)
    material.uniforms.uTheme!.value = tokens.theme
    material.blending = tokens.theme === 1 ? THREE.NormalBlending : THREE.AdditiveBlending
    material.needsUpdate = true
  }, [material, tokens])

  useFrame((state) => {
    material.uniforms.uTime!.value = state.clock.elapsedTime
    material.uniforms.uProgress!.value = progress.current ?? 0
  })

  return (
    <mesh position={[0, HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[SIZE, SIZE]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
