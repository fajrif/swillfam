import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the 5 "Private Events" sheets of Swillfam.xlsx:
 * "Private Events Page" (archive), "Private Events Corporate Events",
 * "Private Events Birthdays Events", "Private Events Brand Activation",
 * "Private Events Page Celebration".
 * Run with: npx tsx prisma/copy-updates/private-events.ts
 */

// Shared across all 4 category detail pages — identical wording on every one of
// the 4 xlsx sheets, so applied uniformly rather than per-category.
const TESTIMONIALS_TITLE = "In their words";
const TESTIMONIALS_LEAD =
  "Real feedback from those who've hosted their events at SwillFam venues, in their own words.";
const VENUES_TITLE = "Venues We'd Suggest";
const GALLERY_TITLE = "See It For Yourself";
const GALLERY_LEAD = "A look inside past events, celebrations, and gatherings hosted across SwillFam venues.";

type CategoryUpdate = {
  slug: string;
  title?: string;
  heroTitle: string;
  shortDescription: string;
  caption: string;
  description: string;
};

const CATEGORIES: CategoryUpdate[] = [
  {
    slug: "corporate-events-at-swillfam-jakarta",
    title: "Corporate Events",
    heroTitle: "Corporate Events at SwillFam",
    shortDescription:
      "Our venues offer the setting and flexibility every corporate event needs, professional by day and unforgettable by night.",
    caption: "Built For Business, Ready For More",
    description: `SwillFam offers some of Jakarta's most versatile corporate event venues, built to handle everything from a quiet office party to a full-scale corporate party. Whether you're hosting a client dinner, a product launch, or an end-of-year celebration, our spaces adapt to the tone of the event, professional when it needs to be, and lively when the night calls for it.

As a private event venue trusted by teams across the city, SwillFam venues offer the flexibility to shape the space around your guest list, from an intimate meeting turned dinner to a full corporate event venue takeover. Each SwillFam location brings its own atmosphere, giving corporate events in Jakarta a setting that feels considered rather than generic.

Looking for a party venue in Jakarta that can flex from boardroom energy to celebration mode? SwillFam has the space, the setting, and the flexibility to make it happen.`,
  },
  {
    slug: "birthdays",
    heroTitle: "Birthdays at SwillFam",
    shortDescription:
      "Every birthday party venue fits your guest list and vibe, from an intimate room to a full takeover, built around the celebration you have in mind.",
    caption: "Celebrations Built Around You",
    description: `Birthdays deserve more than a reserved table and a cake at the end of the night. SwillFam's birthday party venues in Jakarta are built for celebrations that actually feel like an event, spaces shaped around your guest list, your playlist, and the kind of night you're picturing. Some birthdays call for something intimate, a private party venue in Jakarta where conversation stays easy and the room feels like it was made for you. Others are built for scale, a full venue takeover where the celebration carries into a night out.

SwillFam also hosts graduation parties and other private parties for guests marking a milestone worth remembering. Every location has its own personality, so no two birthday venues in Jakarta feel the same, and no two celebrations have to either. Whatever the vision, there's a birthday party venue built to match it.`,
  },
  {
    slug: "brand-activations",
    heroTitle: "Brand Activations at SwillFam",
    shortDescription:
      "Our venues bring distinctive spaces and atmosphere built to make any brand moment stand out.",
    caption: "Where Brands Come To Life",
    description: `A brand activation only works if the space matches the ambition behind it, and SwillFam's venues are built for exactly that kind of moment. Each location brings its own atmosphere, from industrial and high-energy to refined and intimate, giving brands a corporate event venue that can be shaped around a launch, a pop-up, or a full takeover rather than forced into a generic setup.

Because SwillFam operates across some of Jakarta's most versatile private event venues, activations can move beyond a single format. A product reveal might call for the polish of a corporate party, while a brand's after-hours moment might lean into something closer to a private party venue in Jakarta, energetic and unscripted. Corporate events in Jakarta rarely get the chance to feel this considered, and that's the difference SwillFam brings to every activation, treating the brand's presence in the room as seriously as the event itself.`,
  },
  {
    slug: "celebrations-after-parties",
    heroTitle: "Celebrations at SwillFam",
    shortDescription:
      "Our venues keep the energy going from the first toast to the last song, giving every celebration room to continue.",
    caption: "Keep The Night Going",
    description: `Some nights are worth extending past the main event, and SwillFam's venues exist for exactly that moment. As one of Jakarta's most sought-after settings for a wedding after party, our spaces give couples and guests somewhere to keep the celebration alive once the reception winds down, trading formality for energy that actually matches the occasion.

The same holds true beyond weddings. A graduation party, a private party, or any milestone worth marking can move from dinner into something bigger, using SwillFam as the party venue in Jakarta built for that second wind. Each location carries its own atmosphere, so an after-wedding celebration feels distinct from a birthday party venue or a corporate party, shaped instead around whatever the night calls for.

Whether the celebration started elsewhere or begins right here, SwillFam offers the private event venue built to carry it further.`,
  },
];

