/**
 * The "Moments We've Hosted" gallery on /private-events.
 *
 * It is one ordered list of images for the whole page, not a record per
 * picture, so it lives in a single `SiteSetting` row as a JSON array of paths
 * rather than getting a table of its own. That is also what lets the admin use
 * one multi-image uploader — upload several, reorder, delete — instead of
 * creating the photos one form at a time, which is how single-image resources
 * like Private Event Occasions work.
 *
 * Alt text is not stored here: it lives in `ImageAlt` keyed by path like every
 * other image, and `withAlts()` joins it at render time.
 */

export const MOMENTS_SETTING_KEY = "privateEventMoments";

/**
 * Parses the stored value, tolerating anything that isn't a JSON array of
 * paths. A hand-edited or truncated row must degrade to "no photos" rather
 * than take the whole page down.
 */
export function parseMoments(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((p): p is string => typeof p === "string" && p.startsWith("/"))
      : [];
  } catch {
    return [];
  }
}
