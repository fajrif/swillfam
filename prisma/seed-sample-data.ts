import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

const ARTICLE_IMAGES = [
  "/sample_articles/article-1.jpg",
  "/sample_articles/article-2.jpg",
  "/sample_articles/article-3.jpg",
  "/sample_articles/article-4.jpg",
  "/sample_articles/article-5.jpg",
  "/sample_articles/article-6.jpg",
];

async function seedEventCategories() {
  if (await prisma.eventCategory.count()) return;
  await prisma.eventCategory.createMany({
    data: ["Dining Experience", "Regular", "Music", "Special Event"].map((name) => ({ name })),
  });
  console.log("Seeded 4 event categories.");
}

async function seedPrivateEventTypes() {
  if (await prisma.privateEventType.count()) return;
  const TYPES = [
    {
      title: "Birthday Celebrations",
      description: "Intimate to full-venue birthday setups with custom decor, cake, and music.",
      image: "/private-events/events-1.png",
    },
    {
      title: "Celebration & After Parties",
      description: "Late-night after-parties and milestone celebrations with dedicated bottle service.",
      image: "/private-events/events-2.png",
    },
    {
      title: "Corporate & Brand Events",
      description: "Product launches, brand activations, and corporate gatherings tailored to your audience.",
      image: "/private-events/events-3.png",
    },
    {
      title: "Anniversary & Engagement",
      description: "Romantic, milestone-worthy setups for anniversaries, engagements, and proposals.",
      image: null,
    },
  ];
  await prisma.privateEventType.createMany({
    data: TYPES.map((t, i) => ({ ...t, sortOrder: i })),
  });
  console.log(`Seeded ${TYPES.length} private event types.`);
}

async function seedArticleCategories() {
  if (await prisma.articleCategory.count()) return;
  await prisma.articleCategory.createMany({
    data: ["Nightlife", "Lifestyle", "Talents", "Social Proof"].map((name) => ({ name })),
  });
  console.log("Seeded 4 article categories.");
}

