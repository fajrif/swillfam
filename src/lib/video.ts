/**
 * One reading of an admin-typed video URL, shared by the player and the markup.
 *
 * `VideoObject.embedUrl` has to be a **player** URL, not the page you'd send a
 * person to: the spec's sample asks for `{youtube_embed_url}`, and Google's
 * video docs expect a URL it can load in a frame. A `youtube.com/watch?v=…`
 * link is neither. So the URL the admin pastes is parsed once, here, and both
 * the `<iframe src>` the page renders and the `embedUrl` the schema reports
 * come out of the same call — which is the only way the markup can keep
 * describing what the page actually plays.
 *
 * Returns `null` for anything unparseable (the column is free text, so it can
 * hold a typo); callers then show and emit nothing rather than a broken frame.
 */

export type VideoSource =
  /** Playable in a frame: YouTube and Vimeo both report `embedUrl`. */
  | { kind: "embed"; embedUrl: string }
  /** A file we serve ourselves, playable in a `<video>` element. */
  | { kind: "file"; contentUrl: string };

/** YouTube's cookie-free player host. See `youtubeEmbed` for why it's used. */
const YOUTUBE_PLAYER = "https://www.youtube-nocookie.com/embed/";
const VIMEO_PLAYER = "https://player.vimeo.com/video/";

/** A YouTube video id: 11 chars of base64url in every form YouTube emits. */
const YOUTUBE_ID = /^[\w-]{11}$/;
const VIMEO_ID = /^\d+$/;

/**
 * `youtube-nocookie.com`, not `youtube.com`, because the page embeds the player
 * for real and that host doesn't set tracking cookies until playback starts —
 * which also keeps `/exclusive`-style pages out of consent-banner territory.
 * It is a genuine player URL, so it stays valid as `embedUrl`, and using the
 * same string in both places means the markup can't drift from the frame.
 */
function youtubeEmbed(id: string): VideoSource | null {
  return YOUTUBE_ID.test(id) ? { kind: "embed", embedUrl: YOUTUBE_PLAYER + id } : null;
}

function vimeoEmbed(id: string): VideoSource | null {
  return VIMEO_ID.test(id) ? { kind: "embed", embedUrl: VIMEO_PLAYER + id } : null;
}

export function parseVideoUrl(raw: string | null | undefined): VideoSource | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  // Only ever hand an https URL to an iframe or a <video>: a stored http link
  // would be blocked as mixed content and show an empty box.
  if (url.protocol !== "https:") return null;

  const host = url.hostname.replace(/^www\./, "");
  // Path without the leading slash, so `/watch` and `/embed/ID` split cleanly.
  const segments = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") return youtubeEmbed(segments[0] ?? "");

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    // /watch?v=ID, and the three path forms: /embed/ID, /shorts/ID, /live/ID.
    if (segments[0] === "watch") return youtubeEmbed(url.searchParams.get("v") ?? "");
    if (["embed", "shorts", "live"].includes(segments[0] ?? "")) {
      return youtubeEmbed(segments[1] ?? "");
    }
    return null;
  }

  if (host === "vimeo.com") return vimeoEmbed(segments[0] ?? "");
  if (host === "player.vimeo.com") {
    return segments[0] === "video" ? vimeoEmbed(segments[1] ?? "") : null;
  }

  // Anything else is only usable if it is a video file we can put in <video>.
  // A bare link to some other site's watch page is not something this page can
  // play, so it is not something the markup may claim either.
  return /\.(mp4|webm|mov|m4v)$/i.test(url.pathname)
    ? { kind: "file", contentUrl: url.href }
    : null;
}
