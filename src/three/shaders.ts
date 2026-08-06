/**
 * GLSL for the background scene. Written by hand rather than pulled from a
 * material library so the whole thing stays a handful of small programs.
 *
 * Most shaders take `uProgress` (0 → 1, how far down the page you have read) and
 * `uTheme` (0 = night, 1 = day), so the scene reacts to scroll and to the theme
 * switch without rebuilding materials.
 */

/* ---------------------------------------------------------------------------
 * Dust
 *
 * The far layer. Points rather than quads, because at this size the driver's
 * point-size clamp is never reached.
 * ------------------------------------------------------------------------- */

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

    // Present from the start, but the field gains confidence as you read down.
    vFade = 0.35 + 0.5 * smoothstep(0.0, 0.6, uProgress);

    vec3 pos = position;
    pos.x += sin(uTime * 0.04 + aSeed * 6.283) * 1.5;

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    // Perspective-correct point size, clamped so a mote near the camera cannot
    // blow up into a square.
    float size = aSize * uPixelRatio * (140.0 / -viewPosition.z);
    gl_PointSize = clamp(size, 0.6, 7.0);
  }
`

export const DUST_FRAGMENT = /* glsl */ `
  precision mediump float;

  // Explicitly high, because the vertex stage sharing this uniform gets highp by
  // default and a program whose two halves disagree on a uniform fails to link.
  uniform highp float uTime;
  uniform vec3 uColor;
  uniform float uTheme;

  varying float vSeed;
  varying float vFade;

  void main() {
    vec2 offset = gl_PointCoord - 0.5;
    float disc = 1.0 - smoothstep(0.35, 0.5, length(offset));
    if (disc <= 0.001) discard;

    // Phase-shifted by the seed so no two motes ever blink in unison.
    float twinkle = 0.65 + 0.35 * sin(uTime * 1.6 + vSeed * 12.566);

    gl_FragColor = vec4(uColor, disc * twinkle * vFade * mix(1.0, 0.12, uTheme));
  }
`

/* ---------------------------------------------------------------------------
 * Bokeh field
 *
 * Instanced quads billboarded in view space rather than gl_POINTS, because
 * point size is clamped by the driver — some mobile GPUs cap it around 64px,
 * which would quietly flatten the whole effect on exactly the devices where it
 * is hardest to notice the regression.
 * ------------------------------------------------------------------------- */

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

    // Nearer motes sweep past faster. That parallax is the whole reason a flat
    // scatter of discs reads as depth rather than as wallpaper.
    float parallax = 1.0 + (origin.z + 9.0) * 0.1;
    origin.y -= (uProgress * 4.0 + uTime * 0.1) * parallax;

    // Wrapped into a repeating slab, so the field never runs dry no matter how
    // far the page scrolls.
    origin.y = mod(origin.y + uSpan * 0.5, uSpan) - uSpan * 0.5;

    // Billboard: offset the quad's corners in view space, after the centre has
    // been transformed, so every disc faces the camera whatever it does.
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

    // An out-of-focus highlight is a disc with a brighter edge, not a gaussian
    // blob — that ring is what makes it read as a lens artefact. The sharper
    // the mote, the more of the ring survives.
    float edge = mix(0.94, 0.0, vBlur);
    float disc = 1.0 - smoothstep(edge, 1.0, dist);
    float ring = (1.0 - vBlur) * smoothstep(0.78, 0.97, dist) * (1.0 - smoothstep(0.97, 1.0, dist));

    vec3 color = mix(uNear, uFar, vTint);
    float alpha = (disc * 0.5 + ring * 0.6) * uOpacity;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`

/* ---------------------------------------------------------------------------
 * Perspective floor
 *
 * A single large plane. The grid is drawn procedurally and antialiased against
 * the screen-space derivative, so it stays one pixel wide at the horizon
 * instead of turning into the moiré a texture would give.
 * ------------------------------------------------------------------------- */

