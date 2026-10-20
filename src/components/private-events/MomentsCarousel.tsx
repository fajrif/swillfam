import { GalleryCarousel } from "@/components/shared/GalleryCarousel";

// Archive-page chrome, not per-event data — the DB-backed galleries live on
// each PrivateEvent and render on its detail page instead.
const GALLERY = [
  { src: "/private-events/events-1.png", alt: "A private celebration at a SwillFam venue" },
  { src: "/private-events/events-2.png", alt: "Guests at a SwillFam private event" },
  { src: "/private-events/events-3.png", alt: "A corporate function hosted by SwillFam" },
];

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
