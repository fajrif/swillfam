/**
 * GlassRefractionBackground fragment shader — a huge volumetric red light seen
 * through vertical ribbed glass, keyframed on /glass-refraction-banner.png.
 *
 * At t = 0 the frame reproduces the reference composition: a near-black purple
 * field, a wide red dome ("amplitude curve") cresting left of centre and
 * sinking away to the lower right, a magenta rim tracing its contour with a
 * violet halo wrapping just outside it, and ~28 full-height translucent glass
 * slats laid over the whole thing. Each slat is a thin cylindrical lens: it
 * displaces the light behind it by a couple of device pixels, shades its own
 * body dark-to-bright across its width, and throws a soft purple highlight.
 *
 * The light itself barely moves — the *glass* is what animates. Every slat gets
 * its own phase, speed, amplitude and start delay, so the dome contour behind
 * the fins rises and falls like a very slow audio spectrum rather than a single
 * recognisable sine. Motion is deliberately subtle: at the default amplitude a
 * slat travels ~3.5% of the frame height.
 *
 * Built as isolated layers (background ramp -> dome contour -> volumetric light
 * -> per-slat motion -> refraction -> glass body -> highlight -> grain +
 * vignette), each in its own helper below. One octave of value noise, no FBM,
 * no raymarching, no loops.
 */
export const glassRefractionFragment = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

// -- uniforms ----------------------------------------------------------------
uniform vec2 iResolution;        // drawing buffer size in device px
uniform float iTime;             // seconds since mount (unscaled)
uniform float uOpacity;          // output alpha
uniform float uSpeed;            // global motion speed multiplier
uniform float uSlatCount;        // number of vertical glass slats
uniform float uRefraction;       // per-slat UV displacement, device px
uniform float uAmplitude;        // per-slat breathing, fraction of frame height
uniform float uBlur;             // slat edge softness (1 dissolves the ribs)
uniform float uHighlight;        // per-slat purple highlight strength
uniform float uEdgeLight;        // specular seam brightness at each rib edge
uniform float uGrain;            // film grain amount
uniform float uGlow;             // volumetric light intensity
uniform float uDomeCenter;       // x of the dome crest (0 = left, 1 = right)
uniform float uDomeHeight;       // image-space y of the dome crest (0 = top)
uniform vec3 uBgColors[3];       // background ramp, top -> bottom
uniform vec3 uRedColors[3];      // dome core, rim-inward -> deep
uniform vec3 uPurpleColors[3];   // halo, deep -> mid -> bright (bright sits at the rim)
uniform vec3 uMagentaColors[2];  // contour rim, outer -> inner
uniform vec3 uHighlightColor;    // brightest point of the per-slat highlight
uniform vec2 uMouse;             // container-normalised mouse (uv space)
uniform float uMouseInteractive; // 1.0 enables the parallax term

const float TAU = 6.28318530718;
const float HALF_PI = 1.57079632679;

// -- dome shape --------------------------------------------------------------
// Half-width of the arch in uv-x. Wider than the frame so the crest reads as
// one continuous sweep rather than a bump with two visible feet.
const float DOME_WIDTH = 1.15;
// How far the contour sinks between the crest and the edge of DOME_WIDTH.
// 1.05 pushes the right-hand end just off the bottom of the frame, matching the
// reference's fade to black in the lower right.
const float DOME_FALL = 1.05;
// Shoulder sharpness of the arch. 1.0 is a plain raised cosine; 1.6 flattens
// the crest and steepens the descent, which is what the reference does.
const float DOME_POW = 1.6;

// -- light falloffs (all in uv-y, i.e. fractions of frame height) ------------
const float RED_SIGMA = 0.42;     // how deep into the dome the red stays lit
const float RIM_SIGMA = 0.07;     // magenta band half-width at the contour
const float HALO_SIGMA = 0.13;    // violet halo reach outside the contour
const float HIGHLIGHT_SIGMA = 0.16; // per-slat highlight spread

// -- motion ------------------------------------------------------------------
// The three breathing frequencies. Deliberately incommensurate so the summed
// waveform never repeats within a viewing session and reads as organic drift.
const vec3 BREATH_FREQ = vec3(0.63, 0.41, 0.27);
const vec3 BREATH_WEIGHT = vec3(0.55, 0.30, 0.15);
// Largest start delay, in seconds, a slat can draw. Staggering the delays is
// what stops the field from pulsing in unison on the first cycle.
const float MAX_DELAY = 4.0;

// -- hashes / value noise (used for POSITIONS only, never for colour) --------
float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

