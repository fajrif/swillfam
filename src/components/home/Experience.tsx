import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** The SwillFam Experience (Figma 312:32 + 450:886 day→night route graphic). */
export function Experience() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading
          align="center"
          title="The Swillfam Experience"
          lead="Morning padel at Kilo Cafe. A long lunch at Atsumaru. Cocktails at Dualism or Truce as the sun goes down. Then Zoo, Le Cirque, or Swillhouse when the night really starts. SwillFam is built for the full day: eight venues, one uninterrupted experience, entirely yours."
        />

        <div className="relative w-full overflow-hidden bg-sf-surface">
          <Image
            src="/home/experience.png"
            alt="A day-to-night journey across SwillFam venues"
            width={2780}
            height={1308}
            sizes="(max-width: 1440px) 100vw, 1390px"
            className="h-auto w-full"
          />
        </div>

        <SpecularButton href="/experience" size="lg" radius={30}>
          Discover Experience
        </SpecularButton>
      </Container>
    </section>
  );
}
