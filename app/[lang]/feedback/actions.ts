"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { feedbackSchema } from "@/lib/validation";
import { isFeedbackConfigured, submitFeedback } from "@/lib/feedback";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { defaultLocale, isLocale, localeHref, type Locale } from "@/lib/i18n";

type FeedbackFieldName = "rating" | "comment";

export type FeedbackValues = {
  rating?: string;
  comment?: string;
};

/**
 * Result of a feedback submission, driving what the form renders next:
 * - `invalid`: validation failed (only the rating is required); show field
 *   errors and keep the typed values
 * - `not-configured`: the database isn't connected, so nothing was saved;
 *   shown inline rather than silently pretending the response was stored
 * - `error`: the insert failed; show a generic error, keep the values
 *
 * There is no `success` state here: on success the action redirects to
 * `/[lang]/feedback/sent` (Post/Redirect/Get), so a page refresh after
 * submitting re-requests that confirmation page with a plain GET instead of
 * re-posting the form. This works with or without JavaScript, since a
 * `redirect()` call inside a server action issues a real HTTP redirect.
 */
export type FeedbackState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: Partial<Record<FeedbackFieldName, string>>;
      values: FeedbackValues;
    }
  | { status: "not-configured" }
  | { status: "error"; values: FeedbackValues };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/** Strips a query string and fragment, so nothing accidentally captured there (e.g. a "?email=" typo'd into a link) ends up stored. */
function sanitizePath(rawPath: string): string {
  return rawPath.split("?")[0]?.split("#")[0] || "/";
}

/**
 * Server action for the satisfaction feedback form. Runs on a normal form
 * POST even without JavaScript, so the whole journey works HTML-first;
 * `useActionState` in components/feedback/FeedbackForm.tsx layers inline
 * error handling on top. Mirrors submitContact in
 * app/[lang]/contact/actions.ts: rate limit, honeypot, shared zod schema,
 * then the data-access call, never revealing the honeypot to bots.
 */
export async function submitFeedbackAction(
  _prev: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  const values: FeedbackValues = {
    rating: String(formData.get("rating") ?? ""),
    comment: String(formData.get("comment") ?? ""),
  };
  const nickname = String(formData.get("nickname") ?? "");
  const localeRaw = String(formData.get("locale") ?? "");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : defaultLocale;
  const rawPath = String(formData.get("path") ?? "");
  const path = sanitizePath(rawPath || localeHref(locale, "/feedback"));

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "feedback")) {
    return { status: "error", values };
  }

  // Honeypot filled: silently accept-and-discard, never reveal detection.
  if (nickname) {
    redirect(localeHref(locale, "/feedback/sent"));
  }

  const result = feedbackSchema.safeParse({ ...values, locale, path, nickname });
  if (!result.success) {
    const errors: Partial<Record<FeedbackFieldName, string>> = {};
    for (const issue of result.error.issues) {
      const fieldPath = issue.path[0];
      if (fieldPath === "rating") {
        errors.rating =
          locale === "th"
            ? "กรุณาเลือกระดับความพึงพอใจต่อบริการนี้"
            : "Select how satisfied you were with this service";
      }
      if (fieldPath === "comment") {
        errors.comment =
          locale === "th"
            ? "ความคิดเห็นยาวเกินไป กรุณาย่อให้สั้นลง"
            : "Comment is too long. Shorten it and try again.";
      }
    }
    return { status: "invalid", errors, values };
  }

  if (!isFeedbackConfigured()) {
    return { status: "not-configured" };
  }

  const { rating, comment } = result.data;

  const saved = await submitFeedback({
    rating,
    comment: comment ?? "",
    locale,
    path,
  });

  if (!saved) {
    return { status: "error", values };
  }

  redirect(localeHref(locale, "/feedback/sent"));
}
