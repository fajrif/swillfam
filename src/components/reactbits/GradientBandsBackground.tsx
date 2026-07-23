"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { cn } from "@/lib/utils";
import { gradientBandsVertex } from "./shaders/gradientBands.vert";
import { gradientBandsFragment } from "./shaders/gradientBands.frag";
import "./GradientBandsBackground.css";

/** Maximum palette entries the shader's uniform arrays hold. */
const MAX_COLORS = 10;

/**
 * Default palette extracted from /public/articles/banner.png — the average
 * colour of ten of its horizontal layers, top to bottom.
 */
const DEFAULT_COLORS = [
  "#331B76", // deep indigo
  "#4C2184", // violet
  "#62409B", // mid violet
  "#845DA2", // lavender
  "#9B70A2", // mauve
  "#BD81A5", // pale mauve
  "#D685AA", // cream pink
  "#D570AF", // hot pink
  "#8F4D82", // plum
  "#110B10", // near-black
];

/**
 * Where each palette colour sits on the vertical ramp (image-space y, 0 = top),
 * measured from the keyframe: a long indigo run up top, the pink region
 * compressed into the lower third, then a plunge to near-black. Used whenever
 * the palette has exactly MAX_COLORS entries; shorter palettes fall back to
 * even spacing.
 */
const KEYFRAME_STOPS = [0.1, 0.2, 0.36, 0.47, 0.55, 0.62, 0.68, 0.73, 0.83, 1.0];

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

export type GradientBandsBackgroundProps = {
  /** Output alpha (1 = fully opaque). */
  opacity?: number;
  /** Global motion speed multiplier; 0 freezes the keyframe. */
  speed?: number;
  /** Number of horizontal bands (the keyframe reads as ~16). */
  bandCount?: number;
  /** Travelling-glow intensity; 0 disables the sweep (still highlight). */
  sweep?: number;
  /** Vertical band-edge warp; 0.04 ≈ 4 device px of wobble. */
  warpStrength?: number;
  /** Band edge softness as a fraction of band height (1 dissolves the bands). */
  blur?: number;
  /** Enables a gentle mouse parallax on the whole composition. */
  mouseInteractive?: boolean;
  /** 2–10 hex colours, top to bottom. Defaults to the banner.png palette. */
  colors?: string[];
  className?: string;
};

/**
 * WebGL stacked-gradient-bands shader background (React Bits style). Renders
 * soft tilted horizontal colour bands keyframed on /articles/banner.png; each
 * band's internal gradient drifts horizontally at its own speed and direction.
 * Fills its container — position via `className` (e.g. `absolute inset-0`).
 */
export function GradientBandsBackground({
  opacity = 1,
  speed = 0.12,
  bandCount = 16,
  sweep = 0.42,
  warpStrength = 0.04,
  blur = 0.08,
  mouseInteractive = false,
  colors,
  className,
}: GradientBandsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Encode the palette as a string so the effect deps stay primitive — an
  // inline `colors` array literal would otherwise re-init WebGL every render.
  const paletteKey = (colors && colors.length >= 2 ? colors.slice(0, MAX_COLORS) : DEFAULT_COLORS).join("|");

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const palette = paletteKey.split("|");
    // Array uniforms (uColors[10], uStops[10]) must be plain arrays — OGL only
    // recognises `Array.isArray` values when resolving `name[0]` active uniforms.
    const colorData = palette.flatMap((hex) => hexToRgb(hex));
    const stopData =
      palette.length === MAX_COLORS
        ? [...KEYFRAME_STOPS]
        : palette.map((_, i) => i / Math.max(1, palette.length - 1));

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
      vertex: gradientBandsVertex,
      fragment: gradientBandsFragment,
      uniforms: {
        iResolution: { value: new Float32Array([1, 1]) },
        iTime: { value: 0 },
        uOpacity: { value: opacity },
        uSpeed: { value: speed },
        uBandCount: { value: bandCount },
        uSweep: { value: sweep },
        uWarpStrength: { value: warpStrength },
        uBlur: { value: blur },
        uColors: { value: colorData },
        uStops: { value: stopData },
        uColorCount: { value: palette.length },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      // uv space: x right, y up — matching the shader's vUv.
      mouseUniform[0] = (e.clientX - rect.left) / Math.max(1, rect.width);
      mouseUniform[1] = 1 - (e.clientY - rect.top) / Math.max(1, rect.height);
    };

    if (mouseInteractive) {
      containerEl.addEventListener("mousemove", handleMouseMove);
    }

    const setSize = () => {
      const rect = containerEl.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
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
      program.uniforms.iTime.value = (t - t0) * 0.001;
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

    // Pause the render loop entirely while off-screen (or display:none'd by
    // StickyHero's covered guard).
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
  }, [opacity, speed, bandCount, sweep, warpStrength, blur, mouseInteractive, paletteKey]);

  return <div ref={containerRef} className={cn("gradient-bands-container", className)} />;
}
