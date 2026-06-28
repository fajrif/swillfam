import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

const FOLDER = "kilo";
const asset = (file: string) => `/categories/venues/${FOLDER}/${file}`;

async function getOrCreateVenue() {
  const existing = await prisma.venue.findUnique({ where: { slug: "kilo" } });
  if (existing) return existing;

  const category = await prisma.category.findFirst({ where: { name: "Lifestyle" } });
  const slug = await ensureUniqueSlug("Kilo", async (s) => {
    const found = await prisma.venue.findUnique({ where: { slug: s } });
    return !!found;
  });
  return prisma.venue.create({
    data: {
      name: "Kilo",
      slug,
      description:
        "Kilo Kitchen Jakarta is a standout culinary destination known for its modern comfort food rooted in a bold fusion of Latin and Asian flavors.\n\nLocated in the vibrant heart of Jakarta, Kilo offers a stylish yet relaxed atmosphere perfect for casual dining, date nights, or social gatherings. Blending Jakarta\u2019s fast-paced city life with Kilo\u2019s signature lifestyle approach, the venue creates an immersive experience where food, music, and culture converge. Guests can expect elevated dishes, handcrafted cocktails, and an inviting ambiance that redefines contemporary dining in Indonesia. Whether you\u2019re craving unique flavor combinations or a cozy escape with great vibes, Kilo Kitchen Jakarta is your go-to restaurant for unforgettable dining moments.",
      caption: "Latin-Asian fusion in a stylish setting",
      shortDescription:
        "An all-day cafe and kitchen built around slow mornings, easy lunches, and unhurried catch-ups. Kilo pairs a considered menu with a calm, design-led room that works just as well for solo coffee as it does for long table conversations.",
      image: asset("image.png"),
      bannerImage: asset("banner.jpg"),
      logo: asset("logo.png"),
      categoryId: category?.id ?? null,
      operatingHours: "Daily: 10:00 - 22:00",
      location: "SCBD, Jakarta",
      lat: -6.229813053282502,
      lng: 106.80704052448323,
    },
  });
}

