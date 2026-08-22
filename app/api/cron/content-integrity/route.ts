import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

import { hasValidCronSecret } from "@/app/api/_lib/cronAuth";
import { isCronConfigured } from "@/lib/inventory/notifications";
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "@/sanity/projectConfig";
import { portfolios, type PortfolioId } from "@/lib/portfolios";
import type { Lifecycle } from "@/lib/content/lifecycle";
import { validateBilingualDocument } from "@/lib/cms/validation";
import { computeStalenessReport, type StalenessSubject } from "@/lib/cms/validation/staleness";
import {
  checkExternalLinkRegister,
  type ExternalLinkFinding,
  type FetchLike,
} from "@/lib/cms/validation/linkIntegrity";
import { SEEDED_EXTERNAL_LINKS } from "@/lib/cms/externalLinkRegister";

/**
 * The nightly content integrity cron (REDESIGN-2.0 §3.6, §6.9, §10).
 *
 * "Schemas stop an officer entering something wrong today. You catch what
 * goes wrong over time: a translation that never arrived, a link that died
 * quietly, a page nobody has looked at in two years." This route is that
 * catch, run once a day.
 *
 * Follows `app/api/cron/daily/route.ts` and `app/api/cron/access-drift/
 * route.ts` exactly: Vercel Cron issues a GET with `Authorization: Bearer
 * <CRON_SECRET>`, checked with the same constant-time comparison; no
 * additional rate limiting, since this path is only ever invoked by the
 * scheduler; every dependency degrades to "not configured" or "unreachable"
 * rather than throwing, so a missing secret, a missing Sanity token, or a
 * genuine Sanity outage (§6.9: "Sanity may be unreachable") returns `200`
 * with a reason, never a failed deploy and never a failed request for a
 * reader on the public site, which does not depend on this endpoint at all.
 *
 * WHO READS THIS. The response is JSON meant for the console (a future
 * "content health" page reading this cron's last run) and for whoever is
 * on call for the portfolio named against a finding. It is not meant for a
 * reader, an RSS feed, or a log line copy-pasted into a group chat, which
 * is the reason for the next paragraph.
 *
 * WHAT NEVER APPEARS HERE, same rule as `access-drift`: no officer name, no
 * email, and (this cron's own addition) no fragment of a document's actual
 * copy. Findings are reduced to document ids, `_type`s, portfolio ids, rule
 * names and counts before they leave this file. A missing Thai translation
 * is reported as "field `alt` on document `news.abcd1234` is missing `th`",
 * never as the English sentence that IS there, because the English sentence
 * is content, and content is exactly what a cron response must not carry.
 *
 * NOT YET SCHEDULED. `vercel.json`'s `crons` list is outside this wave's
 * owned paths; see this wave's report for the one entry it needs.
 */

const MAX_DOCUMENTS = 1000;
const MAX_LISTED_ISSUES = 100;

function isSanityConfigured(): boolean {
  return !!process.env.SANITY_API_READ_TOKEN;
}

const portfolioIds = new Set(portfolios.map((p) => p.id));

function isPortfolioId(value: unknown): value is PortfolioId {
  return typeof value === "string" && portfolioIds.has(value as PortfolioId);
}

/**
 * A raw Sanity document to a staleness subject, or `null` if it does not
 * (yet) carry the frozen lifecycle field set from `lib/content/lifecycle.ts`.
 * That is expected, not an error: a document type mid-migration, or one a
 * schema agent has not finished, simply does not contribute to the
 * staleness report until it does.
 *
 * The lifecycle fields live under a nested `lifecycle` object
 * (`sanity/schemaTypes/objects/lifecycle.ts`), not on the document root, so
 * this reads `doc.lifecycle.*` rather than `doc.*`.
 */
