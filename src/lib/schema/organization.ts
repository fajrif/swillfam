/**
 * `Organization` + `WebSite` — emitted on every page, exactly once.
 *
 * These live in the root layout, so every other builder can reference the
 * organisation by `@id` (`publisher`, `provider`, `organizer`, `parentOrganization`)
 * without restating it.
 */

import type { SiteSettings } from "@/lib/site-settings";
import {
  ORG_ID,
  WEBSITE_ID,
  graph,
  pageUrl,
  postalAddress,
  ref,
  venueId,
  type JsonLdNode,
} from "./core";
import { imageUrl } from "./core";

/**
 * Values the content team has not replaced yet.
 *
 * A fake phone number in `Organization.telephone` publishes a wrong contact to
 * every search engine and AI assistant that reads this — worse than having no
 * number at all. Listing the exact placeholder strings means the key drops out
 * until real data lands, and starts appearing again with no code change the
 * moment it does. Tracked in ROADMAP_PLAN.md's blocked table.
 */
const PLACEHOLDER_CONTACTS = new Set([
  "+62 123 456 7890",
  "+621234567890",
  "621234567890",
]);

function realContact(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || PLACEHOLDER_CONTACTS.has(trimmed)) return undefined;
  return trimmed;
}

/**
 * Confirmed copy for the organisation entity, from the schema spec. Not page
 * metadata — this describes the company, and is the same wherever it appears.
 */
const ORG_DESCRIPTION =
  "Jakarta hospitality group running lifestyle and nightlife venues — a restaurant and bar, a café, bars and clubs across South Jakarta.";

/** Spelling variants people actually search for. */
const ORG_ALTERNATE_NAMES = ["Swillfam", "Swill Fam"];

/** The head office postcode. Per-venue codes come from each venue's own row. */
const ORG_POSTAL_CODE = "12190";

/**
 * The real intrinsic size of `/logo-swillfam.png`, not a guess.
 *
 * It is a wide wordmark, so 118px of height clears Google's 112px minimum by
 * very little — a purpose-made square logo would be safer, and that is logged
 * against the image work in Fase 8.
 */
const LOGO = { url: "/logo-swillfam.png", width: 269, height: 118 };

export function orgGraph({
  settings,
  venueSlugs,
}: {
  settings: SiteSettings;
  /** Published venues only, so a venue switched off drops out by itself. */
  venueSlugs: string[];
}): Record<string, unknown> {
  const whatsapp = realContact(settings.mainWhatsapp);
  const telephone = whatsapp ?? realContact(settings.mainPhone);

  // The street line stays admin-editable (it is what the footer shows); the
  // locality and region are the shared Jakarta constants, as for every venue.
  const street = [settings.officeAddressLine1, settings.officeAddressLine2]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");

  const organization: JsonLdNode = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "SwillFam",
    alternateName: ORG_ALTERNATE_NAMES,
    url: pageUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: imageUrl(LOGO.url),
      width: LOGO.width,
      height: LOGO.height,
    },
    description: ORG_DESCRIPTION,
    email: settings.mainEmail,
    telephone,
    address: postalAddress({ streetAddress: street, postalCode: ORG_POSTAL_CODE }),
    areaServed: { "@type": "City", name: "Jakarta" },
    sameAs: [
      settings.socialInstagram,
      settings.socialTiktok,
      settings.socialYoutube,
      settings.socialLinkedin,
    ],
    subOrganization: venueSlugs.map((slug) => ref(venueId(slug))),
    contactPoint: telephone
      ? {
          "@type": "ContactPoint",
          contactType: "reservations",
          telephone,
          availableLanguage: ["en", "id"],
        }
      : undefined,
  };

  const website: JsonLdNode = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: pageUrl("/"),
    name: "SwillFam",
    inLanguage: "en",
    publisher: ref(ORG_ID),
  };

  return graph(organization, website);
}