async function seedGalleries(venueId: string) {
  await prisma.segmentGallery.create({
    data: {
      title: "Inside Kilo",
      description:
        "A stylish, relaxed room designed for slow mornings and lively evenings, where every corner reflects Kilo\u2019s signature lifestyle approach.",
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
        "A bold fusion of Latin and Asian flavours, from elevated comfort food to handcrafted cocktails that redefine contemporary dining.",
      images: [
        asset("menu-1.jpg"), asset("menu-2.jpg"), asset("menu-3.jpg"), asset("menu-4.jpg"),
        asset("menu-5.png"), asset("menu-6.png"), asset("menu-7.png"), asset("menu-8.png"),
        asset("menu-9.png"), asset("menu-10.png"), asset("menu-11.png"), asset("menu-12.png"),
        asset("menu-13.png"), asset("menu-14.png"), asset("menu-15.png"), asset("menu-16.png"),
        asset("menu-17.png"), asset("menu-18.png"), asset("menu-19.png"), asset("menu-20.png"),
        asset("menu-21.png"), asset("menu-22.png"),
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
      poster: asset("promo-1.jpg"),
      name: "Lunch Special",
      shortDescription: "A two-course lunch menu featuring Kilo's signature Latin-Asian fusion creations.",
      description:
        "Enjoy a curated two-course lunch at Kilo Kitchen. Choose from a selection of our signature starters and mains, showcasing the best of Latin-Asian fusion in a stylish, relaxed setting.",
      caption: "Daily, 12:00 \u2013 15:00",
      terms: "<p>Valid daily from 12:00 to 15:00. Dine-in only. Not combinable with other promotions.</p>",
      startHour: "12:00",
      endHour: "15:00",
    },
    {
      poster: asset("promo-2.jpg"),
      name: "Happy Hour",
      shortDescription: "Two-for-one on handcrafted cocktails and selected drinks from 5 PM to 7 PM.",
      description:
        "Unwind after work with Kilo's daily happy hour. Two-for-one on handcrafted cocktails, wine, and beer from 5 PM to 7 PM, paired with our bar snack selection.",
      caption: "Daily, 17:00 \u2013 19:00",
      terms: "<p>Valid daily from 17:00 to 19:00. Dine-in only. Not combinable with other promotions.</p>",
      startHour: "17:00",
      endHour: "19:00",
    },
    {
      poster: asset("promo-3.jpg"),
      name: "Date Night Set",
      shortDescription: "A three-course dinner for two with a complimentary glass of wine each.",
      description:
        "Make your date night unforgettable with Kilo's special set menu. Three courses for two people, with a complimentary glass of wine each. The perfect way to enjoy an evening in Jakarta.",
      caption: "Available nightly",
      terms: "<p>Available Tuesday to Sunday for dinner service. Advance booking recommended. Not combinable with other promotions.</p>",
      startHour: "18:00",
      endHour: "22:00",
    },
    {
      poster: asset("promo-4.jpg"),
      name: "Weekend Brunch",
      shortDescription: "A leisurely weekend brunch spread with free-flow selected beverages.",
      description:
        "Weekends are made for brunch at Kilo. Enjoy a curated brunch menu with free-flow selected beverages, from coffee and fresh juices to sparkling wine and signature cocktails.",
      caption: "Saturday \u2013 Sunday, 10:00 \u2013 14:00",
      terms: "<p>Valid Saturday and Sunday from 10:00 to 14:00. Dine-in only. Not combinable with other promotions.</p>",
      startHour: "10:00",
      endHour: "14:00",
    },
    {
      poster: asset("promo-5.jpg"),
      name: "Group Dining Package",
      shortDescription: "A shared feast for groups of four or more with a set menu and drinks.",
      description:
        "Gather your group and enjoy a shared dining experience at Kilo. Our group package includes a curated set menu of signature dishes with unlimited selected drinks. Perfect for celebrations and corporate lunches.",
      caption: "Valid for groups of 4+",
      terms: "<p>Valid for groups of four or more with advance reservation. Not combinable with other promotions.</p>",
      startHour: "12:00",
      endHour: "21:00",
    },
    {
      poster: asset("promo-6.jpg"),
      name: "Cocktail Masterclass",
      shortDescription: "Learn to craft Kilo's signature cocktails with our head bartender.",
      description:
        "Join our head bartender for an interactive cocktail masterclass. Learn the techniques behind Kilo's signature drinks, from muddling and shaking to garnishing, then enjoy your creations with small plates.",
      caption: "By appointment",
      terms: "<p>Available by appointment for groups of 4 to 10. Includes welcome drink, masterclass, and tasting. Advance booking required.</p>",
      startHour: "15:00",
      endHour: "17:00",
    },
    {
      poster: asset("promo-7.jpg"),
      name: "Birthday Celebration",
      shortDescription: "Celebrate your birthday with a complimentary dessert and a glass of sparkling wine.",
      description:
        "Make your birthday special at Kilo. Dine with us on your birthday and receive a complimentary dessert platter and a glass of sparkling wine. Add a bottle service upgrade for the full celebration.",
      caption: "Valid on your birthday",
      terms: "<p>Valid on your birthday with valid ID. Dine-in only. Advance booking recommended.</p>",
      startHour: "10:00",
      endHour: "22:00",
    },
    {
      poster: asset("promo-8.jpg"),
      name: "Loyalty Rewards",
      shortDescription: "Earn points on every visit and redeem them for exclusive menu items.",
      description:
        "Join Kilo's loyalty programme and earn points on every visit. Redeem points for exclusive menu items, priority reservations at peak times, and invitations to members-only tasting events.",
      caption: "Ongoing",
      terms: "<p>Available to all registered loyalty members. Points are non-transferable. Terms and conditions apply.</p>",
      startHour: "10:00",
      endHour: "22:00",
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
      answer: "Walk-ins are welcome, but reservations are recommended for weekends, dinner service, and group bookings.",
    },
    {
      question: "Is Kilo suitable for group dining?",
      answer: "Yes. Kilo offers group dining packages and a spacious layout perfect for celebrations, corporate lunches, and social gatherings.",
    },
    {
      question: "Can I host a private event at Kilo?",
      answer: "Yes. Kilo can be booked for private events and celebrations. Reach out to our team to discuss availability and catering options.",
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

  console.log(`\nDone seeding Kilo (${venue.slug}).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
