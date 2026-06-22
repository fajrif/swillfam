import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Admin forms upload images and PDF resumes through Server Actions; the default
    // 1 MB body limit would reject them.
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
