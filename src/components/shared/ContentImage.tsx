import Image, { type ImageProps } from "next/image";
import { altFor } from "@/lib/image-alt";

/**
 * `next/image` for a picture that came out of the database.
 *
 * Drop-in: same props, but `alt` becomes the *fallback*. If the content team
 * has written alt text for this file it wins; otherwise the row's name or title
 * is used, exactly as before. That is what makes this safe to adopt one call
 * site at a time — nothing regresses while the table is still empty.
 *
 * It resolves the alt itself instead of taking a map, which is the whole point:
 * a call site changes by one word, with no lookup to thread down through
 * intermediate components. `getImageAlts` is `cache()`d, so thirty of these on
 * a page still cost one query.
 *
 * **Server Components only** — it is async, so a Client Component cannot render
 * it. Resolve alts with `withAlts()` on the server and pass `{ src, alt }`
 * down instead; `GalleryCarousel` and `DishesSection` are the examples.
 *
 * Not for art hardcoded in a component — a hero backdrop or a decorative
 * divider has no row and should keep `alt=""`.
 */
export async function ContentImage({ src, alt, ...rest }: ImageProps) {
  // `alt` is required by ImageProps and `altFor` only ever swaps it for a
  // stored description, so the result is never weaker than the call site's own
  // value.
  const resolved = await altFor(typeof src === "string" ? src : null, alt);
  return <Image src={src} alt={resolved} {...rest} />;
}
