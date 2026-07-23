"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { cn } from "@/lib/utils";
import "./PlasmaBackground.css";

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

// --- noise helpers ---
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
  for (int i = 0; i < 5; i++) {
    v += amp * vnoise(p);
    p *= 2.0;
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
  vec2 uv = gl_FragCoord.xy / iResolution.xy;         // 0..1
  float aspect = iResolution.x / max(iResolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 center = vec2(0.5 * aspect, 0.5);

  // Zoom around center: larger uScale => bigger, softer blobs.
  p = (p - center) / uScale + center;

  // Gentle mouse parallax.
  vec2 mouseNorm = uMouse / max(iResolution.xy, vec2(1.0));
  p += (mouseNorm - 0.5) * 0.15 * step(0.5, uMouseInteractive);

  float T = iTime * uSpeed * uDirection;

  // Domain warp for organic, gooey merging edges.
  vec2 warp = vec2(
    fbm(p * 1.5 + vec2(0.0, T * 0.15)),
    fbm(p * 1.5 + vec2(5.2, -T * 0.12))
  );
  vec2 pw = p + (warp - 0.5) * 0.6;

  // Metaball field: several slow-orbiting soft blobs.
  float field = 0.0;
  for (int k = 0; k < 6; k++) {
    float fk = float(k);
    vec2 c = center + vec2(
      0.42 * sin(T * (0.25 + 0.05 * fk) + fk * 2.1),
      0.30 * cos(T * (0.22 + 0.04 * fk) + fk * 1.3)
    );
    float r = 0.16 + 0.06 * sin(fk * 1.7 + T * 0.3);
    field += (r * r) / (dot(pw - c, pw - c) + 8e-4);
  }
  // Break up perfectly-round cores.
  field += 0.35 * fbm(pw * 2.0 + T * 0.1);

  // Punch a few big dark holes through the field (negative metaballs, gaussian
  // wells so each has a controlled size and depth).
  for (int h = 0; h < 3; h++) {
    float fh = float(h);
    vec2 hc = center + vec2(
      (0.34 + 0.11 * fh) * sin(T * 0.10 + fh * 5.5),
      (0.26 + 0.12 * fh) * cos(T * 0.09 + fh * 2.2)
    );
    float hr = 0.18 + 0.03 * fh;
    field -= 1.7 * exp(-dot(pw - hc, pw - hc) / (hr * hr));
  }

  // Shape into a soft-edged intensity.
  float t = smoothstep(0.55, 1.6, field);

  // Color ramp: black -> vibrant -> accent -> darker. Deriving vibrant + darker
  // from the color prop makes the whole ramp recolour when the prop changes;
  // fixed pink shades are the fallback when no color is supplied.
  vec3 accent, vibrant, darker;
  if (uUseCustomColor > 0.5) {
    vec3 h = rgb2hsv(uCustomColor);
    accent = uCustomColor;
    vibrant = hsv2rgb(vec3(fract(h.x + 0.03), min(h.y + 0.18, 1.0), min(h.z + 0.10, 1.0))); // brighter, more saturated
    darker = hsv2rgb(vec3(h.x, h.y, h.z * 0.40));                                            // darker
  } else {
    accent = vec3(0.85, 0.15, 0.45);
    vibrant = vec3(0.867, 0.086, 0.306); // #dd164e
    darker = mix(accent, vec3(0.0), 0.6);
  }
  vec3 col = mix(vec3(0.0), vibrant, smoothstep(0.0, 0.25, t));
  col = mix(col, accent, smoothstep(0.45, 0.72, t));
  // Darker only tints the brightest cores — its upper bound is above the max t,
  // so it never fully takes over and vibrant + accent stay the dominant fill.
  col = mix(col, darker, smoothstep(0.85, 1.35, t));

  // Subtle animated film grain.
  float grain = hash21(gl_FragCoord.xy + fract(iTime) * 100.0);
  col += (grain - 0.5) * 0.05;

  // Fade the dark gaps to transparent so the near-black page shows through.
  float alpha = max(smoothstep(0.02, 0.5, t), t * 0.9) * uOpacity;

  fragColor = vec4(max(col, 0.0), clamp(alpha, 0.0, 1.0));
}`;

type Direction = "forward" | "reverse" | "pingpong";

export type PlasmaBackgroundProps = {
  color?: string;
  speed?: number;
  direction?: Direction;
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  className?: string;
};

/** WebGL plasma-field shader background (React Bits). Fills its container —
 *  position it via `className` (e.g. `absolute inset-0` over a `relative` parent). */
export function PlasmaBackground({
  color,
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 1,
  mouseInteractive = false,
  className,
}: PlasmaBackgroundProps) {
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

  return <div ref={containerRef} className={cn("plasma-container", className)} />;
}
