import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "./SectionHeading";

/** The SwillFam Experience (Figma 312:32 + 450:886 day→night route graphic). */
export function Experience() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading
          align="center"
          title="The SwillFam Experience"
          lead="Swillfam is designed to make discovery easier. We connect people with venues, events, and stories that match their lifestyle, from casual nights out to curated social experiences and exclusive gatherings."
        />

        <div className="relative w-full overflow-hidden border border-sf-border/60 bg-sf-surface">
          <Image
            src="/home/experience.png"
            alt="A day-to-night journey across SwillFam venues"
            width={2780}
            height={1308}
            sizes="(max-width: 1440px) 100vw, 1390px"
            className="h-auto w-full"
          />
        </div>

        <Button asChild size="pill">
          <Link href="#">Discover Experience</Link>
        </Button>
      </Container>
    </section>
  );
}
