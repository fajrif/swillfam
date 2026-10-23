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

/**
 * Response headers for every route.
 *
 * **No `Content-Security-Policy` here, deliberately.** The pages embed Mapbox,
 * YouTube, Spotify and Instagram, render admin rich text through
 * `dangerouslySetInnerHTML`, and get inline styles from Framer Motion — and
 * GTM arrives in Fase 9. A policy loose enough to allow all that buys little,
 * and a strict one would break the site in ways `npm run build` cannot catch.
 * It wants a browser pass of its own.
 *
 * **No `Strict-Transport-Security` either**: HSTS belongs at the TLS
 * terminator, which is also the only place that can honestly promise HTTPS for
 * the whole apex. It is on the Fase 10 server checklist.
 */
const SECURITY_HEADERS = [
  // Stops a browser from second-guessing our Content-Type — the upload folder
  // serves admin-supplied files, so a .png that is really HTML must never be
  // sniffed into one.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL to our own pages, origin-only cross-site: enough for
  // analytics to attribute a referrer without leaking a path to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on the site is meant to be framed. `frame-ancestors` would be the
  // modern spelling, but it only exists inside a CSP (see above).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // The site asks for none of these; saying so stops an embedded third party
  // from prompting in our name. The venue locator draws a map but never asks
  // where the visitor is.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // WebP only. This used to be AVIF first, and AVIF can be smaller — measured
    // at w=1920 the Le Cirque banner was 115 KB as AVIF vs 151 KB as WebP — but
    // it was not a clear win (Zoo's venue photo went the other way, 99 vs 77, and
    // small flat logos came out larger than the source), and the art the team
    // supplies is WebP already, so AVIF meant a WebP -> AVIF re-encode. That
    // encode is slow and memory-hungry in `sharp`; on a cold image cache it
    // pushed the Node process past its PM2 memory cap. The brief (T13) accepts
    // "WebP/AVIF". If a hero ever needs the extra ~25%, put "image/avif" back
    // in front and watch `pm2 status` while the cache warms.
    formats: ["image/webp"],
    // 30 days instead of the 4-hour default. Safe because the paths are
    // immutable in practice: `reconcileSingleImage` writes a fresh UUID
    // filename on every replace, so a changed image is a changed URL. Only the
    // committed `public/**` art is overwritable in place — if a designer swaps
    // one of those, the file has to be renamed or the cache purged.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
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
