"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { cn } from "@/lib/utils";
import { glassRefractionVertex } from "./shaders/glassRefraction.vert";
import { glassRefractionFragment } from "./shaders/glassRefraction.frag";
import "./GlassRefractionBackground.css";

/**
 * Default palette, read off /glass-refraction-banner.png. Each group maps to
 * one layer of the composition and is a fixed length the shader expects — the
 * `fit` helper below pads a short caller-supplied array back out with these.
 */
const DEFAULT_BACKGROUND_COLORS = ["#05030A", "#09040E", "#0D0715"];
const DEFAULT_RED_COLORS = ["#B0002A", "#8A0022", "#620018"];
const DEFAULT_PURPLE_COLORS = ["#5A1BA8", "#7B29FF", "#A53CFF"];
const DEFAULT_MAGENTA_COLORS = ["#FF2AC8", "#FF3DA5"];
const DEFAULT_HIGHLIGHT_COLOR = "#FFD4FF";

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

/** Clamps/pads a caller palette to the fixed length the shader's uniform holds. */
const fit = (colors: string[] | undefined, fallback: string[]) =>
  fallback.map((defaultHex, i) => colors?.[i] ?? defaultHex);

export type GlassRefractionBackgroundProps = {
  /** Output alpha (1 = fully opaque). */
  opacity?: number;
  /** Global motion speed multiplier; 0 freezes the keyframe (grain excluded). */
  speed?: number;
  /** Number of vertical glass slats (the reference reads as ~28). */
  slatCount?: number;
  /** Per-slat UV displacement in device px; the reference sits at 1–4. */
  refraction?: number;
  /** Per-slat breathing travel, as a fraction of frame height. */
  amplitude?: number;
  /** Slat edge softness; 1 flattens the lens and dissolves the ribs. */
  blur?: number;
  /** Per-slat purple highlight strength; 0 disables it. */
  highlight?: number;
  /** Brightness of the specular seam at each rib's edge. */
  edgeLight?: number;
  /** Film grain amount; 0 disables it. */
  grain?: number;
  /** Volumetric light intensity; 0 leaves just the dark background. */
  glow?: number;
  /** Horizontal position of the dome crest (0 = left edge, 1 = right edge). */
  domeCenter?: number;
  /** Image-space y of the dome crest (0 = top of the frame). */
  domeHeight?: number;
  /** 3 hex colours — background ramp, top to bottom. */
  backgroundColors?: string[];
  /** 3 hex colours — dome core, rim-inward to deep. */
  redColors?: string[];
  /** 3 hex colours — halo, deep to bright (the brightest sits against the rim). */
  purpleColors?: string[];
  /** 2 hex colours — the rim band straddling the dome contour. */
  magentaColors?: string[];
  /** Brightest point of the per-slat highlight. */
  highlightColor?: string;
  /** Enables a gentle mouse parallax on the whole composition. */
  mouseInteractive?: boolean;
  className?: string;
};

/**
 * WebGL ribbed-glass shader background (React Bits style). A wide red
 * volumetric dome with a magenta rim and violet halo, seen through vertical
 * translucent glass slats that each refract it by a couple of pixels. The light
 * holds still; the glass breathes, every slat on its own phase, speed and
 * delay, so the contour reads like a very slow audio spectrum.
 *
 * Fills its container — position via `className` (e.g. `absolute inset-0`).
 */
export function GlassRefractionBackground({
  opacity = 1,
  speed = 3,
  slatCount = 28,
  refraction = 3.6,
  amplitude = 0.055,
  blur = 0.12,
  highlight = 0.22,
  edgeLight = 0.38,
  grain = 0.035,
  glow = 0.52,
  domeCenter = 0.24,
  domeHeight = 0.2,
  backgroundColors,
  redColors,
  purpleColors,
  magentaColors,
  highlightColor,
  mouseInteractive = false,
  className,
}: GlassRefractionBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Encode the whole palette as one string so the effect deps stay primitive —
  // inline `redColors={[...]}` literals would otherwise re-init WebGL every
  // render. Unpacked back into groups inside the effect.
  const paletteKey = [
    ...fit(backgroundColors, DEFAULT_BACKGROUND_COLORS),
    ...fit(redColors, DEFAULT_RED_COLORS),
    ...fit(purpleColors, DEFAULT_PURPLE_COLORS),
    ...fit(magentaColors, DEFAULT_MAGENTA_COLORS),
    highlightColor ?? DEFAULT_HIGHLIGHT_COLOR,
  ].join("|");

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    // Same order the key was packed in: 3 background, 3 red, 3 purple,
    // 2 magenta, 1 highlight.
    const palette = paletteKey.split("|");
    // Array uniforms (uBgColors[3] etc.) must be plain arrays — OGL only
    // recognises `Array.isArray` values when resolving `name[0]` active uniforms.
    const rgb = (from: number, to: number) => palette.slice(from, to).flatMap((hex) => hexToRgb(hex));

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
      vertex: glassRefractionVertex,
      fragment: glassRefractionFragment,
      uniforms: {
        iResolution: { value: new Float32Array([1, 1]) },
        iTime: { value: 0 },
        uOpacity: { value: opacity },
        uSpeed: { value: speed },
        uSlatCount: { value: slatCount },
        uRefraction: { value: refraction },
        uAmplitude: { value: amplitude },
        uBlur: { value: blur },
        uHighlight: { value: highlight },
        uEdgeLight: { value: edgeLight },
        uGrain: { value: grain },
        uGlow: { value: glow },
        uDomeCenter: { value: domeCenter },
        uDomeHeight: { value: domeHeight },
        uBgColors: { value: rgb(0, 3) },
        uRedColors: { value: rgb(3, 6) },
        uPurpleColors: { value: rgb(6, 9) },
        uMagentaColors: { value: rgb(9, 11) },
        uHighlightColor: { value: hexToRgb(palette[11]) },
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
  }, [
    opacity,
    speed,
    slatCount,
    refraction,
    amplitude,
    blur,
    highlight,
    edgeLight,
    grain,
    glow,
    domeCenter,
    domeHeight,
    mouseInteractive,
    paletteKey,
  ]);

  return <div ref={containerRef} className={cn("glass-refraction-container", className)} />;
}
