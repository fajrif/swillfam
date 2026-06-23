import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const DEFAULTS: { key: string; value: string }[] = [
  { key: "mainEmail", value: "contact@swillfam.com" },
  { key: "mainWhatsapp", value: "+62 123 456 7890" },
  { key: "mainPhone", value: "+62 123 456 7890" },
  { key: "officeAddressLine1", value: "Fairgrounds, SCBD lot 14" },
  {
    key: "officeAddressLine2",
    value: "Jl. Jenderal Sudirman, Senayan, Keb. Baru",
  },
  { key: "officeAddressCity", value: "Jakarta Selatan, DKI Jakarta 12190" },
  { key: "socialLinkedin", value: "" },
  { key: "socialTiktok", value: "" },
  { key: "socialYoutube", value: "" },
  { key: "socialInstagram", value: "" },
];

async function main() {
  for (const { key, value } of DEFAULTS) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`Seeded ${DEFAULTS.length} site settings.`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
