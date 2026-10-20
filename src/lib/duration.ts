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
