import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, type RefObject } from "react"
import * as THREE from "three"
import { DUST_FRAGMENT, DUST_VERTEX } from "./shaders"
import { useThemeTokens } from "./tokens"

/**
 * The furthest layer: a thick shell of drifting motes. Distributed through the
 * shell's volume rather than across its surface, so the camera's own movement
 * separates them by parallax and the background gains depth for free.
 */

const COUNT = 1400

export function Dust({ progress }: { progress: RefObject<number> }) {
  const tokens = useThemeTokens()
  const { size, viewport } = useThree()

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)
    const seeds = new Float32Array(COUNT)

    for (let index = 0; index < COUNT; index += 1) {
      const radius = 40 + Math.random() * 90
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[index * 3 + 1] = radius * Math.cos(phi)
      positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

      // Squared so most motes are faint and only a handful are bright.
      sizes[index] = 0.4 + Math.random() ** 2 * 2.4
      seeds[index] = Math.random()
    }

    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    buffer.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))
    buffer.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1))
    return buffer
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DUST_VERTEX,
        fragmentShader: DUST_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uPixelRatio: { value: 1 },
          uColor: { value: new THREE.Color() },
          uTheme: { value: 0 },
        },
      }),
    [],
  )

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useEffect(() => {
    material.uniforms.uColor!.value.copy(tokens.ink)
    material.uniforms.uTheme!.value = tokens.theme
  }, [material, tokens])

  useEffect(() => {
    material.uniforms.uPixelRatio!.value = Math.min(viewport.dpr, 2)
  }, [material, viewport.dpr, size])

  useFrame((state) => {
    material.uniforms.uTime!.value = state.clock.elapsedTime
    material.uniforms.uProgress!.value = progress.current ?? 0
  })

  return (
    <points frustumCulled={false} renderOrder={-2}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </points>
  )
}
