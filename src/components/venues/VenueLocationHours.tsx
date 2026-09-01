"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { whatsappHref } from "@/lib/whatsapp";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const DEFAULT_CENTER = { longitude: 106.809, latitude: -6.2249 }; // SCBD, Jakarta

/** "Location Map & Operating Hours" — info panel + single-venue Mapbox map. */
export function VenueLocationHours({
  name,
  location,
  operatingHours,
  lat,
  lng,
  whatsapp,
  placeId,
}: {
  name: string;
  location: string;
  operatingHours: string;
  lat: number | null;
  lng: number | null;
  whatsapp?: string;
  placeId?: string | null;
}) {
  const longitude = lng ?? DEFAULT_CENTER.longitude;
  const latitude = lat ?? DEFAULT_CENTER.latitude;
  const hasCoords = lat != null && lng != null;

  const googleMapsHref = placeId
    ? `https://www.google.com/maps/place/${encodeURIComponent(name)}/data=!4m2!3m1!1s${placeId}`
    : hasCoords
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-12">
        <SectionHeading
          title="Location Map & Operating Hours"
          lead={`Find ${name}, along with hours and directions to plan your visit ahead of time.`}
        />

        <div className="grid grid-cols-1 divide-y divide-sf-border/40 border border-sf-border/40 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          {/* Info panel */}
          <div className="flex flex-col gap-6 p-8 lg:p-12">
            <h3 className="font-syne text-2xl font-bold text-white lg:text-3xl">Visit {name}</h3>
            <p className="font-inter leading-relaxed">
              Find {name} and plan your visit. Check our location, opening hours, and contact
              details before you come.
            </p>
            <div className="flex flex-col gap-1">
              <p className="font-inter font-bold text-white">Location:</p>
              <p className="font-inter leading-relaxed">{location}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-inter font-bold text-white">Operating Hours:</p>
              <p className="whitespace-pre-line font-inter leading-relaxed">
                {operatingHours}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <SpecularButton
                href={googleMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                radius={30}
              >
                Open in Google Maps
              </SpecularButton>
              {whatsapp ? (
                <SpecularButton
                  href={whatsappHref(
                    whatsapp,
                    `Hi SwillFam, I would like to reserve a table at ${name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  radius={30}
                >
                  Reserve via WhatsApp
                </SpecularButton>
              ) : null}
            </div>
          </div>

          {/* Map */}
          <div className="relative h-[360px] w-full lg:h-[460px]">
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
                <p className="font-inter text-sm">
                  Interactive map unavailable. Set NEXT_PUBLIC_MAPBOX_TOKEN to enable it.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
