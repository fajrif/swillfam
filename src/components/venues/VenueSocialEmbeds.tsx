import { Container } from "@/components/shared/Container";
import { SocialEmbed } from "@/components/shared/SocialEmbed";

type EmbedBlock = {
  key: string;
  html: string;
  title: string;
  description: string;
  embedClassName?: string;
};

/**
 * Venue "Stay Connected" (Spotify + YouTube) and "Follow Us on Instagram"
 * embeds. Each block is conditional; the whole section renders nothing when the
 * venue has no embeds set.
 */
export function VenueSocialEmbeds({
  spotifyEmbed,
  youtubeEmbed,
  instagramEmbed,
  venueName,
}: {
  spotifyEmbed: string | null;
  youtubeEmbed: string | null;
  instagramEmbed: string | null;
  venueName: string;
}) {
  const stayConnected: EmbedBlock[] = [];
  if (spotifyEmbed) {
    stayConnected.push({
      key: "spotify",
      html: spotifyEmbed,
      title: "Spotify Embed",
      description: `Set the mood with ${venueName}'s signature sound. Press play and get a feel for the atmosphere before you arrive.`,
    });
  }
  if (youtubeEmbed) {
    stayConnected.push({
      key: "youtube",
      html: youtubeEmbed,
      title: "YouTube",
      description: `Explore the latest videos, highlights, venue features, and behind-the-scenes moments from ${venueName}.`,
      embedClassName: "aspect-video [&_iframe]:h-full",
    });
  }

  if (stayConnected.length === 0 && !instagramEmbed) return null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-16">
        {stayConnected.length > 0 ? (
          <div className="flex flex-col gap-12">
            <h2 className="mx-auto max-w-[640px] text-center font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
              Stay Connected
            </h2>
            <div className="flex flex-col gap-12">
              {stayConnected.map((block) => (
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
          </div>
        ) : null}

        {instagramEmbed ? (
          <div className="flex flex-col gap-12">
            <h2 className="mx-auto max-w-[640px] text-center font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
              Follow Us on Instagram
            </h2>
            <SocialEmbed html={instagramEmbed} className="mx-auto max-w-[640px]" />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
