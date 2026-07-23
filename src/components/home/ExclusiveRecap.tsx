import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** Latest Exclusive Content + Event Recap (Figma 790:124 + 441:108/109).
 *  "View Exclusive Contents" links out to the admin-configured YouTube channel
 *  when set, falling back to the /exclusive page otherwise. */
export function ExclusiveRecap({ youtubeUrl }: { youtubeUrl?: string | null }) {
  const href = youtubeUrl || "/exclusive";

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading align="center" title="Latest Exclusive Content" />

        <div className="relative w-full overflow-hidden">
          <div className="relative aspect-[1390/625] w-full">
            <video
              src="https://swillfam.com/assets/BICYdCYp.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="px-6 text-center font-syne text-[clamp(1.75rem,5vw,64px)] leading-tight text-white">
                SWILLFAM EXCLUSIVE
              </h3>
            </div>
          </div>
        </div>

        <SpecularButton
          href={href}
          target={youtubeUrl ? "_blank" : undefined}
          rel={youtubeUrl ? "noopener noreferrer" : undefined}
          size="lg"
          radius={30}
        >
          View Exclusive Contents
        </SpecularButton>
      </Container>
    </section>
  );
}
