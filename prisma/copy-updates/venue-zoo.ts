import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venue Zoo" sheet of Swillfam.xlsx.
 * Run with: npx tsx prisma/copy-updates/venue-zoo.ts
 */

const SLUG = "zoo";

const HERO_TITLE = "Enter the Wild Side";
const HERO_DESCRIPTION =
  "A sanctuary for party animals, where music, design, and energy collide into Jakarta's boldest nightlife experience.";

const CAPTION = "Home for Party Animals";
const DESCRIPTION =
  "Zoo is SwillFam's boldest creative expression yet, a club where musical styles roam free and guide party animals toward their untamed energy. Recognized as one of the standout names in SCBD nightlife, Zoo transports guests the moment they step inside: intricate feathers symbolizing birds of the sky, water patterns representing aquatic life, pulling visitors out of the concrete jungle and into a realm of wilderness. Uniquely designed private rooms, each reflecting a different animalistic style, give guests something unlike anything else in the city. Set to a soundtrack of afro house and afro dance music, Zoo is where Jakarta's party animals come to lose themselves and don't want to be found.";

const GALLERY_TITLE = "Inside Zoo";
const GALLERY_DESCRIPTION = "Step inside Zoo and see the space for yourself.";

const MENU_TITLE = "Explore Our Menu";
const MENU_DESCRIPTION = "Every drink on the Zoo menu, built for a night among party animals.";

// Zoo has no `special` dish/drink gallery — the xlsx's "What to Try" header has nowhere to render.

const TALENT_SECTION_TITLE = "Meet Our Talents";
const TALENT_SECTION_DESCRIPTION = "Get to know the resident DJs and talents shaping the sound at Zoo.";

const FAQS: { question: string; answer: string; sortOrder: number }[] = [
  {
    question: "Do I need a reservation, or can I walk in?",
    answer:
      "Zoo fills up fast, especially for the sofa in our lounge and for our private rooms. Reservations are strongly recommended if you want guaranteed seats in the wilderness. Walk-ins are welcome.",
    sortOrder: 0,
  },
  {
    question: "What's the dress code?",
    answer:
      "Zoo leans bold, not buttoned-up. Dress to match the energy, think confident, a little wild, ready for a night that doesn't hold back. Strictly no shorts, sandals, or sleeveless (for men).",
    sortOrder: 1,
  },
  {
    question: "Do you take private event bookings?",
    answer:
      "Yes. Zoo's animal-themed private rooms are built for intimate gatherings, while the hall is perfect for corporate events, wedding after-party, or any big celebration. Get in touch to discuss your next event with us.",
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

  await galleryUpdate("Inside Zoo", GALLERY_TITLE, GALLERY_DESCRIPTION);
  await galleryUpdate("Explore the Menu", MENU_TITLE, MENU_DESCRIPTION);

  await prisma.faq.deleteMany({ where: { segment: "venue", refSlug: SLUG } });
  await prisma.faq.createMany({
    data: FAQS.map((f) => ({ ...f, segment: "venue", refSlug: SLUG, published: true })),
  });

  console.log("Updated Venue Zoo: hero, caption, description, gallery headers, talent section, FAQs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
