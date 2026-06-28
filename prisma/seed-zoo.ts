import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

const FOLDER = "zoo";
const asset = (file: string) => `/categories/venues/${FOLDER}/${file}`;

async function getOrCreateVenue() {
  const existing = await prisma.venue.findUnique({ where: { slug: "zoo" } });
  if (existing) return existing;

  const category = await prisma.category.findFirst({ where: { name: "Nightlife" } });
  const slug = await ensureUniqueSlug("Zoo", async (s) => {
    const found = await prisma.venue.findUnique({ where: { slug: s } });
    return !!found;
  });
  return prisma.venue.create({
    data: {
      name: "Zoo",
      slug,
      description:
        "Zoo is a boutique lounge concept created for all party animals to embrace their wild side.\n\nKnown for its vibrant music direction, ranging from afro, amapiano, baila, to fresh DJ-led sounds, Zoo brings a unique energy to Jakarta\u2019s nightlife scene. Inside, guests can explore a lineup of immersive private rooms, each crafted with its own bold, animal-inspired design. Whether you\u2019re here for late-night drinks, curated DJ sets, or a private celebration, Zoo offers a nightlife experience unlike anywhere else in Jakarta the moment you step through the door.",
      caption: "A boutique lounge for all party animals",
      shortDescription:
        "A high-energy club where music leads and the night runs late. Zoo brings together a serious sound system, resident and guest DJs, and a packed dance floor for the city's most committed night owls.",
      image: asset("image.png"),
      bannerImage: asset("banner.jpg"),
      logo: asset("logo.png"),
      categoryId: category?.id ?? null,
      operatingHours: "Wednesday - Sunday: 19:00 - 04:00",
      location: "SCBD, Jakarta",
      lat: -6.226216879413745,
      lng: 106.80709112263447,
    },
  });
}

async function seedGalleries(venueId: string) {
  await prisma.segmentGallery.create({
    data: {
      title: "Inside Zoo",
      description:
        "Step into a bold, animal-inspired lounge where immersive private rooms and high-energy nights come together across a vibrant, multi-room space.",
      images: [asset("gallery-1.jpg"), asset("gallery-2.jpg"), asset("gallery-3.jpg"), asset("gallery-4.jpg")],
      imageTitles: [],
      imageDescriptions: [],
      special: false,
      venueId,
    },
  });

  await prisma.segmentGallery.create({
    data: {
      title: "Explore the Menu",
      description:
        "From shareable plates to late-night bites, our menu is built for the wild hours of the evening.",
      images: [
        asset("menu-1.png"), asset("menu-2.png"), asset("menu-3.png"), asset("menu-4.png"),
        asset("menu-5.png"), asset("menu-6.png"), asset("menu-7.png"), asset("menu-8.png"),
        asset("menu-9.png"), asset("menu-10.png"), asset("menu-11.png"), asset("menu-12.png"),
        asset("menu-13.png"), asset("menu-14.png"), asset("menu-15.png"), asset("menu-16.png"),
        asset("menu-17.png"),
      ],
      imageTitles: [],
      imageDescriptions: [],
      special: false,
      venueId,
    },
  });

  console.log("Seeded 2 segment galleries (Inside, Menu).");
}

