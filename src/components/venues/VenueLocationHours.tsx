"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const DEFAULT_CENTER = { longitude: 106.809, latitude: -6.2249 }; // SCBD, Jakarta

/** "Location & Operating Hours" — single-venue Mapbox map + an info panel. */
export function VenueLocationHours({
  name,
  location,
  operatingHours,
  lat,
  lng,
}: {
  name: string;
  location: string;
  operatingHours: string;
  lat: number | null;
  lng: number | null;
}) {
  const longitude = lng ?? DEFAULT_CENTER.longitude;
  const latitude = lat ?? DEFAULT_CENTER.latitude;
  const hasCoords = lat != null && lng != null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-12">
        <SectionHeading title="Location & Operating Hours" align="center" />

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          {/* Map */}
          <div className="relative h-[360px] w-full overflow-hidden border border-sf-border/40 lg:h-[460px]">
            {TOKEN ? (
              <Map
                mapboxAccessToken={TOKEN}
                initialViewState={{ longitude, latitude, zoom: hasCoords ? 16 : 13 }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                style={{ width: "100%", height: "100%" }}
              >
                {hasCoords ? (
                  <Marker longitude={longitude} latitude={latitude} color="#c6387f" />
                ) : null}
              </Map>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-sf-surface p-8 text-center">
                <p className="font-inter text-sm text-white/60">
                  Interactive map unavailable. Set NEXT_PUBLIC_MAPBOX_TOKEN to enable it.
                </p>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="flex flex-col justify-center gap-8 border border-sf-border/40 bg-sf-surface/30 p-8 lg:p-12">
            <div className="flex flex-col gap-2">
              <p className="font-archivo text-xs uppercase tracking-[0.16em] text-white">
                {name}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-syne text-lg font-bold text-white">Location</p>
              <p className="font-inter text-base leading-relaxed text-white">{location}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-syne text-lg font-bold text-white">Operating Hours</p>
              <p className="whitespace-pre-line font-inter text-base leading-relaxed text-white">
                {operatingHours}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
