/**
 * GradientBandsBackground fragment shader — stacked soft horizontal gradient
 * bands, keyframed on /public/articles/banner.png.
 *
 * At t = 0 the frame reproduces the banner's composition: a vertical palette
 * ramp quantised into ~16 tilted bands with soft edges, brighter on the left
 * with one broad luminous glow in the lower-left, and a gentle vignette. Over
 * time each band's internal horizontal gradient drifts independently (direction,
 * speed, and phase derived from the band index) so the colours flow *through*
 * each ribbon, and the glow travels horizontally back and forth along the bright
 * band region — the still keyframe brought to life while its composition holds.
 *
 * Built as isolated layers (background ramp → bands → motion → warp → soft
 * blending → luminosity + travelling glow → vignette), each in its own helper
 * below. One octave of value noise, no FBM, no raymarching, no branches in hot
 * paths.
 */
export const gradientBandsFragment = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

// -- uniforms ----------------------------------------------------------------
uniform vec2 iResolution;       // drawing buffer size in device px
uniform float iTime;            // seconds since mount (unscaled)
uniform float uOpacity;         // output alpha
uniform float uSpeed;           // global motion speed multiplier
uniform float uBandCount;       // number of horizontal bands
uniform float uSweep;           // travelling-glow intensity (0 disables it)
uniform float uWarpStrength;    // vertical domain warp; 0.04 ~= 4 device px
uniform float uBlur;            // band edge softness, fraction of band height
uniform vec3 uColors[10];       // palette, top -> bottom
uniform float uStops[10];       // palette stop positions (image-space y, 0..1)
uniform float uColorCount;      // how many palette entries are populated
uniform vec2 uMouse;            // container-normalised mouse (uv space)
uniform float uMouseInteractive;// 1.0 enables the parallax term

const float TAU = 6.28318530718;

// Downward-right slope of the band edges, in uv-y per uv-x across the full
// width. Measured from the reference keyframe (~45px drop over 1260px at
// 1440x715 — almost exactly one band height across the frame).
const float BAND_TILT = 0.072;

// How far a band's internal horizontal gradient may pull the sampled colour
// toward its neighbours, as a fraction of the band spacing (1/uBandCount).
// Kept under ~0.35 — larger values visually exaggerate the tilt into a diagonal.
const float RIBBON_AMP_BANDS = 0.28;

// Phase velocity of the ribbon gradients (curve-domain units per second at
// speed = 1). High enough that the colour flow is visible within a couple of
// seconds at the default speed, while still reading as calm.
const float RIBBON_DRIFT = 0.9;

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

// -- Layer 1+2: artist-directed keyframe ramp --------------------------------
// Piecewise interpolation through the extracted palette at hand-placed stop
// positions. \`t\` is image-space y (0 = top). Each chained smoothstep saturates
// before the next segment begins, giving a C1-continuous ramp with no visible
// stops. Sampling outside [0,1] clamps to the first/last colour.
vec3 keyframeRamp(float t) {
  vec3 col = uColors[0];
  for (int i = 1; i < 10; i++) {
    if (float(i) >= uColorCount) break;
    col = mix(col, uColors[i], smoothstep(uStops[i - 1], uStops[i], t));
  }
  return col;
}

// -- Layer 3: independent per-band motion ------------------------------------
// Every band derives its own direction, speed, phase, and gradient span from
// its index, so no two bands animate identically. The returned value shifts
// where on the ramp the band samples — a wide two-cosine curve (4-6 large
// colour regions across the width) whose domain slides slowly with time, so
// colours flow through the ribbon rather than the band itself moving.
float ribbonShift(float band, float x, float t) {
  float s1 = hash11(band + 13.73);
  float s2 = hash11(band + 41.37);
  float s3 = hash11(band + 77.11);
  float direction = sign(s1 - 0.5);
  float speedScale = mix(0.6, 1.4, s2);
  float xx = x * mix(0.7, 1.3, s3) + t * direction * speedScale * RIBBON_DRIFT;
  float curve = 0.62 * cos(xx * TAU * 0.50 + s1 * TAU)
              + 0.38 * cos(xx * TAU * 0.23 + s2 * TAU);
  return curve * RIBBON_AMP_BANDS / uBandCount;
}

// -- Layer 6a: per-band depth ------------------------------------------------
// Some bands sit slightly brighter, some slightly darker — static per band.
float bandLuma(float band) {
  return mix(0.97, 1.04, hash11(band + 3.31));
}

// Colour of one band at horizontal position x: the keyframe ramp sampled at
// the band centre, pulled along by the band's own drifting internal gradient.
vec3 bandColor(float band, float x, float t) {
  float center = (band + 0.5) / uBandCount;
  return keyframeRamp(center + ribbonShift(band, x, t)) * bandLuma(band);
}

