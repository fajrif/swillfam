/**
 * Seasonal campaign switches. Server-only and read per request (same contract as
 * `SITE_INDEXABLE`): anything other than exactly "true" is off, and changing it
 * needs a restart (`pm2 restart swillfam --update-env`), not a rebuild.
 */

/** Halloween: static home banner + the flyer pop-up on the home page. */
export const halloweenOn = () => process.env.HALLOWEEN_MODE === "true";

export const HALLOWEEN_BANNER = "/halloween/banner.webp";
export const HALLOWEEN_FLYER = "/halloween/flyer.webp";
export const HALLOWEEN_LINK = "https://adecadeofpoppin.com/event/the-further";
