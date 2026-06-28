import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

const FOLDER = "swillhouse";
const asset = (file: string) => `/categories/venues/${FOLDER}/${file}`;

async function getOrCreateVenue() {
  const existing = await prisma.venue.findUnique({ where: { slug: "swillhouse" } });
  if (existing) return existing;

  const category = await prisma.category.findFirst({ where: { name: "Nightlife" } });
  const slug = await ensureUniqueSlug("Swillhouse", async (s) => {
    const found = await prisma.venue.findUnique({ where: { slug: s } });
    return !!found;
  });
  return prisma.venue.create({
    data: {
      name: "Swillhouse",
      slug,
      description:
        "The Swillhouse is a hip-hop\u2013focused bar and creative event space in Jakarta.\n\nIt is known for its high-energy atmosphere, curated music, and contemporary minimalist design. A destination for nightlife lovers and the youthful party crowd, The Swillhouse blends hip-hop culture, live DJ sets, and signature events under one roof. Here, hype isn\u2019t just a feeling, it\u2019s the experience. The Swillhouse continues to be one of Jakarta\u2019s go-to spots for nights out, club sessions, and unforgettable moments.",
      caption: "Hip-hop culture and high-energy nights",
      shortDescription:
        "A late-night bar and party space with a reputation for atmosphere. Swillhouse pairs inventive drinks with curated music programming, turning an ordinary evening into a proper night out.",
      image: asset("image.png"),
      bannerImage: asset("banner.webp"),
      logo: asset("logo.png"),
      categoryId: category?.id ?? null,
      operatingHours: "Wednesday - Sunday: 19:00 - 04:00",
      location: "SCBD, Jakarta",
      lat: -6.226764348529861,
      lng: 106.80725476681219,
    },
  });
}

async function seedGalleries(venueId: string) {
  await prisma.segmentGallery.create({
    data: {
      title: "Inside Swillhouse",
      description:
        "A minimalist, high-energy room where hip-hop culture meets contemporary design, built for nights that go the distance.",
      images: [
        asset("gallery-1.jpg"), asset("gallery-2.jpg"), asset("gallery-3.jpg"),
        asset("gallery-4.jpg"), asset("gallery-5.jpg"),
      ],
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
        "From bar bites to late-night plates, our menu keeps the energy up and the flavours bold.",
      images: [asset("menu-1.jpg"), asset("menu-2.jpg"), asset("menu-3.jpg")],
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
      poster: asset("promo-1.jpg"),
      name: "Hip-Hop Happy Hour",
      shortDescription: "Two-for-one on selected drinks and beers from open until 9 PM.",
      description:
        "Get the party started early with our daily happy hour. Two-for-one on selected cocktails, beers, and spirits from opening until 9 PM, with the best hip-hop tracks setting the vibe.",
      caption: "Wed \u2013 Sun, open \u2013 21:00",
      terms: "<p>Valid Wednesday to Sunday from opening until 21:00. Dine-in only. Not combinable with other promotions.</p>",
      startHour: "19:00",
      endHour: "21:00",
    },
    {
      poster: asset("promo-2.jpg"),
      name: "Bottle Service",
      shortDescription: "Premium bottle service with mixers, garnishes, and dedicated host.",
      description:
        "Elevate your night with Swillhouse bottle service. Choose from our premium selection of spirits, served with a full set of mixers, garnishes, and a dedicated host for your table.",
      caption: "Available nightly",
      terms: "<p>Available Wednesday to Sunday. Advance reservation recommended. Prices vary by selection.</p>",
      startHour: "19:00",
      endHour: "04:00",
    },
    {
      poster: asset("promo-3.jpg"),
      name: "Group Booking Deal",
      shortDescription: "Reserve a table for six or more and receive a complimentary bottle.",
      description:
        "Gather your crew and book a table for six or more guests. Receive a complimentary bottle of spirits and a round of shots to kick off the night right.",
      caption: "Valid for groups of 6+",
      terms: "<p>Valid for groups of 6 or more guests with advance table reservation. One complimentary bottle per booking. Not combinable with other promotions.</p>",
      startHour: "19:00",
      endHour: "04:00",
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
      question: "Is Swillhouse suitable for private events?",
      answer: "Yes. The Swillhouse can be booked for private parties, corporate events, and celebrations. Contact our team to discuss your needs.",
    },
    {
      question: "What kind of music is played at Swillhouse?",
      answer: "The Swillhouse is a hip-hop\u2013focused venue, with resident DJs and curated playlists spanning hip-hop, R&B, and club tracks throughout the night.",
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

  console.log(`\nDone seeding Swillhouse (${venue.slug}).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