async function seedArticles() {
  if (await prisma.article.count()) return;

  const categories = await prisma.articleCategory.findMany({ orderBy: { createdAt: "asc" } });
  const byName = (name: string) => categories.find((c) => c.name === name)?.id;

  const ARTICLES = [
    {
      title: "Inside Jakarta's Late-Night Scene",
      shortDescription: "A look at what keeps the city's nightlife buzzing long after midnight.",
      category: "Nightlife",
      paragraphs: [
        "Jakarta doesn't slow down when the sun goes down — if anything, that's when the city shows its real personality. Past midnight, a different crowd takes over the streets of SCBD and Kemang: off-duty creatives, late-shift hospitality staff, and travelers chasing the kind of energy you can't find in daylight. The late-night scene here has grown from a handful of clubs into a full ecosystem of bars, lounges, and live-music rooms that each carry their own mood.",
        "What sets Jakarta apart is the variety packed into a single night out. You can start with a quiet whisky pour in a low-lit speakeasy, move to a rooftop bar for the skyline, and end up on a packed dance floor before the night is through — all within a few blocks of each other. Venue owners have leaned into this, designing spaces that transition naturally from dinner service to dancefloor without ever feeling like two different rooms.",
        "Sound has become a competitive edge. The venues pulling the biggest crowds are the ones investing seriously in their systems and booking selectors who understand pacing — building a night rather than just playing songs. Resident DJs are now treated less like background entertainment and more like the architects of the evening, and regulars will cross town specifically to catch a particular set.",
        "Safety and service have also matured alongside the scene. Where late-night venues used to compete purely on size and volume, the newer standard is attentive staff, clear house rules, and spaces that feel considered rather than chaotic. It's made Jakarta's nightlife more welcoming to a broader crowd, not just the most committed night owls.",
        "If there's one thing that defines the late-night scene right now, it's confidence — venues know what kind of night they're offering and lean into it fully, rather than trying to be everything to everyone. That clarity is exactly what keeps people coming back long after midnight.",
      ],
    },
    {
      title: "What Makes a Great Club Night",
      shortDescription: "From sound systems to crowd energy — the ingredients of a night to remember.",
      category: "Nightlife",
      paragraphs: [
        "A great club night rarely comes down to one single thing — it's the layering of small details that, together, create a room people don't want to leave. Sound is the obvious starting point: a properly tuned system doesn't just play music louder, it lets a crowd feel the low end in a way that changes how they move. Venues that skip on their rig are always working uphill, no matter how good the lineup is.",
        "Lighting comes a close second. The best operators treat lighting as a storytelling tool rather than decoration, building intensity through the night instead of running the same pattern from open to close. A room that brightens and dims in sync with the music gives the DJ another instrument to work with, and gives the crowd visual cues that match the energy shift they're already feeling.",
        "Then there's pacing — arguably the most underrated skill in nightlife. A resident who understands the room will hold back early, let the crowd build naturally, and only push toward peak time once the floor is actually ready for it. Rushing a night kills momentum just as fast as playing it too safe for too long.",
        "Crowd energy is the variable no venue can fully control, but the good ones know how to cultivate it: door policies that protect the vibe, bar staff who keep service fast so people stay on the floor instead of queuing, and a layout that lets a crowd actually gather instead of spreading thin across a room that's too big for the night.",
        "Put all of it together — sound, light, pacing, and a crowd that's been set up to have a good time — and you get the kind of night people talk about for weeks afterward. That's the bar every club night should be measured against.",
      ],
    },
    {
      title: "Weekend Hotspots You Shouldn't Miss",
      shortDescription: "Our pick of the venues worth showing up early for this weekend.",
      category: "Nightlife",
      paragraphs: [
        "Weekends in the city move fast, and the venues worth your time tend to fill up well before midnight. If you're planning a night out, the smartest move is treating 'early' as part of the plan rather than something to avoid — the best tables, the best spots at the bar, and the calmest version of the room all belong to the people who show up before the rush.",
        "Restaurants-turned-lounges are having a moment right now, with several spots running a dinner service that quietly shifts into a livelier scene as the night goes on. Arriving for the early seating means you get a proper meal in a relaxed room, then get to watch — and join — the same space transform without ever having to switch venues.",
        "For those chasing a bigger night, the rooftop and open-air venues remain the weekend standard, especially with the evening weather as forgiving as it's been. These spots reward arriving with enough daylight left to grab a seat with a view before the crowd builds past comfortable capacity.",
        "If live music is more your speed, look for venues running resident bands or DJ sets early in the evening — these slots are often the most underrated part of a weekend, with smaller crowds, better sound clarity, and performers who are genuinely enjoying the room rather than just powering through a peak-time set.",
        "Whichever route you take, the common thread across every hotspot worth visiting is the same: get there with intention. The venues on this list reward guests who plan their night rather than wander into it, and a little timing goes a long way toward making the evening memorable.",
      ],
    },
    {
      title: "Curating Your Night Out Wardrobe",
      shortDescription: "Dressing for the dance floor without sacrificing comfort.",
      category: "Lifestyle",
      paragraphs: [
        "Dressing for a night out is its own small art form — the goal isn't just looking good walking through the door, it's looking good three hours later after dancing, drinks, and a venue change or two. That means building a wardrobe around pieces that hold their shape and stay comfortable, not just ones that photograph well in the first five minutes.",
        "Fabric choice matters more than most people realize. Breathable, slightly stretch-finished materials handle a warm, crowded room far better than anything stiff or heavy, and they tend to recover their shape after a few hours on the floor instead of wilting. The same goes for footwear — a great-looking shoe that can't survive a night of standing and dancing isn't actually doing its job.",
        "Layering is the other underused trick. A great night out look often has one statement piece — a jacket, a bold top, a standout accessory — paired with simpler basics underneath, so you can adjust as the temperature in the room shifts from a cool entrance to a packed, warm dance floor later on.",
        "Color and texture choices also follow the rhythm of the venue itself. Darker, moodier rooms tend to favor richer tones and a bit of shine, while open-air or rooftop settings give more room to play with lighter palettes. Reading the room before you get dressed is a small habit that pays off.",
        "Ultimately, the best night-out wardrobe is one you don't have to think about once you're inside — it should let you move, dance, and relax without constant adjustment, freeing you up to actually enjoy the night you got dressed up for.",
      ],
    },
    {
      title: "Weekend Rituals Worth Repeating",
      shortDescription: "Small habits that turn an ordinary weekend into something memorable.",
      category: "Lifestyle",
      paragraphs: [
        "The best weekends rarely come from one big plan — they come from a handful of small rituals repeated often enough that they start to feel like tradition. A regular Saturday lunch spot, a standing dinner with the same group of friends, or a habit of catching the early evening light from a favorite rooftop all do more for how a weekend feels than any single big night out.",
        "Routine, used well, doesn't make a weekend boring — it gives it shape. Knowing exactly where you'll be for golden hour or which bar always has your usual order ready removes the friction of decision-making, leaving more energy for the parts of the night that actually matter: the company, the conversation, the moments worth remembering.",
        "Many of the most loyal regulars at SwillFam venues describe their visits this way — not as a special occasion every time, but as a dependable part of how their weekend is built. That consistency is exactly what turns a venue into a habit rather than just a destination.",
        "There's also something to be said for rituals that involve other people. A standing weekly dinner or a recurring meetup gives a group something to look forward to without needing to coordinate from scratch every time, and over months it builds a kind of shared history that a one-off night out never quite manages.",
        "Whatever the ritual looks like — a particular table, a particular order, a particular hour you always show up — the habits worth keeping are the ones that make an ordinary weekend feel like it belongs to you.",
      ],
    },
    {
      title: "The Art of the After-Party",
      shortDescription: "How to keep the night going once the main event winds down.",
      category: "Lifestyle",
      paragraphs: [
        "Every great night needs a second act, and the after-party is where that act usually happens. The transition from a main event — a dinner, a show, an early set — into something looser and later takes a bit of planning, but it's often the part of the night people remember most clearly the next morning.",
        "The best after-parties tend to happen in smaller, more relaxed spaces than the main event itself. A late-night lounge or an intimate bar gives a group room to actually talk and unwind after a louder, busier first half of the evening, rather than just trading one big room for another.",
        "Timing is everything. Moving too early can leave a group standing around an empty venue waiting for a vibe to build; moving too late risks losing momentum entirely. The sweet spot is usually right as the main event starts to thin out — enough energy left to carry into a new space, without dragging out a night that's already peaked.",
        "Drinks also shift in character during an after-party. Where the main event might call for something crowd-pleasing and easy to order in bulk, the after-party is where a more considered cocktail or a shared bottle tends to take over — a sign that the pace of the night has changed from social to personal.",
        "Done well, an after-party isn't an afterthought — it's the part of the night where the group actually settles in, and often where the best stories of the evening end up happening.",
      ],
    },
    {
      title: "Meet the DJs Behind the Decks",
      shortDescription: "A closer look at the resident talents shaping our sound every week.",
      category: "Talents",
      paragraphs: [
        "Behind every great night out is a resident who's spent months — sometimes years — learning exactly how a room moves. Our resident DJs aren't just filling a time slot; they're the ones shaping the identity of a venue week after week, building a relationship with regulars who know exactly which night to show up for their set.",
        "Each resident brings a distinct approach to the booth. Some build slow, layered sets that reward people who stay for the whole night; others come in with high-energy openers designed to fill a floor fast. That range is intentional — venues curate their weekly lineup the same way a kitchen curates a menu, balancing different styles across different nights.",
        "What separates a resident from a guest is familiarity — with the room, the regulars, and the sound system itself. A resident knows exactly how a particular speaker stack handles bass in a packed room versus an empty one, and adjusts their set in real time based on who's actually on the floor that night.",
        "Many of our residents started as regulars themselves before stepping behind the decks, which shows in how closely their sets track what the crowd actually wants rather than what's trending elsewhere. That connection to the room is hard to fake, and it's exactly what keeps people coming back to hear them again.",
        "The next time you're on the floor and the set just feels right, there's a good chance it's one of our residents — someone who's spent real time learning that exact room, that exact crowd, and exactly how to bring both to life.",
      ],
    },
    {
      title: "Spotlight: Resident Performers",
      shortDescription: "The faces and acts that bring our stages to life.",
      category: "Talents",
      paragraphs: [
        "Beyond the DJ booth, our venues run on a rotating cast of live performers — vocalists, bands, and acts who turn a regular night into an event worth planning around. These residencies are built over time, with performers and venues finding a rhythm together rather than booking one-off shows.",
        "Live music adds something a playlist simply can't: the unpredictability of a real performance, the small interactions between a performer and the crowd, and the kind of energy that comes from watching musicians read a room and respond to it in real time. It's a different kind of night out, and one that draws its own loyal following.",
        "Our resident acts span a wide range — from intimate acoustic sets that suit an early dinner crowd to full bands capable of carrying a room well past midnight. That variety lets venues program an entire evening's arc with live talent alone, long before a DJ even takes over.",
        "Many of these performers have built genuine followings of their own, with guests showing up specifically for a particular night because they know who's on stage. That kind of draw takes real consistency — performers earn it set after set, not from a single standout show.",
        "The next time a live act catches you off guard on what was supposed to be a quiet night out, that's exactly the point — these residencies exist to turn an ordinary evening into the reason you remember it.",
      ],
    },
    {
      title: "Why Guests Keep Coming Back",
      shortDescription: "Stories from regulars on what makes SwillFam venues feel like home.",
      category: "Social Proof",
      paragraphs: [
        "Ask any regular why they keep coming back to the same venue and the answer is rarely just the drinks or the music — it's almost always about how the place makes them feel. Being recognized at the door, having a server remember your usual order, finding a familiar face behind the bar — these small touches turn a venue into something closer to a second living room.",
        "That sense of familiarity doesn't happen by accident. Staff are trained to remember regulars, not as a sales tactic but as a genuine part of the experience — because a guest who feels known is a guest who feels comfortable enough to actually relax and enjoy their night, rather than just pass through.",
        "Consistency plays just as big a role. Regulars talk about knowing exactly what they're going to get on a given night — the same reliable service, the same well-kept space, the same energy they came back for in the first place. That predictability is a feature, not a limitation.",
        "Community is the other piece guests mention often. Many describe meeting recurring faces at the same venue over months, building friendships that started purely from showing up to the same bar on the same night. The venue becomes the backdrop, but the people are what actually bring them back.",
        "At the end of the day, loyalty in this industry is earned one night at a time. The guests who keep returning aren't chasing novelty — they're chasing the feeling of walking into a room where they already belong.",
      ],
    },
    {
      title: "Real Stories From the Floor",
      shortDescription: "Guest moments, in their own words, from a night out with SwillFam.",
      category: "Social Proof",
      paragraphs: [
        "Every venue collects its own folklore over time — the birthday that turned into a full-room singalong, the proposal that happened right as the lights dimmed, the stranger-turned-friend conversation that started at the bar and is still going months later. These are the moments that never make it onto a menu or a flyer, but they're the real reason people remember a night out.",
        "One guest recalls showing up alone for what was meant to be a quick drink, only to end up closing the venue down with a group of people she'd just met that night — a story she still tells as one of her best nights in the city. Moments like that aren't planned, but the right room makes them far more likely to happen.",
        "Staff have their own version of these stories too. Bartenders talk about regulars whose drink order they could make blind, servers remember the table that came in for a quiet anniversary dinner and ended up dancing by the end of the night, and security staff recall walking first-time guests through the door and watching them become regulars within weeks.",
        "What ties these stories together isn't the venue itself so much as what the venue made possible — a space loose enough for spontaneity, but considered enough that spontaneity actually feels safe and welcome. That balance is harder to get right than it looks.",
        "These are the stories that don't show up in marketing but matter the most — the proof that a good night out isn't really about the room at all. It's about what happens inside it.",
      ],
    },
  ];

  const now = Date.now();
  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    const slug = await ensureUniqueSlug(a.title, async (s) => {
      const found = await prisma.article.findUnique({ where: { slug: s } });
      return !!found;
    });
    await prisma.article.create({
      data: {
        title: a.title,
        slug,
        shortDescription: a.shortDescription,
        description: a.paragraphs.map((p) => `<p>${p}</p>`).join(""),
        image: ARTICLE_IMAGES[Math.floor(Math.random() * ARTICLE_IMAGES.length)],
        articleCategoryId: byName(a.category) ?? null,
        publishedDate: new Date(now - i * 86400000),
        status: 1,
      },
    });
  }
  console.log(`Seeded ${ARTICLES.length} articles.`);
}

