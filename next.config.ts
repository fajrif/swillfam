import type { NextConfig } from "next";

/**
 * Path redirects from the old swillfam.com, per requests/swillfam-redirect-map.csv.
 * The host-level rules in that file (www → apex, http → https) are deliberately
 * absent: they belong at Nginx/CDN, before the request ever reaches Next.
 *
 * `/brands/zoo/` alone carries 90 referring domains, so the brief requires every
 * one of these to land in a *single* 301 — see the trailing-slash note below.
 */
const PATH_REDIRECTS: [source: string, destination: string][] = [
  ["/brands/zoo", "/venues/zoo"],
  ["/zoo", "/venues/zoo"],
  ["/zoo/f&b", "/venues/zoo"],
  ["/brands/the-swillhouse", "/venues/swillhouse"],
  ["/swillhouse", "/venues/swillhouse"],
  ["/swillhouse/fnb", "/venues/swillhouse"],
  ["/kilo-jakarta", "/venues/kilo-jakarta"],
  ["/kilojakarta", "/venues/kilo-jakarta"],
  ["/kilo-jakarta/f&b", "/venues/kilo-jakarta"],
  ["/lecirque", "/venues/le-cirque"],
  ["/dualism", "/venues/dualism"],
  ["/truce", "/venues/truce"],
  // Atsumaru is off the site at launch; its category page is the closest match.
  ["/atsumaru", "/venues/lifestyle"],
  ["/brands", "/venues"],
  ["/brands/wa-chu-want", "/venues"],
  ["/brands/billions", "/venues"],
  ["/cgi-sys/suspendedpage.cgi", "/"],
  // Staging routes renamed in Fase 0.
  ["/articles", "/guides"],
  ["/category/lifestyle", "/venues/lifestyle"],
  ["/category/nightlife", "/venues/nightlife"],
  ["/venues/kilo", "/venues/kilo-jakarta"],
  ["/venues/atsumaru-izakaya", "/venues/lifestyle"],
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Next normally injects its own `/:path+/` → `/:path+` redirect at the *front*
  // of the list (unshift + priority), which would turn every old slashed URL
  // into a two-hop chain: /brands/zoo/ → /brands/zoo → /venues/zoo. The brief
  // forbids chains, so the normaliser is disabled here and re-added as the last
  // rule below, after the specific ones have had their chance to match.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...PATH_REDIRECTS.flatMap(([source, destination]) =>
        // Registered bare and slashed so an old link in either form is one hop.
        [source, `${source}/`].map((s) => ({
          source: s,
          destination,
          // statusCode over `permanent` (which emits 308): the redirect map and
          // the SEO team's curl checks both specify 301.
          statusCode: 301,
        })),
      ),
      { source: "/articles/:path+/", destination: "/guides/:path+", statusCode: 301 },
      { source: "/articles/:path+", destination: "/guides/:path+", statusCode: 301 },
      // Replaces the normaliser disabled above, so a trailing slash anywhere
      // else on the site still collapses instead of serving duplicate content.
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
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
