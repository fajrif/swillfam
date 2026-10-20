/**
 * Video durations.
 *
 * `VideoObject.duration` must be an ISO 8601 duration ("PT2M15S"), but nobody
 * reads a recap video's length in that form — an admin types "2:15". This
 * normalises on save so the column always holds something a validator accepts,
 * without making the form hostile to the person filling it in.
 *
 * Anything unrecognised is returned trimmed but otherwise untouched, so a typo
 * round-trips back into the field for the admin to see and fix rather than
 * being silently discarded. The schema builder checks the shape before emitting.
 */

/** Matches a value already in ISO 8601 duration form. */
export const ISO_DURATION = /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/;

/** "2:15" or "1:02:30" — minutes:seconds, optionally hours first. */
const CLOCK = /^(?:(\d+):)?(\d{1,2}):(\d{2})$/;

export function toIsoDuration(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const upper = trimmed.toUpperCase();
  if (ISO_DURATION.test(upper)) return upper;

  const clock = CLOCK.exec(trimmed);
  if (!clock) return trimmed;

  const [, hours, minutes, seconds] = clock;
  const parts = [
    hours && Number(hours) > 0 ? `${Number(hours)}H` : "",
    Number(minutes) > 0 ? `${Number(minutes)}M` : "",
    Number(seconds) > 0 ? `${Number(seconds)}S` : "",
  ].join("");

  // "0:00" carries no information — treat it as unset rather than emitting "PT".
  return parts ? `PT${parts}` : "";
}

/** Just the `T` part — days and up make no sense for a recap video's length. */
const ISO_CLOCK = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

/**
 * The stored ISO duration back as "2:15", or "" when it isn't one.
 *
 * The page has to show the length the markup reports, and the column holds the
 * ISO form, so the label is derived from it rather than stored a second time —
 * the rule that keeps opening hours honest applies to this field too. Returning
 * "" for an unparseable value makes the display drop it on exactly the same
 * condition `recapVideo()` drops `duration`, so the page and the markup never
 * disagree about whether a length is known.
 */
export function formatIsoDuration(iso: string | null | undefined): string {
  const match = ISO_CLOCK.exec(iso?.trim().toUpperCase() ?? "");
  if (!match) return "";

  const [, h, m, s] = match;
  const hours = Number(h ?? 0);
  const minutes = Number(m ?? 0);
  const seconds = Number(s ?? 0);
  if (hours === 0 && minutes === 0 && seconds === 0) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}
