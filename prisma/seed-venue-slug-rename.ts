import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Aligns the venue slugs with the go-live URL plan (see ROADMAP_PLAN.md Fase 0):
 * `kilo` becomes `kilo-jakarta` so Kilo Cafe can take its own page, and
 * `lecirque` becomes the readable `le-cirque`. Atsumaru is unpublished rather
 * than deleted — its events, promotions and talents stay intact for the day it
 * comes back.
 *
 * Venue FAQs are keyed by `refSlug`, so they are renamed in the same pass or
 * they would silently detach from their venue. Asset folders under
 * `public/categories/venues/` deliberately keep their old names; only the URL
 * slug carries SEO weight, and the stored image paths stay valid.
 *
 * Safe to re-run: each step matches on the old slug and no-ops once renamed.
 */
const RENAMES = [
  { from: "kilo", to: "kilo-jakarta", name: "Kilo Jakarta" },
  { from: "lecirque", to: "le-cirque", name: "Le Cirque" },
];

const UNPUBLISH = ["atsumaru-izakaya"];

async function main() {
  for (const { from, to, name } of RENAMES) {
    const clash = await prisma.venue.findUnique({ where: { slug: to } });
    if (clash) {
      console.warn(`  ⚠ "${to}" already exists — skipping rename of "${from}"`);
      continue;
    }
    const { count } = await prisma.venue.updateMany({
      where: { slug: from },
      data: { slug: to, name },
    });
    if (count === 0) {
      console.warn(`  ⚠ Venue "${from}" not found — skipped`);
      continue;
    }
    const faqs = await prisma.faq.updateMany({
      where: { segment: "venue", refSlug: from },
      data: { refSlug: to },
    });
    console.log(`  ✓ ${from} → ${to} ("${name}") · ${faqs.count} FAQ(s) repointed`);
  }

  for (const slug of UNPUBLISH) {
    const { count } = await prisma.venue.updateMany({
      where: { slug },
      data: { published: false },
    });
    if (count === 0) console.warn(`  ⚠ Venue "${slug}" not found — skipped`);
    else console.log(`  ✓ ${slug} unpublished`);
  }

  console.log("Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
