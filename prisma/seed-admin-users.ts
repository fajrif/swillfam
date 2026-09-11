import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { BCRYPT_COST } from "../src/lib/password-rules";

/**
 * One OPERATOR account per venue, emailed `admin@<first slug segment>.com`
 * (e.g. admin@truce.com, admin@atsumaru.com for "atsumaru-izakaya").
 *
 * Idempotent: a re-run re-links each operator to its venue but never overwrites
 * an existing password or profile, so passwords changed in the admin survive.
 * The ADMINISTRATOR account comes from seed-admin.ts.
 */
async function main() {
  const password = process.env.OPERATOR_DEFAULT_PASSWORD;
  if (!password) {
    throw new Error("Set OPERATOR_DEFAULT_PASSWORD before running this script.");
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const venues = await prisma.venue.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const used = new Set<string>();
  for (const venue of venues) {
    // Fall back to the full slug if two venues share a first segment.
    const short = venue.slug.split("-")[0];
    const email = `admin@${used.has(short) ? venue.slug : short}.com`;
    used.add(short);

    const existing = await prisma.adminUser.findUnique({ where: { email }, select: { role: true } });
    if (existing?.role === "ADMINISTRATOR") {
      console.warn(`Skipped ${email}: already an administrator.`);
      continue;
    }

    await prisma.adminUser.upsert({
      where: { email },
      update: { role: "OPERATOR", venueId: venue.id },
      create: {
        email,
        passwordHash,
        fullName: `${venue.name} Operator`,
        position: "Venue Operator",
        role: "OPERATOR",
        venueId: venue.id,
      },
    });
    console.log(`Operator ready: ${email} → ${venue.name}`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