// Single-octave value noise — the only noise the shader needs.
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// -- Layer 1: background ------------------------------------------------------
// Vertical three-stop ramp through the near-black purples, then a horizontal
// multiply so the right-hand third falls away to black as it does in the
// reference. \`p\` is image-space (y = 0 at the top).
vec3 backgroundLayer(vec2 p) {
  vec3 col = mix(uBgColors[0], uBgColors[1], smoothstep(0.0, 0.5, p.y));
  col = mix(col, uBgColors[2], smoothstep(0.5, 1.0, p.y));
  return col * mix(1.0, 0.45, smoothstep(0.55, 1.0, p.x));
}

// -- Layer 2: the dome contour ------------------------------------------------
// Image-space y of the top of the red light at horizontal position x — the
// "amplitude curve" everything else is measured against. A raised cosine
// clamped to DOME_WIDTH, so outside that span the contour simply rests at its
// lowest point instead of curving back up.
float domeCrest(float x) {
  float k = clamp((x - uDomeCenter) / DOME_WIDTH, -1.0, 1.0);
  float arch = pow(max(cos(k * HALF_PI), 0.0), DOME_POW);
  return uDomeHeight + (1.0 - arch) * DOME_FALL;
}

// -- Layer 3: volumetric light ------------------------------------------------
// Everything keys off \`s\`, the signed distance below the contour: s > 0 is
// inside the dome, s < 0 is the sky above it. Each band is a gaussian in s so
// the transitions are C-infinity — no stops, no banding — and the three are
// summed *emissively* rather than mixed, so the result reads as light rather
// than as paint. Red dies off toward the right much faster than the violet,
// which is why the reference's right edge goes blue-purple before it goes black.
vec3 volumetricLight(float s, vec2 p) {
  float inside = max(s, 0.0);
  float outside = max(-s, 0.0);

  // Core: brightest just under the rim, deepening with depth, and dimmed
  // toward the bottom of the frame where the reference sinks into black.
  vec3 red = mix(uRedColors[0], uRedColors[1], smoothstep(0.0, 0.22, inside));
  red = mix(red, uRedColors[2], smoothstep(0.22, 0.55, inside));
  float redFall = exp(-(inside * inside) / (RED_SIGMA * RED_SIGMA));
  redFall *= 1.0 - 0.85 * smoothstep(0.55, 1.0, p.y);
  red *= redFall * mix(1.05, 0.18, smoothstep(0.35, 0.92, p.x));

  // Rim: a tight magenta band straddling the contour itself.
  vec3 magenta = mix(uMagentaColors[0], uMagentaColors[1], smoothstep(-0.05, 0.05, s));
  float rim = exp(-(s * s) / (RIM_SIGMA * RIM_SIGMA));
  magenta *= rim * mix(1.0, 0.30, smoothstep(0.5, 1.0, p.x));

  // Halo: broad violet wrap, brightest against the rim and cooling outward.
  vec3 purple = mix(uPurpleColors[2], uPurpleColors[1], smoothstep(0.0, 0.08, outside));
  purple = mix(purple, uPurpleColors[0], smoothstep(0.08, 0.20, outside));
  float halo = exp(-(outside * outside) / (HALO_SIGMA * HALO_SIGMA));
  purple *= halo * mix(1.0, 0.35, smoothstep(0.55, 1.05, p.x));

  return (red * 1.15 + magenta * 0.85 + purple * 0.75) * uGlow;
}

// -- Layer 4: per-slat breathing ----------------------------------------------
// Three incommensurate cosines, each carrying this slat's own phase, plus a
// slow value-noise drift to break the residual periodicity of the sum. The
// slat's speed, amplitude and start delay are all drawn from its index, so no
// two fins ever move together. Returns a vertical offset in uv-y.
float slatBreath(float slat, float t) {
  float a = hash11(slat + 1.73);
  float b = hash11(slat + 9.31);
  float c = hash11(slat + 23.17);

  float tt = (t - c * MAX_DELAY) * mix(0.55, 1.45, b);
  vec3 phase = vec3(a, b, c) * TAU;
  vec3 wave = cos(BREATH_FREQ * tt + phase);
  float w = dot(wave, BREATH_WEIGHT);

  // Organic drift — keeps the field from settling into a readable rhythm.
  w += (vnoise(vec2(slat * 0.37, t * 0.11)) - 0.5) * 0.6;

  return w * mix(0.35, 1.0, a) * uAmplitude;
}

