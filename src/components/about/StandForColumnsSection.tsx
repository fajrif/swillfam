import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { DestinationsColumn } from "@/components/shared/DestinationsColumn";

export function StandForColumnsSection() {
  return (
    <section className="pt-16">
      <Container>
        <div className="grid border border-sf-border/40 lg:grid-cols-[8fr_4fr]">
          <DestinationsColumn />

          {/* Our Experiences */}
          <div className="flex flex-col justify-between gap-4 p-4 lg:border-l lg:border-sf-border/40">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                Our Experiences
              </h3>
              <p className="font-inter leading-relaxed">
                SwillFam brings together food, drinks, music, entertainment, and community to
                create memorable moments.
              </p>
              <p className="mb-5 font-inter leading-relaxed">
                From events and celebrations to collaborations and nights out, every experience is
                designed to connect people and leave a lasting impression.
              </p>
            </div>
            <SpecularButton href="/experience" size="lg" radius={30} className="w-fit">
              See Experiences
            </SpecularButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