export const GRID_VERTEX = /* glsl */ `
  varying vec2 vPlane;
  varying float vDist;

  void main() {
    // The plane's own coordinates, so the grid does not care how the mesh was
    // rotated into place.
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

  /** Antialiased grid: distance to the nearest line, in pixels. */
  float gridLine(vec2 p, float cell, float thickness) {
    vec2 q = p / cell;
    vec2 d = abs(fract(q - 0.5) - 0.5) / fwidth(q);
    return 1.0 - clamp(min(d.x, d.y) / thickness, 0.0, 1.0);
  }

  void main() {
    // The floor streams toward the viewer, so scrolling reads as travel. Paced to
    // match the cascade — if the floor outruns the debris the two layers read as
    // two unrelated animations.
    vec2 p = vPlane - vec2(0.0, uProgress * 10.0 + uTime * 0.6);

    float fine = gridLine(p, 1.0, 1.6);
    float coarse = gridLine(p, 8.0, 2.2);

    // Two falloffs: one kills the horizon, one keeps the near field hotter than
    // the middle distance so the plane does not read as flat.
    float horizon = 1.0 - smoothstep(14.0, 76.0, vDist);
    float near = 1.0 - smoothstep(0.0, 28.0, vDist);

    vec3 color = mix(uNear, uFar, clamp(vDist / 60.0, 0.0, 1.0));
    float intensity = (fine * 0.32 + coarse * 0.85) * horizon * (0.35 + near * 0.65);

    gl_FragColor = vec4(color, clamp(intensity, 0.0, 1.0) * mix(0.9, 0.3, uTheme));
  }
`

/* ---------------------------------------------------------------------------
 * Vehicle hull
 *
 * The body is a lathed profile, so `uv.x` runs around the circumference and
 * `uv.y` from the base (0) to the tip of the nose (1). Both are used to etch
 * panel lines into the surface instead of relying on a texture.
 * ------------------------------------------------------------------------- */

export const HULL_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorld;

  void main() {
    vUv = uv;

    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - world.xyz);
    vWorld = world.xyz;

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const HULL_FRAGMENT = /* glsl */ `
  precision mediump float;

  // See DUST_FRAGMENT: matches the vertex stage's default highp.
  uniform highp float uTime;
  uniform vec3 uEdge;
  uniform vec3 uGlow;
  uniform float uFade;
  uniform float uTheme;
  /** The horizon, as xyz normal and w constant. Past it is out of this universe. */
  uniform vec4 uClip;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorld;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float iceNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    // The hull is a solid of revolution being pushed through a plane, so the
    // silhouette has to be cut per fragment. Scaling it down instead would read
    // as a model shrinking in front of a picture of a hole.
    if (dot(vWorld, uClip.xyz) + uClip.w < 0.0) discard;

    vec3 normal = normalize(vNormal);
    // Flipped on back faces. The hull is drawn two-sided, and without this the
    // far wall of the tube would be shaded by a normal pointing inward — wrong
    // rim, wrong key, and a silhouette that breaks up depending on the angle.
    if (!gl_FrontFacing) normal = -normal;

    vec3 viewDir = normalize(vViewDir);

    // Ice body: cold cyan glass rather than painted metal. Dark theme keeps a
    // deep freeze core; daylight prints it as tinted crystal on paper.
    vec3 body = mix(vec3(0.04, 0.10, 0.18), vec3(0.12, 0.28, 0.38), vUv.y * 0.55 + 0.2);
    body = mix(body, vec3(0.55, 0.72, 0.82), uTheme);

    // Facet seams — crystalline plates instead of tank rings.
    float seam = 1.0 - smoothstep(0.012, 0.045, abs(fract(vUv.y * 18.0) - 0.5) * 2.0);
    float facet = 1.0 - smoothstep(0.02, 0.08, abs(fract(vUv.x * 24.0 + vUv.y * 3.0) - 0.5) * 2.0);

    // Internal frost and stress cracks. Slow drift so the ice feels alive without
    // looking like a scanline UI effect.
    float frost = iceNoise(vUv * vec2(28.0, 14.0) + vec2(uTime * 0.04, 0.0));
    float crackA = abs(fract(vUv.x * 7.0 + frost * 0.4) - 0.5);
    float crackB = abs(fract(vUv.y * 11.0 - frost * 0.3 + uTime * 0.02) - 0.5);
    float cracks = (1.0 - smoothstep(0.0, 0.035, crackA)) * 0.55
                 + (1.0 - smoothstep(0.0, 0.028, crackB)) * 0.4;

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);

    float form = max(dot(normal, normalize(vec3(-0.45, 0.55, 0.7))), 0.0);
    // Soft internal bounce, so the ice reads as volume rather than shell.
    float subsurface = pow(max(dot(normal, normalize(vec3(0.2, 0.9, 0.3))), 0.0), 1.4);

    vec3 accent = mix(uEdge, uGlow, 0.35 + vUv.y * 0.4);
    vec3 color = body;
    color += accent * form * 0.22;
    color += accent * subsurface * 0.35;
    color += accent * (seam * 0.35 + facet * 0.2);
    color += accent * cracks * 0.7;
    color += mix(uEdge, vec3(0.85, 0.95, 1.0), 0.5) * fresnel * 1.85;
    color += vec3(0.7, 0.9, 1.0) * frost * 0.08;

    // Ice is never fully opaque — the page behind should ghost through a little.
    float alpha = uFade * mix(0.88, 0.72, fresnel * 0.5);

    gl_FragColor = vec4(color, alpha);
  }
`

