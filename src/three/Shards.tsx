import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, type RefObject } from "react"
import * as THREE from "three"
import { SHARD_FRAGMENT, SHARD_VERTEX } from "./shaders"
import { usePointerRef } from "./pointer"
import { IMPACT, flash, ignite, settle } from "./sequence"
import { useThemeTokens } from "./tokens"

/**
 * Crystal shards from the impact. One instanced draw call: each shard carries
 * an origin near the strike, a burst direction, and a home in the cascade. The
 * vertex shader blends between them so the shatter and the column are the same
 * geometry throughout.
 */

const SHARD_COUNT = 1200

/** Height of the repeating slab the cascade wraps into, in world units. */
const SPAN = 30

/**
 * How far the cursor shoves a shard directly under it, as a fraction of half the
 * screen. Small deliberately: water-through-hand, not a scatter.
 */
const PUSH = 0.09

/**
 * Deterministic PRNG. The shards are laid out once, and `Math.random` would mean
 * a different explosion on every reload.
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

export function Shards({ progress }: { progress: RefObject<number> }) {
  const tokens = useThemeTokens()
  const pointer = usePointerRef(2.2)

  const geometry = useMemo(() => {
    const tetrahedron = new THREE.TetrahedronGeometry(1, 0)
    const source = tetrahedron.index ? tetrahedron.toNonIndexed() : tetrahedron
    const position = source.getAttribute("position")

    const bary = new Float32Array(position.count * 3)
    for (let vertex = 0; vertex < position.count; vertex += 1) {
      bary[vertex * 3 + (vertex % 3)] = 1
    }

    const geo = new THREE.InstancedBufferGeometry()
    geo.setAttribute("position", position.clone())
    geo.setAttribute("aBary", new THREE.BufferAttribute(bary, 3))
    geo.instanceCount = SHARD_COUNT

    const origins = new Float32Array(SHARD_COUNT * 3)
    const bursts = new Float32Array(SHARD_COUNT * 3)
    const cascade = new Float32Array(SHARD_COUNT * 3)
    const spins = new Float32Array(SHARD_COUNT * 3)
    const scales = new Float32Array(SHARD_COUNT)
    const seeds = new Float32Array(SHARD_COUNT)

    const random = mulberry32(0xca5cade)
    const impact = new THREE.Vector3(IMPACT.x, IMPACT.y, IMPACT.z)

    for (let index = 0; index < SHARD_COUNT; index += 1) {
      // Seed near the strike — a tight crystal cluster that the flash opens.
      const theta = random() * Math.PI * 2
      const phi = Math.acos(2 * random() - 1)
      const radius = random() ** 0.55 * 0.42
      const point = new THREE.Vector3(
        impact.x + Math.sin(phi) * Math.cos(theta) * radius,
        impact.y + Math.cos(phi) * radius,
        impact.z + Math.sin(phi) * Math.sin(theta) * radius,
      )
      const outward = point.clone().sub(impact)
      if (outward.lengthSq() < 1e-6) outward.set(0, 1, 0)
      else outward.normalize()

      origins[index * 3] = point.x
      origins[index * 3 + 1] = point.y
      origins[index * 3 + 2] = point.z

      const burst = outward
        .clone()
        .multiplyScalar(0.55 + random() * 0.55)
        .add(new THREE.Vector3(0, (random() - 0.35) * 0.55, 0))
        .normalize()
        .multiplyScalar(0.85 + random() * 1.35)

      bursts[index * 3] = burst.x
      bursts[index * 3 + 1] = burst.y
      bursts[index * 3 + 2] = burst.z

      // Hollow column: empty core keeps the headline readable.
      cascade[index * 3] = 2.7 + random() ** 0.7 * 5.9
      cascade[index * 3 + 1] = random() * Math.PI * 2
      cascade[index * 3 + 2] = (random() - 0.5) * SPAN

      spins[index * 3] = (random() - 0.5) * 0.9
      spins[index * 3 + 1] = (random() - 0.5) * 0.9
      spins[index * 3 + 2] = (random() - 0.5) * 0.9

      scales[index] = 0.016 + random() ** 2 * 0.03
      seeds[index] = random()
    }

    geo.setAttribute("aOrigin", new THREE.InstancedBufferAttribute(origins, 3))
    geo.setAttribute("aBurst", new THREE.InstancedBufferAttribute(bursts, 3))
    geo.setAttribute("aCascade", new THREE.InstancedBufferAttribute(cascade, 3))
    geo.setAttribute("aSpin", new THREE.InstancedBufferAttribute(spins, 3))
    geo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1))
    geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1))

    tetrahedron.dispose()
    if (source !== tetrahedron) source.dispose()

    return geo
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SHARD_VERTEX,
        fragmentShader: SHARD_FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSpan: { value: SPAN },
          uIgnite: { value: 0 },
          uSettle: { value: 0 },
          uEdge: { value: new THREE.Color() },
          uFill: { value: new THREE.Color() },
          uFlash: { value: 0 },
          uOpacity: { value: 1 },
          uCursor: { value: new THREE.Vector2() },
          uCursorPush: { value: 0 },
          uAspect: { value: 1 },
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
    material.uniforms.uEdge!.value.copy(tokens.sig)
    material.uniforms.uFill!.value.setRGB(
      tokens.theme === 1 ? 0.55 : 0.12,
      tokens.theme === 1 ? 0.72 : 0.28,
      tokens.theme === 1 ? 0.85 : 0.42,
    )

    const daylight = tokens.theme === 1
    material.blending = daylight ? THREE.NormalBlending : THREE.AdditiveBlending
    material.uniforms.uOpacity!.value = daylight ? 0.6 : 1
    material.needsUpdate = true
  }, [material, tokens])

  useFrame((state) => {
    const value = progress.current ?? 0
    const opened = settle(value)

    material.uniforms.uTime!.value = state.clock.elapsedTime
    material.uniforms.uProgress!.value = value
    material.uniforms.uIgnite!.value = ignite(value)
    material.uniforms.uSettle!.value = opened
    material.uniforms.uFlash!.value = flash(value) * 0.8

    material.uniforms.uCursor!.value.set(pointer.current.x, pointer.current.y)
    material.uniforms.uAspect!.value = state.size.width / state.size.height
    material.uniforms.uCursorPush!.value = PUSH * (0.2 + 0.8 * opened)
  })

  return (
    <mesh frustumCulled={false} renderOrder={1}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
