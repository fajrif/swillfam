"use client";

import YarlLightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

/**
 * Themed wrapper around yet-another-react-lightbox. One instance per gallery
 * (not per image) — pass the full image set plus which index is open so
 * prev/next navigation works across the whole gallery. Renders through the
 * library's own portal to `document.body`, so it's never trapped inside a
 * transformed ancestor (e.g. an Embla carousel track).
 */
export function Lightbox({
  images,
  index,
  open,
  onClose,
}: {
  images: string[];
  index: number;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <YarlLightbox
      open={open}
      close={onClose}
      index={index}
      slides={images.map((src) => ({ src }))}
      plugins={[Zoom]}
      zoom={{ scrollToZoom: true }}
      styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.92)" } }}
    />
  );
}
