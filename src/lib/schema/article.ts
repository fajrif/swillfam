/** Guide page: `BlogPosting` + breadcrumb. */

import type { Article, Venue } from "@/generated/prisma/client";
import { articleSeo } from "@/lib/seo/entities";
import { truncate } from "@/lib/seo/text";
import {
  ORG_ID,
  articleId,
  breadcrumb,
  graph,
  imageUrls,
  jakartaInstant,
  pageUrl,
  ref,
  venueId,
  type JsonLdNode,
} from "./core";

/** Google truncates a headline past this, and over-long values get flagged. */
const HEADLINE_MAX = 110;

export type ArticleForSchema = Article & {
  venues?: Pick<Venue, "slug" | "published">[];
};

export function articleGraph(article: ArticleForSchema): Record<string, unknown> {
  const posting: JsonLdNode = {
    "@type": "BlogPosting",
    "@id": articleId(article.slug),
    headline: truncate(article.title, HEADLINE_MAX),
    description: articleSeo(article).description.value,
    image: imageUrls(article.ogImage, article.image),
    datePublished: jakartaInstant(article.publishedDate),
    dateModified: jakartaInstant(article.updatedAt),
    // Plain text, with the brand as the fallback — a BlogPosting without an
    // author is incomplete, and the guides are editorial output either way.
    author: article.author?.trim()
      ? { "@type": "Person", name: article.author.trim() }
      : { "@type": "Organization", name: "SwillFam", "@id": ORG_ID },
    publisher: ref(ORG_ID),
    mainEntityOfPage: pageUrl(`/guides/${article.slug}`),
    // "Venues mentioned", by reference. Unpublished venues are filtered out:
    // their `@id` would point at a page that 404s, the same discipline the
    // sitemap follows. The admin picker deliberately still offers them.
    about: (article.venues ?? [])
      .filter((venue) => venue.published)
      .map((venue) => ref(venueId(venue.slug))),
  };

  return graph(
    posting,
    breadcrumb({ name: "Guides & Journal", path: "/guides" }, { name: article.title }),
  );
}
