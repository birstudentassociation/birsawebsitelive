"use server";

/**
 * The chassis's generic server actions (REDESIGN-2.0 §5.1 items 2 to 5).
 *
 * ONE ACTION PER STEP KIND, SHARED BY EVERY SERVICE. `submitQuestionStep`
 * handles every question on every service; `submitCheckAnswers` and
 * `lookupServiceStatus` do the same for their steps. This is the payoff the
 * whole chassis exists for (`lib/services/defineService.ts`'s own header,
 * "eleven things an officer creates in an afternoon"): a twelfth service
 * needs zero new actions, because none of these read anything about a
 * service beyond its `ServiceDefinition`.
 *
 * A "use server" file may only export async functions (the equipment loan
 * wizard's own `actions.ts` notes this), so step ids, labels and other plain
 * data live in the page components and `lib/services/*`, never here.
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getService } from "@/lib/services/registry";
import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import { validateAnswer } from "@/lib/services/validate";
import {
  mergeServiceDraftAnswer,
  readServiceDraft,
  clearServiceDraft,
  writeConfirmationCookie,
} from "@/lib/services/draft";
import { nextStepHref, submitService, validateFullDraft } from "@/lib/services/intake";
import { lookupSubmission } from "@/lib/services/status";
import { getSubmissionStore } from "@/lib/services/intake";
import { checkRateLimit } from "@/app/api/_lib/guard";

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

export type QuestionStepState = { status: "idle" | "invalid"; error?: string };

/**
 * Validates and saves ONE question's answer, then redirects to whatever
 * comes next (`nextStepHref`, which already knows about `returnTo=check`).
 * Bound by the step page as
 * `submitQuestionStep.bind(null, serviceId, stepId, locale, returnTo)`,
 * mirroring the equipment loan wizard's own `.bind(null, locale, itemKey,
 * returnTo, labels)` pattern.
 */
export async function submitQuestionStep(
  serviceId: string,
  stepId: string,
  locale: Locale,
  returnTo: string | undefined,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const definition = getService(serviceId);
  if (!definition) redirect(localeHref(locale, `/do/${serviceId}`));

  const question = definition.questions.find((q) => q.id === stepId);
  if (!question) redirect(localeHref(locale, `/do/${serviceId}`));

  const result = validateAnswer(question, formData, locale);
  if (!result.ok) {
    return { status: "invalid", error: result.error };
  }

  await mergeServiceDraftAnswer(serviceId, question.id, result.value);
  redirect(localeHref(locale, nextStepHref(definition, question.id, returnTo)));
}

export type CheckAnswersState =
  | { status: "idle" }
  | { status: "rate-limited" }
  | { status: "error" }
  /**
   * The store took the answers and still could not create the thing: the item
   * went out while the form was open, the borrower is blocklisted. Every
   * answer is valid, so there is no question to send the student back to, and
   * the check page shows `message` instead of highlighting a field.
   */
  | { status: "rejected"; message: string };

/**
 * The final "confirm and send". Re-validates the WHOLE draft (defense in
 * depth, `validateFullDraft`'s own header), rate limits, honours the
 * honeypot (matching the equipment loan wizard's convention: silently accept
 * and discard rather than reveal detection), submits, writes the
 * confirmation cookie, clears the draft, and redirects to `/confirm`. A
 * draft that fails full-draft validation is sent back to the first question
 * that needs fixing with `?returnTo=check`, so fixing it returns here rather
 * than restarting the whole wizard, the same behaviour
 * `submitLoanRequestCheck` gives the loan journey.
 */
export async function submitCheckAnswers(
  serviceId: string,
  locale: Locale,
  _prev: CheckAnswersState,
  formData: FormData
): Promise<CheckAnswersState> {
  const definition = getService(serviceId);
  if (!definition) redirect(localeHref(locale, `/do/${serviceId}`));

  const nickname = String(formData.get("nickname") ?? "");
  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), `do-check-${serviceId}`)) {
    return { status: "rate-limited" };
  }

  const draft = await readServiceDraft(serviceId);

  // Honeypot filled: behave exactly as if the submission succeeded, never
  // reveal detection (matches `submitLoanRequestCheck`'s own comment).
  if (nickname) {
    await clearServiceDraft(serviceId);
    redirect(localeHref(locale, `/do/${serviceId}/confirm`));
  }

  const validation = validateFullDraft(definition, draft, locale);
  if (!validation.ok) {
    redirect(
      localeHref(locale, `/do/${serviceId}/${validation.firstInvalidQuestionId}?returnTo=check`)
    );
  }

  const outcome = await submitService(definition, draft, locale, getSubmissionStore(serviceId));
  if (!outcome.ok) {
    if (outcome.reason === "rejected") {
      // Keep the draft. The answers are all fine and the student may well be
      // able to submit them unchanged once whatever blocked it clears, so
      // throwing their work away here would be gratuitous.
      return { status: "rejected", message: outcome.problem[locale] };
    }
    redirect(
      localeHref(locale, `/do/${serviceId}/${outcome.firstInvalidQuestionId}?returnTo=check`)
    );
  }

  await writeConfirmationCookie(serviceId, outcome.reference);
  await clearServiceDraft(serviceId);
  redirect(localeHref(locale, `/do/${serviceId}/confirm`));
}

export type StatusLookupState =
  | { status: "idle" }
  | { status: "invalid" }
  | { status: "not-found" }
  | { status: "rate-limited" }
  | { status: "error" }
  | {
      status: "success";
      submission: { reference: string; status: string; createdAt: string };
    };

/**
 * §5.1 item 5: reference plus one corroborating detail, in a single form
 * (`components/bds/StatusLookup.tsx` collects both at once, unlike the loan
 * wizard's own two-step version of the same journey). Rate limited and
 * honeypot-guarded the same way `submitLookupStep` protects the loan
 * status check.
 */
export async function lookupServiceStatus(
  serviceId: string,
  _prev: StatusLookupState,
  formData: FormData
): Promise<StatusLookupState> {
  const definition = getService(serviceId);
  if (!definition) return { status: "error" };

  // StatusLookup (components/bds/StatusLookup.tsx) is a frozen contract with
  // only a reference and a corroborating-detail field, so unlike the check
  // step's own form (this file's own hidden field in the page above it),
  // there is no honeypot field to read here. Rate limiting is this action's
  // only abuse guard.
  const reference = String(formData.get("reference") ?? "");
  const detail = String(formData.get("detail") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), `do-status-${serviceId}`)) {
    return { status: "rate-limited" };
  }

  if (!reference.trim() || !detail.trim()) {
    return { status: "invalid" };
  }

  const outcome = await lookupSubmission(getSubmissionStore(), definition, reference, detail);
  if (!outcome.ok) {
    return { status: outcome.reason === "invalid" ? "invalid" : "not-found" };
  }

  return {
    status: "success",
    submission: {
      reference: outcome.submission.reference,
      status: outcome.submission.status,
      createdAt: outcome.submission.createdAt,
    },
  };
}
