/**
 * Read access to the transparency documents Wave 3C's schema defines:
 * `minutes`, `decision` and `budgetEntry` (REDESIGN-2.0 §10, §6.3, §6.9).
 *
 * Uses `sanity/lib/client.ts`'s public, published-only client (Wave 3A,
 * FROZEN): no token, `perspective: "published"`, so a draft can never reach
 * a reader by accident. Every query additionally filters
 * `lifecycle.status == "published"`, because this schema layers its own
 * editorial status (draft, scheduled, published, archived,
 * `lib/content/lifecycle.ts`) over Sanity's native draft mechanism, and only
 * the editorial "published" state is what an officer means by "this is
 * live".
 *
 * DEGRADES RATHER THAN CRASHES (§6.9: "Sanity may be unreachable"). No
 * content has been published through the CMS for any of these three types
 * yet, and a genuine Sanity outage is also possible at any time, so every
 * function here returns an empty result rather than throwing. The pages
 * that call these render an honest empty state ("BIRSA has not published
 * minutes yet") rather than a broken one. That empty state is not a bug to
 * fix by inventing content: BIRSA has not held a minuted, published meeting
 * through this system yet, and inventing one would be inventing an
 * institutional fact.
 */
import { client } from "@/sanity/lib/client";
import type { RedactionCategory } from "@/sanity/schemaTypes/documents/minutes";
import type { BudgetEntryDirection } from "@/sanity/schemaTypes/documents/budgetEntry";
import type { PortfolioId } from "@/lib/portfolios";
import type { PortableTextBlockLike } from "@/components/about/PortableTextBody";

async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    const result = await client.fetch<T>(query, params);
    return result ?? fallback;
  } catch {
    // No live dataset reachable (offline build, no content published yet,
    // or a genuine Sanity outage). Never a 500 for a reader over this.
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Minutes
// ---------------------------------------------------------------------------

export type MinutesListItem = {
  slug: string;
  title: string;
  meetingDate: string;
};

export type MinutesDetail = {
  title: string;
  meetingDate: string;
  publicSummary: { th: PortableTextBlockLike[]; en: PortableTextBlockLike[] };
  redactedItems: Array<{ itemNumber: number; category: RedactionCategory }>;
};

export async function listPublishedMinutes(): Promise<MinutesListItem[]> {
  return safeFetch<MinutesListItem[]>(
    `*[_type == "minutes" && lifecycle.status == "published"] | order(meetingDate desc) {
      "slug": slug.current, title, meetingDate
    }`,
    {},
    []
  );
}

export async function getPublishedMinutesBySlug(slug: string): Promise<MinutesDetail | null> {
  return safeFetch<MinutesDetail | null>(
    `*[_type == "minutes" && lifecycle.status == "published" && slug.current == $slug][0] {
      title, meetingDate, publicSummary, redactedItems
    }`,
    { slug },
    null
  );
}

// ---------------------------------------------------------------------------
// Decisions
// ---------------------------------------------------------------------------

export type DecisionListItem = {
  slug: string;
  title: string;
  decisionDate: string;
};

export type DecisionDetail = {
  title: string;
  decisionDate: string;
  summary: PortableTextBlockLike[];
  whatChanged: { th: string; en: string };
  portfolioId: PortfolioId;
  meeting: { title: string; slug: string } | null;
};

export async function listPublishedDecisions(): Promise<DecisionListItem[]> {
  return safeFetch<DecisionListItem[]>(
    `*[_type == "decision" && lifecycle.status == "published"] | order(decisionDate desc) {
      "slug": slug.current, title, decisionDate
    }`,
    {},
    []
  );
}

export async function getPublishedDecisionBySlug(slug: string): Promise<DecisionDetail | null> {
  return safeFetch<DecisionDetail | null>(
    `*[_type == "decision" && lifecycle.status == "published" && slug.current == $slug][0] {
      title, decisionDate, summary, whatChanged,
      "portfolioId": lifecycle.owner,
      "meeting": meeting->{ title, "slug": slug.current }
    }`,
    { slug },
    null
  );
}

// ---------------------------------------------------------------------------
// Budget
// ---------------------------------------------------------------------------

export type BudgetEntryRecord = {
  id: string;
  description: { th: string; en: string };
  amount: number;
  direction: BudgetEntryDirection;
  entryDate: string;
  portfolioId: PortfolioId;
};

export async function listPublishedBudgetEntries(): Promise<BudgetEntryRecord[]> {
  return safeFetch<BudgetEntryRecord[]>(
    `*[_type == "budgetEntry" && lifecycle.status == "published"] | order(entryDate asc) {
      "id": _id, description, amount, direction, entryDate,
      "portfolioId": lifecycle.owner
    }`,
    {},
    []
  );
}
