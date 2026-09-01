import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venue Le Cirque" sheet of Swillfam.xlsx.
 * Run with: npx tsx prisma/copy-updates/venue-lecirque.ts
 */

const SLUG = "lecirque";

// Data-quality fix: Venue.name was "Lecirque" (no space) — leaks into every ${venue.name}
// interpolated string (Upcoming Events, Location Map, etc). The venue's own gallery already used
// "Le Cirque" (with space), and the xlsx consistently writes it with a space. Slug is untouched.
const NAME = "Le Cirque";

const HERO_TITLE = "A Playground of Sound";
const HERO_DESCRIPTION =
  "A fluid, multisensory experience that evolves through the night with custom lighting that responds to the rhythm of the room.";

const CAPTION = "Music, Lights, In Motion";
const DESCRIPTION =
  "Le Cirque is built as a playground of sound, style, and atmosphere, where Jakarta's music lovers, tastemakers, and creatives gather to connect. Set to a soundtrack of house music, Le Cirque stands out in the city's club scene with a lighting and visual system that responds in real time to the rhythm of the room. Recognized among the best venues in Jakarta, this smoke-free club draws a crowd that doesn't check the time, because on Le Cirque's floor, the night doesn't really end, it just changes shape.";

const GALLERY_TITLE = "Inside Le Cirque";
const GALLERY_DESCRIPTION = "Step inside Le Cirque and see the space for yourself.";

const MENU_TITLE = "Explore Our Menu";
const MENU_DESCRIPTION = "Every drink on the Le Cirque menu, built for a night that moves with the room.";

// No `special` dish/drink gallery — the xlsx's "What to Try" header has nowhere to render.
// Location Map & Operating Hours: xlsx left this blank for Le Cirque — already covered by the
// shared template.

const TALENT_SECTION_TITLE = "Meet Our Talents";
const TALENT_SECTION_DESCRIPTION = "Get to know the resident DJs and talents shaping the sound at Le Cirque.";

const FAQS: { question: string; answer: string; sortOrder: number }[] = [
  {
    question: "Do I need a reservation, or can I walk in?",
    answer: "Reservations are recommended if you want a spot early. Walk-ins are always welcome.",
    sortOrder: 0,
  },
  {
    question: "What's the dress code?",
    answer:
      "Come dressed to move. Le Cirque leans stylish and expressive, built for a crowd that's here for the music as much as the scene. Strictly no shorts or sandals or sleeveless (for men).",
    sortOrder: 1,
  },
  {
    question: "Do you take private event bookings?",
    answer:
      "Yes, Le Cirque's beautiful design, along with its lighting and sound system make it a natural fit for anything from a birthday to a full-scale event. Get in touch to check availability and start planning.",
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
      name: NAME,
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

  await galleryUpdate("Inside Le Cirque", GALLERY_TITLE, GALLERY_DESCRIPTION);
  await galleryUpdate("Explore the Menu", MENU_TITLE, MENU_DESCRIPTION);

  await prisma.faq.deleteMany({ where: { segment: "venue", refSlug: SLUG } });
  await prisma.faq.createMany({
    data: FAQS.map((f) => ({ ...f, segment: "venue", refSlug: SLUG, published: true })),
  });

  console.log("Updated Venue Le Cirque: name, hero, caption, description, gallery headers, talent section, FAQs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
