import { GalleryCarousel } from "@/components/shared/GalleryCarousel";
import { GALLERY } from "./data";

/** "Moments We've Hosted" — preset of the shared GalleryCarousel. */
export function MomentsCarousel() {
  return (
    <GalleryCarousel
      title="Moments We've Hosted"
      description="Explore a selection of celebrations, corporate functions, launches, and special occasions hosted across the SwillFam family of venues."
      images={GALLERY}
    />
  );
}
