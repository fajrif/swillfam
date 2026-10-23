import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

/**
 * Reverse of EXT_BY_MIME, for serving stored files back (see the /uploads route
 * handler). Written out rather than derived because the mapping isn't 1:1 —
 * both image/jpeg and image/jpg store as "jpg", and jpeg is the correct type.
 */
export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  pdf: "application/pdf",
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

/** Longest edge an image placed inside a rich-text body is kept at. */
const BODY_IMAGE_MAX_WIDTH = 1600;

/**
 * Persist one picture for a rich-text body: shrunk to at most 1600px wide and
 * re-encoded as WebP (the site's only delivery format), then written under
 * public/uploads/<category>/. Returns the public path and the stored size, so the
 * editor can write width/height and the page doesn't shift while it loads.
 */
export async function saveBodyImage(
  file: File,
  category: string,
): Promise<{ src: string; width: number; height: number }> {
  if (!IMAGE_MIME_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`File too large (max ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB).`);
  }
  const { default: sharp } = await import("sharp");
  const { data, info } = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: BODY_IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const dir = path.join(UPLOAD_ROOT, category);
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  await writeFile(path.join(dir, filename), data);
  return { src: `/uploads/${category}/${filename}`, width: info.width, height: info.height };
}

/** Every `/uploads/...` path used as an <img src> inside a rich-text HTML string. */
export function inlineImagePaths(html: string | null | undefined): string[] {
  if (!html) return [];
  return [...html.matchAll(/<img\b[^>]*?\bsrc="(\/uploads\/[^"]+)"/g)].map((m) => m[1]);
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

/**
 * Delete many files by public path, and the alt text that described them.
 *
 * The alt rows are dropped here rather than in each `deleteX` action because
 * every one of them already routes its cleanup through this function — and
 * unlike the unlink, the delete is *not* limited to `/uploads/`: a venue whose
 * seeded `/categories/...` photo is replaced by an upload leaves behind an alt
 * row for a path the row no longer uses.
 */
export async function deleteUploadedFiles(
  paths: (string | null | undefined)[],
): Promise<void> {
  await Promise.all(paths.map((p) => deleteUploadedFile(p)));
  const known = paths.filter((p): p is string => Boolean(p));
  if (known.length > 0) {
    await prisma.imageAlt.deleteMany({ where: { path: { in: known } } });
  }
}

/**
 * Store the alt text for the images a field just saved.
 *
 * Alt lives in `ImageAlt`, keyed by path, so it is written here rather than by
 * each action: the call that saves the files is the only place that knows
 * which paths a field ended up with. A blank alt deletes the row instead of
 * storing `""` — "nobody has described this yet" and "this image is
 * decorative" are different claims, and the render sites fall back on the
 * first. Removed files take their alt with them via `deleteUploadedFiles`.
 */
async function saveImageAlts(entries: { path: string; alt: string }[]) {
  const blank: string[] = [];

  for (const { path: imagePath, alt } of entries) {
    const trimmed = alt.trim();
    if (!trimmed) {
      blank.push(imagePath);
      continue;
    }
    await prisma.imageAlt.upsert({
      where: { path: imagePath },
      create: { path: imagePath, alt: trimmed },
      update: { alt: trimmed },
    });
  }

  if (blank.length > 0) {
    await prisma.imageAlt.deleteMany({ where: { path: { in: blank } } });
  }
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

  const tokens = parseJsonStringArray(formData.get(`${field}__order`));
  // Index-aligned with `__order`, same contract as `__titles`. A field
  // rendered with `alts={false}` — a logo, an avatar, a share card — posts no
  // array at all, and `hasAlts` keeps those saves from reading as "the admin
  // cleared every description" and deleting rows they never owned.
  const hasAlts = formData.has(`${field}__alts`);
  const altsIn = parseJsonStringArray(formData.get(`${field}__alts`));

  const files = formData
    .getAll(`${field}__file`)
    .filter((f): f is File => f instanceof File && f.size > 0);

  const finalPaths: string[] = [];
  const alts: { path: string; alt: string }[] = [];

  for (const [index, token] of tokens.entries()) {
    let saved: string | null = null;
    if (token.startsWith("new:")) {
      const idx = Number.parseInt(token.slice(4), 10);
      const file = files[idx];
      if (file) saved = await saveUploadedFile(file, category, { allowedTypes, maxBytes });
    } else if (previousPaths.includes(token)) {
      saved = token;
    }
    if (saved) {
      finalPaths.push(saved);
      // Read by index, not by path: a brand-new file has no path until the
      // line above saved it, and the admin typed its alt before that existed.
      alts.push({ path: saved, alt: altsIn[index] ?? "" });
    }
  }

  await deleteUploadedFiles(previousPaths.filter((p) => !finalPaths.includes(p)));
  if (hasAlts) await saveImageAlts(alts);

  return finalPaths;
}

/** Parse a hidden field holding a JSON string array (used for order/titles/descriptions). */
function parseJsonStringArray(value: FormDataEntryValue | null): string[] {
  const raw = String(value ?? "");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Caption-aware variant of {@link reconcileImageField}. In addition to the
 * ordered paths, reads the index-aligned `<field>__titles` / `<field>__descriptions`
 * JSON arrays posted by <ImageManager captions>. Titles/descriptions are kept in
 * lockstep with the surviving paths (so dropped tokens don't misalign the arrays).
 */
export async function reconcileImageFieldWithCaptions(opts: {
  formData: FormData;
  field: string;
  category: string;
  previousPaths: string[];
  allowedTypes?: string[];
  maxBytes?: number;
}): Promise<{ paths: string[]; titles: string[]; descriptions: string[] }> {
  const { formData, field, category, previousPaths } = opts;
  const allowedTypes = opts.allowedTypes ?? IMAGE_MIME_TYPES;
  const maxBytes = opts.maxBytes ?? MAX_IMAGE_BYTES;

  const tokens = parseJsonStringArray(formData.get(`${field}__order`));
  const titlesIn = parseJsonStringArray(formData.get(`${field}__titles`));
  const descriptionsIn = parseJsonStringArray(formData.get(`${field}__descriptions`));
  const hasAlts = formData.has(`${field}__alts`);
  const altsIn = parseJsonStringArray(formData.get(`${field}__alts`));

  const files = formData
    .getAll(`${field}__file`)
    .filter((f): f is File => f instanceof File && f.size > 0);

  const paths: string[] = [];
  const titles: string[] = [];
  const descriptions: string[] = [];
  const alts: { path: string; alt: string }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let saved: string | null = null;
    if (token.startsWith("new:")) {
      const idx = Number.parseInt(token.slice(4), 10);
      const file = files[idx];
      if (file) saved = await saveUploadedFile(file, category, { allowedTypes, maxBytes });
    } else if (previousPaths.includes(token)) {
      saved = token;
    }
    if (saved) {
      paths.push(saved);
      titles.push(titlesIn[i] ?? "");
      descriptions.push(descriptionsIn[i] ?? "");
      alts.push({ path: saved, alt: altsIn[i] ?? "" });
    }
  }

  await deleteUploadedFiles(previousPaths.filter((p) => !paths.includes(p)));
  if (hasAlts) await saveImageAlts(alts);

  return { paths, titles, descriptions };
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
