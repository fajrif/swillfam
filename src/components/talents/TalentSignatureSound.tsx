import { Container } from "@/components/shared/Container";
import { SocialEmbed } from "@/components/shared/SocialEmbed";

type EmbedBlock = {
  key: string;
  html: string;
  title: string;
  description: string;
  /** YouTube needs a 16:9 box; Spotify/Instagram keep their natural height. */
  embedClassName?: string;
};

/**
 * "Signature Sound" — one labelled block per embed the talent has
 * (Spotify / YouTube / Instagram). Renders nothing when the talent has none.
 */
export function TalentSignatureSound({
  spotifyEmbed,
  youtubeEmbed,
  instagramEmbed,
}: {
  spotifyEmbed: string | null;
  youtubeEmbed: string | null;
  instagramEmbed: string | null;
}) {
  const blocks: EmbedBlock[] = [];
  if (spotifyEmbed) {
    blocks.push({
      key: "spotify",
      html: spotifyEmbed,
      title: "Spotify Embed",
      description:
        "Discover the sounds that define this talent. From late-night grooves to high-energy selections, this playlist gives a closer look into the music, influences, and atmosphere behind the decks.",
    });
  }
  if (youtubeEmbed) {
    blocks.push({
      key: "youtube",
      html: youtubeEmbed,
      title: "Watch the Set",
      description:
        "Catch full sets, performance highlights, and venue features — and feel the energy and atmosphere long before you arrive.",
      embedClassName: "aspect-video [&_iframe]:h-full",
    });
  }
  if (instagramEmbed) {
    blocks.push({
      key: "instagram",
      html: instagramEmbed,
      title: "Follow Along",
      description:
        "Follow the latest moments, sets, and announcements straight from the source.",
    });
  }

  if (blocks.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <h2 className="mx-auto max-w-[640px] text-center font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Signature Sound
        </h2>

        <div className="flex flex-col gap-12">
          {blocks.map((block) => (
            <div
              key={block.key}
              className="grid grid-cols-1 gap-8 border border-sf-border/40 p-6 lg:grid-cols-2 lg:items-center lg:p-8"
            >
              <div className="flex flex-col gap-3">
                <h3 className="font-syne text-2xl font-bold text-white">{block.title}</h3>
                <p className="font-inter leading-relaxed">{block.description}</p>
              </div>
              <SocialEmbed html={block.html} className={block.embedClassName} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