async function seedCategories() {
  if (await prisma.category.count()) return;
  const CATEGORIES = [
    {
      name: "Nightlife",
      caption: "Where the city comes alive after dark.",
      headline: "Nightlife Clubs & Bars by SwillFam",
      description:
        "Step into SwillFam's nightlife, where music, energy, and atmosphere come together after dark. From late-night lounges and social bars to high-energy clubs and live performances, each destination is designed to keep the night moving. Whether you are meeting friends for after-work drinks, celebrating a special occasion, or chasing the city's best DJ sets and parties, our venues deliver unforgettable evenings filled with great music, vibrant crowds, and the unmistakable SwillFam spirit.",
      shortDescription:
        "Explore DJ nights, live performances, parties, club programs, late-night sessions, and music-led experiences designed for after-hours energy. From intimate music showcases and themed parties to headline performances and venue takeovers, our nightlife events celebrate the vibrant spirit of the city after dark.\n\nWhether you are looking for a lively dance floor, a unique entertainment experience, or a night out with friends, SwillFam's nightlife calendar delivers unforgettable evenings filled with music, atmosphere, and excitement.",
      image: "/categories/image-nightlife.png",
      bannerImage: "/categories/banner-nightlife.png",
    },
    {
      name: "Lifestyle",
      caption: "Spaces designed for how you actually want to spend your time.",
      headline: "Lifestyle Restaurants & Bars by SwillFam",
      description:
        "Discover SwillFam's lifestyle venues, where food, drinks, atmosphere, and people come together. From Japanese-inspired dining to modern restaurants and social bars, each destination is thoughtfully designed to create meaningful experiences for guests throughout the day and into the night. Whether you are meeting friends for a casual meal, celebrating a special occasion, enjoying after-work drinks, or exploring new places around the city, our venues offer welcoming spaces that bring people closer together. With distinctive concepts, carefully curated menus, attentive hospitality, and unique atmospheres, every SwillFam destination delivers its own character while sharing the same commitment to memorable moments, genuine connections, and enjoyable experiences that keep guests coming back.",
      shortDescription:
        "Discover restaurants, cafes, and social bars made for every part of the day, from slow morning coffee and relaxed lunches to unhurried dinners and after-work drinks. Each lifestyle venue brings great food, considered design, and genuine hospitality together in spaces built for connection.\n\nWhether you are catching up with friends, marking a special occasion, or simply finding a new favorite spot around the city, SwillFam's lifestyle destinations offer welcoming rooms, distinctive menus, and atmospheres that make every visit feel effortless.",
      image: "/categories/image-lifestyle.png",
      bannerImage: "/categories/banner-lifestyle.png",
    },
  ];
  for (const c of CATEGORIES) {
    const slug = await ensureUniqueSlug(c.name, async (s) => {
      const found = await prisma.category.findUnique({ where: { slug: s } });
      return !!found;
    });
    await prisma.category.create({
      data: {
        name: c.name,
        slug,
        caption: c.caption,
        headline: c.headline,
        description: c.description,
        shortDescription: c.shortDescription,
        image: c.image,
        bannerImage: c.bannerImage,
      },
    });
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);
}

