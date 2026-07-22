import Image from "next/image";

export type TalentCardData = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  venueId: string | null;
  talentCategoryId: string | null;
  venueName: string | null;
  venueLogo: string | null;
  categoryName: string | null;
};

/** A single talent: image, then a row of [category label | venue logo], name, bio. */
export function TalentCard({ talent }: { talent: TalentCardData }) {
  return (
    <article className="flex flex-col border border-sf-border/50 bg-sf-surface">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sf-surface">
        {talent.image ? (
          <Image
            src={talent.image}
            alt={talent.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-sf-surface" />
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="font-inter text-sm text-white">{talent.categoryName}</span>
          {talent.venueLogo ? (
            <div className="relative h-7 w-28">
              <Image
                src={talent.venueLogo}
                alt={talent.venueName ?? ""}
                fill
                sizes="112px"
                className="object-contain object-right"
              />
            </div>
          ) : (
            <span className="font-syne text-sm font-bold uppercase text-white">{talent.venueName}</span>
          )}
        </div>

        <h3 className="font-syne text-2xl font-bold leading-tight text-white">{talent.name}</h3>
        <p className="line-clamp-3 font-inter text-sm leading-relaxed text-white">{talent.description}</p>
      </div>
    </article>
  );
}