function toStalenessSubject(doc: Record<string, unknown>): StalenessSubject | null {
  if (typeof doc._id !== "string" || typeof doc._type !== "string") return null;

  const lifecycleValue = doc.lifecycle;
  if (typeof lifecycleValue !== "object" || lifecycleValue === null) return null;
  const raw = lifecycleValue as Record<string, unknown>;

  if (!isPortfolioId(raw.owner)) return null;
  if (typeof raw.reviewBy !== "string") return null;

  const lifecycle: Lifecycle = {
    status: typeof raw.status === "string" ? (raw.status as Lifecycle["status"]) : "draft",
    publishAt: typeof raw.publishAt === "string" ? raw.publishAt : null,
    owner: raw.owner,
    lastReviewed: typeof raw.lastReviewed === "string" ? raw.lastReviewed : null,
    reviewBy: raw.reviewBy,
    slugHistory: Array.isArray(raw.slugHistory) ? (raw.slugHistory as string[]) : [],
    maintainedBecause: typeof raw.maintainedBecause === "string" ? raw.maintainedBecause : null,
  };

  return { id: doc._id, documentType: doc._type, lifecycle };
}

type DocumentIssueSummary = {
  id: string;
  documentType: string;
  missingLocales: Array<"en" | "th">;
  houseStyleBlocking: number;
  houseStyleAdvice: number;
};

function emptyResponse(sanity: "not-configured" | "unreachable") {
  return {
    ok: true as const,
    sanity,
    summary: {
      documentsChecked: 0,
      bilingualParity: { documentsWithMissingLocale: 0, fieldsMissingEn: 0, fieldsMissingTh: 0 },
      houseStyle: { documentsWithBlockingIssues: 0, blockingFindings: 0, advisoryFindings: 0 },
      staleness: { overdueCount: 0 },
      externalLinks: { checked: SEEDED_EXTERNAL_LINKS.length, dead: 0, redirected: 0, errored: 0 },
    },
    staleDocuments: [] as unknown[],
    parityIssues: [] as unknown[],
    houseStyleIssues: [] as unknown[],
    externalLinkIssues: [] as unknown[],
  };
}

