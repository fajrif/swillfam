import Image from "next/image";
import { Play } from "lucide-react";

const VIDEO_THUMBS = [
  "/gallery/gallery-1.png",
  "/gallery/gallery-2.png",
  "/gallery/gallery-3.png",
  "/gallery/gallery-4.png",
  "/gallery/gallery-5.png",
  "/gallery/gallery-6.png",
];

/** Placeholder video thumbnail grid with a play-button overlay. */
export function VideosGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {VIDEO_THUMBS.map((src, i) => (
        <div
          key={src}
          className="relative aspect-[448/537] overflow-hidden border border-sf-border/50 bg-sf-surface"
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority={i < 2}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50">
              <Play className="h-6 w-6 fill-white text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
