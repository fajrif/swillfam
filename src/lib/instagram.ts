/**
 * A venue's Instagram feed comes from its `instagramUrl`, not from a pasted
 * snippet. Instagram's own `/{handle}/embed/` page is iframe-able without a
 * token, so the profile URL is all the admin supplies.
 *
 * Returns `null` for anything that isn't a plain profile URL (a post, a reel,
 * another host), which is what makes the section and its markup appear and
 * vanish together — same contract as `parseVideoUrl()` in `video.ts`.
 */

const HOSTS = new Set(["instagram.com", "www.instagram.com"]);
const HANDLE = /^[A-Za-z0-9._]+$/;
/** First path segments that are Instagram routes, not accounts. */
const RESERVED = new Set(["p", "reel", "reels", "tv", "stories", "explore", "accounts", "direct"]);

export type InstagramProfile = { handle: string; embedUrl: string };

export function instagramProfile(url: string | null | undefined): InstagramProfile | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!HOSTS.has(parsed.hostname)) return null;
    const [handle] = parsed.pathname.split("/").filter(Boolean);
    if (!handle || !HANDLE.test(handle) || RESERVED.has(handle.toLowerCase())) return null;
    return { handle, embedUrl: `https://www.instagram.com/${handle}/embed/` };
  } catch {
    return null;
  }
}
