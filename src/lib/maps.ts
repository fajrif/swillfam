/**
 * The venue's Google Maps link — the "Open in Google Maps" button and the
 * schema `hasMap` are the same URL, built here once.
 *
 * There is no separate maps-URL column: `placeId` already identifies the venue
 * unambiguously, and a stored URL would be a second thing to keep in step with
 * it. The coordinate and address fallbacks exist because not every venue has a
 * Place ID yet.
 */
export function googleMapsUrl({
  name,
  placeId,
  lat,
  lng,
  location,
}: {
  name: string;
  placeId?: string | null;
  lat?: number | null;
  lng?: number | null;
  location?: string | null;
}): string {
  if (placeId) {
    return `https://www.google.com/maps/place/${encodeURIComponent(name)}/data=!4m2!3m1!1s${placeId}`;
  }
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location || name)}`;
}