async function seedVenues() {
  if (await prisma.venue.count()) return;

  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  const categoryId = (name: string) => categories.find((c) => c.name === name)?.id ?? null;
  const asset = (folder: string, file: string) => `/categories/venues/${folder}/${file}`;

  // folder, Titleized name, category, and whether the folder ships a banner.png.
  const VENUES = [
    {
      folder: "atsumaru-izakaya",
      name: "Atsumaru Izakaya",
      category: "Lifestyle",
      hasBanner: true,
      operatingHours: "Tuesday - Sunday: 18:00 - 02:00",
      location: "SCBD, Jakarta",
      lat: -6.249291022294074,
      lng: 106.8003771668123,
      description:
        "Atsumaru Izakaya is a modern Japanese restaurant in Jakarta that brings the warmth and vibrancy of traditional izakaya culture into a refined, contemporary setting.\n\nDesigned as a welcoming space for everyday dining, after-work drinks, and special celebrations, Atsumaru reflects a commitment to constant innovation while staying true to authentic Japanese flavors and hospitality. The menu features a wide variety of dishes, from sushi and sashimi to yakitori, donburi, and comforting izakaya classics, ensuring there\u2019s something for every palate and occasion. Whether you\u2019re gathering with friends, sharing a meal with family, or hosting an intimate celebration, Atsumaru Izakaya offers the perfect combination of delicious food, warm ambiance, and genuine Japanese culinary culture in the heart of Jakarta.",
      shortDescription:
        "A Japanese-inspired dining and social destination made for good food, good drinks, and good company. Atsumaru Izakaya brings together warm hospitality, flavorful dishes, and a relaxed atmosphere for casual lunches, intimate dinners, and group gatherings.",
      caption: "Good food, good drinks, good company",
    },
    {
      folder: "kilo",
      name: "Kilo",
      category: "Lifestyle",
      hasBanner: false,
      operatingHours: "Daily: 10:00 - 22:00",
      location: "SCBD, Jakarta",
      lat: -6.229813053282502,
      lng: 106.80704052448323,
      description:
        "Kilo Kitchen Jakarta is a standout culinary destination known for its modern comfort food rooted in a bold fusion of Latin and Asian flavors.\n\nLocated in the vibrant heart of Jakarta, Kilo offers a stylish yet relaxed atmosphere perfect for casual dining, date nights, or social gatherings. Blending Jakarta\u2019s fast-paced city life with Kilo\u2019s signature lifestyle approach, the venue creates an immersive experience where food, music, and culture converge. Guests can expect elevated dishes, handcrafted cocktails, and an inviting ambiance that redefines contemporary dining in Indonesia. Whether you\u2019re craving unique flavor combinations or a cozy escape with great vibes, Kilo Kitchen Jakarta is your go-to restaurant for unforgettable dining moments.",
      shortDescription:
        "An all-day cafe and kitchen built around slow mornings, easy lunches, and unhurried catch-ups. Kilo pairs a considered menu with a calm, design-led room that works just as well for solo coffee as it does for long table conversations.",
      caption: "Latin-Asian fusion in a stylish setting",
    },
    {
      folder: "dualism",
      name: "Dualism",
      category: "Lifestyle",
      hasBanner: false,
      operatingHours: "Tuesday - Sunday: 18:00 - 02:00",
      location: "SCBD, Jakarta",
      lat: -6.230096084344473,
      lng: 106.80957632448332,
      description:
        "Dualism is Jakarta\u2019s innovative cocktail bar where contrast takes center stage.\n\nEvery cocktail begins with the same foundation, then branches into two distinct expressions: one bold and spirit-forward, the other playful and elegant. This dual-format menu invites guests to explore the endless possibilities of flavor, texture, and technique. At Dualism, you\u2019ll experience both the familiar and the unexpected. From clean and composed sips to indulgent and expressive pours, each pair reveals the dynamic spectrum of modern mixology. Whether you\u2019re a fan of classic cocktails or experimental drinks, Dualism redefines how we taste by celebrating the power of duality. This isn\u2019t just a bar, it\u2019s an exploration of opposites. And in every contrast, you\u2019ll discover something new.",
      shortDescription:
        "A modern restaurant and bar where dinner service shifts effortlessly into an evening of drinks and music. Dualism balances a refined kitchen with a social, atmospheric room designed to carry a night from the first course onward.",
      caption: "Where every cocktail explores both sides",
    },
    {
      folder: "truce",
      name: "Truce",
      category: "Lifestyle",
      hasBanner: false,
      operatingHours: "Tuesday - Sunday: 18:00 - 02:00",
      location: "SCBD, Jakarta",
      lat: -6.22616914830079,
      lng: 106.80707301098985,
      description:
        "In the heart of SCBD, Truce introduces Jakarta to a slow bar experience inspired by Japanese bar philosophy. Every detail at Truce is intentional. The beverage programme focuses on spirit-forward, classic drinks crafted with method over novelty. Sugar is used sparingly, and a deep respect for base spirits remains central to the offerings. To keep the experience dynamic, the bar also features house ferments, savoury tinctures and hydroponic herbs grown on site.\n\nThe cocktail list is divided into four categories. Crafted Creations reinterpret classic structures with a smoked, late-night twist, while Original Vol. 1 experiments with Japanese ingredients such as edamame, gari and ogura. Seasonal specials, like Hail Mary Pass, push the boundaries of savoury drinking. For lighter moods, highballs, teas and spritzes can be found in the Seltzers and Mizuwari section, reflecting Tokyo\u2019s preference for refreshing drinks that extend the evening.",
      shortDescription:
        "A laid-back bar and lounge built for after-work unwinding and easy evenings out. Truce offers a curated drinks list, considered small plates, and a warm room that invites you to settle in and stay a while.",
      caption: "A slow bar inspired by Japanese philosophy",
    },
    {
      folder: "zoo",
      name: "Zoo",
      category: "Nightlife",
      hasBanner: false,
      operatingHours: "Wednesday - Sunday: 19:00 - 04:00",
      location: "SCBD, Jakarta",
      lat: -6.226216879413745,
      lng: 106.80709112263447,
      description:
        "Zoo is a boutique lounge concept created for all party animals to embrace their wild side.\n\nKnown for its vibrant music direction, ranging from afro, amapiano, baila, to fresh DJ-led sounds, Zoo brings a unique energy to Jakarta\u2019s nightlife scene. Inside, guests can explore a lineup of immersive private rooms, each crafted with its own bold, animal-inspired design. Whether you\u2019re here for late-night drinks, curated DJ sets, or a private celebration, Zoo offers a nightlife experience unlike anywhere else in Jakarta the moment you step through the door.",
      shortDescription:
        "A high-energy club where music leads and the night runs late. Zoo brings together a serious sound system, resident and guest DJs, and a packed dance floor for the city's most committed night owls.",
      caption: "A boutique lounge for all party animals",
    },
    {
      folder: "swillhouse",
      name: "Swillhouse",
      category: "Nightlife",
      hasBanner: false,
      operatingHours: "Wednesday - Sunday: 19:00 - 04:00",
      location: "SCBD, Jakarta",
      lat: -6.226764348529861,
      lng: 106.80725476681219,
      description:
        "The Swillhouse is a hip-hop\u2013focused bar and creative event space in Jakarta.\n\nIt is known for its high-energy atmosphere, curated music, and contemporary minimalist design. A destination for nightlife lovers and the youthful party crowd, The Swillhouse blends hip-hop culture, live DJ sets, and signature events under one roof. Here, hype isn\u2019t just a feeling, it\u2019s the experience. The Swillhouse continues to be one of Jakarta\u2019s go-to spots for nights out, club sessions, and unforgettable moments.",
      shortDescription:
        "A late-night bar and party space with a reputation for atmosphere. Swillhouse pairs inventive drinks with curated music programming, turning an ordinary evening into a proper night out.",
      caption: "Hip-hop culture and high-energy nights",
    },
    {
      folder: "lecirque",
      name: "Lecirque",
      category: "Nightlife",
      hasBanner: false,
      operatingHours: "Friday - Saturday: 21:00 - 05:00",
      location: "SCBD, Jakarta",
      lat: -6.226252844973073,
      lng: 106.80709598215432,
      description:
        "LE CIRQUE REPRESENTS A SHIFT TOWARD A BOLDER, MORE DYNAMIC AND MORE SOULFUL NIGHTLIFE CULTURE MIXED WITH MAD + FUN EXPERIENCE.\n\nA new cultural nightlife house built for Jakarta\u2019s growing community of music lovers. Designed as a playground of sound, style, and energy, Le Cirque brings an experience that blends intimacy, credibility, and modern nightlife culture \u2014 something truly different from anything currently offered in Indonesia. Powered by a custom lighting and visual system, the venue offers a dynamic, immersive atmosphere that moves in sync with the sound. Le Cirque champions a spectrum of unique house-driven styles \u2014 deep house, disco, minimal house, tech house, and modern club rhythms, presented by Indonesia\u2019s top talents and curated international guests. Built for tastemakers, dancers, and true music lovers, Le Cirque is where fun feels inevitable and every night feels alive.",
      shortDescription:
        "A theatrical nightlife destination built for headline performances and venue takeovers. Lecirque blends live entertainment, immersive production, and a charged dance floor for unforgettable late-night experiences.",
      caption: "A new cultural nightlife house",
    },
  ];

  for (const v of VENUES) {
    const slug = await ensureUniqueSlug(v.name, async (s) => {
      const found = await prisma.venue.findUnique({ where: { slug: s } });
      return !!found;
    });
    await prisma.venue.create({
      data: {
        name: v.name,
        slug,
        description: v.description,
        shortDescription: v.shortDescription ?? null,
        caption: v.caption,
        image: asset(v.folder, "image.png"),
        bannerImage: v.hasBanner ? asset(v.folder, "banner.png") : null,
        logo: asset(v.folder, "logo.png"),
        categoryId: categoryId(v.category),
        operatingHours: v.operatingHours,
        location: v.location,
        lat: v.lat,
        lng: v.lng,
      },
    });
  }
  console.log(`Seeded ${VENUES.length} venues.`);
}

