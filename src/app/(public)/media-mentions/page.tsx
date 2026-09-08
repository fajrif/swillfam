import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { MediaMentionsIntro, MediaMentionsList } from "@/components/media-mentions";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.pageSeo.findUnique({ where: { pageKey: "media-mentions" } });
  return {
    title: seo?.metaTitle ?? "SwillFam",
    description: seo?.metaDescription ?? undefined,
  };
}

export default async function MediaMentionsPage() {
  const mentions = await prisma.mediaMention.findMany({
    orderBy: { publishedDate: "desc" },
  });

  return (
    <StickyHero
      backdrop={
        <Image
          src="/banner-media-mentions.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Media Mentions
          </h1>
        </Container>
      }
    >
      <Reveal>
        <MediaMentionsIntro />
      </Reveal>

      <Reveal>
        <MediaMentionsList mentions={mentions} />
      </Reveal>
    </StickyHero>
  );
}
