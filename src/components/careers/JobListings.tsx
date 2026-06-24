"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Career, EmploymentType } from "@/generated/prisma/client";

const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
};

/** Grid of job-listing boxes; description truncates with a top-right toggle arrow. */
export function JobListings({ careers }: { careers: Career[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <section className="pb-16 lg:pb-24">
      <Container className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {careers.map((job) => {
          const isOpen = !!expanded[job.id];
          return (
            <article
              key={job.id}
              className="relative flex flex-col gap-4 border border-sf-border/50 p-8"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setExpanded((prev) => ({ ...prev, [job.id]: !isOpen }))}
                    aria-label={isOpen ? "View less" : "View more"}
                    className="absolute top-6 right-6"
                  >
                    <i
                      className={`ph ph-play inline-block shrink-0 text-2xl text-white/40 transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{isOpen ? "View less" : "View more"}</TooltipContent>
              </Tooltip>

              <h3 className="font-syne text-2xl text-white pr-8">{job.jobTitle}</h3>
              <div className="flex flex-col gap-1 font-inter text-sm text-white">
                <p>Department / Venue: {job.department}</p>
                <p>Employment Type: {EMPLOYMENT_TYPE_LABELS[job.employmentType]}</p>
                <p>Location: {job.location}</p>
              </div>
              <p
                className={`font-inter leading-relaxed text-white ${isOpen ? "" : "line-clamp-3"}`}
              >
                {job.description}
              </p>
            </article>
          );
        })}
      </Container>
    </section>
  );
}
