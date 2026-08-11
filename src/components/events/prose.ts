/**
 * Class list for admin-authored rich text (`Event.description`, written through
 * the Tiptap editor). Mirrors the treatment the promotion page gives its terms
 * so HTML from the same editor looks consistent across the site.
 *
 * Descriptions saved before the field became rich text are plain strings; they
 * still render correctly here, just as a single unstyled paragraph.
 */
export const EVENT_PROSE =
  "font-inter leading-relaxed [&_a]:underline [&_h1]:font-syne [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:font-syne [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5";
