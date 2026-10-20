import Image from "next/image";
import { cn } from "@/lib/utils";
import { GALLERY_IMAGES } from "./data";

/** Uniform-height image grid; the two double-width images span two columns. */
export function GalleryGrid() {
  return (
    <div className="grid grid-flow-row-dense grid-cols-2 gap-4 lg:grid-cols-3">
      {GALLERY_IMAGES.map((img) => (
        <div
          key={img.src}
          className={cn(
            "relative overflow-hidden border border-sf-border/50 bg-sf-surface",
            img.wide ? "col-span-2 aspect-[919/537]" : "aspect-[448/537]",
          )}
        >
          {/* No `priority`: the grid sits under /exclusive's hero, inside a
              tab panel, so preloading two of these only delays the hero. */}
          <Image
            src={img.src}
            alt=""
            fill
            sizes={img.wide ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
