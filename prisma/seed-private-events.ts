import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/slug";

/**
 * The four private-event types that used to live in
 * `src/components/private-events/data.ts`, plus everything the new detail page
 * needs. `corporate-events` is filled in from the "SwillFam - Private Events"
 * mockup; the other three carry the same shape with copy written to match.
 *
 * Idempotent: upserts by slug, then replaces child rows and venue links.
 */

const GALLERY = [
  "/private-events/events-1.png",
  "/private-events/events-2.png",
  "/private-events/events-3.png",
];

/**
 * The mockup shows the same three quotes on the detail page and they read as
 * house-wide rather than type-specific, so every private event gets them.
 */
const TESTIMONIALS = [
  {
    quote:
      "SwillFam helped us find the right venue for our birthday celebration. Everything felt easy, lively, and well taken care of.",
    author: "Birthday Celebration Guest",
  },
  {
    quote:
      "The team made our event feel seamless from start to finish. The venue, food, drinks, and overall atmosphere were exactly what we needed for our company gathering.",
    author: "Corporate Event Guest",
  },
  {
    quote:
      "From the first inquiry to the event night, the experience was smooth. The venue setup, service, and hospitality really helped bring our celebration together.",
    author: "Private Celebration Guest",
  },
];

const TESTIMONIALS_LEAD =
  "SwillFam venues are suitable for companies, brands, agencies, communities, and partners looking to create corporate events with stronger atmosphere and hospitality.";

type Occasion = { image: string; title: string; description: string };

type PrivateEventSeed = {
  title: string;
  image: string;
  shortDescription: string;
  caption: string;
  description: string;
  occasionsTitle: string;
  testimonialsTitle: string;
  testimonialsLead: string;
  venuesTitle: string;
  galleryTitle: string;
  galleryLead: string;
  venueSlugs: string[];
  occasions: Occasion[];
};

// The mockup's six cards. Its card copy is lorem ipsum, so this is written out.
const CORPORATE_OCCASIONS: Occasion[] = [
  {
    image: "/private-events/stone-1.png",
    title: "Company Gatherings",
    description:
      "Team dinners, quarterly get-togethers, and department celebrations in a space that keeps conversation easy and the evening relaxed.",
  },
  {
    image: "/private-events/stone-2.png",
    title: "Networking Events",
    description:
      "Mixers and industry nights with room to move, a bar that keeps pace, and an atmosphere that gets people talking.",
  },
  {
    image: "/private-events/stone-3.png",
    title: "Client Appreciation Nights",
    description:
      "Host the people who matter most to your business over curated food, drinks, and service that feels considered throughout.",
  },
  {
    image: "/private-events/stone-4.png",
    title: "Media Gatherings",
    description:
      "Press dinners, editor previews, and launch briefings in rooms that photograph as well as they host.",
  },
  {
    image: "/private-events/stone-5.png",
    title: "Year-End Celebrations",
    description:
      "Close the year with a full-venue party — food, music, and a room that carries the energy through to late.",
  },
  {
    image: "/private-events/stone-6.png",
    title: "Executive Functions",
    description:
      "Board dinners and leadership offsites in quieter, more private settings with dedicated service from arrival onward.",
  },
];

/**
 * Slugs are derived, never hardcoded: `SlugField` regenerates a row's slug from
 * its title on every admin save, so a hardcoded seed slug would silently drift
 * apart from the real one the first time someone opened the edit form.
 */
const slugFor = (seed: Pick<PrivateEventSeed, "title">) => slugify(seed.title);

