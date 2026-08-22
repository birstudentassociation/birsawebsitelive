/**
 * Staleness reporting (REDESIGN-2.0 §10, §3.6).
 *
 * "Every document carries a review date via Wave 3B's lifecycle object.
 * Report what is overdue, by how long, and who owns it, so the output is a
 * list a portfolio can act on rather than a number."
 *
 * The lifecycle rules themselves (`isStale`, `lifecycleProblems`) live in
 * `lib/content/lifecycle.ts` (Wave 0, frozen) and are not re-implemented
 * here. This file turns "is this one document stale" into a report over a
 * whole content set: sorted by how overdue, grouped by the portfolio that
 * has to act on it, with the portfolio's own bilingual label attached so a
 * dashboard needs no further lookup.
 *
 * This applies unchanged to `maintainedBecause` content (§3.6's delegation
 * gate): those documents carry `reviewBy` exactly like any other, and the
 * trigger to re-run the disposition decision IS a review date going
 * overdue, so no separate code path is needed.
 */
import type { Lifecycle } from "@/lib/content/lifecycle";
import { isStale } from "@/lib/content/lifecycle";
import { portfolios, type PortfolioId } from "@/lib/portfolios";
import type { Locale } from "@/lib/i18n";

export type StalenessSubject = {
  /** The document id. Never its title or body: see the cron's own note on
   * why content never appears in a cron response. */
  id: string;
  documentType: string;
  lifecycle: Lifecycle;
};

export type StalenessReportEntry = {
  id: string;
  documentType: string;
  owner: PortfolioId;
  ownerLabel: Record<Locale, string>;
  reviewBy: string;
  overdueDays: number;
  /** True when this document is only being kept because §3.6's delegation
   * gate failed. Worth surfacing separately: a stale `maintainedBecause`
   * page is not just late for review, it is the standing trigger to check
   * whether an authoritative source has appeared and delete the page. */
  keptBecauseNoAuthoritativeSource: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(earlier: string, later: string): number {
  const a = Date.parse(earlier);
  const b = Date.parse(later);
  return Math.max(0, Math.round((b - a) / MS_PER_DAY));
}

function ownerLabelFor(id: PortfolioId): Record<Locale, string> {
  const found = portfolios.find((p) => p.id === id);
  // Falls back to the id itself rather than throwing: a portfolio id that
  // does not resolve is a data problem worth reporting, not a reason for
  // the whole cron to fail (§6.9's "degrade rather than throw" applied one
  // level down).
  return found?.label ?? { en: id, th: id };
}

/**
 * Every document whose `reviewBy` has passed, as of `today` (an ISO date),
 * sorted most overdue first. That ordering is the point: a portfolio dashboard
 * or a cron summary that leads with the longest-neglected page is one an
 * officer can act on, rather than a flat count.
 */
export function computeStalenessReport(
  subjects: StalenessSubject[],
  today: string
): StalenessReportEntry[] {
  const entries: StalenessReportEntry[] = [];

  for (const subject of subjects) {
    if (!isStale(subject.lifecycle, today)) continue;
    const reviewBy = subject.lifecycle.reviewBy!; // isStale guarantees non-null
    entries.push({
      id: subject.id,
      documentType: subject.documentType,
      owner: subject.lifecycle.owner,
      ownerLabel: ownerLabelFor(subject.lifecycle.owner),
      reviewBy,
      overdueDays: daysBetween(reviewBy, today),
      keptBecauseNoAuthoritativeSource: subject.lifecycle.maintainedBecause !== null,
    });
  }

  return entries.sort((a, b) => b.overdueDays - a.overdueDays);
}

/** The same report, grouped by owning portfolio, for a per-portfolio dashboard. */
export function groupStalenessByOwner(
  entries: StalenessReportEntry[]
): Record<PortfolioId, StalenessReportEntry[]> {
  const grouped = {} as Record<PortfolioId, StalenessReportEntry[]>;
  for (const entry of entries) {
    (grouped[entry.owner] ??= []).push(entry);
  }
  return grouped;
}
