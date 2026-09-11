const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://swillfam.com";

/** Absolute URL for a site-relative path, used to build share links. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
