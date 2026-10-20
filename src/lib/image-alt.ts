import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Alt text for stored images, read once per request.
 *
 * One `findMany` for the whole table rather than a lookup per image: a page can
 * show thirty pictures, the table holds one short row per uploaded file, and
 * `cache()` collapses every call on a request into that single query. If the
 * table ever grows past a few thousand rows this becomes a `where: { path: { in } }`
 * — but it is sized by the number of images an admin has uploaded, not by
 * traffic.
 */
export const getImageAlts = cache(async (): Promise<Map<string, string>> => {
  const rows = await prisma.imageAlt.findMany({ select: { path: true, alt: true } });
  return new Map(rows.map((row) => [row.path, row.alt]));
});

/**
 * The same table as a plain object, for handing to the admin forms.
 *
 * `ImageManager` is a Client Component, and a `Map` crossing that boundary is
 * more than this needs — an object of path → alt serialises into the RSC
 * payload as-is. Read in each resource's `[id]/page.tsx`, never in the
 * dashboard layout: layouts are not re-rendered on client navigation, so an
 * alt saved a moment ago would come back stale, which is precisely the
 * "a field whose saved value the admin can't see" failure.
 */
export async function getImageAltRecord(): Promise<Record<string, string>> {
  return Object.fromEntries(await getImageAlts());
}

/**
 * The stored alt for `src`, or `fallback`.
 *
 * **`fallback` is required and must be meaningful.** Alt text is empty until
 * the content team writes it, so the fallback is what a visitor actually gets
 * today — the venue name, the event title. Passing `""` here would mean "this
 * image is decorative", which is a different claim and almost never true of a
 * picture that came out of the database.
 */
export async function altFor(
  src: string | null | undefined,
  fallback: string,
): Promise<string> {
  if (!src) return fallback;
  return (await getImageAlts()).get(src)?.trim() || fallback;
}

/**
 * Pair each path with its alt, for handing to a Client Component.
 *
 * `ContentImage` cannot be used inside one — a Client Component may not render
 * an async Server Component — so the server resolves the alts first and passes
 * `{ src, alt }` down. Galleries are the main caller: their fallback has always
 * been "Inside Zoo (3)", which is the weakest alt text on the site.
 */
export async function withAlts(
  srcs: string[],
  fallback: (src: string, index: number) => string,
): Promise<{ src: string; alt: string }[]> {
  const alts = await getImageAlts();
  return srcs.map((src, index) => ({
    src,
    alt: alts.get(src)?.trim() || fallback(src, index),
  }));
}
