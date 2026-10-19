/**
 * Public-side filter for content that hangs off a venue (events, promotions,
 * talents, galleries). Unpublishing a venue has to take its cards down with it
 * — otherwise they keep linking to a venue page that now 404s, which a crawl
 * reports as a broken link.
 *
 * Rows with no venue at all are kept: every foreign key in this schema is
 * optional with `onDelete: SetNull`, so `venueId: null` is a normal state and
 * means "not tied to a venue", not "hidden".
 */
export const publishedVenueScope = {
  OR: [{ venueId: null }, { venue: { published: true } }],
};
