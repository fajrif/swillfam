"use client";

import { sendGTMEvent } from "@next/third-parties/google";

export type GtmClickEvent = "whatsapp_click" | "maps_click" | "email_click";

/**
 * Sends a GTM event when anything inside it is clicked. A Server Component
 * cannot hand an `onClick` to a client button, so it wraps the link in this
 * instead. `display: contents` keeps the wrapper out of the layout.
 */
export function GtmClick({
  event,
  venue,
  children,
}: {
  event: GtmClickEvent;
  venue?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="contents"
      onClickCapture={() => sendGTMEvent(venue ? { event, venue } : { event })}
    >
      {children}
    </span>
  );
}