async function seedCareers() {
  if (await prisma.career.count()) return;
  const CAREERS = [
    {
      jobTitle: "Bartender",
      department: "Bar",
      employmentType: "FULL_TIME" as const,
      location: "Jakarta — SCBD",
      description:
        "We're looking for a Bartender who can keep their composure and their craft sharp through a packed Friday night. You'll build and serve classic and signature cocktails to spec, manage your station's stock and garnish prep, and read the bar at a glance to keep service moving even when every seat is full. Beyond the pour, you're expected to engage guests, upsell thoughtfully, and represent the energy of the venue every time you're behind the bar.\n\nThe ideal candidate has prior bar experience in a high-volume venue, solid product knowledge across spirits and mixology techniques, and the stamina to stay sharp on your feet for a full shift. You'll work closely with the bar manager on menu development and seasonal specials, and with the floor team to keep drink tickets flowing without bottlenecks. If you take pride in a clean station and a well-balanced drink, we want to hear from you.",
    },
    {
      jobTitle: "Head Waiter",
      department: "Front of House",
      employmentType: "FULL_TIME" as const,
      location: "Jakarta — SCBD",
      description:
        "As Head Waiter, you'll lead the floor team through every service, setting the standard for attentive, polished hospitality from the moment guests are seated to the moment they leave. You'll coordinate table assignments, manage the pacing of courses with the kitchen, and step in personally for VIP tables and special requests, all while keeping a calm, organized floor during the busiest hours.\n\nThis role also carries real people-management responsibility — briefing the team before each shift, training new waitstaff on service standards, and resolving guest concerns before they become problems. We're looking for someone with several years of front-of-house experience, strong command of service flow under pressure, and a genuine instinct for making every table feel well looked after.",
    },
    {
      jobTitle: "Lounge Host/Hostess",
      department: "Front of House",
      employmentType: "PART_TIME" as const,
      location: "Jakarta — Kemang",
      description:
        "Our Lounge Host/Hostess is the first and last impression every guest gets — greeting arrivals, managing reservations and walk-ins, and setting the tone for the night before a single drink is ordered. You'll keep the host stand organized during fluctuating crowd levels, coordinate seating with the floor team in real time, and handle guest questions with warmth even when the lounge is at capacity.\n\nWe're looking for someone naturally personable, comfortable managing a guest list and waitlist under pressure, and confident enough to de-escalate the occasional disagreement over a table. Prior hosting or guest-relations experience is a plus, but the right attitude and presence matter more than a long résumé for this role.",
    },
    {
      jobTitle: "Sous Chef",
      department: "Kitchen",
      employmentType: "FULL_TIME" as const,
      location: "Jakarta — SCBD",
      description:
        "The Sous Chef works directly under the Head Chef to run day-to-day kitchen operations, from prep through close. You'll oversee station setup, quality-check every plate before it leaves the kitchen, and keep service running on pace during full-house nights, stepping onto any station that needs an extra pair of hands. Inventory, ordering, and food-cost discipline are also part of the job, alongside maintaining the kitchen's hygiene and safety standards.\n\nWe need someone with solid culinary training, several years of kitchen experience including time in a supervisory role, and the ability to mentor junior cooks without slowing down service. You'll work closely with the Head Chef on menu testing and seasonal rotations, and you should be comfortable taking ownership of the kitchen when the Head Chef isn't on the floor.",
    },
    {
      jobTitle: "Marketing Intern",
      department: "Marketing",
      employmentType: "INTERNSHIP" as const,
      location: "Jakarta — Head Office",
      description:
        "This internship puts you right in the middle of how a multi-venue hospitality brand builds its presence — supporting content shoots at our venues, drafting social copy, and helping plan promotions and events across our calendar. You'll get hands-on exposure to campaign planning, influencer and partner outreach, and the day-to-day rhythm of marketing a brand with several distinct venues under one roof.\n\nWe're looking for someone currently studying or recently graduated in marketing, communications, or a related field, with a sharp eye for content and a genuine interest in hospitality and nightlife. You should be comfortable working across tools like social schedulers and basic design software, and excited to learn by doing rather than just observing from the sidelines.",
    },
    {
      jobTitle: "Security Supervisor",
      department: "Security",
      employmentType: "FULL_TIME" as const,
      location: "Jakarta — SCBD",
      description:
        "As Security Supervisor, you'll oversee the security team across our venue, managing shift schedules, briefing staff before doors open, and making the judgment calls that keep both guests and team members safe through a busy night. You'll handle door policy enforcement, de-escalate incidents before they grow, and coordinate directly with venue management on capacity, emergency procedures, and any incidents that need follow-up.\n\nWe're looking for someone with prior security or law-enforcement experience, ideally in a nightlife or hospitality setting, along with strong leadership instincts and a level head under pressure. You'll be the person staff and managers turn to when something goes wrong, so sound judgment and clear communication matter just as much as physical presence.",
    },
  ];
  await prisma.career.createMany({ data: CAREERS });
  console.log(`Seeded ${CAREERS.length} careers.`);
}

