"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Map, { Marker, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

export type VenuePin = {
  id: string;
  name: string;
  slug: string;
  location: string;
  operatingHours: string;
  lat: number | null;
  lng: number | null;
};

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const DEFAULT_CENTER = { longitude: 106.809, latitude: -6.2249 }; // SCBD, Jakarta

function whatsappHref(phone: string, name: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(`Hi SwillFam, I would like to reserve a table at ${name}.`);
  return `https://wa.me/${digits}?text=${text}`;
}

/** Map (left) + collapsible venue list (right). Opening a venue flies the map to it. */
export function VenueLocator({ venues, whatsapp }: { venues: VenuePin[]; whatsapp?: string }) {
  const mapRef = useRef<MapRef>(null);
  const firstWithCoords = venues.find((v) => v.lat != null && v.lng != null);
  const [openSlug, setOpenSlug] = useState(venues[0]?.slug ?? "");
  const [focusSlug, setFocusSlug] = useState((firstWithCoords ?? venues[0])?.slug ?? "");

  useEffect(() => {
    const v = venues.find((x) => x.slug === focusSlug);
    if (v && v.lat != null && v.lng != null) {
      mapRef.current?.flyTo({ center: [v.lng, v.lat], zoom: 16, duration: 1200 });
    }
  }, [focusSlug, venues]);

  if (venues.length === 0) return null;

  return (
    <section className="py-8 lg:py-16">
      <Container className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Map */}
        <div className="relative h-[420px] w-full overflow-hidden border border-sf-border/40 lg:sticky lg:top-24 lg:h-[600px]">
          {TOKEN ? (
            <Map
              ref={mapRef}
              mapboxAccessToken={TOKEN}
              initialViewState={{
                longitude: firstWithCoords?.lng ?? DEFAULT_CENTER.longitude,
                latitude: firstWithCoords?.lat ?? DEFAULT_CENTER.latitude,
                zoom: 15,
              }}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              style={{ width: "100%", height: "100%" }}
            >
              {venues.map((v) =>
                v.lat != null && v.lng != null ? (
                  <Marker
                    key={v.id}
                    longitude={v.lng}
                    latitude={v.lat}
                    color="#c6387f"
                    onClick={() => {
                      setOpenSlug(v.slug);
                      setFocusSlug(v.slug);
                    }}
                  />
                ) : null,
              )}
            </Map>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-sf-surface p-8 text-center">
              <p className="font-inter text-sm text-white/60">
                Interactive map unavailable. Set NEXT_PUBLIC_MAPBOX_TOKEN to enable it.
              </p>
            </div>
          )}
        </div>

        {/* Venue list */}
        <Accordion
          type="single"
          collapsible
          value={openSlug}
          onValueChange={(v) => {
            setOpenSlug(v);
            if (v) setFocusSlug(v);
          }}
          className="flex flex-col gap-4"
        >
          {venues.map((venue) => (
            <AccordionItem
              key={venue.id}
              value={venue.slug}
              className="border border-sf-border/60 px-6 sm:px-8"
            >
              <AccordionTrigger className="items-center gap-6 py-6 font-syne text-xl font-bold text-white hover:no-underline [&>svg]:hidden [&[data-state=open]_i]:rotate-90">
                {venue.name}
                <i
                  className="ph ph-play shrink-0 text-2xl text-white/40 transition-transform duration-200"
                  aria-hidden
                />
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-7 font-inter text-sm leading-relaxed text-white">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-white">Location:</p>
                    <p className="text-white">{venue.location}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-white">Operating Hours:</p>
                    <p className="whitespace-pre-line text-white">{venue.operatingHours}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button asChild variant="swillfam" size="pill" className="w-full">
                      <Link href={`/venues/${venue.slug}`}>See Venue</Link>
                    </Button>
                    {whatsapp ? (
                      <Button asChild variant="swillfam" size="pill" className="w-full">
                        <a
                          href={whatsappHref(whatsapp, venue.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Reserve via WhatsApp
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
