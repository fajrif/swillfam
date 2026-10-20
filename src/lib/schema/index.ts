/**
 * JSON-LD builders — one per page template, per the schema spec in
 * `requests/swillfam-schema-samples.md`.
 *
 * A builder takes rows a page has already fetched and returns the single
 * `@graph` object that page renders through `<JsonLd>`. They are pure: no
 * builder queries the database, so emitting markup never costs a page an extra
 * round trip.
 */

export { JsonLd } from "@/components/shared/JsonLd";

export {
  ORG_ID,
  WEBSITE_ID,
  breadcrumb,
  collectionPage,
  compactDeep,
  faqPage,
  graph,
  imageUrl,
  imageUrls,
  pageUrl,
  ref,
  venueId,
  type Crumb,
  type JsonLdNode,
} from "./core";

export { orgGraph } from "./organization";
export { venueGraph, venueNode, categoryGraph, type VenueForSchema } from "./venue";
export { eventGraph, type EventForSchema } from "./event";
export { talentGraph, type TalentForSchema } from "./talent";
export { articleGraph, type ArticleForSchema } from "./article";
export {
  aboutGraph,
  archiveGraph,
  breadcrumbOnlyGraph,
  contactGraph,
  experienceGraph,
  merchandiseGraph,
  privateEventGraph,
} from "./page";
