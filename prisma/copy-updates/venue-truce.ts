import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venue Truce" sheet of Swillfam.xlsx.
 * Run with: npx tsx prisma/copy-updates/venue-truce.ts
 */

const SLUG = "truce";

const HERO_TITLE = "A Journey of Quiet Craft";
const HERO_DESCRIPTION =
  "A slow bar built on balance and restraint, where every pour is deliberate and every detail distilled.";

const CAPTION = "The Art of Restraint";
const DESCRIPTION =
  "Truce is a slow bar tucked into a small footprint in SCBD, part of a growing scene of cocktail bar Jakarta Selatan has become known for. Drawing on Japanese bar philosophy as an approach rather than an aesthetic, Truce Jakarta works with balance, restraint, and quiet craft, carrying the imprint of its past while moving toward something sharper and more precise. There's no theatrics here, no overexplaining, just thoughtful drinks in a laid-back room, spinning vinyl and feeding regulars who like their spirits serious and their atmosphere soft. Recognized as a Japanese bar with real depth, Truce Bar is where salarymen stop before heading home, and where guests end up staying far longer than planned.";

const GALLERY_TITLE = "Inside Truce";
const GALLERY_DESCRIPTION = "Step inside Truce and see the space for yourself.";

// Truce has only one SegmentGallery ("Inside Truce"), no non-special "menu" gallery and no
// `special` dish/drink gallery — the xlsx's "Menu" and "What to Try" headers have nowhere to
// render (neither GalleryCarousel nor DishesSection has a matching row for either).

const TALENT_SECTION_TITLE = "Meet the Bar Team";
const TALENT_SECTION_DESCRIPTION = "The bartender and craftspeople behind every pour at Truce.";

const FAQS: { question: string; answer: string; sortOrder: number }[] = [
  {
    question: "Do I need a reservation, or can I walk in?",
    answer:
      "Truce is a small space and fills up quickly, especially on weeknights when the regulars are in. A reservation is recommended, but if you find yourself walking past, it's always worth checking if there's room at the bar.",
    sortOrder: 0,
  },
  {
    question: "What's the dress code?",
    answer:
      "No dress code. Truce is a room for people who appreciate good drinks over appearances. Come as you are, as long as you're ready to slow down a little.",
    sortOrder: 1,
  },
  {
    question: "Do you take private event bookings?",
    answer:
      "Yes, Truce is available for intimate private events, small group gatherings, and hosted tastings. The space is small by design, which makes it ideal for something personal and considered. Get in touch to check availability.",
    sortOrder: 2,
  },
];

async function main() {
  const venue = await prisma.venue.findUnique({
    where: { slug: SLUG },
    include: { segmentGalleries: true },
  });
  if (!venue) throw new Error(`Venue "${SLUG}" not found`);

  await prisma.venue.update({
    where: { id: venue.id },
    data: {
      heroTitle: HERO_TITLE,
      heroDescription: HERO_DESCRIPTION,
      caption: CAPTION,
      description: DESCRIPTION,
      talentSectionTitle: TALENT_SECTION_TITLE,
      talentSectionDescription: TALENT_SECTION_DESCRIPTION,
    },
  });

  const gallery = venue.segmentGalleries.find((g) => g.title === "Inside Truce");
  if (!gallery) {
    console.warn('  ! gallery "Inside Truce" not found, skipping');
  } else {
    await prisma.segmentGallery.update({
      where: { id: gallery.id },
      data: { title: GALLERY_TITLE, description: GALLERY_DESCRIPTION },
    });
  }

  await prisma.faq.deleteMany({ where: { segment: "venue", refSlug: SLUG } });
  await prisma.faq.createMany({
    data: FAQS.map((f) => ({ ...f, segment: "venue", refSlug: SLUG, published: true })),
  });

  console.log("Updated Venue Truce: hero, caption, description, gallery header, talent section, FAQs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
