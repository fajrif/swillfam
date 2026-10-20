/** Talent page: `Person` + breadcrumb. */

import type { Talent, Venue } from "@/generated/prisma/client";
import { talentSeo } from "@/lib/seo/entities";
import {
  breadcrumb,
  graph,
  imageUrl,
  pageUrl,
  ref,
  talentId,
  venueId,
  type JsonLdNode,
} from "./core";

export type TalentForSchema = Talent & { venue?: Pick<Venue, "slug"> | null };

export function talentGraph(talent: TalentForSchema): Record<string, unknown> {
  const person: JsonLdNode = {
    "@type": "Person",
    "@id": talentId(talent.slug),
    name: talent.name,
    jobTitle: talent.speciality,
    description: talentSeo(talent).description.value,
    image: imageUrl(talent.image),
    url: pageUrl(`/talents/${talent.slug}`),
    worksFor: talent.venue ? ref(venueId(talent.venue.slug)) : undefined,
    // Only the Instagram URL is a real profile link. `spotifyEmbed` and
    // `youtubeEmbed` hold iframe markup, not profile URLs, so they are not
    // `sameAs` candidates — putting an embed snippet in there would be invalid.
    sameAs: [talent.instagramUrl],
  };

  return graph(
    person,
    breadcrumb({ name: "Talents", path: "/talents" }, { name: talent.name }),
  );
}
