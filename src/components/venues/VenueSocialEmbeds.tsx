import { Container } from "@/components/shared/Container";
import { SocialEmbed } from "@/components/shared/SocialEmbed";
import { instagramEmbedWorks, instagramProfile } from "@/lib/instagram";

type EmbedBlock = {
  key: string;
  html: string;
  title: string;
  description: string;
  embedClassName?: string;
};

/**
 * Venue "Stay Connected" (Spotify + YouTube) and "Follow Us on Instagram".
 * Each block is conditional; the whole section renders nothing when the venue
 * has none. The Instagram feed is Instagram's own profile embed, derived from
 * the venue's `instagramUrl` — nothing is pasted by an admin. Instagram refuses
 * the embed for some accounts, so the frame is only rendered when a server-side
 * check says it works; the Follow link is always shown.
 */
export async function VenueSocialEmbeds({
  spotifyEmbed,
  youtubeEmbed,
  instagramUrl,
  venueName,
}: {
  spotifyEmbed: string | null;
  youtubeEmbed: string | null;
  instagramUrl: string | null;
  venueName: string;
}) {
  const instagram = instagramProfile(instagramUrl);
  const showFrame = instagram ? await instagramEmbedWorks(instagram.embedUrl) : false;
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

  if (stayConnected.length === 0 && !instagram) return null;

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

        {instagram ? (
          <div className="flex flex-col gap-12">
            <h2 className="mx-auto max-w-[640px] text-center font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
              Follow Us on Instagram
            </h2>
            <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-4">
              {/* Lazy: the section is near the foot of the page, so the frame
                  isn't fetched until the visitor scrolls close to it. */}
              {showFrame ? (
                <iframe
                  src={instagram.embedUrl}
                  title={`${venueName} on Instagram`}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-[700px] w-full border-0"
                />
              ) : null}
              <a
                href={instagramUrl ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter underline underline-offset-4 transition-colors hover:text-sf-accent"
              >
                Follow @{instagram.handle} on Instagram
              </a>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