async function seedMerchandise() {
  if (await prisma.merchandise.count()) return;
  const PRODUCTS = [
    {
      image: "/merchandise/Group 33719.png",
      name: "SwillFam Signature Pen Set",
      shortDescription:
        "A set of five metallic gel pens in the SwillFam pink-to-violet gradient, finished with a glossy lacquer barrel.",
      price: "150000.00",
    },
    {
      image: "/merchandise/pink-tshirt-png-transparent-unisex-apparel-casual-style 1.png",
      name: "SwillFam Classic Tee — Pink",
      shortDescription: "Unisex cotton tee in soft pink with the SwillFam wordmark, cut for an easy everyday fit.",
      price: "250000.00",
    },
    {
      image:
        "/merchandise/striking-modern-pink-lighter-vivid-red-background-with-mysterious-glowing-light-perfect-bold 1.png",
      name: "SwillFam Pocket Lighter — Red",
      shortDescription: "A compact refillable lighter in matte red, built for late nights out.",
      price: "85000.00",
    },
    {
      image: "/merchandise/retro-lava-lamp-dark-room 1.png",
      name: "SwillFam Mood Lamp",
      shortDescription: "A retro-inspired lava lamp that sets the tone for any after-hours hangout.",
      price: "450000.00",
    },
    {
      image: "/merchandise/yellow-tshirt-tshirt-clothing-yellow-tshirt 1.png",
      name: "SwillFam Classic Tee — Yellow",
      shortDescription: "Unisex cotton tee in sunshine yellow with the SwillFam wordmark.",
      price: "250000.00",
    },
    {
      image: "/merchandise/pink-beanie-with-cuff-women-s-winter-accessories 1.png",
      name: "SwillFam Cuffed Beanie",
      shortDescription: "A ribbed-knit cuffed beanie in pink, soft enough for everyday wear.",
      price: "180000.00",
    },
  ];
  await prisma.merchandise.createMany({ data: PRODUCTS });
  console.log(`Seeded ${PRODUCTS.length} merchandise items.`);
}

