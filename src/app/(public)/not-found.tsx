import type { Metadata } from "next";
import { NotFoundPage } from "@/components/shared/NotFoundPage";

/**
 * Handles `notFound()` from any public page — an unknown venue, event,
 * promotion, talent, guide or private-event slug.
 */
export const metadata: Metadata = {
  title: "Page Not Found | SwillFam",
  robots: { index: false, follow: true },
};

export default function PublicNotFound() {
  return <NotFoundPage />;
}
