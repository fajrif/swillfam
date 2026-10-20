/**
 * Hero heading for a page whose subject has a name: a venue, a venue category.
 *
 * **The H1 is the subject's name, never its tagline.** Both pages used to put
 * the admin's `heroTitle`/`headline` in the H1 and fall back to the name only
 * when it was blank — and since every row has one, the H1 on `/venues/zoo` read
 * "Enter the Wild Side" with the word "Zoo" nowhere in it. The page's one
 * heading has to say what the page is about: that is what a crawler reads as
 * the page's subject, and the brief requires it.
 *
 * The tagline keeps the same face, case and weight — it is still the editorial
 * line the design calls for — but steps down a scale so the lockup reads as
 * name-then-tagline. Holding it at the H1's size would leave two display lines
 * of equal weight competing, which is a worse hero than the one we started
 * with.
 */
export function HeroTitle({ name, tagline }: { name: string; tagline?: string | null }) {
  return (
    <>
      <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
        {name}
      </h1>
      {tagline ? (
        <p className="max-w-3xl font-syne text-[clamp(1.375rem,3vw,32px)] font-semibold uppercase leading-[1.15] text-white">
          {tagline}
        </p>
      ) : null}
    </>
  );
}
