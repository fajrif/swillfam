"use client";

import Image from "next/image";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { ParallaxImage } from "@/components/shared/ParallaxImage";

export function DestinationsColumn({
  imageSrc = "/about/personalities.png",
  alt = "SwillFam destinations",
}: {
  imageSrc?: string;
  alt?: string;
}) {
  return (
    <div className="flex flex-col gap-8 border-b border-sf-border/40 p-4 sm:flex-row lg:border-b-0">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:w-[340px]">
        <ParallaxImage>
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-cover"
          />
        </ParallaxImage>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
            Destinations with Distinct Personalities
          </h3>
          <p className="mb-5 font-inter leading-relaxed text-white">
            Every SwillFam venue has its own concept and atmosphere. From dining and social spaces to
            nightlife and events, each offers a unique experience while reflecting the SwillFam
            identity. Our venues are designed to bring people together and create memorable moments.
          </p>
        </div>
        <SpecularButton href="/venues" size="lg" radius={30} className="w-fit">
          Explore Venues
        </SpecularButton>
      </div>
    </div>
  );
}
