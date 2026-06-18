"use client";

import { useEffect, useRef, useState } from "react";
import { LegalNav } from "@/components/legal/LegalNav";

export type LegalSection = {
  id: string;
  tocLabel: string;
  heading: string;
  body: React.ReactNode;
};

type LegalDocumentProps = {
  badgeLabel: string;
  title: string;
  lastUpdated: string;
  effectiveDate: string;
  contactEmail: string;
  noticeTitle: string;
  noticeBody: React.ReactNode;
  sections: LegalSection[];
};

export function LegalDocument({
  badgeLabel,
  title,
  lastUpdated,
  effectiveDate,
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
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-brand-bg">
        <div
          className="h-full bg-brand-orange origin-left transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <LegalNav />

      <header className="pt-32 pb-16 px-4 sm:px-6 lg:px-12 border-b-2 border-brand-black">
        <div className="max-w-7xl mx-auto pt-12 md:pt-24">
          <div className="inline-flex items-center gap-3 bg-brand-black text-brand-lime px-4 py-2 mb-8 shadow-[4px_4px_0px_#FF4911]">
            <i className="ph-bold ph-file-text text-xl" />
            <span className="text-xs font-display font-bold uppercase tracking-[0.1em]">{badgeLabel}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-brand-black mb-6 max-w-4xl leading-[1.1]">
            {title}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center text-zinc-500 font-base">
            <div className="flex items-center gap-2">
              <i className="ph-bold ph-calendar-blank" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <div className="flex items-center gap-2">
              <i className="ph-bold ph-clock" />
              <span>Effective: {effectiveDate}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
        <aside className="col-span-1 lg:col-span-4 relative order-2 lg:order-1 hidden md:block">
          <div className="sticky top-32 border-2 border-brand-black bg-white p-8 shadow-[8px_8px_0px_rgba(17,17,17,0.1)]">
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-brand-black mb-6 flex items-center gap-2">
              <i className="ph-fill ph-list-dashes" /> Table of Contents
            </h4>
            <nav className="flex flex-col gap-4 text-sm font-base text-zinc-500">
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

            <div className="mt-12 pt-8 border-t border-zinc-200">
              <h5 className="font-bold text-brand-black mb-2 flex items-center gap-2">
                <i className="ph-fill ph-question text-brand-orange" /> Need Legal Support?
              </h5>
              <p className="text-xs text-zinc-500 mb-4">
                Contact our team for compliance or contract inquiries.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase text-white bg-brand-black hover:bg-brand-orange hover:text-brand-black transition-colors px-4 py-2"
              >
                <i className="ph-bold ph-envelope-simple" /> {contactEmail}
              </a>
            </div>
          </div>
        </aside>

        <div className="col-span-1 lg:col-span-8 order-1 lg:order-2 legal-doc max-w-none">
          <div className="bg-brand-black text-white p-6 font-base text-lg border-l-4 border-brand-lime mb-12 shadow-[4px_4px_0_0_#FF4911]">
            <strong className="font-display uppercase text-brand-lime tracking-widest text-sm flex items-center gap-2 mb-2">
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

          <div className="mt-20 pt-12 border-t-4 border-brand-black flex items-center justify-between">
            <p className="font-display font-bold text-lg uppercase tracking-tight">End of Document</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-12 h-12 bg-brand-black text-brand-lime flex items-center justify-center hover:bg-brand-orange hover:text-brand-black transition-colors shadow-[4px_4px_0_0_rgba(17,17,17,0.2)]"
            >
              <i className="ph-bold ph-arrow-up text-xl" />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
