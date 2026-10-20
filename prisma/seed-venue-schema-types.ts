import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import type { VenueSchemaType } from "../src/generated/prisma/client";

/**
 * Per-venue schema.org `@type`, exactly as confirmed with the client on
 * 19 Oct 2026 and recorded in `requests/swillfam-schema-samples.md` §4.
 *
 * Seeded rather than hard-coded in the schema builder, because the brief is
 * explicit that this is an admin field — a venue that changes character, or a
 * new venue, must be settable without a deploy. This script only supplies the
 * launch values.
 *
 * Kilo Jakarta takes two types because it is both a restaurant and a bar; the
 * builder emits `@type` as an array in that case.
 *
 * `cuisine`, the street address, postal code and Instagram URL are deliberately
 * NOT seeded — they are still blocked on the venue fact sheet from the SEO
 * side, and guessing them would put wrong data in front of search engines.
 */
const SCHEMA_TYPES: { slug: string; types: VenueSchemaType[] }[] = [
  { slug: "kilo-jakarta", types: ["Restaurant", "BarOrPub"] },
  { slug: "kilo-cafe", types: ["CafeOrCoffeeShop"] },
  { slug: "dualism", types: ["BarOrPub"] },
  { slug: "truce", types: ["BarOrPub"] },
  { slug: "zoo", types: ["NightClub"] },
  { slug: "le-cirque", types: ["NightClub"] },
  { slug: "swillhouse", types: ["NightClub"] },
  // Atsumaru Izakaya is off the site at launch (published = false) and so has
  // no page and no schema. Typed anyway so that republishing it is one toggle.
  { slug: "atsumaru-izakaya", types: ["Restaurant"] },
];

async function main() {
  for (const { slug, types } of SCHEMA_TYPES) {
    const { count } = await prisma.venue.updateMany({
      where: { slug },
      data: { schemaTypes: types },
    });
    if (count === 0) console.warn(`  ⚠ Venue "${slug}" not found — skipped`);
    else console.log(`  ✓ ${slug} → ${types.join(", ")}`);
  }
  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