// -- Layer 5: refraction ------------------------------------------------------
// Each slat is a thin cylindrical lens, so the displacement runs from one edge
// of the rib to the other and eases back to zero at both seams — continuous
// across the boundary, which keeps the 1-4px offset from aliasing into a hard
// line. \`f\` is the position across the rib (0..1). uBlur widens the eased
// shoulders; at 1.0 the lens flattens out and the refraction disappears.
// Returns a uv-space offset.
vec2 slatRefract(float f, float scale) {
  float lens = f * 2.0 - 1.0;
  float bend = lens * (1.0 - 0.35 * lens * lens);
  float shoulder = clamp(uBlur, 0.02, 1.0);
  // Both smoothsteps are written low-edge-first: GLSL leaves edge0 >= edge1
  // undefined, so the trailing shoulder is inverted rather than reversed.
  bend *= smoothstep(0.0, shoulder, f) * (1.0 - smoothstep(1.0 - shoulder, 1.0, f));

  float px = bend * uRefraction * scale;
  // A touch of vertical bend too — pure horizontal displacement reads as a
  // smear rather than as glass. Each axis is divided by its own resolution so
  // uRefraction stays honest in device px at any aspect ratio.
  return vec2(px / max(iResolution.x, 1.0), px * 0.35 / max(iResolution.y, 1.0));
}

// -- Layer 6: glass body ------------------------------------------------------
// Brightness profile across one rib, taken from the ribbed-glass reference: a
// bright left shoulder, darkest around 69% of the way across, then a specular
// seam at the right edge. The repeating light/dark/light cadence — and the
// reset at each boundary — is what reads as bevelled vertical glass instead of
// flat stripes. \`luma\` is the slat's own static depth.
float slatShade(float f, float luma) {
  float dip = mix(1.06, 0.84, smoothstep(0.0, 0.69, f));
  float edge = smoothstep(0.69, 1.0, f);
  return mix(dip, 1.0 + uEdgeLight, edge * edge) * luma;
}

// -- Layer 8: vignette --------------------------------------------------------
// Corners a touch darker. Very subtle.
float vignette(vec2 uv) {
  float d = length(uv - 0.5);
  return 1.0 - smoothstep(0.45, 0.85, d) * 0.18;
}

void main() {
  vec2 uv = vUv;
  // Gentle parallax when mouse interaction is enabled.
  uv += (uMouse - 0.5) * 0.03 * uMouseInteractive;

  // Image-space coordinates: y = 0 at the top, matching the reference analysis.
  vec2 p = vec2(uv.x, 1.0 - uv.y);

  // All motion scales with uSpeed; speed 0 freezes the keyframe (grain excluded).
  float t = iTime * uSpeed;

  // Which slat this fragment falls in, and where across it.
  float sx = p.x * uSlatCount;
  float slat = floor(sx);
  float f = sx - slat;

  // Per-slat character — every draw uses a different offset so the traits are
  // uncorrelated with each other.
  float refractScale = mix(0.35, 1.0, hash11(slat + 41.37));
  float luma = mix(0.94, 1.06, hash11(slat + 77.11));
  float tint = mix(0.7, 1.3, hash11(slat + 5.29));

  // The glass displaces what's behind it, and the whole fin breathes vertically.
  float breath = slatBreath(slat, t);
  vec2 sp = p + slatRefract(f, refractScale);
  sp.y += breath;

  // Compose: background, then the light sampled through the glass.
  vec3 col = backgroundLayer(sp);
  col += volumetricLight(sp.y - domeCrest(sp.x), sp);

  // Layer 6: the glass body itself.
  col *= slatShade(f, luma);

  // Layer 7: soft purple highlight riding this slat's current contour position.
  // Pure gaussian, so it can never produce a hard edge, and it follows the
  // motion by construction.
  float hy = domeCrest(p.x) + breath;
  float d = (p.y - hy) / HIGHLIGHT_SIGMA;
  float hl = exp(-d * d);
  // Squared envelope: only the few fragments sitting right on the contour reach
  // the near-white tip, so the rim stays hot pink instead of blowing out.
  col += mix(uPurpleColors[1], uHighlightColor, hl * hl) * hl * hl * uHighlight * tint;

  // Layer 8: grain (independent of uSpeed, so a frozen frame still breathes)
  // and vignette.
  col += (hash21(gl_FragCoord.xy + fract(iTime * 0.37) * 511.0) - 0.5) * uGrain;
  col *= vignette(uv);

  fragColor = vec4(max(col, vec3(0.0)), uOpacity);
}
`;
