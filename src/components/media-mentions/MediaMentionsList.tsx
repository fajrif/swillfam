"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import type { MediaMention } from "@/generated/prisma/client";
import { formatDay } from "@/lib/date";

const INITIAL = 6;

export function MediaMentionsList({
  mentions,
}: {
  mentions: MediaMention[];
}) {
  const [count, setCount] = useState(INITIAL);
  const visible = mentions.slice(0, count);
  const hasMore = count < mentions.length;

  if (mentions.length === 0) return null;

  return (
    <section className="pb-16 lg:pb-24">
      <Container className="flex flex-col items-center gap-8 lg:gap-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visible.map((m) => (
            <article
              key={m.id}
              className="relative flex h-full flex-col gap-4 border border-sf-border/50 p-8"
            >
              <h3 className="font-syne text-2xl leading-tight text-white">
                {m.title}
              </h3>
              <div className="flex flex-col gap-1 font-inter text-sm">
                <p>
                  <span className="font-semibold text-white">Article name:</span> {m.articleTitle}
                </p>
                <p>
                  <span className="font-semibold text-white">Publication name:</span> {m.publicationName}
                </p>
                <p>
                  <span className="font-semibold text-white">Published date:</span> {formatDay(m.publishedDate)}
                </p>
              </div>
              <p className="line-clamp-3 font-inter leading-relaxed">
                {m.shortDescription}
              </p>
              <div className="mt-auto pt-2">
                <SpecularButton
                  href={m.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  radius={30}
                >
                  Read Article
                </SpecularButton>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <SpecularButton
            onClick={() => setCount((c) => c + 6)}
            size="lg"
            radius={30}
          >
            Load More
          </SpecularButton>
        )}
      </Container>
    </section>
  );
}
