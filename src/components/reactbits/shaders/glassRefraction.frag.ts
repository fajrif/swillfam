/**
 * GlassRefractionBackground fragment shader — a huge volumetric light seen
 * through vertical ribbed glass, keyframed on /glass-refraction-banner.png.
 *
 * At t = 0 the frame reproduces the reference composition: a near-black field,
 * a wide arch cresting left of centre and sinking away to the lower right, and
 * ~28 full-height translucent glass slats laid over the whole thing. Each slat
 * is a thin cylindrical lens: it displaces the light behind it by a couple of
 * device pixels, shades its own body dark-to-bright across its width, and
 * throws a soft highlight.
 *
 * COLOUR — every stop below was sampled off the reference rather than taken
 * from a spec, and the reference turns out to be a *single* ramp rather than
 * three separable lights. Walking the normal outward-to-inward across the
 * contour gives dark purple -> violet -> magenta (the brightest point in the
 * whole image, #A400B0) -> pink -> crimson -> near-black. Green is 0-8 over the
 * entire frame and nothing ever approaches white, so the ramp is modelled as
 * one monotone interpolation keyed on distance from the contour. That also
 * makes the light physically consistent by construction: there is exactly one
 * value at each distance, so no band can leak onto the wrong side.
 *
 * The light itself barely moves — the *glass* is what animates. Every slat gets
 * its own phase, speed, amplitude and start delay, so the contour behind the
 * fins rises and falls like a very slow audio spectrum rather than a single
 * recognisable sine.
 *
 * Built as isolated layers (background -> contour -> light ramp -> per-slat
 * motion -> refraction -> glass body -> highlight -> grain + vignette), each in
 * its own helper below. One octave of value noise, no FBM, no raymarching, no
 * loops.
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
uniform float uHighlight;        // per-slat highlight strength
uniform float uEdgeLight;        // specular seam brightness at each rib edge
uniform float uGrain;            // film grain amount
uniform float uGlow;             // light intensity
uniform float uDomeCenter;       // x of the arch crest (0 = left, 1 = right)
uniform float uDomeHeight;       // image-space y of the arch crest (0 = top)
uniform vec3 uBgColors[3];       // background ramp, top -> bottom
uniform vec3 uPurpleColors[3];   // ramp outside the contour, far -> near
uniform vec3 uMagentaColors[2];  // ramp at the contour, outer -> inner
uniform vec3 uRedColors[3];      // ramp inside the contour, near -> deep
uniform vec3 uHighlightColor;    // per-slat highlight tint
uniform vec2 uMouse;             // container-normalised mouse (uv space)
uniform float uMouseInteractive; // 1.0 enables the parallax term

const float TAU = 6.28318530718;
const float HALF_PI = 1.57079632679;

// -- arch shape --------------------------------------------------------------
// Half-width of the arch in uv-x. Wider than the frame so the crest reads as
// one continuous sweep rather than a bump with two visible feet.
const float DOME_WIDTH = 0.95;
// How far the contour sinks between the crest and the edge of DOME_WIDTH.
// Fitted by least-squares against the reference's brightest-pixel-per-column
// trace, which runs y = 0.33 at x = 0, 0.22 at the crest (x ~ 0.27), 0.43 at
// x = 0.64 and 0.85 at x = 1. Width and fall are coupled — widening one
// without shortening the other flattens the descent and the arc stops
// matching past x ~ 0.6.
const float DOME_FALL = 0.78;
// Shoulder sharpness. 1.0 is a plain raised cosine; 1.6 flattens the crest and
// steepens the descent, which is what the trace shows.
const float DOME_POW = 1.6;
// Half-width of the central difference used to measure the arch's local slope.
const float SLOPE_EPS = 0.01;

// -- light ramp stops --------------------------------------------------------
// Perpendicular distance from the contour, in fractions of frame height.
// Negative is outside (above) the light, positive is inside it. Each stop is
// the measured position of its colour along a vertical cut through the
// reference at x = 0.02, converted to distance from the contour there.
const float S_P0 = -0.272;  // deep outer purple
const float S_P1 = -0.172;  // mid violet
const float S_P2 = -0.085;  // bright violet, just clear of the rim
const float S_M0 = -0.022;  // the contour itself — brightest point in the frame
const float S_M1 = 0.028;   // inner magenta
const float S_R0 = 0.078;   // pink
const float S_R1 = 0.178;   // crimson
const float S_R2 = 0.328;   // deep red

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
// Near-black throughout. In the reference every trace of colour in the "sky"
// belongs to the light's own outer tail, not to the backdrop — the top-right
// corner, far from the arch, is pure #000000 — so this stays a plain vertical
// ramp from black to the faint neutral floor the bottom edge settles on.
vec3 backgroundLayer(vec2 p) {
  vec3 col = mix(uBgColors[0], uBgColors[1], smoothstep(0.0, 0.55, p.y));
  return mix(col, uBgColors[2], smoothstep(0.55, 1.0, p.y));
}

// -- Layer 2: the arch contour ------------------------------------------------
// Image-space y of the crest of the light at horizontal position x — the
// "amplitude curve" everything else is measured against. A raised cosine
// clamped to DOME_WIDTH, so outside that span the contour rests at its lowest
// point instead of curving back up.
float domeCrest(float x) {
  float k = clamp((x - uDomeCenter) / DOME_WIDTH, -1.0, 1.0);
  float arch = pow(max(cos(k * HALF_PI), 0.0), DOME_POW);
  return uDomeHeight + (1.0 - arch) * DOME_FALL;
}

// Signed perpendicular distance from the contour at \`p\`. Plain vertical
// distance would overstate the gap wherever the arch is steep; dividing by the
// local gradient is what compresses the colour bands toward the right of the
// frame, exactly as the reference does.
float contourDistance(vec2 p) {
  float slope = (domeCrest(p.x + SLOPE_EPS) - domeCrest(p.x - SLOPE_EPS)) / (2.0 * SLOPE_EPS);
  return (p.y - domeCrest(p.x)) / sqrt(1.0 + slope * slope);
}

// -- Layer 3: the light -------------------------------------------------------
// One monotone ramp across the contour: outer purple -> violet -> magenta at
// the rim -> pink -> crimson -> deep red. Chained smoothsteps, each saturating
// before the next begins, give a C1-continuous curve with no visible stops and
// no banding. Both ends fade to black so the light never tints the far
// background — which is why this can simply be added to it.
vec3 lightRamp(float s) {
  vec3 c = uPurpleColors[0];
  c = mix(c, uPurpleColors[1], smoothstep(S_P0, S_P1, s));
  c = mix(c, uPurpleColors[2], smoothstep(S_P1, S_P2, s));
  c = mix(c, uMagentaColors[0], smoothstep(S_P2, S_M0, s));
  c = mix(c, uMagentaColors[1], smoothstep(S_M0, S_M1, s));
  c = mix(c, uRedColors[0], smoothstep(S_M1, S_R0, s));
  c = mix(c, uRedColors[1], smoothstep(S_R0, S_R1, s));
  c = mix(c, uRedColors[2], smoothstep(S_R1, S_R2, s));
  // Tail fades, fitted to the same cut: the outer tail is gone by ~0.46 above
  // the contour, the inner one decays much further before reaching the black
  // floor at the bottom of the frame.
  c *= 1.0 - smoothstep(0.24, 0.46, max(-s, 0.0));
  c *= 1.0 - smoothstep(0.30, 0.62, max(s, 0.0));
  return c;
}

// The reference holds roughly full intensity across the left two thirds and
// then falls to about 55% at the right edge. Starting the falloff late matters:
// the arc is still descending through the right of the frame, and cutting it
// sooner blacks out the bottom-right corner, which the reference does not do.
vec3 volumetricLight(float s, vec2 p) {
  return lightRamp(s) * mix(1.0, 0.55, smoothstep(0.65, 1.0, p.x)) * uGlow;
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
// flat stripes. Kept gentle; in the reference the fins modulate the light
// rather than striping it. \`luma\` is the slat's own static depth.
float slatShade(float f, float luma) {
  float dip = mix(1.04, 0.88, smoothstep(0.0, 0.69, f));
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
  col += volumetricLight(contourDistance(sp), sp);

  // Layer 6: the glass body itself.
  col *= slatShade(f, luma);

  // Layer 7: soft highlight riding this slat's current contour position. Pure
  // gaussian, so it can never produce a hard edge, and it follows the motion by
  // construction. The squared envelope keeps it to the rim — the ramp above
  // already carries most of the contour's brightness.
  float hy = domeCrest(p.x) + breath;
  float d = (p.y - hy) / HIGHLIGHT_SIGMA;
  float hl = exp(-d * d);
  col += uHighlightColor * hl * hl * uHighlight * tint;

  // Layer 8: grain (independent of uSpeed, so a frozen frame still breathes)
  // and vignette.
  col += (hash21(gl_FragCoord.xy + fract(iTime * 0.37) * 511.0) - 0.5) * uGrain;
  col *= vignette(uv);

  fragColor = vec4(max(col, vec3(0.0)), uOpacity);
}
`;