const PRIVATE_EVENTS: PrivateEventSeed[] = [
  {
    title: "Corporate Events at SwillFam Jakarta",
    image: "/private-events/type-1.png",
    shortDescription:
      "Host corporate events at SwillFam venues built for meaningful connections and memorable experiences. From company gatherings and networking events to client nights and team celebrations, we'll help match your event with the right venue.",
    caption: "Corporate Events Designed for Connection",
    description: [
      "SwillFam venues are built for more than just hosting guests. Each space is designed to create a strong atmosphere where people can connect, celebrate, discuss, and enjoy the moment. Whether your company is planning a casual team dinner, an executive gathering, a brand presentation, or a larger celebration, our venues offer different settings to match the tone of your event.",
      "From refined dining spaces to social bars and high-energy nightlife destinations, SwillFam gives you the flexibility to choose the right environment for your audience. Our team can help recommend venues, guide food and beverage options, support event flow, and assist with the inquiry process so your event feels smooth from planning to execution.",
    ].join("\n\n"),
    occasionsTitle: "Suitable for Different Corporate Occasions:",
    testimonialsTitle: "Trusted for Private Moments",
    testimonialsLead: TESTIMONIALS_LEAD,
    venuesTitle: "Recommended Venues for Corporate Events",
    galleryTitle: "Corporate Events We Can Host",
    galleryLead:
      "Explore examples of corporate event setups, dining moments, social gatherings, brand-hosted nights, and celebration formats across SwillFam venues.",
    venueSlugs: ["dualism", "truce", "zoo", "lecirque"],
    occasions: CORPORATE_OCCASIONS,
  },
  {
    title: "Birthdays",
    image: "/private-events/type-2.png",
    shortDescription:
      "Celebrate your birthday at a SwillFam venue with curated food, drinks, and atmosphere. From intimate dinners to lively nights out, we help make every milestone feel special.",
    caption: "Birthdays Worth Staying Out For",
    description: [
      "A birthday can be a long table of close friends, a room booked out for the night, or a table in the middle of the floor with the music turned up. SwillFam venues cover all three, so the celebration matches the person rather than the other way round.",
      "Tell us the date, the headcount, and the kind of night you have in mind. We'll suggest the venues that fit, put together food and drink options, and take care of the setup so the evening runs without anyone having to manage it.",
    ].join("\n\n"),
    occasionsTitle: "Suitable for Different Birthday Moments:",
    testimonialsTitle: "Trusted for Private Moments",
    testimonialsLead: TESTIMONIALS_LEAD,
    venuesTitle: "Recommended Venues for Birthdays",
    galleryTitle: "Birthdays We Can Host",
    galleryLead:
      "Explore examples of birthday dinners, table celebrations, group nights, and full-venue parties across SwillFam venues.",
    venueSlugs: ["kilo", "zoo", "lecirque", "swillhouse"],
    occasions: [],
  },
  {
    title: "Brand Activations",
    image: "/private-events/type-3.png",
    shortDescription:
      "Launch products, host press nights, and run brand activations in distinctive spaces. Our team supports your concept with flexible venues, production, and full event coordination.",
    caption: "Spaces That Carry a Brand",
    description: [
      "Launches, press nights, and activations need a room with a point of view. SwillFam venues each have a distinct identity — refined dining rooms, social bars, and full nightlife spaces — so the setting does some of the storytelling before anyone speaks.",
      "Our team works with your concept from the first conversation: venue fit, floor plan, food and beverage, AV and production partners, and run-of-show on the night. The result should look like your brand, not like a venue with your logo on it.",
    ].join("\n\n"),
    occasionsTitle: "Suitable for Different Activation Formats:",
    testimonialsTitle: "Trusted for Private Moments",
    testimonialsLead: TESTIMONIALS_LEAD,
    venuesTitle: "Recommended Venues for Brand Activations",
    galleryTitle: "Brand Activations We Can Host",
    galleryLead:
      "Explore examples of launches, press nights, product showcases, and brand-hosted evenings across SwillFam venues.",
    venueSlugs: ["dualism", "kilo", "truce", "zoo"],
    occasions: [],
  },
  {
    title: "Celebrations & After-Parties",
    image: "/private-events/type-4.png",
    shortDescription:
      "From anniversaries and engagements to late-night after-parties, SwillFam venues set the tone for unforgettable celebrations with music, drinks, and energy that last all night.",
    caption: "Celebrations That Run Late",
    description: [
      "Anniversaries, engagements, wrap parties, and the after-party that follows someone else's event — these are the nights that need the room to keep going rather than wind down. SwillFam venues are built for exactly that stretch of the evening.",
      "We'll match the guest list to the right space, sort table packages and bottle service, and coordinate with whoever is running the earlier part of the night so the handover is seamless and nobody loses momentum.",
    ].join("\n\n"),
    occasionsTitle: "Suitable for Different Celebrations:",
    testimonialsTitle: "Trusted for Private Moments",
    testimonialsLead: TESTIMONIALS_LEAD,
    venuesTitle: "Recommended Venues for Celebrations",
    galleryTitle: "Celebrations We Can Host",
    galleryLead:
      "Explore examples of anniversary dinners, engagement parties, wrap nights, and late after-parties across SwillFam venues.",
    venueSlugs: ["swillhouse", "lecirque", "zoo", "dualism"],
    occasions: [],
  },
];

