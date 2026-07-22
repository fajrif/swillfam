import { cn } from "@/lib/utils";

/**
 * Renders a stored embed snippet (a full `<iframe …>` string saved by an admin,
 * e.g. Spotify / YouTube / Instagram) responsively. Trusted admin HTML — same
 * `dangerouslySetInnerHTML` pattern used by FaqSection/ArticleContent. The child
 * iframe is forced to fill its container's width; height comes from the embed.
 */
export function SocialEmbed({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
