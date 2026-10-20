import type { Metadata } from "next";

/**
 * Exists only to carry metadata for the whole admin section — it adds no
 * chrome, which `admin/(dashboard)/layout.tsx` owns (and `login`/`logout` sit
 * outside that group deliberately, so they get no sidebar).
 *
 * `robots.ts` already disallows `/admin/`, but robots.txt is a crawl
 * instruction, not an indexing one: a URL that is linked from somewhere else
 * can still be indexed without being fetched. `noindex` is the directive that
 * actually keeps these pages out, and it costs one header per page.
 */
export const metadata: Metadata = {
  title: "SwillFam Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
