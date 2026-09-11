import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { BCRYPT_COST } from "../src/lib/password-rules";

/** The ADMINISTRATOR account. Venue operators come from seed-admin-users.ts. */
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, role: "ADMINISTRATOR", venueId: null },
    create: { email, passwordHash, fullName: "Admin", role: "ADMINISTRATOR" },
  });

  console.log(`Administrator ready: ${admin.email}`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