export async function GET(request: Request) {
  if (!isCronConfigured()) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  if (!hasValidCronSecret(request)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  if (!isSanityConfigured()) {
    // §6.9: this cron's job cannot run without a read token, but that is a
    // configuration state, not a failure. External link checking does not
    // need Sanity at all (see below), so it still runs.
    const external = await checkExternalLinksSafely();
    const body = emptyResponse("not-configured");
    body.summary.externalLinks = summarizeExternalLinks(external);
    body.externalLinkIssues = sanitizeExternalLinkIssues(external);
    return NextResponse.json(body, { status: 200 });
  }

  let documents: Record<string, unknown>[];
  try {
    const client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      token: process.env.SANITY_API_READ_TOKEN,
      useCdn: false,
      perspective: "published",
    });
    documents =
      (await client.fetch<Record<string, unknown>[]>(
        `*[!(_id in path("drafts.**"))][0...$max]`,
        { max: MAX_DOCUMENTS }
      )) ?? [];
  } catch {
    // §6.9, restated for this cron: "Sanity may be unreachable. Your cron
    // must not fail the deploy or the site when it is." Degrade exactly like
    // the modules this codebase already has, and still report on external
    // links, which never touch Sanity.
    const external = await checkExternalLinksSafely();
    const body = emptyResponse("unreachable");
    body.summary.externalLinks = summarizeExternalLinks(external);
    body.externalLinkIssues = sanitizeExternalLinkIssues(external);
    return NextResponse.json(body, { status: 200 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const docSummaries: DocumentIssueSummary[] = [];
  let fieldsMissingEn = 0;
  let fieldsMissingTh = 0;
  let blockingFindings = 0;
  let advisoryFindings = 0;

  for (const doc of documents) {
    if (typeof doc._id !== "string" || typeof doc._type !== "string") continue;

    const result = validateBilingualDocument(doc);
    if (result.parity.length === 0 && result.houseStyle.length === 0) continue;

    const missingLocales = [...new Set(result.parity.map((f) => f.locale))];
    fieldsMissingEn += result.parity.filter((f) => f.locale === "en").length;
    fieldsMissingTh += result.parity.filter((f) => f.locale === "th").length;

    const blocking = result.houseStyle.filter((f) => f.severity === "block").length;
    const advice = result.houseStyle.filter((f) => f.severity === "advice").length;
    blockingFindings += blocking;
    advisoryFindings += advice;

    docSummaries.push({
      id: doc._id,
      documentType: doc._type,
      missingLocales,
      houseStyleBlocking: blocking,
      houseStyleAdvice: advice,
    });
  }

  const subjects = documents
    .map(toStalenessSubject)
    .filter((s): s is StalenessSubject => s !== null);
  const staleReport = computeStalenessReport(subjects, today);

  const externalLinkFindings = await checkExternalLinksSafely();

  return NextResponse.json(
    {
      ok: true,
      sanity: "configured",
      summary: {
        documentsChecked: documents.length,
        bilingualParity: {
          documentsWithMissingLocale: docSummaries.filter((d) => d.missingLocales.length > 0)
            .length,
          fieldsMissingEn,
          fieldsMissingTh,
        },
        houseStyle: {
          documentsWithBlockingIssues: docSummaries.filter((d) => d.houseStyleBlocking > 0).length,
          blockingFindings,
          advisoryFindings,
        },
        staleness: { overdueCount: staleReport.length },
        externalLinks: summarizeExternalLinks(externalLinkFindings),
      },
      staleDocuments: staleReport.slice(0, MAX_LISTED_ISSUES).map((e) => ({
        id: e.id,
        documentType: e.documentType,
        owner: e.owner,
        reviewBy: e.reviewBy,
        overdueDays: e.overdueDays,
        keptBecauseNoAuthoritativeSource: e.keptBecauseNoAuthoritativeSource,
      })),
      parityIssues: docSummaries
        .filter((d) => d.missingLocales.length > 0)
        .slice(0, MAX_LISTED_ISSUES)
        .map((d) => ({ id: d.id, documentType: d.documentType, missingLocales: d.missingLocales })),
      houseStyleIssues: docSummaries
        .filter((d) => d.houseStyleBlocking > 0)
        .slice(0, MAX_LISTED_ISSUES)
        .map((d) => ({ id: d.id, documentType: d.documentType, blockingFindings: d.houseStyleBlocking })),
      externalLinkIssues: sanitizeExternalLinkIssues(externalLinkFindings),
    },
    { status: 200 }
  );
}

/**
 * External link checking never depends on Sanity, so it runs regardless of
 * whether the Content Lake answered. A thrown error here (a `fetch` that
 * rejects in a way `linkIntegrity.ts` did not already catch, for example)
 * degrades to an empty result rather than taking the whole cron down with
 * it, the same "one module's failure is not the job's failure" shape §6.9
 * asks for.
 */
async function checkExternalLinksSafely(): Promise<ExternalLinkFinding[]> {
  try {
    const fetchImpl: FetchLike = (url, init) => fetch(url, init);
    return await checkExternalLinkRegister(SEEDED_EXTERNAL_LINKS, fetchImpl);
  } catch {
    return [];
  }
}

function summarizeExternalLinks(findings: ExternalLinkFinding[]) {
  return {
    checked: SEEDED_EXTERNAL_LINKS.length,
    dead: findings.filter((f) => f.outcome.kind === "dead").length,
    redirected: findings.filter((f) => f.outcome.kind === "redirect").length,
    errored: findings.filter((f) => f.outcome.kind === "error").length,
  };
}

function sanitizeExternalLinkIssues(findings: ExternalLinkFinding[]) {
  return findings.slice(0, MAX_LISTED_ISSUES).map((f) => ({
    entryId: f.entryId,
    kind: f.outcome.kind,
    httpStatus: "httpStatus" in f.outcome ? f.outcome.httpStatus : null,
  }));
}
