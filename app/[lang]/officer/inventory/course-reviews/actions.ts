"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getDictionary,
  isLocale,
  locales,
  localeHref,
  defaultLocale,
  type Locale,
} from "@/lib/i18n";
import { requireReviewOfficer } from "@/lib/course-review/access";
import { recordAudit } from "@/lib/inventory/audit";
import { courseNode } from "@/lib/courses/graph";
import { groupId, meetsThreshold, parseGroupId, type GroupKey } from "@/lib/course-review/groups";
import { instructorByKey } from "@/lib/course-review/instructors";
import {
  getPublishedGroup,
  publishGroup,
  unpublishGroup,
  type ReviewSummary,
} from "@/lib/course-review/published";
import { decideSubmission, listGroupSubmissions } from "@/lib/course-review/submissions";
import {
  parseSummaryFields,
  summaryFieldNames,
  type SummaryErrorCode,
  type SummaryFields,
} from "@/lib/course-review/summary-form";
import { isSummariserConfigured, summariseSubmissions } from "@/lib/course-review/summarise";
import type { SummariseFailure } from "@/lib/course-review/summarise";
import { termYearLabel } from "@/lib/course-review/terms";

export type DraftState =
  | { status: "idle" }
  | { status: "drafted"; summary: ReviewSummary; nonce: number }
  | {
      status: "failed";
      reason: SummariseFailure | "forbidden" | "bad-group" | "below-threshold";
    };

export type PublishState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: Record<string, SummaryErrorCode>;
      fields: SummaryFields;
      /** When the attempt was made, so the editor can tell it from a later draft. */
      at: number;
    }
  | {
      status: "failed";
      reason: "forbidden" | "bad-group" | "below-threshold" | "not-configured" | "error";
      fields: SummaryFields;
      at: number;
    };

function localeOf(formData: FormData): Locale {
  const raw = String(formData.get("locale") ?? "");
  return isLocale(raw) ? raw : defaultLocale;
}

function groupHref(locale: Locale, key: GroupKey): string {
  return `${localeHref(locale, "/officer/inventory/course-reviews/group")}?g=${encodeURIComponent(groupId(key))}`;
}

/**
 * Course pages and the catalogue cache published reviews (the catalogue for its
 * "reviewed" badge and filter), so a publish or unpublish refreshes both
 * languages of the course page and of the catalogue straight away.
 */
function revalidateCoursePages(courseCode: string): void {
  for (const locale of locales) {
    revalidatePath(localeHref(locale, `/student-life/course-reviews/${courseCode}`));
    revalidatePath(localeHref(locale, "/student-life/course-reviews"));
  }
}

function readGroup(formData: FormData): GroupKey | null {
  const key = parseGroupId(String(formData.get("group") ?? ""));
  return key && courseNode(key.courseCode) ? key : null;
}

/** "Semester 1, 2024/25 (Buddhist Era 2567)": the term as the model is told it, always in English. */
function termLabelForPrompt(key: GroupKey): string {
  const names = getDictionary("en").courseReview;
  const semester =
    key.term.semester === "summer"
      ? names.summer
      : key.term.semester === 1
        ? names.semester1
        : names.semester2;
  return `${semester}, ${termYearLabel(key.term, "en")} (Buddhist Era ${key.term.year})`;
}

/**
 * Approves or rejects one submission. A plain form POST that ends in a
 * redirect back to the group, so it works without JavaScript and a refresh
 * never repeats the decision. Every decision is written to the audit log with
 * the group but not the submission's text.
 */
export async function decideSubmissionAction(formData: FormData): Promise<void> {
  const locale = localeOf(formData);
  const auth = await requireReviewOfficer();
  if (!auth.ok) {
    redirect(localeHref(locale, "/officer/inventory"));
  }

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const key = readGroup(formData);
  if (!key || !/^[0-9a-f-]{36}$/i.test(id) || (decision !== "approve" && decision !== "reject")) {
    redirect(localeHref(locale, "/officer/inventory/course-reviews"));
  }

  const status = decision === "approve" ? "approved" : "rejected";
  const decidedGroup = await decideSubmission(id, status, auth.officer.id);
  if (decidedGroup) {
    await recordAudit({
      officerId: auth.officer.id,
      action: `course_review.${decision}`,
      entityType: "course_review_submission",
      entityId: id,
      detail: { group: groupId(decidedGroup) },
    });
  }
  redirect(groupHref(locale, key));
}

