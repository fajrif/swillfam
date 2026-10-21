import { GalleryCarousel } from "@/components/shared/GalleryCarousel";

/**
 * "Moments We've Hosted" — preset of the shared GalleryCarousel.
 *
 * The photos are managed in the admin (Private Event Moments), so this takes
 * them from the page instead of owning a list. `GalleryCarousel` is a Client
 * Component and cannot look up stored alt text itself, which is why the page
 * passes `{ src, alt }` pairs.
 */
export function MomentsCarousel({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <GalleryCarousel
      title="Moments We've Hosted"
      description="Explore a selection of celebrations, corporate functions, launches, and special occasions hosted across the SwillFam family of venues."
      images={images}
    />
  );
}
