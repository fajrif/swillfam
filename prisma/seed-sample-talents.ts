import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Seeds the 4 canonical sample talents (one per public/talents/sample-DJ-*.png,
 * matching the talents mockup). Production-safe: matches existing venues by slug/name,
 * looks up (does not create) categories, and finds-or-updates by the natural key
 * (name, venueId) — Talent has no unique slug, so this is a manual upsert rather than
 * a Prisma `.upsert()`. Never deletes existing talents, never duplicates on re-run.
 *
 * Run "npm run seed:talent-categories" first so the talents get categorized.
 */

const IMG = (file: string) => `/talents/${file}`;
const CATEGORY = "DJ";

type Sample = {
  venueSlug: string;
  venueName: string;
  name: string;
  speciality: string;
  description: string;
  instagramUrl: string;
  image: string;
};

const SAMPLES: Sample[] = [
  {
    venueSlug: "kilo",
    venueName: "Kilo",
    name: "DJ Nova",
    speciality: "Resident DJ",
    description:
      "DJ Nova anchors the decks at Kilo with a genre-spanning set that moves from lounge grooves into full dancefloor energy as the night goes on, reading the room and building the set course by course.",
    instagramUrl: "https://instagram.com/",
    image: IMG("sample-DJ-kilo.png"),
  },
  {
    venueSlug: "lecirque",
    venueName: "Lecirque",
    name: "DJ Rae",
    speciality: "Resident DJ",
    description:
      "DJ Rae brings a polished, late-night sound to Le Cirque, blending house and disco influences into sets built for a room that likes to dress up and stay out.",
    instagramUrl: "https://instagram.com/",
    image: IMG("sample-DJ-lecirque.png"),
  },
  {
    venueSlug: "swillhouse",
    venueName: "Swillhouse",
    name: "DJ Ezra",
    speciality: "Resident DJ",
    description:
      "DJ Ezra keeps Swillhouse's dancefloor moving with a hip-hop and afrobeats-driven set, known for reading the crowd and keeping the energy high from open until close.",
    instagramUrl: "https://instagram.com/",
    image: IMG("sample-DJ-swillhouse.png"),
  },
  {
    venueSlug: "zoo",
    venueName: "Zoo",
    name: "DJ Wilder",
    speciality: "Resident DJ",
    description:
      "DJ Wilder headlines Zoo's wildest nights, spinning afro, amapiano, and baila-inspired sets that define the venue's signature high-energy sound.",
    instagramUrl: "https://instagram.com/",
    image: IMG("sample-DJ-zoo.png"),
  },
];

async function main() {
  const cats = await prisma.talentCategory.findMany({ select: { id: true, name: true } });
  const categoryId = cats.find((c) => c.name === CATEGORY)?.id ?? null;
  if (!categoryId) {
    console.warn(`Category "${CATEGORY}" not found — run "npm run seed:talent-categories" first. Seeding without a category.`);
  }

  let upserted = 0;
  let skipped = 0;

  for (const s of SAMPLES) {
    const venue = await prisma.venue.findFirst({
      where: { OR: [{ slug: s.venueSlug }, { name: { equals: s.venueName, mode: "insensitive" } }] },
    });
    if (!venue) {
      console.warn(`Skipped "${s.name}": venue not found (slug "${s.venueSlug}" / name "${s.venueName}").`);
      skipped += 1;
      continue;
    }

    const data = {
      name: s.name,
      speciality: s.speciality,
      description: s.description,
      instagramUrl: s.instagramUrl,
      image: s.image,
      venueId: venue.id,
      talentCategoryId: categoryId,
    };

    const existing = await prisma.talent.findFirst({ where: { name: s.name, venueId: venue.id } });
    if (existing) {
      await prisma.talent.update({ where: { id: existing.id }, data });
    } else {
      await prisma.talent.create({ data });
    }
    upserted += 1;
  }

  console.log(`Upserted ${upserted}/${SAMPLES.length} sample talents (skipped ${skipped} missing venues).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