const CORPORATE_FAQS = [
  {
    question: "How far in advance should I book a corporate event?",
    answer:
      "Two to four weeks is comfortable for most gatherings. Year-end dates fill quickly, so reach out earlier if you are planning around that period.",
  },
  {
    question: "Can we book a venue exclusively?",
    answer:
      "Yes. Most SwillFam venues can be booked for partial or full exclusive use depending on your guest count and the date. Our team will walk you through what each space allows.",
  },
  {
    question: "Do you handle food and beverage packages?",
    answer:
      "We do. We will put together set menus, canape packages, and drink options to suit your format and budget, including non-alcoholic selections.",
  },
  {
    question: "Can you support presentations or brand activations?",
    answer:
      "Yes. Several venues have AV, screens, and stage areas available, and our team can coordinate production partners for anything more involved.",
  },
];

async function seedPrivateEvent(seed: PrivateEventSeed, sortOrder: number) {
  const slug = slugFor(seed);
  const venues = await prisma.venue.findMany({
    where: { slug: { in: seed.venueSlugs } },
    select: { id: true, slug: true },
  });
  const missing = seed.venueSlugs.filter((s) => !venues.some((v) => v.slug === s));
  if (missing.length > 0) {
    console.warn(`  ! ${slug}: no venue for ${missing.join(", ")} — run the venue seeds first.`);
  }

  const data = {
    title: seed.title,
    image: seed.image,
    bannerImage: seed.image,
    caption: seed.caption,
    shortDescription: seed.shortDescription,
    description: seed.description,
    occasionsTitle: seed.occasionsTitle,
    testimonialsTitle: seed.testimonialsTitle,
    testimonialsLead: seed.testimonialsLead,
    venuesTitle: seed.venuesTitle,
    galleryTitle: seed.galleryTitle,
    galleryLead: seed.galleryLead,
    galleries: GALLERY,
    sortOrder,
    published: true,
  };
  const venueIds = venues.map((v) => ({ id: v.id }));

  const privateEvent = await prisma.privateEvent.upsert({
    where: { slug },
    // `set` replaces any existing links; on create there are none to replace,
    // and Prisma only accepts `connect` there.
    update: { ...data, venues: { set: venueIds } },
    create: { ...data, slug, venues: { connect: venueIds } },
  });

  // Children are replaced wholesale so re-running never duplicates them.
  await prisma.privateEventOccasion.deleteMany({ where: { privateEventId: privateEvent.id } });
  await prisma.privateEventTestimonial.deleteMany({ where: { privateEventId: privateEvent.id } });

  if (seed.occasions.length > 0) {
    await prisma.privateEventOccasion.createMany({
      data: seed.occasions.map((o, i) => ({ ...o, sortOrder: i, privateEventId: privateEvent.id })),
    });
  }
  await prisma.privateEventTestimonial.createMany({
    data: TESTIMONIALS.map((t, i) => ({ ...t, sortOrder: i, privateEventId: privateEvent.id })),
  });

  console.log(
    `Seeded "${seed.title}" (${seed.occasions.length} occasions, ${TESTIMONIALS.length} testimonials, ${venues.length} venues).`,
  );
}

async function seedCorporateFaqs() {
  // Derived from the same title as the private event itself, so the FAQ scope
  // can never point at a slug that no longer exists.
  const scope = { segment: "private_event", refSlug: slugFor(PRIVATE_EVENTS[0]) };
  await prisma.faq.deleteMany({ where: scope });
  await prisma.faq.createMany({
    data: CORPORATE_FAQS.map((f, i) => ({
      question: f.question,
      answer: `<p>${f.answer}</p>`,
      ...scope,
      sortOrder: i,
    })),
  });
  console.log(`Seeded ${CORPORATE_FAQS.length} corporate-events FAQs.`);
}

async function main() {
  for (const [i, seed] of PRIVATE_EVENTS.entries()) {
    await seedPrivateEvent(seed, i);
  }
  await seedCorporateFaqs();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
