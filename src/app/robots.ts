import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

/**
 * AI search, assistant and answer-engine crawlers, allowed on purpose.
 *
 * The training crawlers in this list (GPTBot, Google-Extended, Applebot-Extended,
 * Meta-ExternalAgent) are included deliberately: the site is public marketing
 * content, and blocking them only reduces how well AI assistants know and
 * recommend SwillFam venues. Decision recorded 19 Oct 2026.
 *
 * A crawler that matches a named group ignores the `*` group entirely, so these
 * need their own copy of the disallow list — Next emits one block per agent.
 */
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Meta-ExternalAgent",
];

/**
 * Paths kept out of the index. `/search` from the original pack is omitted —
 * no such route exists. `/api/` has no routes either (this app uses Server
 * Actions, not a REST layer) but is kept as a cheap guard for anything added
 * under Next's conventional API path later.
 *
 * `/uploads/` is deliberately NOT disallowed: venue and event images are served
 * from there and need to stay crawlable for image search and for the original
 * file URLs that OG tags and JSON-LD point at.
 */
const DISALLOW = ["/admin/", "/api/"];

/**
 * Staging must never be indexed, so indexing is opt-in: only a deployment that
 * explicitly sets SITE_INDEXABLE="true" serves an allow-list. Getting this
 * wrong on production is caught by the pre-launch check in ROADMAP_PLAN.md
 * (`curl -s / | grep 'name="robots"'`); getting it wrong on staging would not
 * be caught by anything, which is why the safe default points the other way.
 */
/**
 * Read per request, not baked at build. This app is self-hosted behind
 * `next start`, so the same build can be deployed to staging and production
 * with different env files — a statically generated robots.txt would freeze
 * whichever value was present on the build machine and silently ignore the
 * server's own setting.
 */
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE !== "true") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