// -- Layer 5: soft band blending ---------------------------------------------
// Quantise the ramp into bands, blending each band into the next with a
// smoothstep centred on the shared edge. uBlur is the fraction of the band
// height the transition occupies (1.0 dissolves the bands entirely).
vec3 bandsLayer(vec2 p, float t) {
  float bandPos = p.y * uBandCount - 0.5;
  float band = floor(bandPos);
  float f = bandPos - band;
  float halfEdge = clamp(uBlur, 0.02, 1.0) * 0.5;
  float blend = smoothstep(0.5 - halfEdge, 0.5 + halfEdge, f);
  vec3 a = bandColor(band, p.x, t);
  vec3 b = bandColor(band + 1.0, p.x, t);
  return mix(a, b, blend);
}

// -- Layer 4: domain warp (positions only) -----------------------------------
// One octave of very low-frequency noise nudges the band edges vertically so
// they never read as mechanical straight lines. Amplitude is expressed in
// device pixels: uWarpStrength * 100 (default 0.04 -> ~4px), drifting slowly.
float domainWarp(vec2 p, float t) {
  float n = vnoise(vec2(p.x * 1.8, p.y * 2.2) + vec2(t * 0.03, t * 0.021));
  return (n - 0.5) * (uWarpStrength * 100.0) / max(iResolution.y, 1.0);
}

// -- Layer 6b: travelling-glow centre ----------------------------------------
// Horizontal centre of the luminous highlight, easing back and forth across the
// frame. A primary raised-cosine sweeps [~0.06, ~0.9] of the width; a slow
// secondary wobble at an incommensurate frequency keeps the reversal from
// reading as a mechanical sine loop. Phased so at t = 0 the centre sits at the
// lower-left (~0.06), matching the keyframe's bright patch. \`t\` is iTime*uSpeed,
// so at the default speed one left->right->left cycle takes ~30s.
float sweepCenter(float t) {
  float primary = 0.5 - 0.5 * cos(t * 1.7);     // 0..1 eased traversal
  float wobble = 0.05 * sin(t * 0.9);           // organic, breaks the loop
  return mix(0.06, 0.9, primary) + wobble;
}

// -- Layer 6c: luminosity + travelling glow ----------------------------------
// The keyframe is brighter on the left and darker on the right; on top of that
// grade a real luminous glow travels along the bright band region. The glow is
// core + halo (two gaussians) for a soft bloom that bleeds gently across a
// couple of neighbouring bands, added *emissively* toward a warm near-white
// tint so it reads as light rather than a flat colour mix.
vec3 luminosity(vec3 col, vec2 p, float t) {
  col *= mix(1.05, 0.93, p.x);

  float cx = sweepCenter(t);
  // Tight bright core.
  vec2 dCore = (p - vec2(cx, 0.72)) / vec2(0.16, 0.11);
  // Wider soft halo — larger sigmas, vertically broader so it blooms over bands.
  vec2 dHalo = (p - vec2(cx, 0.72)) / vec2(0.34, 0.22);
  float glow = 0.5 * exp(-dot(dCore, dCore)) + 0.35 * exp(-dot(dHalo, dHalo));

  // Warm soft-pink tint (kept off pure white so the core reads as a pink glow
  // rather than a blown-out hotspot).
  vec3 glowTint = vec3(0.98, 0.82, 0.92);
  return col + glowTint * glow * uSweep;
}

// -- Layer 7: vignette ---------------------------------------------------------
// Corners a touch darker. Very subtle.
float vignette(vec2 uv) {
  float d = length(uv - 0.5);
  return 1.0 - smoothstep(0.45, 0.85, d) * 0.16;
}

void main() {
  vec2 uv = vUv;
  // Gentle parallax when mouse interaction is enabled.
  uv += (uMouse - 0.5) * 0.03 * uMouseInteractive;

  // Image-space coordinates: y = 0 at the top, matching the keyframe analysis.
  vec2 p = vec2(uv.x, 1.0 - uv.y);

  // All motion scales with uSpeed; speed 0 freezes the keyframe (grain excluded).
  float t = iTime * uSpeed;

  // Tilt the band field to match the keyframe's slanted edges, then warp.
  float bandY = p.y - BAND_TILT * p.x + domainWarp(p, t);

  vec3 col = bandsLayer(vec2(p.x, bandY), t);
  col = luminosity(col, p, t);
  col *= vignette(uv);

  fragColor = vec4(max(col, vec3(0.0)), uOpacity);
}
`;
