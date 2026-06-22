import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";

/** Latest Exclusive Content + Event Recap (Figma 790:124 + 441:108/109). */
export function ExclusiveRecap() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading align="center" title="Latest Exclusive Content" />

        <div className="relative w-full overflow-hidden">
          <div className="relative aspect-[1390/625] w-full">
            <Image
              src="/home/recap.png"
              alt="Event recap"
              fill
              sizes="(max-width: 1440px) 100vw, 1390px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="px-6 text-center font-syne text-[clamp(1.75rem,5vw,64px)] leading-tight text-white">
                Event Recap Title
              </h3>
            </div>
          </div>
        </div>

        <Button asChild variant="pill" size="pill">
          <Link href="#">View Exclusive Contents</Link>
        </Button>
      </Container>
    </section>
  );
}
