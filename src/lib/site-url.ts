/**
 * The site's own origin, used for canonicals, OG tags, the sitemap, share
 * links and the JSON-LD `@id`s.
 *
 * `NEXT_PUBLIC_*` variables are inlined by the bundler, so this value is fixed
 * **at build time** — it is not read from the server's environment at runtime.
 * That is a deliberate acceptance rather than an oversight: most public routes
 * are statically prerendered, so their canonical tags are baked during the
 * build anyway, and making the origin runtime-dynamic would mean rendering
 * every page per request to keep the tags honest. The practical rule is that a
 * build is tied to the origin it was built for; a staging build that inherits
 * the production origin is kept out of the index by `SITE_INDEXABLE` instead.
 */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://swillfam.com"
).replace(/\/+$/, "");

/** The bare origin, no trailing slash. */
export function siteUrl(): string {
  return SITE_URL;
}

/** Absolute URL for a site-relative path, used to build share links. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
