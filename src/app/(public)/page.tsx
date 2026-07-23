import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { MetaballsBackground } from "@/components/reactbits/MetaballsBackground";
import { DualImageColumnSection } from "@/components/shared/DualImageColumnSection";
import { EventSectionWithImage } from "@/components/shared/EventSectionWithImage";
import { Experience } from "@/components/home/Experience";
import { CardImageInfoSection } from "@/components/shared/CardImageInfoSection";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { ExclusiveRecap } from "@/components/home/ExclusiveRecap";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";

// Statically rendered but data-driven (articles) — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "SwillFam — Discover the City's Best Lifestyle & Nightlife Experiences",
  description:
    "SwillFam connects people with the city's best venues, events, and stories — from casual nights out to curated social experiences and exclusive gatherings.",
};

export default async function Home() {
  const [settings, articles] = await Promise.all([getSiteSettings(), getArticleRows(3)]);
  return (
    <StickyHero
      backdrop={
        <MetaballsBackground
          className="absolute inset-0"
          speed={0.5}
          direction="forward"
          scale={1.8}
          opacity={0.8}
        />
      }
      heroContent={
        <Container className="relative z-10 grid h-full w-full grid-cols-1 items-end gap-8 pb-12 lg:grid-cols-[1fr_auto] lg:pb-16">
          <h1 className="order-2 font-syne text-[clamp(3.25rem,13vw,130px)] font-bold uppercase leading-[0.9] tracking-tight text-white lg:order-1">
            SwillFam
          </h1>

          <div className="order-1 flex max-w-[480px] flex-col gap-5 lg:order-2 lg:items-end lg:text-right">
            {/* Featured-event mini card */}
            <div className="flex items-center gap-4 border border-white/10 bg-sf-surface/70 p-3 backdrop-blur-sm">
              <Image
                src="/home/trusted-3.png"
                alt=""
                width={84}
                height={84}
                className="size-[68px] shrink-0 object-cover"
              />
              <div className="text-left">
                <p className="font-archivo text-[13px] font-semibold uppercase tracking-wide text-white">
                  Newest Featured Event
                </p>
                <p className="mt-1 font-inter text-xs leading-snug text-white">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                </p>
              </div>
            </div>

            <p className="font-syne text-2xl font-semibold leading-snug text-white lg:text-[33px]">
              Discover the City&rsquo;s Best Lifestyle &amp; Nightlife Experiences
            </p>
          </div>
        </Container>
      }
    >
      <Reveal>
        <DualImageColumnSection
          parallax
          tiles={[
            { src: "/home/category-lifestyle.png", label: "Lifestyle", labelAlign: "top-left", href: "/category/lifestyle" },
            { src: "/home/category-nightlife.png", label: "Nightlife", labelAlign: "bottom-right", href: "/category/nightlife" },
          ]}
        />
      </Reveal>
      <Reveal>
        <EventSectionWithImage
          title="Upcoming Events"
          description="Stay updated with upcoming events, special programs, parties, collaborations, and community gatherings happening across Swillfam's network."
          ctaText="See all events"
          ctaHref="/events"
          items={[
            { img: "/home/poster-1.png", title: "Mat & Mingle", shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
            { img: "/home/poster-2.png", title: "High Five", shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
            { img: "/home/poster-3.png", title: "Truce", shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          ]}
        />
      </Reveal>
      <Reveal>
        <Experience />
      </Reveal>
      <Reveal>
        <CardImageInfoSection />
      </Reveal>
      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
      <Reveal>
        <ExclusiveRecap youtubeUrl={settings.socialYoutube} />
      </Reveal>
    </StickyHero>
  );
}
