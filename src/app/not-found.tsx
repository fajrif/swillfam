import type { Metadata } from "next";
import { NotFoundPage } from "@/components/shared/NotFoundPage";

/**
 * 404 for URLs that match no route at all. A `notFound()` thrown by a page
 * inside the `(public)` group is caught by `(public)/not-found.tsx` instead —
 * both render the same component.
 */
export const metadata: Metadata = {
  title: "Page Not Found | SwillFam",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage />;
}
