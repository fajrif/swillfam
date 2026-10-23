/**
 * Sizes the Halloween campaign art for the web.
 *
 *   npx tsx scripts/generate-halloween-images.ts
 *
 * The supplied files are print-sized (banner 8000x4500, flyer 4500x5625 - 10 MB).
 * Decoding that in `sharp` for every size `next/image` asks for is the
 * memory-hungry work that already pushed the Node process past its PM2 cap, so
 * the site uses these WebP derivatives instead and the PNGs stay out of git.
 *
 * Reads (untracked, in public/):
 *   TF_BANNER_SWILLFAM.png   -> public/halloween/banner.webp   2560 px wide
 *   MAIN_FLYER_SWILLFAM.png  -> public/halloween/flyer.webp    1400 px wide
 */
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");

const JOBS = [
  { from: "TF_BANNER_SWILLFAM.png", to: "halloween/banner.webp", width: 2560 },
  { from: "MAIN_FLYER_SWILLFAM.png", to: "halloween/flyer.webp", width: 1400 },
];

async function main() {
  for (const { from, to, width } of JOBS) {
    const info = await sharp(path.join(PUBLIC, from))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(PUBLIC, to));
    console.log(`${to}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
  }
}

main();
