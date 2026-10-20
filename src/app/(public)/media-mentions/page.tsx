import { staticPageMetadata, staticPageSeo } from "@/lib/seo/static-page";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { MediaMentionsIntro, MediaMentionsList } from "@/components/media-mentions";
import { JsonLd, archiveGraph } from "@/lib/schema";

export const revalidate = 60;

export const generateMetadata = () => staticPageMetadata("media-mentions");

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
      <JsonLd
        data={archiveGraph({
          path: "/media-mentions",
          ...(await staticPageSeo("media-mentions")),
          crumbName: "Media Mentions",
          // These link off-site, to the publications themselves.
          items: mentions.map((m) => ({ name: m.articleTitle, path: m.link })),
        })}
      />
      <Reveal>
        <MediaMentionsIntro />
      </Reveal>

      <Reveal>
        <MediaMentionsList mentions={mentions} />
      </Reveal>
    </StickyHero>
  );
}
