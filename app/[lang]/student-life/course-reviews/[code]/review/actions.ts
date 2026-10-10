"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkRateLimit, refundRateLimit } from "@/app/api/_lib/guard";
import { defaultLocale, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { courseNode } from "@/lib/courses/graph";
import {
  REVIEW_RATE_LIMIT_SCOPE,
  validateReview,
  type RawReviewForm,
  type ReviewErrors,
} from "@/lib/course-review/submit";
import { insertSubmission, isCourseReviewConfigured } from "@/lib/course-review/submissions";

/** What the reader typed, kept so a failed submission does not lose it. */
export type ReviewFormValues = {
  term: string;
  instructor: string;
  workload: string;
  workloadBand: string;
  assessment: string;
  tips: string[];
  quote: string;
};

/**
 * Result of a review submission, driving what the form renders next:
 * - `invalid`: validation failed; show the error summary and keep the values
 * - `not-configured`: the database isn't connected, so nothing was saved;
 *   shown inline rather than pretending the review was stored
 * - `rate-limited`: too many submissions from this address recently
 * - `error`: the insert failed; show a generic error and keep the values
 *
 * There is no `success` state: on success the action redirects to the
 * confirmation page (Post/Redirect/Get), so a refresh re-requests that page
 * with a plain GET instead of re-posting the review. This works with or
 * without JavaScript, because `redirect()` in a server action is a real HTTP
 * redirect.
 */
export type ReviewFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: ReviewErrors; values: ReviewFormValues }
  | { status: "not-configured"; values: ReviewFormValues }
  | { status: "rate-limited"; values: ReviewFormValues }
  | { status: "error"; values: ReviewFormValues };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/** Postgres rejects the NUL character in text, so strip it rather than fail the insert. */
function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").replace(/\u0000/g, "");
}

function readForm(formData: FormData): RawReviewForm {
  return {
    code: field(formData, "code"),
    term: field(formData, "term"),
    instructor: field(formData, "instructor"),
    workload: field(formData, "workload"),
    workloadBand: field(formData, "workloadBand"),
    assessment: field(formData, "assessment"),
    tips: [1, 2, 3].map((n) => field(formData, `tip${n}`)),
    quote: field(formData, "quote"),
    locale: field(formData, "locale"),
    nickname: field(formData, "nickname"),
  };
}

function valuesOf(raw: RawReviewForm): ReviewFormValues {
  return {
    term: raw.term,
    instructor: raw.instructor,
    workload: raw.workload,
    workloadBand: raw.workloadBand,
    assessment: raw.assessment,
    tips: raw.tips,
    quote: raw.quote,
  };
}

/**
 * Server action for the course review form. Runs on a normal form POST even
 * without JavaScript, so the whole journey works HTML-first; `useActionState`
 * in components/course-review/ReviewForm.tsx layers inline error handling on
 * top. Mirrors submitFeedbackAction in app/[lang]/feedback/actions.ts: rate
 * limit, honeypot, shared zod schema, then the data-access call, never
 * revealing the honeypot to bots.
 *
 * Nothing about the submitter is read beyond the IP address the rate limiter
 * uses, and that is held in memory for ten minutes and never stored with the
 * review.
 */
export async function submitReviewAction(
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const raw = readForm(formData);
  const values = valuesOf(raw);
  const locale: Locale = isLocale(raw.locale) ? raw.locale : defaultLocale;
  const node = courseNode(raw.code);

  const h = await headers();
  const ip = ipFromHeaders(h);
  if (!checkRateLimit(ip, REVIEW_RATE_LIMIT_SCOPE)) {
    return { status: "rate-limited", values };
  }

  // Honeypot filled: silently accept and discard, never reveal detection.
  if (raw.nickname) {
    redirect(
      localeHref(
        locale,
        node
          ? `/student-life/course-reviews/${node.code}/review/sent`
          : "/student-life/course-reviews"
      )
    );
  }

  if (!node) {
    refundRateLimit(ip, REVIEW_RATE_LIMIT_SCOPE);
    return { status: "error", values };
  }

  const result = validateReview(
    { ...raw, locale },
    { code: node.code, instructors: node.catalogue?.instructors },
    new Date()
  );
  if (!result.ok) {
    // A mistake in the form is not an attempt to flood it, so it does not
    // count against the reader's budget.
    refundRateLimit(ip, REVIEW_RATE_LIMIT_SCOPE);
    return { status: "invalid", errors: result.errors, values };
  }

  if (!isCourseReviewConfigured()) {
    refundRateLimit(ip, REVIEW_RATE_LIMIT_SCOPE);
    return { status: "not-configured", values };
  }

  const saved = await insertSubmission(result.data);
  if (!saved) {
    return { status: "error", values };
  }

  redirect(localeHref(locale, `/student-life/course-reviews/${node.code}/review/sent`));
}
