import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Admin forms upload images and PDF resumes through Server Actions; the default
    // 1 MB body limit would reject them.
    serverActions: {
      bodySizeLimit: "15mb",
    },
    optimizePackageImports: ["@phosphor-icons/react"],
    // Self-hosted `next start` doesn't trust the incoming Host header by default
    // (unlike Vercel) — without this, request.url/nextUrl fall back to an internal
    // default containing "localhost", so any redirect built from request.url
    // (middleware's auth redirect, admin logout) sends production users to
    // localhost instead of the real domain. Read at runtime (next-server.js) but
    // missing from this Next version's public ExperimentalConfig type.
    // @ts-expect-error -- valid experimental flag, not yet in the public type
    trustHostHeader: true,
  },
};

export default nextConfig;
