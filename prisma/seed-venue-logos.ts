import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// Repoints every venue's `logo` at the normalized 512x512 asset regenerated
// from `Logo-1000px/` (see public/categories/venues/<slug>/logo.png). Needed
// because the 7 venue seeds only create-if-missing, so editing their `logo:`
// line never touches an already-seeded row — and an admin may have since
// replaced a venue's logo via the upload form, pointing it at /uploads/venues/
// instead of this canonical path.
const UPDATES = [
  { slug: "atsumaru-izakaya", folder: "atsumaru-izakaya" },
  { slug: "zoo", folder: "zoo" },
  { slug: "swillhouse", folder: "swillhouse" },
  { slug: "kilo", folder: "kilo" },
  { slug: "dualism", folder: "dualism" },
  { slug: "truce", folder: "truce" },
  { slug: "lecirque", folder: "lecirque" },
];

async function main() {
  for (const { slug, folder } of UPDATES) {
    const { count } = await prisma.venue.updateMany({
      where: { slug },
      data: { logo: `/categories/venues/${folder}/logo.png` },
    });
    if (count === 0) console.warn(`  ⚠ Venue "${slug}" not found — skipped`);
    else console.log(`  ✓ ${slug}`);
  }
  console.log("Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
