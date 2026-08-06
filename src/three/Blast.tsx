import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, type RefObject } from "react"
import * as THREE from "three"
import { BLAST_FRAGMENT, BLAST_VERTEX } from "./shaders"
import { flash, shockwave } from "./sequence"
import { useThemeTokens } from "./tokens"

/**
 * Impact flash: a white-cyan core and a faceted shockwave on a camera-facing
 * quad. Covers the hand-off where the bolt clears and the shards take the stage.
 */

/** How far the shockwave reaches, in world units. */
const REACH = 9

export function Blast({ progress }: { progress: RefObject<number> }) {
  const tokens = useThemeTokens()
  const mesh = useRef<THREE.Mesh>(null)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BLAST_VERTEX,
        fragmentShader: BLAST_FRAGMENT,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uHot: { value: new THREE.Color() },
          uCool: { value: new THREE.Color() },
          uCore: { value: 0 },
          uWave: { value: 0 },
        },
      }),
    [],
  )

  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    // Ice shatter: white-hot core, cyan ring — never amber fire.
    material.uniforms.uHot!.value.setRGB(0.95, 0.99, 1.0)
    material.uniforms.uCool!.value.copy(tokens.sig)
  }, [material, tokens])

  useFrame(({ camera }) => {
    const value = progress.current ?? 0
    const core = flash(value)
    const wave = shockwave(value)

    material.uniforms.uCore!.value = core
    material.uniforms.uWave!.value = wave

    if (mesh.current) {
      // Nothing to draw for the vast majority of the page, and an additive quad
      // this large is not something to leave running for free.
      mesh.current.visible = core > 0.002 || (wave > 0 && wave < 1)

      // Billboarded by adopting the camera's rotation outright, which is exact
      // and costs one quaternion copy.
      mesh.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    // Drawn last and with depth testing off, so the flash covers the shards
    // instead of being sorted among them.
    <mesh ref={mesh} renderOrder={10} frustumCulled={false}>
      <planeGeometry args={[REACH * 2, REACH * 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
