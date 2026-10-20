/**
 * One declaration per model of how its SEO values resolve.
 *
 * **This is the only place a fallback chain is written.** `generateMetadata`,
 * the JSON-LD builders and the admin's SEO Details panel all read from here, so
 * the `<title>`, the `og:` tags, the schema `name`/`description` and what the
 * admin is shown can't disagree. They used to be spelled out separately in each
 * route and again in each schema builder — four copies of the venue chain, with
 * nothing keeping them in step.
 *
 * Adding a field to a chain means editing one function here.
 *
 * The inputs are deliberately structural rather than Prisma model types: these
 * resolvers are called with rows selected in different shapes (a full record on
 * a detail page, a narrow `select` elsewhere), and naming only the fields each
 * chain actually reads keeps every caller valid.
 */

import {
  required,
  resolveSeoDescription,
  resolveSeoImage,
  resolveSeoTitle,
  type ResolvedSeo,
  type ResolvedSeoText,
} from "./resolve";
import {
  STATIC_PAGE_SEO_BY_KEY,
  type StaticPageSeoKey,
} from "@/lib/page-seo-registry";

export type EntitySeo = {
  /** Always present: every model's chain ends at a required name column. */
  title: ResolvedSeoText;
  description: ResolvedSeo;
  image: ResolvedSeo;
};

/** The SEO fields every model carries, named as the admin form labels them. */
type SeoFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
};

const manualTitle = (row: SeoFields) => ({ label: "Meta title", value: row.metaTitle });
const manualDescription = (row: SeoFields) => ({
  label: "Meta description",
  value: row.metaDescription,
});
const manualImage = (row: SeoFields) => ({ label: "OG image", value: row.ogImage });

// --- Venue -----------------------------------------------------------------

export type VenueSeoInput = SeoFields & {
  name: string;
  shortDescription?: string | null;
  caption?: string | null;
  description?: string | null;
  bannerImage?: string | null;
  image?: string | null;
};

export function venueSeo(venue: VenueSeoInput): EntitySeo {
  return {
    title: required(
      resolveSeoTitle(manualTitle(venue), { label: "Name", value: venue.name }),
      venue.name,
    ),
    // Shortest first: `description` is a full intro paragraph on every venue.
    description: resolveSeoDescription(
      manualDescription(venue),
      { label: "Short description", value: venue.shortDescription },
      { label: "Caption", value: venue.caption },
      { label: "Description", value: venue.description },
    ),
    image: resolveSeoImage(
      manualImage(venue),
      { label: "Banner image", value: venue.bannerImage },
      { label: "Image", value: venue.image },
    ),
  };
}

// --- Venue category (/venues/lifestyle) ------------------------------------

export type CategorySeoInput = SeoFields & {
  name: string;
  shortDescription?: string | null;
  headline?: string | null;
  caption?: string | null;
  description?: string | null;
  bannerImage?: string | null;
  image?: string | null;
};

export function categorySeo(category: CategorySeoInput): EntitySeo {
  const fallbackTitle = `${category.name} Venues in Jakarta`;
  return {
    title: required(
      resolveSeoTitle(manualTitle(category), {
        label: "Name",
        value: fallbackTitle,
        isDefault: true,
      }),
      fallbackTitle,
    ),
    // `headline` belongs in here: the route's metadata already used it while the
    // schema builder didn't, so the two described a category page differently.
    // That drift is the reason this file exists.
    description: resolveSeoDescription(
      manualDescription(category),
      { label: "Short description", value: category.shortDescription },
      { label: "Headline", value: category.headline },
      { label: "Caption", value: category.caption },
      { label: "Description", value: category.description },
    ),
    image: resolveSeoImage(
      manualImage(category),
      { label: "Banner image", value: category.bannerImage },
      { label: "Image", value: category.image },
    ),
  };
}

// --- Event -----------------------------------------------------------------

export type EventSeoInput = SeoFields & {
  name: string;
  shortDescription?: string | null;
  caption?: string | null;
  description?: string | null;
  bannerImage?: string | null;
  posterImage?: string | null;
  image?: string | null;
  venue?: { name: string } | null;
};

