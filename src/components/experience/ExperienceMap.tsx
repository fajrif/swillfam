import Image from "next/image";
import { Container } from "@/components/shared/Container";

/** Full-width day→night route graphic (Figma "SwillFam Experience" map). */
export function ExperienceMap() {
  return (
    <section className="pb-16 lg:pb-24">
      <Container>
        <div className="relative w-full overflow-hidden border border-sf-border/60 bg-sf-surface">
          <div className="relative aspect-[2780/1308] w-full overflow-hidden">
            <Image
              src="/experience/experience.png"
              alt="A day-to-night route across SwillFam venues"
              fill
              sizes="(max-width: 1440px) 100vw, 1390px"
              className="object-contain"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