async function seedFaqs() {
  if (await prisma.faq.count()) return;
  const FAQS = [
    {
      question: "Do I need to make a reservation?",
      answer:
        "Walk-ins are welcome, but reservations are recommended for weekends, group bookings, and peak hours.",
    },
    {
      question: "Can I host a private event at Atsumaru Izakaya?",
      answer:
        "Yes. Atsumaru Izakaya can be booked for private events, from intimate gatherings to full-venue celebrations. Reach out to our team to discuss availability and setup.",
    },
    {
      question: "Is Atsumaru Izakaya suitable for group dining?",
      answer:
        "Yes. The venue is suitable for casual gatherings, celebrations, after-work meals, and group dining experiences.",
    },
    {
      question: "How do I reserve a table for a group, special occasion, or busy dining hours?",
      answer:
        "Contact us via WhatsApp or the inquiry form with your date, group size, and occasion, and our team will help arrange the right table or space for your visit.",
    },
  ];
  await prisma.faq.createMany({
    data: FAQS.map((f, i) => ({
      question: f.question,
      answer: `<p>${f.answer}</p>`,
      segment: "private_events",
      sortOrder: i,
    })),
  });
  console.log(`Seeded ${FAQS.length} FAQs.`);
}

async function main() {
  await seedEventCategories();
  await seedPrivateEventTypes();
  await seedArticleCategories();
  await seedArticles();
  await seedCategories();
  await seedVenues();
  await seedCareers();
  await seedMerchandise();
  await seedFaqs();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
