import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/**
 * "Happening at {venue}" — the venue's own story alongside its imagery, with a
 * route through to the full venue page. Skipped entirely by the caller when the
 * event has no venue attached.
 */
export function EventVenueSection({
  name,
  slug,
  description,
  image,
}: {
  name: string;
  slug: string;
  description: string;
  image: string | null;
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-6">
          <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
            Happening at {name}
          </h2>
          <p className="whitespace-pre-line font-inter leading-relaxed">{description}</p>
          <SpecularButton href={`/venues/${slug}`} size="lg" radius={30} className="w-fit">
            Discover {name}
          </SpecularButton>
        </div>

        {image ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-sf-surface">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
