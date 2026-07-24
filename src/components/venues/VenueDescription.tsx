import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import type { Category, Venue } from "@/generated/prisma/client";

export function VenueDescription({
  venue,
}: {
  venue: Venue & { category: Category | null };
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10">
        {venue.category ? (
          <div className="flex flex-col gap-6">
            <Link
              href={`/category/${venue.category.slug}`}
              className="group inline-flex w-fit items-center gap-3 font-inter text-sm uppercase tracking-[0.06em] text-white"
            >
              <span aria-hidden className="transition-transform group-hover:-translate-x-1">
                &larr;
              </span>
              Back to {venue.category.name} Venues
            </Link>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            {venue.caption}
          </h2>
          <div className="flex flex-col justify-center">
          {venue.category ? (
            <Button asChild variant="swillfam" size="pill" className="w-fit mb-8">
              <Link href={`/category/${venue.category.slug}`}>{venue.category.name}</Link>
            </Button>
          ) : null}
            <p className="whitespace-pre-line font-inter leading-relaxed text-white">
              {venue.description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