async function seedPromotions(venueId: string) {
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 86400000);
  const PROMOS = [
    {
      poster: asset("promo-1.png"),
      name: "Wild Hour",
      shortDescription: "Discounted drinks and beats from open until 9 PM every Wednesday to Sunday.",
      description:
        "Kick off the night with Zoo's Wild Hour. Enjoy discounted signature cocktails, beer, and select spirits from opening until 9 PM, with resident DJs setting the tone for the evening.",
      caption: "Wed \u2013 Sun, open \u2013 21:00",
      terms: "<p>Valid Wednesday to Sunday from opening until 21:00. Dine-in only. Not combinable with other promotions.</p>",
      startHour: "19:00",
      endHour: "21:00",
    },
    {
      poster: asset("promo-2.png"),
      name: "Bottle Service Special",
      shortDescription: "Premium bottle service with mixers and a dedicated server for your table.",
      description:
        "Book a table and enjoy premium bottle service including your choice of spirits, selection of mixers, and a dedicated server for the night. Perfect for groups and private celebrations.",
      caption: "Available nightly",
      terms: "<p>Available Wednesday to Sunday. Advance reservation recommended. Prices vary by bottle selection.</p>",
      startHour: "19:00",
      endHour: "04:00",
    },
    {
      poster: asset("promo-3.png"),
      name: "Birthday Party Package",
      shortDescription: "Celebrate your birthday with a reserved table, bottle, and a complimentary shot tower.",
      description:
        "Make your birthday one to remember at Zoo. Package includes a reserved table, a bottle of your choice, mixers, and a complimentary shot tower for the birthday guest.",
      caption: "Valid on your birthday week",
      terms: "<p>Valid for the birthday week. Valid ID required. Advance booking required. Maximum 6 guests per package.</p>",
      startHour: "19:00",
      endHour: "04:00",
    },
    {
      poster: asset("promo-4.png"),
      name: "Ladies Night",
      shortDescription: "Free-flow selected cocktails for ladies every Wednesday night.",
      description:
        "Every Wednesday is Ladies Night at Zoo. Enjoy free-flow selected cocktails and mocktails for ladies from 8 PM to midnight. Bring your friends and take over the dance floor.",
      caption: "Every Wednesday, 20:00 \u2013 00:00",
      terms: "<p>Valid every Wednesday from 20:00 to midnight. Ladies only. Not combinable with other promotions.</p>",
      startHour: "20:00",
      endHour: "00:00",
    },
  ];

  for (const p of PROMOS) {
    const slug = await ensureUniqueSlug(p.name, async (s) => {
      const found = await prisma.promotion.findUnique({ where: { slug: s } });
      return !!found;
    });
    await prisma.promotion.create({
      data: {
        name: p.name,
        slug,
        posterImage: p.poster,
        image: p.poster,
        shortDescription: p.shortDescription,
        description: p.description,
        caption: p.caption,
        terms: p.terms,
        startDate: now,
        endDate: in30,
        startHour: p.startHour,
        endHour: p.endHour,
        venueId,
      },
    });
  }
  console.log(`Seeded ${PROMOS.length} promotions.`);
}

async function seedVenueFaqs() {
  await prisma.faq.deleteMany({ where: { segment: "venue" } });
  const FAQS = [
    {
      question: "Do I need to make a reservation?",
      answer: "Walk-ins are welcome, but reservations are recommended for weekends, group bookings, and peak hours.",
    },
    {
      question: "Is Zoo suitable for group celebrations?",
      answer: "Yes. Zoo offers private rooms and table packages perfect for birthdays, bachelor parties, and group celebrations.",
    },
    {
      question: "Can I host a private event here?",
      answer: "Yes. Zoo can be booked for private events, from intimate gatherings to full-venue celebrations. Reach out to our team to discuss availability.",
    },
    {
      question: "Is there parking available?",
      answer: "Yes, valet and self-parking are available at the SCBD complex where the venue is located.",
    },
  ];
  await prisma.faq.createMany({
    data: FAQS.map((f, i) => ({
      question: f.question,
      answer: `<p>${f.answer}</p>`,
      segment: "venue",
      sortOrder: i,
    })),
  });
  console.log(`Seeded ${FAQS.length} venue FAQs.`);
}

async function main() {
  const venue = await getOrCreateVenue();

  await prisma.segmentGallery.deleteMany({ where: { venueId: venue.id } });
  await prisma.promotion.deleteMany({ where: { venueId: venue.id } });

  await seedGalleries(venue.id);
  await seedPromotions(venue.id);
  await seedVenueFaqs();

  console.log(`\nDone seeding Zoo (${venue.slug}).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
