/**
 * GLSL for the ambient background. Most shaders take `uProgress` (0 → 1, scroll)
 * and `uTheme` (0 = night, 1 = day).
 */

export const DUST_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;

  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;

  varying float vSeed;
  varying float vFade;

  void main() {
    vSeed = aSeed;

    vFade = 0.35 + 0.5 * smoothstep(0.0, 0.6, uProgress);

    vec3 pos = position;
    pos.x += sin(uTime * 0.04 + aSeed * 6.283) * 1.5;

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    float size = aSize * uPixelRatio * (140.0 / -viewPosition.z);
    gl_PointSize = clamp(size, 0.6, 7.0);
  }
`

export const DUST_FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform highp float uTime;
  uniform vec3 uColor;
  uniform float uTheme;

  varying float vSeed;
  varying float vFade;

  void main() {
    vec2 offset = gl_PointCoord - 0.5;
    float disc = 1.0 - smoothstep(0.35, 0.5, length(offset));
    if (disc <= 0.001) discard;

    float twinkle = 0.65 + 0.35 * sin(uTime * 1.6 + vSeed * 12.566);

    gl_FragColor = vec4(uColor, disc * twinkle * vFade * mix(1.0, 0.12, uTheme));
  }
`

export const BOKEH_VERTEX = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aScale;
  attribute float aSeed;
  attribute float aBlur;
  attribute float aTint;

  uniform float uTime;
  uniform float uProgress;
  uniform float uSpan;

  varying vec2 vUv;
  varying float vBlur;
  varying float vTint;

  void main() {
    vUv = uv;
    vBlur = aBlur;
    vTint = aTint;

    float phase = aSeed * 6.2831853;

    vec3 origin = aOffset;
    origin.x += sin(uTime * 0.07 + phase) * 1.6;
    origin.z += cos(uTime * 0.05 + phase * 1.3) * 1.1;

    float parallax = 1.0 + (origin.z + 9.0) * 0.1;
    origin.y -= (uProgress * 4.0 + uTime * 0.1) * parallax;

    origin.y = mod(origin.y + uSpan * 0.5, uSpan) - uSpan * 0.5;

    vec4 viewPosition = modelViewMatrix * vec4(origin, 1.0);
    viewPosition.xy += position.xy * aScale;

    gl_Position = projectionMatrix * viewPosition;
  }
`

export const BOKEH_FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform vec3 uNear;
  uniform vec3 uFar;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vBlur;
  varying float vTint;

  void main() {
    float dist = length(vUv - 0.5) * 2.0;
    if (dist > 1.0) discard;

    float edge = mix(0.94, 0.0, vBlur);
    float disc = 1.0 - smoothstep(edge, 1.0, dist);
    float ring = (1.0 - vBlur) * smoothstep(0.78, 0.97, dist) * (1.0 - smoothstep(0.97, 1.0, dist));

    vec3 color = mix(uNear, uFar, vTint);
    float alpha = (disc * 0.5 + ring * 0.6) * uOpacity;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`

export const GRID_VERTEX = /* glsl */ `
  varying vec2 vPlane;
  varying float vDist;

  void main() {
    vPlane = position.xy;

    vec4 world = modelMatrix * vec4(position, 1.0);
    vDist = length(world.xz - cameraPosition.xz);

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const GRID_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uNear;
  uniform vec3 uFar;
  uniform float uTheme;

  varying vec2 vPlane;
  varying float vDist;

  float gridLine(vec2 p, float cell, float thickness) {
    vec2 q = p / cell;
    vec2 d = abs(fract(q - 0.5) - 0.5) / fwidth(q);
    return 1.0 - clamp(min(d.x, d.y) / thickness, 0.0, 1.0);
  }

  void main() {
    vec2 p = vPlane - vec2(0.0, uProgress * 9.0 + uTime * 0.38);

    float fine = gridLine(p, 1.0, 1.6);
    float coarse = gridLine(p, 8.0, 2.2);

    float horizon = 1.0 - smoothstep(14.0, 76.0, vDist);
    float near = 1.0 - smoothstep(0.0, 28.0, vDist);

    vec3 color = mix(uNear, uFar, clamp(vDist / 60.0, 0.0, 1.0));
    float intensity = (fine * 0.26 + coarse * 0.58) * horizon * (0.28 + near * 0.52);

    gl_FragColor = vec4(color, clamp(intensity, 0.0, 1.0) * mix(0.5, 0.18, uTheme));
  }
`

export const BLAST_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const BLAST_FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform vec3 uHot;
  uniform vec3 uCool;
  uniform float uCore;
  uniform float uAfterglow;
  uniform float uWave;
  uniform float uWaveEcho;

  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float dist = length(p);
    if (dist > 1.0) discard;

    float angle = atan(p.y, p.x);
    float facets = abs(fract(angle / 6.2831853 * 20.0) - 0.5) * 2.0;
    float crystal = 1.0 - smoothstep(0.0, 0.48, facets);
    float micro = abs(fract(angle / 6.2831853 * 36.0 + dist * 3.0) - 0.5) * 2.0;
    float grain = 1.0 - smoothstep(0.0, 0.32, micro);

    float core = exp(-dist * dist * 9.0) * uCore;
    float halo = exp(-dist * dist * 3.4) * (uCore * 0.32 + uAfterglow * 0.55);
    float ring = exp(-pow((dist - uWave) / 0.072, 2.0)) * (1.0 - uWave) * (0.88 + crystal * 0.55);
    float echo = exp(-pow((dist - uWaveEcho) / 0.058, 2.0)) * (1.0 - uWaveEcho) * 0.72 * (0.72 + grain * 0.4);
    float spokes = crystal * exp(-pow((dist - uWave * 0.93) / 0.13, 2.0)) * (1.0 - uWave) * 0.42;

    float amount = core + halo + ring * 0.95 + echo * 0.78 + spokes;

    vec3 color = mix(uCool, uHot, clamp(core * 1.5 + crystal * 0.25, 0.0, 1.0));
    color += vec3(0.9, 0.97, 1.0) * (core * 0.5 + uAfterglow * 0.18);
    color += uCool * echo * 0.22;

    gl_FragColor = vec4(color, clamp(amount, 0.0, 1.0));
  }
`
