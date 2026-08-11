"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { OfferCard, type OfferCardData } from "@/components/shared/OfferCard";

const PAGE = 6;

/**
 * "Past Editions" — retired (deactivated) events presented as previous runs of
 * this series, paged in memory six at a time like the /events browser. The
 * caller omits the section when there are none.
 */
export function PastEditionsSection({
  seriesName,
  editions,
}: {
  seriesName: string;
  editions: OfferCardData[];
}) {
  const [visible, setVisible] = useState(PAGE);
  const shown = editions.slice(0, visible);

  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12">
        <div className="flex flex-col gap-5">
          <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
            Past Editions
          </h2>
          <p className="font-inter leading-relaxed">
            Explore previous editions of {seriesName} and see how the event has grown over time. Each
            past edition may include the event date, poster thumbnail, featured talent, recap video,
            gallery, or short highlight from the night.
          </p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            {shown.map((edition, i) => (
              <div
                key={edition.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <OfferCard offer={edition} />
              </div>
            ))}
          </div>

          {editions.length > visible && (
            <SpecularButton
              type="button"
              size="lg"
              radius={30}
              onClick={() => setVisible((v) => v + PAGE)}
            >
              Load More
            </SpecularButton>
          )}
        </div>
      </Container>
    </section>
  );
}
