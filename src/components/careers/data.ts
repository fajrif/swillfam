export type JobPlaceholder = {
  jobTitle: string;
  department: string;
  employmentType: string;
  location: string;
  description: string;
};

const DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.";

/** Static placeholder job cards (Figma "SwillFam - Careers"). */
export const JOB_PLACEHOLDERS: JobPlaceholder[] = Array.from({ length: 4 }, () => ({
  jobTitle: "Your Job Title Here",
  department: "[Insert Department or Venue]",
  employmentType: "[Full-time / Part-time / Internship]",
  location: "[Insert Location]",
  description: DESCRIPTION,
}));
