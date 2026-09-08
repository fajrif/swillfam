import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import {
  GetInTouchSection,
  LetsConnectSection,
  ContactVenuesSection,
  ContactCtaSection,
} from "@/components/contact";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.pageSeo.findUnique({ where: { pageKey: "contact" } });
  return {
    title: seo?.metaTitle ?? "SwillFam",
    description: seo?.metaDescription ?? undefined,
  };
}

export default async function ContactPage() {
  const [settings, venues] = await Promise.all([
    getSiteSettings(),
    prisma.venue.findMany({
      select: { name: true, slug: true, image: true, whatsapp: true, placeId: true, lat: true, lng: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <StickyHero
      backdrop={
          <Image src="/contact/contact-banner.png" alt="" fill className="object-cover" priority />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Get in Touch with SwillFam
          </h1>
        </Container>
      }
    >
      <Reveal>
        <GetInTouchSection settings={settings} />
      </Reveal>

      <Reveal>
        <LetsConnectSection />
      </Reveal>

      <Reveal>
        <ContactVenuesSection venues={venues} />
      </Reveal>

      <Reveal>
        <ContactCtaSection />
      </Reveal>
    </StickyHero>
  );
}
