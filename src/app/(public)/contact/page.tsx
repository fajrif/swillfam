import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import {
  ContactHero,
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
    <>
      <ContactHero />

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
    </>
  );
}
