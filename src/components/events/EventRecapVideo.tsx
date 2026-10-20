"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { VideoSource } from "@/lib/video";

/**
 * The recap video, as a poster that becomes the player on click.
 *
 * Two reasons it isn't just an `<iframe>`:
 *
 * 1. **The markup depends on it being here.** `recapVideo()` emits a
 *    `VideoObject` for any event with a recap URL, and Google's video
 *    guidelines — like the FAQ rule that forced `forceMount` on the accordion —
 *    only allow marking up a video the page actually plays. Until this section
 *    existed, that block described something no visitor could watch.
 * 2. A third-party player costs ~1 MB and several requests before anyone asks
 *    for it. The poster is one optimised image; the frame is only created on
 *    click, which keeps the recap off the critical path.
 *
 * `autoplay=1` is added only to the clicked frame, never to the `embedUrl` the
 * schema reports: the person has just asked for playback, but a crawler
 * resolving `embedUrl` should get the plain player.
 */
export function EventRecapVideo({
  source,
  thumbnail,
  eventName,
}: {
  source: VideoSource;
  /** Poster frame; the same image the markup reports as `thumbnailUrl`. */
  thumbnail: string | null;
  eventName: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play the ${eventName} recap`}
        className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-sf-surface"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/60 transition-colors group-hover:bg-black/80">
            <Play className="h-7 w-7 fill-white text-white" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {source.kind === "embed" ? (
        <iframe
          // The user clicked play, so start playing.
          src={`${source.embedUrl}?autoplay=1`}
          title={`${eventName} recap`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <video
          src={source.contentUrl}
          poster={thumbnail ?? undefined}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
    </div>
  );
}
