import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const UPDATES = [
  { slug: "zoo",               lat: -6.226392860978992,  lng: 106.80458057510435,  whatsapp: "628111651200", placeId: "0x2e69f102f0d6b0ff:0x295af67d661ae96" },
  { slug: "swillhouse",        lat: -6.226961660984185,  lng: 106.80469057510444,  whatsapp: "6287884288880", placeId: "0x2e69f1a20b4e478f:0xd1076df299376c45" },
  { slug: "atsumaru-izakaya",  lat: -6.249483000000001,  lng: 106.80038789999999,  whatsapp: "6282127771877", placeId: "0x2e69f1ae826821ff:0x80c9dca74b0c2cc7" },
  { slug: "kilo",              lat: -6.230042361012479,  lng: 106.80445487510448,  whatsapp: "6281288002987", placeId: "0x2e69f173d2784aa1:0x31b5b5a65def510" },
  { slug: "dualism",           lat: -6.229897476713857,  lng: 106.80935433660753,  whatsapp: "6281252227022", placeId: "0x2e69f1a84a18334b:0x9cd507ae383e145e" },
  { slug: "truce",             lat: -6.226366460978758,  lng: 106.80445517510445,  whatsapp: "6282289998829", placeId: "0x2e68e7395015ed9d:0x8dfda714139f9c8a" },
  { slug: "lecirque",          lat: -6.226418160979237,  lng: 106.8044888751044,   whatsapp: "6282289990869", placeId: "0x2e69f10623238287:0x47d18945e1a3a034" },
];

async function main() {
  for (const { slug, lat, lng, whatsapp, placeId } of UPDATES) {
    const { count } = await prisma.venue.updateMany({ where: { slug }, data: { lat, lng, whatsapp, placeId } });
    if (count === 0) console.warn(`  ⚠ Venue "${slug}" not found — skipped`);
    else console.log(`  ✓ ${slug}`);
  }
  console.log("Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