/* ---------------------------------------------------------------------------
 * Shards
 *
 * One instanced draw call covering the entire sequence. Each shard knows three
 * things: where it sat near the strike, which way it was thrown, and where it
 * belongs in the cascade afterwards. The vertex shader blends between them, so
 * the impact and the column are the same geometry throughout.
 * ------------------------------------------------------------------------- */

export const SHARD_VERTEX = /* glsl */ `
  attribute vec3 aOrigin;
  attribute vec3 aBurst;
  /** x: column radius, y: angle, z: height. */
  attribute vec3 aCascade;
  attribute vec3 aSpin;
  attribute float aScale;
  attribute float aSeed;
  attribute vec3 aBary;

  uniform float uTime;
  uniform float uProgress;
  uniform float uSpan;
  /** 0 before the blast, 1 once it has fully fired. */
  uniform float uIgnite;
  /** 0 while the debris is still flying, 1 once it has joined the cascade. */
  uniform float uSettle;

  /** Cursor position in normalised device coordinates, -1 to 1. */
  uniform vec2 uCursor;
  /** How far a shard at the very centre of the cursor gets shoved, in NDC. */
  uniform float uCursorPush;
  uniform float uAspect;

  varying vec3 vBary;
  varying float vSeed;
  varying float vDepth;

  mat3 rotX(float a) {
    float s = sin(a), c = cos(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }

  mat3 rotY(float a) {
    float s = sin(a), c = cos(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }

  mat3 rotZ(float a) {
    float s = sin(a), c = cos(a);
    return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
  }

  void main() {
    vBary = aBary;
    vSeed = aSeed;

    vec3 origin = aOrigin;
    vec3 burst = aBurst;

    // Thrown outward. Squaring the gate accelerates the debris instead of easing
    // it out, because an impact has no brakes.
    vec3 thrown = origin + burst * uIgnite * uIgnite * 6.0;

    // The cascade: a column falling past the camera. Its radius breathes with
    // height, so the whole thing reads as braided rather than as a tube.
    // Cascade drifts slowly — crystals in cold air, not a fireworks fall.
    float angle = aCascade.y + uTime * 0.035 + uProgress * 0.35;
    float radius = aCascade.x * (1.0 + sin(aCascade.z * 0.28 + uTime * 0.18) * 0.12);
    float height = aCascade.z - (uProgress * 2.2 + uTime * 0.09);
    height = mod(height + uSpan * 0.5, uSpan) - uSpan * 0.5;

    vec3 column = vec3(cos(angle) * radius, height, sin(angle) * radius);

    vec3 centre = mix(thrown, column, uSettle);

    // Violent through the shatter, then lazily spins in the cascade.
    float chaos = uIgnite * (1.0 - uSettle);
    float rate = uTime * (0.22 + chaos * 7.5);
    mat3 spin = rotY(aSpin.y * rate) * rotX(aSpin.x * rate) * rotZ(aSpin.z * rate);

    // Invisible until the strike; grow into the cascade afterward.
    float alive = max(uIgnite, uSettle);
    float scale = aScale * alive * (1.0 + chaos * 0.6) * (1.0 + uSettle * 2.2);

    vec4 viewPosition = modelViewMatrix * vec4(centre + spin * position * scale, 1.0);
    vDepth = -viewPosition.z;
    vec4 clip = projectionMatrix * viewPosition;

    // Cursor repulsion, applied after projection so the region of influence is a
    // circle on screen at every depth. In world space it would be a sphere, and a
    // sphere only ever touches the shards sitting at one particular distance —
    // which is not what a cursor feels like it should do.
    //
    // Guarded on w, because points behind the camera have a negative w and
    // dividing by it would fold them back into view.
    if (clip.w > 0.0) {
      vec2 ndc = clip.xy / clip.w;

      // Corrected for aspect so the falloff stays round on a wide viewport.
      vec2 away = (ndc - uCursor) * vec2(uAspect, 1.0);
      float dist = length(away);
      vec2 direction = away / max(dist, 1e-4);

      // Tight falloff on purpose: a wide one shoves hundreds of shards at once,
      // and the whole screen reacting to a small mouse movement reads as clutter
      // rather than as touch.
      float push = exp(-dist * dist * 10.0) * uCursorPush;
      ndc += direction * push * vec2(1.0 / uAspect, 1.0);

      clip.xy = ndc * clip.w;
    }

    gl_Position = clip;
  }
`

