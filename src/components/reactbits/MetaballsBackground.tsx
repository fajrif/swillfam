"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { cn } from "@/lib/utils";
import "./MetaballsBackground.css";

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// -----------------------------------------------------------------------------
// Cinematic "floating ink clouds" background.
//
// Technique: FBM value-noise + IQ-style two-level domain warp + soft *gaussian*
// metaballs. No raymarch loop, so it stays cheap enough for 60 FPS on desktop.
// The look targets a luxury motion-graphics hero (Apple / Stripe / Linear):
// very large out-of-focus glowing liquid masses that merge, on pure black, with
// a bloom illusion, a subtle vignette and gentle film grain. Palette is limited
// to four pink/magenta shades.
// -----------------------------------------------------------------------------
const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

// Palette — only shades of these four, over pure black.
const vec3 C1 = vec3(1.000, 0.000, 0.333); // #ff0055
const vec3 C2 = vec3(1.000, 0.176, 0.478); // #ff2d7a
const vec3 C3 = vec3(0.831, 0.235, 1.000); // #d43cff
const vec3 C4 = vec3(1.000, 0.424, 0.851); // #ff6cd9

// --- smooth value noise + fbm (self-contained) ---
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

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

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  // Per-octave rotation/offset breaks up axis-aligned repetition (no tiling).
  for (int i = 0; i < 5; i++) {
    v += amp * vnoise(p);
    p = p * 2.02 + vec2(11.7, 3.3);
    amp *= 0.5;
  }
  return v;
}

