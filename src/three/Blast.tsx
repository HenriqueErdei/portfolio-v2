import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import {
  getIntroProgress,
  introAfterglow,
  introFlash,
  introShockwave,
  introShockwaveEcho,
  subscribeToIntro,
} from "@/lib/intro"
import { BLAST_FRAGMENT, BLAST_VERTEX } from "./shaders"
import { useThemeTokens } from "./tokens"

const REACH = 11

/**
 * Entry blast — desktop only. Reads the same linear intro clock as the boot
 * overlay so the flash and shockwave stay aligned.
 */
export function Blast() {
  const tokens = useThemeTokens()
  const mesh = useRef<THREE.Mesh>(null)
  const clock = useRef(getIntroProgress())

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
          uHot: { value: new THREE.Color(0.96, 0.99, 1) },
          uCool: { value: new THREE.Color() },
          uCore: { value: 0 },
          uAfterglow: { value: 0 },
          uWave: { value: 0 },
          uWaveEcho: { value: 0 },
        },
      }),
    [],
  )

  useEffect(() => {
    return subscribeToIntro(() => {
      clock.current = getIntroProgress()
    })
  }, [])

  useEffect(() => {
    material.uniforms.uCool!.value.copy(tokens.sig)
  }, [material, tokens])

  useEffect(() => () => material.dispose(), [material])

  useFrame(({ camera }) => {
    const value = clock.current
    const core = introFlash(value)
    const afterglow = introAfterglow(value)
    const wave = introShockwave(value)
    const echo = introShockwaveEcho(value)

    material.uniforms.uCore!.value = core
    material.uniforms.uAfterglow!.value = afterglow
    material.uniforms.uWave!.value = wave
    material.uniforms.uWaveEcho!.value = echo

    if (mesh.current) {
      mesh.current.visible =
        core > 0.003 ||
        afterglow > 0.02 ||
        (wave > 0.01 && wave < 0.995) ||
        (echo > 0.01 && echo < 0.995)
      mesh.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <mesh ref={mesh} renderOrder={10} frustumCulled={false}>
      <planeGeometry args={[REACH * 2, REACH * 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
