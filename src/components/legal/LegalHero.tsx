import Image from "next/image";
import { Container } from "@/components/shared/Container";

export function LegalHero({
  badgeLabel,
  title,
  lastUpdated,
  effectiveDate,
}: {
  badgeLabel: string;
  title: string;
  lastUpdated: string;
  effectiveDate: string;
}) {
  return (
    <div className="relative h-[480px] w-full overflow-hidden">
      <Image src="/contact/contact-banner.png" alt="" fill className="object-cover" priority />
      <div className="absolute inset-x-0 bottom-0 h-[225px] bg-gradient-to-t from-sf-bg to-transparent" />
      <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
        <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
          {title}
        </h1>
        <div className="mt-6 flex flex-col gap-3 font-inter text-sm text-white sm:flex-row sm:items-center">
          <span>Last Updated: {lastUpdated}</span>
          <span className="hidden sm:inline-block size-1 rounded-full bg-white/30" />
          <span>Effective: {effectiveDate}</span>
        </div>
      </Container>
    </div>
  );
}
