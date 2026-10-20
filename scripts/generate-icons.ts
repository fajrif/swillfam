/**
 * Builds the icon set from `public/favicon.png`, the only square SwillFam mark
 * in the repo.
 *
 *   npx tsx scripts/generate-icons.ts
 *
 * The source is 84x84 — too small for an apple-touch-icon, let alone a 512px
 * manifest icon — but it is flat two-colour artwork (magenta glyphs on
 * transparency, 17 distinct pixel values in total), so it survives being scaled
 * up far better than a photo would: resample with lanczos, then snap the alpha
 * back to 0 or 255 and repaint every opaque pixel the brand magenta. That
 * removes the resampler's soft halo and gives edges as crisp as the source's,
 * at any size.
 *
 * It is still an upscale of an 84px original. **A vector or 1024px master from
 * the designer would be better** and is on the Fase 8 blocked list, alongside
 * the square parent-brand logo the Organization schema wants. Re-run this
 * script once that lands; nothing else has to change.
 *
 * Outputs (all committed):
 *   src/app/favicon.ico     16 + 32 + 48, PNG-encoded inside the ICO container
 *   src/app/icon.png        192, transparent — tabs and Android
 *   src/app/apple-icon.png  180, opaque — iOS composites transparency on black
 *   public/icon-192.png     referenced by src/app/manifest.ts
 *   public/icon-512.png     ditto
 */

import { Buffer } from "node:buffer";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "public/favicon.png");

/** The mark's own magenta, sampled from the source (not `--color-sf-accent`). */
const MARK = { r: 224, g: 7, b: 140 };
/** `--color-sf-bg`, for the icons that may not be transparent. */
const BACKDROP = { r: 10, g: 10, b: 10 };

/** Native size of the source mark. */
const SOURCE_SIZE = 84;

/**
 * One icon: scaled, re-sharpened, optionally flattened onto the dark backdrop.
 *
 * Working at 4x and reducing is what keeps the threshold from stair-stepping —
 * it decides each output pixel from 16 upscaled samples rather than one.
 *
 * When the target is larger than the source, a blur of about 1.5 source pixels
 * goes in before the threshold. Thresholding alone is faithful to the original,
 * and that is the problem: it preserves the staircase of an 84px curve exactly,
 * so the S came out visibly jagged at 512. Rounding the steps off first and
 * then hardening the edge gives a smooth curve without the resampler's halo.
 * Downscales skip it — there is nothing to invent, and blurring would only
 * cost detail.
 */
async function render(size: number, opaque: boolean): Promise<Buffer> {
  const big = size * 4;
  let scaled = sharp(SOURCE).resize(big, big, { kernel: "lanczos3" }).ensureAlpha();
  if (size > SOURCE_SIZE) scaled = scaled.blur((1.5 * big) / SOURCE_SIZE / 3);

  const { data, info } = await scaled.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    // Half-covered pixels become fully in or fully out, so the resampler's
    // halo disappears and the glyph keeps a hard edge.
    const on = data[i + 3] >= 128;
    data[i] = on ? MARK.r : 0;
    data[i + 1] = on ? MARK.g : 0;
    data[i + 2] = on ? MARK.b : 0;
    data[i + 3] = on ? 255 : 0;
  }

  let out = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize(size, size, { kernel: "lanczos3" });

  if (opaque) out = out.flatten({ background: BACKDROP });

  return out.png({ compressionLevel: 9 }).toBuffer();
}

/**
 * A PNG-in-ICO container.
 *
 * sharp has no ICO encoder, but the format is a 6-byte header, a 16-byte
 * directory entry per image, and the image payloads — and every browser that
 * still asks for `/favicon.ico` accepts PNG payloads. Writing it directly beats
 * adding a dependency for 40 lines of struct packing.
 */
function ico(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries: Buffer[] = [];

  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    // 0 means 256 in this field; every size we emit is smaller than that.
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette colours (0 = truecolour)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

async function main() {
  const targets: [file: string, size: number, opaque: boolean][] = [
    ["src/app/icon.png", 192, false],
    // Opaque: iOS ignores the alpha channel and composites on black, which
    // would leave the mark floating on a colour nobody chose.
    ["src/app/apple-icon.png", 180, true],
    ["public/icon-192.png", 192, false],
    ["public/icon-512.png", 512, false],
  ];

  for (const [file, size, opaque] of targets) {
    const png = await render(size, opaque);
    await writeFile(path.join(ROOT, file), png);
    console.log(`${file.padEnd(26)} ${size}px  ${(png.length / 1024).toFixed(1)} KB`);
  }

  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map(async (size) => ({ size, png: await render(size, false) })),
  );
  const bytes = ico(pngs);
  await writeFile(path.join(ROOT, "src/app/favicon.ico"), bytes);
  console.log(`${"src/app/favicon.ico".padEnd(26)} ${sizes.join("+")}px  ${(bytes.length / 1024).toFixed(1)} KB`);
}

void main();