export const SHARD_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec3 uEdge;
  uniform vec3 uFill;
  uniform float uFlash;
  uniform float uOpacity;

  varying vec3 vBary;
  varying float vSeed;
  varying float vDepth;

  void main() {
    // Wireframe from barycentric coordinates. Unlike a wireframe material this
    // keeps a constant width on screen however near or far the shard is, which
    // is what stops the column turning into a solid mat in the distance.
    float edge = min(min(vBary.x, vBary.y), vBary.z);
    float width = fwidth(edge) * 1.35;
    float line = 1.0 - smoothstep(0.0, width, edge);

    // Crystal body: a thin icy fill with a bright rim.
    vec3 ice = mix(uFill, uEdge, 0.35 + vSeed * 0.25);
    vec3 color = mix(ice * 0.55, uEdge, line);

    // Shatter flash washes the crystals white-blue for a moment.
    color += vec3(0.85, 0.95, 1.0) * uFlash;

    float depthFade = 1.0 - smoothstep(6.0, 46.0, vDepth);
    float alpha = (0.08 + line * 0.92) * depthFade * uOpacity;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`

/* ---------------------------------------------------------------------------
 * Blast
 *
 * One camera-facing quad carrying both halves of the explosion: the core flash
 * and the shockwave ring travelling out of it.
 * ------------------------------------------------------------------------- */

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
  /** Brightness of the central flash. */
  uniform float uCore;
  /** Radius of the shockwave, 0 at the centre and 1 at the quad's edge. */
  uniform float uWave;

  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float dist = length(p);
    if (dist > 1.0) discard;

    float angle = atan(p.y, p.x);

    // Faceted shatter ring: polar angle quantised into crystals, so the wave
    // reads as ice breaking rather than as a soft fireball.
    float facets = abs(fract(angle / 6.2831853 * 14.0) - 0.5) * 2.0;
    float crystal = 1.0 - smoothstep(0.0, 0.55, facets);

    float core = exp(-dist * dist * 11.0) * uCore;
    float ring = exp(-pow((dist - uWave) / 0.055, 2.0)) * (1.0 - uWave) * (0.85 + crystal * 0.55);
    float spokes = crystal * exp(-pow((dist - uWave * 0.92) / 0.12, 2.0)) * (1.0 - uWave) * 0.45;

    float amount = core + ring * 0.95 + spokes;
    vec3 ice = mix(uCool, uHot, clamp(core * 1.8 + crystal * 0.35, 0.0, 1.0));
    ice += vec3(0.85, 0.95, 1.0) * core * 0.5;

    gl_FragColor = vec4(ice, clamp(amount, 0.0, 1.0));
  }
`

/* ---------------------------------------------------------------------------
 * Tower lattice
 *
 * Wireframe + nodes with a soft vertical falloff so a viewport-filling geogram
 * can run past the lens without a hard black crop at the tips.
 * ------------------------------------------------------------------------- */

export const TOWER_LINE_VERTEX = /* glsl */ `
  uniform float uHalfH;

  varying float vFade;

  void main() {
    // Geometry is built downward from y = 0; after centering, |y| / halfH → tip.
    float along = abs(position.y) / max(uHalfH, 0.001);
    vFade = 1.0 - smoothstep(0.62, 1.02, along);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const TOWER_LINE_FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vFade;

  void main() {
    float alpha = uOpacity * vFade;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export const TOWER_POINT_VERTEX = /* glsl */ `
  uniform float uHalfH;
  uniform float uSize;

  varying float vFade;

  void main() {
    float along = abs(position.y) / max(uHalfH, 0.001);
    vFade = 1.0 - smoothstep(0.62, 1.02, along);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (180.0 / -mv.z);
  }
`

export const TOWER_POINT_FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vFade;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float disc = 1.0 - smoothstep(0.32, 0.5, length(p));
    float alpha = uOpacity * vFade * disc;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

/* ---------------------------------------------------------------------------
 * Engine plume
 *
 * The cone is rotated apex-down, so `uv.y` is 0 at the throat and 1 at the tip.
 * ------------------------------------------------------------------------- */

export const PLUME_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;

  void main() {
    vUv = uv;

    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const PLUME_FRAGMENT = /* glsl */ `
  precision mediump float;

  // See DUST_FRAGMENT: matches the vertex stage's default highp.
  uniform highp float uTime;
  uniform float uThrust;
  uniform vec3 uHot;
  uniform vec3 uCool;
  uniform vec4 uClip;

  varying vec2 vUv;
  varying vec3 vWorld;

  void main() {
    if (dot(vWorld, uClip.xyz) + uClip.w < 0.0) discard;

    float along = clamp(vUv.y, 0.0, 1.0);
    float radial = abs(vUv.x - 0.5) * 2.0;

    // Cold exhaust: a soft ionic shimmer, not combustion flicker.
    float shimmer = 0.9 + 0.06 * sin(uTime * 11.0 + along * 8.0)
                          + 0.04 * sin(uTime * 19.0 + radial * 6.0);

    float ribbons = 0.5 + 0.5 * sin(along * 22.0 - uTime * 1.4 + radial * 3.0);
    float vein = ribbons * exp(-along * 2.8) * (1.0 - radial);

    float core = (1.0 - along) * shimmer;
    float edge = 1.0 - smoothstep(0.02, 0.7, radial);

    vec3 color = mix(uHot, uCool, along * 0.85);
    color += vec3(0.75, 0.92, 1.0) * vein * 0.55;

    float alpha = (core * edge * 0.85 + vein * edge * 0.5) * uThrust;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`

/* ---------------------------------------------------------------------------
 * Ice rift
 *
 * Same three-piece layout as before (occluding core, tilted ring, billboarded
 * bloom), but the look is a fracture in frozen glass rather than a black hole:
 * angular crystal bands, radial stress cracks, and a frost halo.
 * ------------------------------------------------------------------------- */

export const DISC_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const DISC_NOISE = /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(cell);
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float sum = 0.0;
    float amplitude = 0.5;

    for (int octave = 0; octave < 4; octave += 1) {
      sum += valueNoise(p) * amplitude;
      p *= 2.07;
      amplitude *= 0.5;
    }

    return sum;
  }
`

export const ACCRETION_FRAGMENT = /* glsl */ `
  // High precision throughout: the disc is built on a sine-based hash, and at
  // mediump the hash quantises into visible cells.
  precision highp float;

  uniform float uTime;
  /** Brightness gate, 0 closed → 1 fully lit. */
  uniform float uOpen;
  /** Disturbance as something crosses the horizon, 0 → 1. */
  uniform float uFlash;
  /** Inner edge of the annulus, as a fraction of its outer edge. */
  uniform float uInner;
  uniform vec3 uEdge;
  uniform vec3 uGlow;
  uniform float uTheme;

  varying vec2 vUv;

  ${DISC_NOISE}

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if (r > 1.0 || r < uInner * 0.96) discard;

    float angle = atan(p.y, p.x);

    // Slow crystal drift — frozen, not orbiting like an accretion disk.
    float grain = fbm(p * 6.5 + vec2(uTime * 0.03, -uTime * 0.02));

    // Faceted rings: polar angle snapped into crystal plates.
    float facets = abs(fract(angle / 6.2831853 * 11.0 + grain * 0.2) - 0.5) * 2.0;
    float plate = 1.0 - smoothstep(0.15, 0.7, facets);

    // Radial stress cracks from the rift lip outward.
    float rays = abs(fract(angle / 6.2831853 * 7.0) - 0.5) * 2.0;
    float crack = (1.0 - smoothstep(0.0, 0.12, rays)) * smoothstep(uInner, uInner + 0.25, r);

    float band =
      smoothstep(uInner, uInner + 0.06, r) * (1.0 - smoothstep(uInner + 0.2, 1.0, r));

    float lip = exp(-pow((r - uInner * 1.02) / 0.04, 2.0));

    float amount = band * (0.18 + grain * 0.55 + plate * 0.45) + lip * 0.9 + crack * 0.55;
    amount = amount * uOpen + uFlash * band * 0.65;
    if (amount < 0.002) discard;

    vec3 color = mix(uEdge, vec3(0.82, 0.94, 1.0), clamp(grain * 0.6 + lip * 0.5, 0.0, 1.0));
    color = mix(color, uGlow, plate * 0.25);
    color += vec3(1.0) * (lip * 0.35 + uFlash * 0.55);

    gl_FragColor = vec4(color, clamp(amount, 0.0, 1.0) * mix(1.0, 0.5, uTheme));
  }
`

export const HALO_FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform float uOpen;
  uniform float uFlash;
  /** Radius of the horizon's silhouette, as a fraction of the quad. */
  uniform float uCore;
  uniform vec3 uEdge;
  uniform float uTheme;

  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if (r > 1.0) discard;

    float angle = atan(p.y, p.x);
    float facets = abs(fract(angle / 6.2831853 * 10.0) - 0.5) * 2.0;
    float frost = 1.0 - smoothstep(0.0, 0.65, facets);

    // Soft frost bloom around the rift, with a hint of crystal spokes.
    float grazing = exp(-pow((r - uCore) / 0.1, 2.0)) * (0.4 + frost * 0.25);
    float bloom = exp(-pow((r - uCore) / 0.48, 2.0)) * 0.14;

    float amount = (grazing + bloom) * uOpen + uFlash * exp(-r * r * 3.5) * 0.75;
    if (amount < 0.002) discard;

    vec3 color = mix(uEdge, vec3(0.88, 0.96, 1.0), 0.45) + vec3(1.0) * uFlash * 0.55;

    gl_FragColor = vec4(color, clamp(amount, 0.0, 1.0) * mix(1.0, 0.45, uTheme));
  }
`
