import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venue Swillhouse" sheet of Swillfam.xlsx.
 * Run with: npx tsx prisma/copy-updates/venue-swillhouse.ts
 */

const SLUG = "swillhouse";

const HERO_TITLE = "Jakarta's Definitive Hip-Hop Nightclub";
const HERO_DESCRIPTION =
  "Concrete walls, geometric neon ceilings, and a clear sightline to the DJ stage, built for nights that never slow down.";

const CAPTION = "Industrial Design, Untamed Energy";
const DESCRIPTION =
  "The Swillhouse is a hip hop club Jakarta regulars swear by, and one of the city's most versatile private event spaces. Industrial-contemporary design, concrete walls, geometric neon ceilings, a long central bar, and a clear sightline to the DJ stage give it the range to work as a nightclub one night and a brand activation the next. Recognized among the best hiphop club in Jakarta, Swillhouse has become a fixture of SCBD's nightlife scene and a go-to for young crowds exploring what the city has to offer after dark.";

const GALLERY_TITLE = "Inside Swillhouse";
const GALLERY_DESCRIPTION = "Step inside Swillhouse and see the space for yourself.";

const MENU_TITLE = "Explore Our Menu";
const MENU_DESCRIPTION = "Every drink on the Swillhouse menu, built for a night that runs late.";

// Swillhouse has no `special` dish/drink gallery — the xlsx's "What to Try" header has nowhere to render.
// Location Map & Operating Hours: xlsx left this blank for Swillhouse — already covered by the
// shared template in VenueLocationHours.tsx, no venue-specific override needed.

const TALENT_SECTION_TITLE = "Meet Our Talents";
const TALENT_SECTION_DESCRIPTION =
  "Get to know the resident DJs and talents shaping the sound at Swillhouse.";

// FAQ #2's xlsx answer was a copy-paste duplicate of FAQ #1's answer (confirmed against the raw
// cells) — replaced with the corrected text supplied directly by the user.
const FAQS: { question: string; answer: string; sortOrder: number }[] = [
  {
    question: "Do I need a reservation, or can I walk in?",
    answer:
      "Swillhouse gets busy fast, so reservations are recommended if you want a table near the stage, especially for groups. Walk-ins are always welcome, but come early if you want the best sightline.",
    sortOrder: 0,
  },
  {
    question: "What's the dress code?",
    answer:
      "Swillhouse keeps it street-smart, sneakers and streetwear are as welcome as anything dressed up. Strictly no shorts or sandals or sleeveless (for men).",
    sortOrder: 1,
  },
  {
    question: "Do you take private event bookings?",
    answer:
      "Yes, and it's one of the things Swillhouse does best. From brand activations to private parties, the space is built to flex for whatever you're planning. Get in touch to check the venue's availability.",
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

  const galleryUpdate = async (matchTitle: string, title: string, description: string) => {
    const gallery = venue.segmentGalleries.find((g) => g.title === matchTitle);
    if (!gallery) {
      console.warn(`  ! gallery "${matchTitle}" not found, skipping`);
      return;
    }
    await prisma.segmentGallery.update({ where: { id: gallery.id }, data: { title, description } });
  };

  await galleryUpdate("Inside Swillhouse", GALLERY_TITLE, GALLERY_DESCRIPTION);
  await galleryUpdate("Explore the Menu", MENU_TITLE, MENU_DESCRIPTION);

  await prisma.faq.deleteMany({ where: { segment: "venue", refSlug: SLUG } });
  await prisma.faq.createMany({
    data: FAQS.map((f) => ({ ...f, segment: "venue", refSlug: SLUG, published: true })),
  });

  console.log("Updated Venue Swillhouse: hero, caption, description, gallery headers, talent section, FAQs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