// --- RGB <-> HSV (used to derive palette shades from the color prop) ---
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 pp = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 qq = mix(vec4(pp.xyw, c.r), vec4(c.r, pp.yzx), step(pp.x, c.r));
  float d = qq.x - min(qq.w, qq.y);
  float e = 1.0e-10;
  return vec3(abs(qq.z + (qq.w - qq.y) / (6.0 * d + e)), d / (qq.x + e), qq.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 pp = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(pp - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;                 // 0..1
  float aspect = iResolution.x / max(iResolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 center = vec2(0.5 * aspect, 0.5);

  // Zoom: larger uScale => bigger, softer masses.
  p = (p - center) / uScale + center;

  // Very gentle mouse parallax.
  vec2 mouseN = uMouse / max(iResolution.xy, vec2(1.0));
  p += (mouseN - 0.5) * 0.08 * step(0.5, uMouseInteractive);

  // Slow time. Feeding time additively into the noise coordinates below (rather
  // than a bare periodic sin) keeps the flow evolving with no obvious loop.
  float T = iTime * uSpeed * uDirection;

  // --- Two-level domain warp (Inigo Quilez style) for organic flowing masses ---
  vec2 q = vec2(
    fbm(p * 1.2 + vec2(0.0, 0.10 * T)),
    fbm(p * 1.2 + vec2(5.2, -0.08 * T) + 1.7)
  );
  vec2 r = vec2(
    fbm(p * 1.2 + 1.8 * q + vec2(1.7 - 0.06 * T, 9.2)),
    fbm(p * 1.2 + 1.8 * q + vec2(8.3, 2.8 + 0.05 * T))
  );
  vec2 pw = p + 0.55 * (r - 0.5);                             // warped sample point

  // --- Soft gaussian metaballs (blurred, out-of-focus liquid blobs) ---
  // Gaussian falloff => inherently soft edges, no crisp procedural lines.
  float field = 0.0;
  float hue = 0.0;                                            // palette selector
  for (int k = 0; k < 5; k++) {
    float fk = float(k);
    // Incommensurate (golden-ratio-ish) frequencies => orbits never obviously repeat.
    vec2 c = center + vec2(
      0.34 * sin(0.11 * T + fk * 2.399 + 0.7),
      0.26 * cos(0.09 * T + fk * 1.618 + 1.3)
    );
    float rad = 0.30 + 0.10 * sin(fk * 1.7 + 0.05 * T);       // large soft radius
    float g = exp(-dot(pw - c, pw - c) / (rad * rad));        // gaussian blob
    field += g;
    hue += g * fract(fk * 0.37 + 0.15);                       // each blob leans to a hue
  }
  hue = clamp(hue / max(field, 1e-3), 0.0, 1.0);

  // A whisper of fbm so masses aren't perfectly gaussian — still very soft.
  field += 0.12 * (fbm(pw * 1.6 + 0.05 * T) - 0.5);

  // Very wide smoothstep => long soft gradient / shallow depth-of-field feel.
  float m = smoothstep(0.15, 1.05, field);

  // --- Build the 4-shade palette ---
  // Default: the fixed pink shades. When a color prop is supplied, derive four
  // shades from it (deep / base / hue-shifted / bright core) so the prop
  // recolours the whole effect while keeping the multi-shade richness.
  vec3 P1 = C1, P2 = C2, P3 = C3, P4 = C4;
  if (uUseCustomColor > 0.5) {
    vec3 h = rgb2hsv(uCustomColor);
    P1 = hsv2rgb(vec3(fract(h.x - 0.03), min(h.y + 0.15, 1.0), h.z * 0.70)); // deep
    P2 = hsv2rgb(h);                                                         // base
    P3 = hsv2rgb(vec3(fract(h.x + 0.08), h.y, min(h.z + 0.05, 1.0)));        // hue-shifted
    P4 = hsv2rgb(vec3(fract(h.x + 0.03), max(h.y - 0.40, 0.0), 1.0));        // bright core
  }

  // Blend across the four shades by the per-blob hue selector.
  vec3 pal = mix(P1, P2, smoothstep(0.0, 0.5, hue));
  pal = mix(pal, P3, smoothstep(0.4, 0.8, hue));
  pal = mix(pal, P4, smoothstep(0.75, 1.0, hue));

  // --- Soft volumetric lighting + bloom illusion (gradients only) ---
  vec3 col = pal * m;                                         // body
  col += pal * smoothstep(0.55, 1.2, field) * 0.6;           // glowing core (bloom-ish)

  // --- Subtle vignette ---
  vec2 vc = uv - 0.5;
  vc.x *= aspect;
  float vig = smoothstep(1.15, 0.35, length(vc));
  col *= mix(0.82, 1.0, vig);

  // --- Very subtle animated film grain (~1.5%) ---
  float grain = hash21(gl_FragCoord.xy * 1.7 + fract(iTime) * 137.0) - 0.5;
  col += grain * 0.015;

  // Alpha: black gaps stay transparent so the page's black shows through.
  float alpha = clamp(m * uOpacity, 0.0, 1.0);
  fragColor = vec4(max(col, 0.0), alpha);
}`;

type Direction = "forward" | "reverse" | "pingpong";

export type MetaballsBackgroundProps = {
  color?: string;
  speed?: number;
  direction?: Direction;
  scale?: number;
  scaleMobile?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  className?: string;
};

/** WebGL cinematic metaball "floating ink clouds" background. Fills its container —
 *  position it via `className` (e.g. `absolute inset-0` over a `relative` parent). */
export function MetaballsBackground({
  color,
  speed = 1,
  direction = "forward",
  scale = 1,
  scaleMobile,
  opacity = 1,
  mouseInteractive = false,
  className,
}: MetaballsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const useCustomColor = color ? 1.0 : 0.0;
    const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];

    const directionMultiplier = direction === "reverse" ? -1.0 : 1.0;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl) return;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerEl.appendChild(canvas);

    const geometry = new Triangle(gl);

    // Responsive scale: use matchMedia to pick the right value per breakpoint.
    const mql = window.matchMedia("(min-width: 1024px)");
    const getScale = () => (mql.matches ? scale : (scaleMobile ?? scale));

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Keep the uScale uniform in sync with the current viewport.
    const updateScale = () => { program.uniforms.uScale.value = getScale(); };
    mql.addEventListener("change", updateScale);
    updateScale();

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive) return;
      const rect = containerEl.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = mousePos.current.x;
      mouseUniform[1] = mousePos.current.y;
    };

    if (mouseInteractive) {
      containerEl.addEventListener("mousemove", handleMouseMove);
    }

    const setSize = () => {
      const rect = containerEl.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerEl);
    setSize();

    let raf = 0;
    let contextLost = false;
    let isVisible = true;
    const t0 = performance.now();

    const loop = (t: number) => {
      if (contextLost || !isVisible) return;
      const timeValue = (t - t0) * 0.001;
      if (direction === "pingpong") {
        const pingpongDuration = 10;
        const segmentTime = timeValue % pingpongDuration;
        const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0;
        const u = segmentTime / pingpongDuration;
        const smooth = u * u * (3 - 2 * u);
        const pingpongTime = isForward ? smooth * pingpongDuration : (1 - smooth) * pingpongDuration;
        program.uniforms.uDirection.value = 1.0;
        program.uniforms.iTime.value = pingpongTime;
      } else {
        program.uniforms.iTime.value = timeValue;
      }
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
    };
    const handleContextRestored = () => {
      contextLost = false;
      if (isVisible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !contextLost) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 },
    );
    io.observe(containerEl);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      mql.removeEventListener("change", updateScale);
      if (mouseInteractive) {
        containerEl.removeEventListener("mousemove", handleMouseMove);
      }
      try {
        containerEl.removeChild(canvas);
      } catch {
        // already detached
      }
    };
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return <div ref={containerRef} className={cn("metaballs-container", className)} />;
}
