import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Seeds the 6 canonical sample promotions (one per public/promotions/sample-promo-*.png,
 * matching the promotions mockup). Production-safe: matches existing venues by slug/name,
 * looks up (does not create) categories, and upserts by a stable slug — so it never deletes
 * existing promotions, never duplicates on re-run, and leaves admin-created rows alone.
 *
 * Run "npm run seed:promotion-categories" first so the promos get categorized.
 */

const IMG = (file: string) => `/promotions/${file}`;

const START = new Date("2026-07-01");
const END = new Date("2026-08-31");
const CAPTION = "Valid 1 July – 31 August 2026";
const TERMS = "<p>Valid for the promotion period. Dine-in only. Terms and conditions apply.</p>";

type Copy = { short: string; description: string; startHour: string; endHour: string };

const COPY: Record<string, Copy> = {
  "Ladies Night": {
    short:
      "Enjoy complimentary selected drinks for ladies before 10 PM, plus special DJ performances and exclusive table packages throughout the night.",
    description:
      "Every week, ladies enjoy complimentary selected drinks before 10 PM, paired with special DJ performances that keep the energy high all night. Reserve one of our exclusive table packages and make it a night to remember with your friends.",
    startHour: "20:00",
    endHour: "00:00",
  },
  "Dinner & Drinks Offer": {
    short:
      "Enjoy selected food and drink offers for casual dinners, group gatherings, after-work meetups, and relaxed evenings. Discover special menu selections and beverage deals.",
    description:
      "Gather for casual dinners, after-work meetups, or relaxed evenings with our selected food and drink offers. From shareable plates to signature beverages, discover special menu selections and beverage deals crafted to make every visit worth coming back for.",
    startHour: "18:00",
    endHour: "23:00",
  },
  "Group Table Package": {
    short:
      "Plan your night with a group table package for celebrations, parties, and late-night moments, featuring curated options that make it easier to gather friends and enjoy great drinks together.",
    description:
      "Bring your group together with a curated table package built for celebrations, parties, and late-night moments. Enjoy a reserved table, curated drinks, and a setup that makes it easy to gather friends and enjoy a great night together.",
    startHour: "19:00",
    endHour: "02:00",
  },
};

type Sample = {
  slug: string;
  venueSlug: string;
  venueName: string;
  title: keyof typeof COPY;
  category: string;
  image: string;
};

const SAMPLES: Sample[] = [
  { slug: "ladies-night-zoo", venueSlug: "zoo", venueName: "Zoo", title: "Ladies Night", category: "Ladies Night", image: IMG("sample-promo-zoo.png") },
  { slug: "dinner-drinks-atsumaru", venueSlug: "atsumaru-izakaya", venueName: "Atsumaru Izakaya", title: "Dinner & Drinks Offer", category: "Food & Drink", image: IMG("sample-promo-atsumaru.png") },
  { slug: "group-table-swillhouse", venueSlug: "swillhouse", venueName: "Swillhouse", title: "Group Table Package", category: "Group & Table", image: IMG("sample-promo-swillhouse.png") },
  { slug: "ladies-night-le-cirque", venueSlug: "lecirque", venueName: "Lecirque", title: "Ladies Night", category: "Ladies Night", image: IMG("sample-promo-lecirque.png") },
  { slug: "dinner-drinks-kilo", venueSlug: "kilo", venueName: "Kilo", title: "Dinner & Drinks Offer", category: "Food & Drink", image: IMG("sample-promo-kilo.png") },
  { slug: "group-table-truce", venueSlug: "truce", venueName: "Truce", title: "Group Table Package", category: "Group & Table", image: IMG("sample-promo-truce.png") },
];

async function main() {
  const cats = await prisma.promotionCategory.findMany({ select: { id: true, name: true } });
  const catId = (name: string) => cats.find((c) => c.name === name)?.id ?? null;

  let upserted = 0;
  let skipped = 0;

  for (const s of SAMPLES) {
    const venue = await prisma.venue.findFirst({
      where: { OR: [{ slug: s.venueSlug }, { name: { equals: s.venueName, mode: "insensitive" } }] },
    });
    if (!venue) {
      console.warn(`Skipped "${s.title}": venue not found (slug "${s.venueSlug}" / name "${s.venueName}").`);
      skipped += 1;
      continue;
    }

    const categoryId = catId(s.category);
    if (!categoryId) {
      console.warn(
        `Category "${s.category}" not found — run "npm run seed:promotion-categories" first. Seeding "${s.title}" without a category.`,
      );
    }

    const copy = COPY[s.title];
    const data = {
      name: s.title,
      image: s.image,
      posterImage: s.image,
      shortDescription: copy.short,
      description: copy.description,
      caption: CAPTION,
      terms: TERMS,
      startDate: START,
      endDate: END,
      startHour: copy.startHour,
      endHour: copy.endHour,
      venueId: venue.id,
      promotionCategoryId: categoryId,
    };

    await prisma.promotion.upsert({
      where: { slug: s.slug },
      create: { ...data, slug: s.slug },
      update: data,
    });
    upserted += 1;
  }

  console.log(`Upserted ${upserted}/${SAMPLES.length} sample promotions (skipped ${skipped} missing venues).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
