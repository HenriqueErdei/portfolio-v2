import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, type RefObject } from "react"
import * as THREE from "three"
import { BOKEH_FRAGMENT, BOKEH_VERTEX } from "./shaders"
import { useThemeTokens } from "./tokens"

/**
 * The layer between the sky and the vehicle: defocused motes drifting through a
 * shallow depth of field.
 *
 * They are tied to scroll, so the field sweeps downward as you read and the
 * background becomes part of the movement rather than idle decoration, and they
 * wrap into a repeating slab so the supply never runs out however long the page
 * gets. Parallax against the cursor comes for free from the camera's orbit,
 * because the motes are spread across sixteen units of depth.
 */

/** Height of the repeating slab, in world units. */
const SPAN = 26

const COUNT = 110

/**
 * Deterministic PRNG. The motes are placed once at module scale and never move
 * house, so using `Math.random` would recompose the background on every reload —
 * and a big soft blob landing over the headline would be nobody's decision.
 */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function Bokeh({ progress }: { progress: RefObject<number> }) {
  const tokens = useThemeTokens()

  const geometry = useMemo(() => {
    // A unit quad, written out rather than borrowed from PlaneGeometry, so the
    // instanced geometry owns every buffer it references.
    const geo = new THREE.InstancedBufferGeometry()
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0]),
        3,
      ),
    )
    geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), 2))
    geo.setIndex([0, 1, 2, 2, 1, 3])
    geo.instanceCount = COUNT

    const offsets = new Float32Array(COUNT * 3)
    const scales = new Float32Array(COUNT)
    const seeds = new Float32Array(COUNT)
    const blurs = new Float32Array(COUNT)
    const tints = new Float32Array(COUNT)

    const random = mulberry32(0x5eed)

    for (let index = 0; index < COUNT; index += 1) {
      // A minority sit in front of the vehicle. Those are the large, very soft
      // blobs that sell the shallow depth of field.
      const foreground = random() < 0.12
      const z = foreground ? 0.8 + random() * 1.3 : -1.5 - random() * 12

      offsets[index * 3] = (random() * 2 - 1) * 11
      offsets[index * 3 + 1] = (random() - 0.5) * SPAN
      offsets[index * 3 + 2] = z

      // Distance from the focal plane — the vehicle, at z = 0 — drives both size
      // and softness, which is what a real lens does.
      const defocus = Math.min(1, Math.abs(z) / 11)

      scales[index] = foreground ? 0.7 + random() * 0.6 : 0.1 + defocus ** 2 * 1.5 + random() * 0.22
      blurs[index] = Math.min(1, foreground ? 0.85 + random() * 0.15 : 0.22 + defocus * 0.75)
      seeds[index] = random()
      tints[index] = random()
    }

    geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3))
    geo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1))
    geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1))
    geo.setAttribute("aBlur", new THREE.InstancedBufferAttribute(blurs, 1))
    geo.setAttribute("aTint", new THREE.InstancedBufferAttribute(tints, 1))

    return geo
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BOKEH_VERTEX,
        fragmentShader: BOKEH_FRAGMENT,
        transparent: true,
        // Depth is tested but not written, so the hull hides the motes behind it
        // while the foreground ones still blur across the vehicle.
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSpan: { value: SPAN },
          uNear: { value: new THREE.Color() },
          uFar: { value: new THREE.Color() },
          uOpacity: { value: 0.5 },
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
    material.uniforms.uNear!.value.copy(tokens.ink)
    material.uniforms.uFar!.value.copy(tokens.sig)

    // On the dark theme the motes add light. On paper they have to remove it, so
    // the blend mode flips or the field vanishes into white.
    const daylight = tokens.theme === 1
    material.blending = daylight ? THREE.NormalBlending : THREE.AdditiveBlending
    material.uniforms.uOpacity!.value = daylight ? 0.28 : 0.5
    material.needsUpdate = true
  }, [material, tokens])

  useFrame((state) => {
    material.uniforms.uTime!.value = state.clock.elapsedTime
    material.uniforms.uProgress!.value = progress.current ?? 0
  })

  return (
    // Drawn after the vehicle so the depth test can decide, per mote, whether it
    // is in front of the hull or behind it.
    <mesh frustumCulled={false} renderOrder={2}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