export function eventSeo(event: EventSeoInput): EntitySeo {
  // The venue is part of the event's identity in search results — "Wild Hour at
  // Zoo" is a better result than "Wild Hour".
  const fallbackTitle = `${event.name}${event.venue ? ` at ${event.venue.name}` : ""}`;
  return {
    title: required(
      resolveSeoTitle(manualTitle(event), { label: "Name", value: fallbackTitle }),
      fallbackTitle,
    ),
    description: resolveSeoDescription(
      manualDescription(event),
      { label: "Short description", value: event.shortDescription },
      { label: "Caption", value: event.caption },
      { label: "Description", value: event.description },
    ),
    image: resolveSeoImage(
      manualImage(event),
      { label: "Banner image", value: event.bannerImage },
      { label: "Poster image", value: event.posterImage },
      { label: "Image", value: event.image },
    ),
  };
}

// --- Promotion -------------------------------------------------------------

export type PromotionSeoInput = EventSeoInput;

export function promotionSeo(promotion: PromotionSeoInput): EntitySeo {
  return eventSeo(promotion);
}

// --- Talent ----------------------------------------------------------------

export type TalentSeoInput = SeoFields & {
  name: string;
  speciality?: string | null;
  description?: string | null;
  image?: string | null;
  talentCategory?: { name: string } | null;
};

export function talentSeo(talent: TalentSeoInput): EntitySeo {
  const fallbackTitle = `${talent.name}${
    talent.talentCategory ? ` — ${talent.talentCategory.name}` : ""
  }`;
  return {
    title: required(
      resolveSeoTitle(manualTitle(talent), { label: "Name", value: fallbackTitle }),
      fallbackTitle,
    ),
    // There is no short-description column here, so the full bio is the only
    // source — truncation is doing real work, not acting as a safety net.
    description: resolveSeoDescription(manualDescription(talent), {
      label: "Description",
      value: talent.description,
    }),
    image: resolveSeoImage(manualImage(talent), { label: "Image", value: talent.image }),
  };
}

// --- Guide article ---------------------------------------------------------

export type ArticleSeoInput = SeoFields & {
  title: string;
  shortDescription?: string | null;
  description?: string | null;
  image?: string | null;
};

export function articleSeo(article: ArticleSeoInput): EntitySeo {
  return {
    title: required(
      resolveSeoTitle(manualTitle(article), { label: "Title", value: article.title }),
      article.title,
    ),
    // `description` is Tiptap HTML — the markup stripping matters here.
    description: resolveSeoDescription(
      manualDescription(article),
      { label: "Short description", value: article.shortDescription },
      { label: "Content", value: article.description },
    ),
    image: resolveSeoImage(manualImage(article), { label: "Cover image", value: article.image }),
  };
}

// --- Private event ---------------------------------------------------------

export type PrivateEventSeoInput = SeoFields & {
  title: string;
  shortDescription?: string | null;
  caption?: string | null;
  description?: string | null;
  bannerImage?: string | null;
  image?: string | null;
};

export function privateEventSeo(privateEvent: PrivateEventSeoInput): EntitySeo {
  return {
    title: required(
      resolveSeoTitle(manualTitle(privateEvent), {
        label: "Title",
        value: privateEvent.title,
      }),
      privateEvent.title,
    ),
    description: resolveSeoDescription(
      manualDescription(privateEvent),
      { label: "Short description", value: privateEvent.shortDescription },
      { label: "Caption", value: privateEvent.caption },
      { label: "Description", value: privateEvent.description },
    ),
    image: resolveSeoImage(
      manualImage(privateEvent),
      { label: "Banner image", value: privateEvent.bannerImage },
      { label: "Image", value: privateEvent.image },
    ),
  };
}

// --- Singleton / archive pages --------------------------------------------

/**
 * The 16 pages whose SEO lives in `PageSeo` rather than on a content row.
 *
 * Their last resort is the registry's per-page default, which is why this is
 * the one chain that genuinely reports a "Default" source for text.
 */
export function staticPageSeoValues(
  key: StaticPageSeoKey,
  row: SeoFields | null,
): EntitySeo {
  const def = STATIC_PAGE_SEO_BY_KEY[key];
  return {
    title: required(
      resolveSeoTitle(manualTitle(row ?? {}), {
        label: "Built-in default",
        value: def.defaultTitle,
        isDefault: true,
      }),
      def.defaultTitle,
    ),
    description: resolveSeoDescription(manualDescription(row ?? {}), {
      label: "Built-in default",
      value: def.defaultDescription,
      isDefault: true,
    }),
    image: resolveSeoImage(manualImage(row ?? {})),
  };
}
