/**
 * Fullscreen-triangle vertex shader for GlassRefractionBackground.
 * (Exported as a TS string module — Turbopack can't import raw .vert files
 * without extra loader config, so the shaders/ folder ships .ts sources.)
 */
export const glassRefractionVertex = /* glsl */ `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
