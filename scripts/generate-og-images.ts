/**
 * Builds share-preview derivatives for every row whose `og:image` is still its
 * full-size display photo.
 *
 *   npx tsx --env-file=.env scripts/generate-og-images.ts
 *   npx tsx --env-file=.env scripts/generate-og-images.ts --force
 *
 * **Why.** Facebook allows 8 MB and Twitter 5 MB, but WhatsApp quietly drops
 * the preview for anything much past ~300 KB — so the link people share most
 * is the one most likely to arrive as a bare URL. Measured before this ran, 17
 * of 37 routes were over that line, up to 2 MB: the display art is sized for a
 * full-bleed hero, not a 1200x630 card.
 *
 * **How.** `Fase 2` added an `ogImage` column to every model for exactly this:
 * a share-only image that leaves the display photo untouched. This fills it in,
 * reading each row's source through the same `src/lib/seo/entities.ts`
 * resolvers the pages use — so the card is cropped from the picture the
 * preview would otherwise have shown, not from some separately-chosen field.
 *
 * **Idempotent.** A row that already has an `ogImage` is skipped, so a
 * hand-picked card is never overwritten. `--force` regenerates only the ones
 * this script made (paths under `/og/`), which is what you want after changing
 * the quality target or replacing a source photo.
 *
 * **Re-run after bulk uploads.** A new venue photo uploaded through the admin
 * does not get a derivative on its own; until this runs again, that row falls
 * back down its chain to the display image. Wiring generation into the upload
 * path is the proper fix and is logged as a follow-up.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  articleSeo,
  categorySeo,
  eventSeo,
  privateEventSeo,
  promotionSeo,
  talentSeo,
  venueSeo,
} from "../src/lib/seo/entities";

/** The size every platform scales from; also `og-default.jpg`'s size. */
const WIDTH = 1200;
const HEIGHT = 630;
/** WhatsApp's practical ceiling — the tightest of the platforms we care about. */
const BUDGET = 300 * 1024;
/** Tried in order until one lands under the budget. 86 KB is the default card. */
const QUALITIES = [82, 74, 66, 58, 50];

const ROOT = path.join(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const force = process.argv.includes("--force");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type Row = { id: string; slug: string; ogImage: string | null };

/** One model's rows plus how to read a row's source image and save the result. */
type Target<T extends Row> = {
  name: string;
  rows: () => Promise<T[]>;
  sourceOf: (row: T) => string | undefined;
  save: (id: string, ogImage: string) => Promise<unknown>;
};

/**
 * Should this row be (re)generated?
 *
 * An `ogImage` outside `/og/` was chosen by a person — never touch it, even
 * with `--force`.
 */
function wanted(row: Row): boolean {
  if (!row.ogImage) return true;
  return force && row.ogImage.startsWith("/og/");
}

/**
 * Crop to the card's aspect ratio and encode under the budget.
 *
 * `fit: "cover"` with the default centre gravity: these are venue interiors,
 * posters and portraits, and an attention-based crop moves the subject around
 * unpredictably between runs. Centre is boring and stable, which is the right
 * trade for a card nobody art-directs.
 */
async function derive(sourcePath: string): Promise<{ data: Buffer; quality: number }> {
  const base = sharp(path.join(PUBLIC, sourcePath))
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    // Cards are composited on a white or dark chrome depending on the app;
    // flattening onto the site's own background keeps transparent PNGs from
    // going black in some clients and white in others.
    .flatten({ background: "#0a0a0a" });

  for (const quality of QUALITIES) {
    const data = await base.clone().jpeg({ quality, progressive: true }).toBuffer();
    if (data.length <= BUDGET) return { data, quality };
  }
  // Fall through at the lowest quality rather than skipping the row: even an
  // over-budget 1200x630 card is far smaller than the multi-MB original.
  const data = await base.jpeg({ quality: QUALITIES.at(-1), progressive: true }).toBuffer();
  return { data, quality: QUALITIES.at(-1)! };
}

const targets: Target<Row>[] = [
  {
    name: "venues",
    rows: () => prisma.venue.findMany({ orderBy: { slug: "asc" } }),
    sourceOf: (v) => venueSeo(v as never).image.value,
    save: (id, ogImage) => prisma.venue.update({ where: { id }, data: { ogImage } }),
  },
  {
    name: "categories",
    rows: () => prisma.category.findMany({ orderBy: { slug: "asc" } }),
    sourceOf: (c) => categorySeo(c as never).image.value,
    save: (id, ogImage) => prisma.category.update({ where: { id }, data: { ogImage } }),
  },
  {
    name: "events",
    rows: () => prisma.event.findMany({ orderBy: { slug: "asc" } }),
    sourceOf: (e) => eventSeo(e as never).image.value,
    save: (id, ogImage) => prisma.event.update({ where: { id }, data: { ogImage } }),
  },
  {
    name: "promotions",
    rows: () => prisma.promotion.findMany({ orderBy: { slug: "asc" } }),
    sourceOf: (p) => promotionSeo(p as never).image.value,
    save: (id, ogImage) => prisma.promotion.update({ where: { id }, data: { ogImage } }),
  },
  {
    name: "talents",
    rows: () => prisma.talent.findMany({ orderBy: { slug: "asc" } }),
    sourceOf: (t) => talentSeo(t as never).image.value,
    save: (id, ogImage) => prisma.talent.update({ where: { id }, data: { ogImage } }),
  },
  {
    name: "guides",
    rows: () => prisma.article.findMany({ orderBy: { slug: "asc" } }),
    sourceOf: (a) => articleSeo(a as never).image.value,
    save: (id, ogImage) => prisma.article.update({ where: { id }, data: { ogImage } }),
  },
  {
    name: "private-events",
    rows: () => prisma.privateEvent.findMany({ orderBy: { slug: "asc" } }),
    sourceOf: (p) => privateEventSeo(p as never).image.value,
    save: (id, ogImage) => prisma.privateEvent.update({ where: { id }, data: { ogImage } }),
  },
];

async function main() {
  let made = 0;
  let skipped = 0;
  let overBudget = 0;

  for (const target of targets) {
    await mkdir(path.join(PUBLIC, "og", target.name), { recursive: true });

    for (const row of await target.rows()) {
      if (!wanted(row)) {
        skipped++;
        continue;
      }

      const source = target.sourceOf(row);
      // No picture anywhere in the chain: `buildMetadata` falls back to
      // `/og-default.jpg`, which is already a proper 86 KB card.
      if (!source || !source.startsWith("/")) {
        skipped++;
        continue;
      }

      let derived;
      try {
        derived = await derive(source);
      } catch (error) {
        // An upload missing from this machine's disk is expected — the folder
        // is gitignored — and must not stop the rest.
        console.log(`  --  ${target.name}/${row.slug}: ${(error as Error).message.split("\n")[0]}`);
        skipped++;
        continue;
      }

      const file = `/og/${target.name}/${row.slug}.jpg`;
      await writeFile(path.join(PUBLIC, file), derived.data);
      await target.save(row.id, file);

      const kb = derived.data.length / 1024;
      if (derived.data.length > BUDGET) overBudget++;
      console.log(
        `  ok  ${file.padEnd(46)} q${derived.quality}  ${kb.toFixed(0).padStart(4)} KB` +
          `${derived.data.length > BUDGET ? "  OVER BUDGET" : ""}  <- ${source}`,
      );
      made++;
    }
  }

  console.log(`\n${made} generated, ${skipped} skipped${overBudget ? `, ${overBudget} over budget` : ""}`);
  await prisma.$disconnect();
}

void main();
