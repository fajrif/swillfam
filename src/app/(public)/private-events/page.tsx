import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import {
  VisionSection,
  EventTypesSection,
  MomentsCarousel,
  FaqSection,
} from "@/components/private-events";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { getArticleRows } from "@/lib/articles";

// Statically rendered but data-driven (FAQs, articles) — revalidate periodically
// so admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Private Events | SwillFam",
  description:
    "Host corporate functions, birthdays, brand activations, and celebrations across SwillFam's distinctive venues — events designed around your vision.",
};

export default async function PrivateEventsPage() {
  const [faqs, articles] = await Promise.all([
    prisma.faq.findMany({
      where: { published: true, segment: "private_events" },
      orderBy: { sortOrder: "asc" },
    }),
    getArticleRows(3),
  ]);

  return (
    <StickyHero
      backdrop={
        <ParallaxImage>
          <Image src="/private-events/Mask group.png" alt="" fill className="object-cover" priority />
        </ParallaxImage>
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Private Events, Made Memorable
          </h1>
        </Container>
      }
    >
      <Reveal>
        <VisionSection />
      </Reveal>

      <Reveal>
        <EventTypesSection />
      </Reveal>

      <Reveal>
        <MomentsCarousel />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <FaqSection faqs={faqs} />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </StickyHero>
  );
}
