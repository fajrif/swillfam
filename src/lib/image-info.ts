"use server";

import { stat } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_ROOT } from "./upload";

/** Best-effort byte size lookup for an already-uploaded file, given its public path. */
export async function getUploadedFileSize(publicPath: string): Promise<number | null> {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return null;
  const resolved = path.resolve(path.join(process.cwd(), "public", publicPath));
  if (resolved !== UPLOAD_ROOT && !resolved.startsWith(UPLOAD_ROOT + path.sep)) return null;
  try {
    const stats = await stat(resolved);
    return stats.size;
  } catch {
    return null;
  }
}
