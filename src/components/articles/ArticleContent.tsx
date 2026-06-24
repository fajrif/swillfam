import Link from "next/link";
import { Container } from "@/components/shared/Container";

const DATE_FMT = new Intl.DateTimeFormat("en-GB");

/** Back link + 2-column intro (title / date + blurb) + rich-text body. */
export function ArticleContent({
  title,
  publishedDate,
  shortDescription,
  description,
}: {
  title: string;
  publishedDate: Date;
  shortDescription: string;
  description: string;
}) {
  return (
    <article className="py-12 lg:py-16">
      <Container className="flex flex-col gap-12">
        <Link
          href="/articles"
          className="font-inter text-sm text-white transition-colors hover:text-sf-accent"
        >
          ← Back to All Articles
        </Link>

        {/* Intro: date, title, blurb stacked in a single column */}
        <div className="flex flex-col gap-4">
          <span className="font-inter text-sm text-white/50">
            {DATE_FMT.format(publishedDate)}
          </span>
          <h2 className="font-syne text-[clamp(2rem,4.5vw,56px)] leading-[1.05] text-white">
            {title}
          </h2>
          <p className="font-inter leading-relaxed text-white">{shortDescription}</p>
        </div>

        {/* Body: admin-authored Tiptap HTML (trusted) */}
        <div
          className="max-w-[820px] font-inter leading-relaxed text-white [&_blockquote]:border-l-2 [&_blockquote]:border-sf-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-syne [&_h2]:text-2xl [&_h2]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-syne [&_h3]:text-xl [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </Container>
    </article>
  );
}
