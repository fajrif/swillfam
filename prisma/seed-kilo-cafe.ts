import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Creates the Kilo Cafe venue stub required by the go-live URL plan, which
 * splits the old single `kilo` venue into `kilo-jakarta` (restaurant and bar)
 * and `kilo-cafe` (café with padel).
 *
 * It ships unpublished on purpose: every text field below is placeholder copy,
 * so the venue stays off the public site, out of the sitemap and out of the
 * Organization schema until the content team fills it in and publishes from
 * /admin/venues. Create-if-missing, so re-running never overwrites their work.
 */
const SLUG = "kilo-cafe";

async function main() {
  const existing = await prisma.venue.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log(`  · ${SLUG} already exists — skipped`);
    return;
  }

  const category = await prisma.category.findFirst({ where: { name: "Lifestyle" } });
  if (!category) console.warn("  ⚠ Lifestyle category not found — venue created without one");

  await prisma.venue.create({
    data: {
      name: "Kilo Cafe",
      slug: SLUG,
      categoryId: category?.id ?? null,
      published: false,
      description: "[PLACEHOLDER] Awaiting final copy from the content team.",
      shortDescription: "[PLACEHOLDER] One to two sentences, used as the schema description.",
      caption: "[PLACEHOLDER] Café with padel",
      operatingHours: "[PLACEHOLDER]",
      location: "[PLACEHOLDER]",
    },
  });

  console.log(`  ✓ ${SLUG} created (unpublished — content team to complete and publish)`);
  console.log("Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