/**
 * Asks Claude for a draft summary of a group's approved submissions. Returns
 * the draft to the editor; nothing is stored. The request is audited because
 * it sends the submissions' text to an outside service.
 */
export async function draftSummaryAction(
  _prev: DraftState,
  formData: FormData
): Promise<DraftState> {
  const auth = await requireReviewOfficer();
  if (!auth.ok) {
    return { status: "failed", reason: "forbidden" };
  }
  const key = readGroup(formData);
  if (!key) {
    return { status: "failed", reason: "bad-group" };
  }
  if (!isSummariserConfigured()) {
    return { status: "failed", reason: "not-configured" };
  }

  const approved = (await listGroupSubmissions(key)).filter(
    (submission) => submission.status === "approved"
  );
  if (!meetsThreshold(approved.length)) {
    return { status: "failed", reason: "below-threshold" };
  }

  const node = courseNode(key.courseCode)!;
  const result = await summariseSubmissions(
    { code: node.code, title: node.title },
    termLabelForPrompt(key),
    approved
  );
  await recordAudit({
    officerId: auth.officer.id,
    action: "course_review.draft_summary",
    entityType: "course_review_group",
    entityId: groupId(key),
    detail: result.ok
      ? { ok: true, submissions: approved.length }
      : { ok: false, reason: result.reason, submissions: approved.length },
  });
  if (!result.ok) {
    return { status: "failed", reason: result.reason };
  }
  return { status: "drafted", summary: result.summary, nonce: Date.now() };
}

function readSummaryFields(formData: FormData): SummaryFields {
  const fields: SummaryFields = {};
  for (const name of summaryFieldNames()) {
    fields[name] = String(formData.get(name) ?? "").replace(/\u0000/g, "");
  }
  return fields;
}

/**
 * Publishes the summary an officer has edited, then redirects to the group
 * page. It only returns when something needs the officer's attention. Whatever is in the form is what
 * publishes, so it is validated here whether Claude drafted it or not, and the
 * support behind it (the count, the ids, the band distribution) is read from
 * the database, never from the form.
 */
export async function publishSummaryAction(
  _prev: PublishState,
  formData: FormData
): Promise<PublishState> {
  const fields = readSummaryFields(formData);
  const auth = await requireReviewOfficer();
  if (!auth.ok) {
    return { status: "failed", reason: "forbidden", fields, at: Date.now() };
  }
  const key = readGroup(formData);
  if (!key) {
    return { status: "failed", reason: "bad-group", fields, at: Date.now() };
  }

  const parsed = parseSummaryFields(fields);
  if (!parsed.ok) {
    return { status: "invalid", errors: parsed.errors, fields, at: Date.now() };
  }

  const node = courseNode(key.courseCode)!;
  const instructor = instructorByKey(node.catalogue?.instructors, key.instructorKey);
  const result = await publishGroup(key, parsed.summary, instructor, auth.officer.id);
  if (!result.ok) {
    return { status: "failed", reason: result.reason, fields, at: Date.now() };
  }

  const origin =
    String(formData.get("origin") ?? "") === "claude-draft" ? "claude-draft" : "manual";
  await recordAudit({
    officerId: auth.officer.id,
    action: "course_review.publish",
    entityType: "published_course_review",
    entityId: groupId(key),
    detail: { reviewCount: result.reviewCount, origin },
  });
  revalidateCoursePages(key.courseCode);
  // Post/Redirect/Get: the group page shows the confirmation, so a refresh
  // never publishes again and the page behind the editor reflects the change.
  redirect(`${groupHref(localeOf(formData), key)}&done=published`);
}

/** Takes a group's summary off the course page. The submissions stay, so it can be published again. */
export async function unpublishSummaryAction(formData: FormData): Promise<void> {
  const locale = localeOf(formData);
  const auth = await requireReviewOfficer();
  if (!auth.ok) {
    redirect(localeHref(locale, "/officer/inventory"));
  }
  const key = readGroup(formData);
  if (!key) {
    redirect(localeHref(locale, "/officer/inventory/course-reviews"));
  }

  const existing = await getPublishedGroup(key);
  if (existing && (await unpublishGroup(key))) {
    await recordAudit({
      officerId: auth.officer.id,
      action: "course_review.unpublish",
      entityType: "published_course_review",
      entityId: groupId(key),
      detail: { reviewCount: existing.reviewCount },
    });
    revalidateCoursePages(key.courseCode);
  }
  redirect(`${groupHref(locale, key)}&done=unpublished`);
}
