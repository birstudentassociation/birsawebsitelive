import type { Locale } from "@/lib/i18n";

/**
 * Where a result came from. Sections mirror the site's information
 * architecture rather than its storage: a reader does not care that clubs are
 * MDX files and the equipment catalogue is a TypeScript array, they care
 * whether they are looking at a club or a thing they can borrow.
 */
export type SectionKey =
  | "answers"
  | "services"
  | "tools"
  | "equipment"
  | "student-life"
  | "clubs"
  | "news"
  | "activity"
  | "regulations"
  | "courses"
  | "places"
  | "quick"
  | "emergency"
  | "page";

/** What kind of thing the result is, used to pick the right result affordance. */
export type ResultKind =
  | "guide" // something to read
  | "task" // something to do, e.g. a form or tool
  | "answer" // a guided question flow
  | "item" // a catalogue entry
  | "link" // an outbound or quick link
  | "reference"; // a document, regulation, or record

/**
 * One indexed thing. Documents are built per locale: the Thai and English
 * indexes are separate so that scoring, tokenization, and stop-word handling
 * never have to reason about mixed-language fields.
 */
export type SearchDoc = {
  /** Stable, unique within a locale index. */
  id: string;
  locale: Locale;
  section: SectionKey;
  kind: ResultKind;
  /** Locale-prefixed internal href, or an absolute URL for outbound links. */
  href: string;
  title: string;
  summary: string;
  /**
   * Curated search terms: synonyms, abbreviations, the words students
   * actually use, and the English word for a Thai page (and vice versa).
   * Weighted just under the title, because an editor writing "projector"
   * here is stating intent, not just describing content.
   */
  keywords?: string[];
  /** Headings and prose. Weighted lowest; it is context, not a label. */
  body?: string;
  /** ISO date, when the document has a meaningful one (news, updates). */
  date?: string;
  /** Whether the date is an upcoming event rather than a publication date. */
  upcoming?: boolean;
  /**
   * Editorial importance, 0-1. Reserved for the handful of pages that are
   * the answer to a whole category of question ("borrow equipment",
   * "contact BIRSA"), so they are not buried by longer prose pages.
   */
  priority?: number;
  /** Small label shown on the result, e.g. a category or a club's status. */
  badge?: string;
};

/** Per-field score breakdown, kept so ranking decisions stay explainable. */
export type FieldName = "title" | "keywords" | "summary" | "body";

export type SearchResult = {
  doc: SearchDoc;
  score: number;
  /** 0-1 share of the reader's terms this document matched. */
  coverage: number;
  /** Terms the document actually matched, used for snippet highlighting. */
  matched: string[];
  /** Why this result is here, when it is not an ordinary text match. */
  reason?: "exact-title" | "keyword" | "fuzzy" | "prefix" | "text";
  /** Body extract around the best match, already trimmed for display. */
  snippet?: string;
};
