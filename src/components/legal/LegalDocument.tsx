"use client";

import { useEffect, useRef, useState } from "react";

export type LegalSection = {
  id: string;
  tocLabel: string;
  heading: string;
  body: React.ReactNode;
};

type LegalDocumentProps = {
  contactEmail: string;
  noticeTitle: string;
  noticeBody: React.ReactNode;
  sections: LegalSection[];
};

export function LegalDocument({
  contactEmail,
  noticeTitle,
  noticeBody,
  sections,
}: LegalDocumentProps) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);

      let current = activeId;
      for (const section of sections) {
        const el = sectionRefs.current[section.id];
        if (el && window.scrollY >= el.offsetTop - 150) {
          current = section.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-sf-border/30">
        <div
          className="h-full bg-sf-accent origin-left transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative bg-sf-bg">
        <aside className="col-span-1 lg:col-span-4 relative order-2 lg:order-1 hidden md:block">
          <div className="sticky top-32 border border-sf-border bg-sf-surface p-8">
            <h4 className="font-syne font-semibold text-sm uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <i className="ph-fill ph-list-dashes text-sf-accent" /> Table of Contents
            </h4>
            <nav className="flex flex-col gap-4 text-sm font-inter text-white/50">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`toc-link relative block ${activeId === section.id ? "active" : ""}`}
                >
                  {section.tocLabel}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="col-span-1 lg:col-span-8 order-1 lg:order-2 legal-doc max-w-none">
          <div className="bg-sf-surface text-white p-6 font-inter text-lg border-l-4 border-sf-accent mb-12">
            <strong className="font-syne uppercase text-sf-accent tracking-widest text-sm flex items-center gap-2 mb-2">
              <i className="ph-fill ph-warning-circle text-xl" /> {noticeTitle}
            </strong>
            {noticeBody}
          </div>

          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el;
              }}
            >
              <h2>{section.heading}</h2>
              {section.body}
            </section>
          ))}

          <div className="mt-20 pt-12 border-t border-sf-border flex items-center justify-between">
            <p className="font-syne font-semibold text-lg uppercase tracking-tight text-white">End of Document</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-12 h-12 bg-sf-surface border border-sf-border text-white flex items-center justify-center hover:bg-sf-accent hover:border-sf-accent transition-colors"
            >
              <i className="ph-bold ph-arrow-up text-xl" />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
