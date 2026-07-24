import { readFile } from "node:fs/promises";
import path from "node:path";
import { MIME_BY_EXT, UPLOAD_ROOT } from "@/lib/upload";

/**
 * Serves admin-uploaded media from public/uploads at request time.
 *
 * `next start` snapshots the public/ directory into a Set once at boot and only
 * consults that Set per request (the fresh-from-disk fallback is dev-only), so a
 * file written by an upload after boot 404s until the process restarts. A miss on
 * the public folder falls through to the app router, so this handler picks those
 * up and reads from disk directly.
 *
 * Uploads present at boot are still served by Next's own static path — the public
 * folder is checked before app routes — so this only handles what that misses.
 * It also covers next/image, which resolves local src values through an internal
 * mocked request rather than an outbound one (i.e. it never reaches nginx).
 */
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  let resolved: string;
  try {
    resolved = path.resolve(UPLOAD_ROOT, ...segments.map((s) => decodeURIComponent(s)));
  } catch {
    return new Response("Not found", { status: 404 }); // malformed percent-encoding
  }

  // Same traversal guard as deleteUploadedFile. 404 rather than 403 so this never
  // reveals whether something exists outside the upload root.
  if (resolved !== UPLOAD_ROOT && !resolved.startsWith(UPLOAD_ROOT + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  let file: Buffer;
  try {
    file = await readFile(resolved);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(resolved).slice(1).toLowerCase();

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
      // Filenames are uuids, so a given path's bytes never change.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
