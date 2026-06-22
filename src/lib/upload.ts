import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
export const PDF_MIME_TYPES = ["application/pdf"];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

/** Validate + persist one upload under public/uploads/<category>/. Returns the public path. */
export async function saveUploadedFile(
  file: File,
  category: string,
  opts: { allowedTypes: string[]; maxBytes: number },
): Promise<string> {
  if (!opts.allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size > opts.maxBytes) {
    throw new Error(`File too large (max ${Math.round(opts.maxBytes / 1024 / 1024)} MB).`);
  }
  const ext = EXT_BY_MIME[file.type] ?? "bin";
  const dir = path.join(UPLOAD_ROOT, category);
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${category}/${filename}`;
}

/** Best-effort delete of a file by its public path. Guards against path traversal; never throws. */
export async function deleteUploadedFile(publicPath: string | null | undefined): Promise<void> {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;
  const resolved = path.resolve(path.join(process.cwd(), "public", publicPath));
  if (resolved !== UPLOAD_ROOT && !resolved.startsWith(UPLOAD_ROOT + path.sep)) return;
  try {
    await unlink(resolved);
  } catch {
    // ignore — cleanup is best-effort (already-gone files are fine)
  }
}

/** Delete many files by public path. */
export async function deleteUploadedFiles(
  paths: (string | null | undefined)[],
): Promise<void> {
  await Promise.all(paths.map((p) => deleteUploadedFile(p)));
}

/** Flatten a mix of single paths / path arrays / nullish into a clean string[] (for record-delete cleanup). */
export function collectImagePaths(
  ...values: (string | string[] | null | undefined)[]
): string[] {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (Array.isArray(v)) out.push(...v.filter(Boolean));
    else out.push(v);
  }
  return out;
}

/**
 * Reconcile an image field posted by <ImageManager>. Reads:
 *   - `<field>__order`: JSON array of tokens (existing path strings or "new:<N>")
 *   - `<field>__file`:  the newly uploaded File objects, in add order
 * Saves new files, keeps existing ones in the posted order, and deletes any
 * previously-stored file that is no longer present. Returns the final ordered paths.
 */
export async function reconcileImageField(opts: {
  formData: FormData;
  field: string;
  category: string;
  previousPaths: string[];
  allowedTypes?: string[];
  maxBytes?: number;
}): Promise<string[]> {
  const { formData, field, category, previousPaths } = opts;
  const allowedTypes = opts.allowedTypes ?? IMAGE_MIME_TYPES;
  const maxBytes = opts.maxBytes ?? MAX_IMAGE_BYTES;

  let tokens: string[] = [];
  const orderRaw = String(formData.get(`${field}__order`) ?? "");
  if (orderRaw) {
    try {
      const parsed = JSON.parse(orderRaw);
      if (Array.isArray(parsed)) tokens = parsed.map(String);
    } catch {
      tokens = [];
    }
  }

  const files = formData
    .getAll(`${field}__file`)
    .filter((f): f is File => f instanceof File && f.size > 0);

  const finalPaths: string[] = [];
  for (const token of tokens) {
    if (token.startsWith("new:")) {
      const idx = Number.parseInt(token.slice(4), 10);
      const file = files[idx];
      if (file) finalPaths.push(await saveUploadedFile(file, category, { allowedTypes, maxBytes }));
    } else if (previousPaths.includes(token)) {
      finalPaths.push(token);
    }
  }

  const removed = previousPaths.filter((p) => !finalPaths.includes(p));
  await deleteUploadedFiles(removed);

  return finalPaths;
}

/** Single-image variant of reconcileImageField — returns one path or null. */
export async function reconcileSingleImage(opts: {
  formData: FormData;
  field: string;
  category: string;
  previousPath: string | null;
  allowedTypes?: string[];
  maxBytes?: number;
}): Promise<string | null> {
  const paths = await reconcileImageField({
    formData: opts.formData,
    field: opts.field,
    category: opts.category,
    previousPaths: opts.previousPath ? [opts.previousPath] : [],
    allowedTypes: opts.allowedTypes,
    maxBytes: opts.maxBytes,
  });
  // Single field never keeps more than one; drop+delete any extras defensively.
  if (paths.length > 1) await deleteUploadedFiles(paths.slice(1));
  return paths[0] ?? null;
}
