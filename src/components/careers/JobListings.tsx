import { Container } from "@/components/shared/Container";
import { JOB_PLACEHOLDERS } from "./data";

/** Grid of job-listing boxes. */
export function JobListings() {
  return (
    <section className="pb-16 lg:pb-24">
      <Container className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {JOB_PLACEHOLDERS.map((job, i) => (
          <article key={i} className="flex flex-col gap-4 border border-sf-border/50 p-8">
            <h3 className="font-syne text-2xl text-white">{job.jobTitle}</h3>
            <div className="flex flex-col gap-1 font-inter text-sm text-white">
              <p>Department / Venue: {job.department}</p>
              <p>Employment Type: {job.employmentType}</p>
              <p>Location: {job.location}</p>
            </div>
            <p className="font-inter leading-relaxed text-white">{job.description}</p>
          </article>
        ))}
      </Container>
    </section>
  );
}
