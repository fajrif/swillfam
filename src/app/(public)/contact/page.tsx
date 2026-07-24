import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import {
  GetInTouchSection,
  LetsConnectSection,
  ContactVenuesSection,
} from "@/components/contact";
import { StandForColumnsSection, CareersSection } from "@/components/about";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Contact SwillFam — Get in Touch",
  description:
    "Reach the SwillFam team for general inquiries, business opportunities, collaborations, private events, media requests, and venue reservations.",
};

export default async function ContactPage() {
  const [settings, articles] = await Promise.all([getSiteSettings(), getArticleRows(3)]);

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
        <ContactVenuesSection />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <CareersSection />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </StickyHero>
  );
}