// Corporate-only occasion cards — matched by existing title. "Client Appreciation
// Nights" isn't in the xlsx, left untouched.
const OCCASION_DESCRIPTIONS: Record<string, string> = {
  "Company Gatherings":
    "Our venues give teams a relaxed setting for a company gathering, away from the usual office party routine.",
  "Networking Events":
    "SwillFam venues offer the atmosphere and flexibility needed to host networking events that feel effortless, not transactional.",
  "Media Gatherings":
    "From press previews to media gatherings, our spaces are built to make every guest feel like the event was designed for them.",
  "Year-End Celebrations":
    "Close out the year the way it should end, at a SwillFam venue built to turn a wrap party into an actual celebration.",
  "Executive Functions":
    "When the occasion calls for more than a meeting room, SwillFam offers a private event setting that combines discretion, elevated hospitality, and an atmosphere made for connection.",
};

// Archive-page FAQs (segment "private_events", refSlug null) — replaces the 4
// existing rows with the xlsx's 4, same policy used for venue FAQs this session.
const ARCHIVE_FAQS: { question: string; answer: string; sortOrder: number }[] = [
  {
    question: "How much does SwillFam venue rental cost?",
    answer:
      "Cost depends on the venue, guest count, and time of day. An intimate birthday at Truce looks very different from a full buyout at Zoo. Our team puts together a custom quote based on what you're planning. Reach out via WhatsApp and we'll get back to you with pricing tailored to your event.",
    sortOrder: 0,
  },
  {
    question: "Which venue is best for private events?",
    answer:
      "It depends on your vibe and guest list. Atsumaru Izakaya and Kilo Jakarta suit dining and big gatherings, Dualism and Truce are built for cocktail-focused evenings and intimate parties, and Swillhouse, Le Cirque, and Zoo are made for full-scale events. Tell us the occasion and size, and we'll help match you to the right space.",
    sortOrder: 1,
  },
  {
    question: "Can I book multiple venues for one event?",
    answer:
      "Yes, many guests build a full evening across several SwillFam venues, moving from dinner to drinks to a late-night close. Let us know your plan and we can help coordinate multiple venues into one private event.",
    sortOrder: 2,
  },
  {
    question: "What is the minimum spend?",
    answer:
      "Minimum spend depends on the venue, day of the week, and duration. Share your date and headcount and we'll walk you through the specifics.",
    sortOrder: 3,
  },
];

async function main() {
  for (const cat of CATEGORIES) {
    const event = await prisma.privateEvent.findUnique({
      where: { slug: cat.slug },
      include: { occasions: true },
    });
    if (!event) {
      console.warn(`  ! PrivateEvent "${cat.slug}" not found, skipping`);
      continue;
    }

    await prisma.privateEvent.update({
      where: { id: event.id },
      data: {
        ...(cat.title ? { title: cat.title } : {}),
        heroTitle: cat.heroTitle,
        shortDescription: cat.shortDescription,
        caption: cat.caption,
        description: cat.description,
        testimonialsTitle: TESTIMONIALS_TITLE,
        testimonialsLead: TESTIMONIALS_LEAD,
        venuesTitle: VENUES_TITLE,
        galleryTitle: GALLERY_TITLE,
        galleryLead: GALLERY_LEAD,
      },
    });

    for (const occasion of event.occasions) {
      const newDescription = OCCASION_DESCRIPTIONS[occasion.title];
      if (!newDescription) continue;
      await prisma.privateEventOccasion.update({
        where: { id: occasion.id },
        data: { description: newDescription },
      });
    }

    console.log(`Updated PrivateEvent "${cat.slug}".`);
  }

  await prisma.faq.deleteMany({ where: { segment: "private_events", refSlug: null } });
  await prisma.faq.createMany({
    data: ARCHIVE_FAQS.map((f) => ({ ...f, segment: "private_events", refSlug: null, published: true })),
  });
  console.log("Updated archive-page FAQs (private_events).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
