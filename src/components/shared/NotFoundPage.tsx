import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

const LINKS = [
  { href: "/venues", label: "Venues" },
  { href: "/events", label: "Events" },
  { href: "/promotions", label: "Promotions" },
  { href: "/guides", label: "Guides & Journal" },
  { href: "/contact", label: "Contact" },
];

/**
 * The whole 404 page, rendered by both not-found boundaries.
 *
 * Two Next 16.2.9 behaviours shape this component, both verified by hand:
 *
 * 1. A not-found boundary is NOT wrapped by its route group's layout — a
 *    `notFound()` from `(public)/venues/[slug]` renders `(public)/not-found.tsx`
 *    without `(public)/layout.tsx` around it. So the chrome is rendered here.
 * 2. `(public)/not-found.tsx` is not server-rendered at all for a `notFound()`
 *    thrown by a page in the group: the HTML body comes back empty and the UI
 *    only appears after hydration. Verified to be independent of this
 *    component's contents — a bare <h1> behaves the same. The HTTP status is
 *    still a correct 404, which is what crawlers act on. Unmatched URLs go to
 *    the root boundary instead and ARE fully server-rendered.
 *
 * It stays synchronous and free of `getSiteSettings()` so the root boundary can
 * be prerendered at build time: the header takes an empty settings object (it
 * only feeds the social icons in the menu overlay, which fall back to "#") and
 * the footer — which genuinely needs contact data — is left off, as is common
 * for a 404.
 */
export function NotFoundPage() {
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-body">
      <div className="relative">
        <SiteHeader settings={{}} />
      </div>

      <Container className="flex min-h-[70dvh] flex-col justify-center py-32">
        <span className="font-archivo text-sm uppercase tracking-[0.18em] text-sf-accent">
          404
        </span>
        <h1 className="mt-4 max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05]">
          This page has left the party
        </h1>
        <p className="mt-6 max-w-2xl font-inter text-base leading-relaxed md:text-lg">
          The link you followed is out of date or the page has moved. Everything else is
          still open — pick up from one of these.
        </p>

        <nav aria-label="Popular pages" className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-archivo text-sm uppercase tracking-[0.12em] underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-12">
          <SpecularButton href="/" size="lg" radius={30} className="w-fit">
            Back to home
          </SpecularButton>
        </div>
      </Container>
    </main>
  );
}
