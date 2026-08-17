"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { rightsRequestSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { renderRightsRequest } from "@/lib/email/templates";
import { getDictionary, formatDate, localeHref, type Locale } from "@/lib/i18n";
import { readDraft, mergeDraft, clearDraft } from "@/components/forms/draftCookie";
import { buildRightsWizardLabels } from "@/components/forms/rightsWizardCopy";
import { rightById, rightsDeadlineIso } from "@/lib/privacy/rightsRequest";
import type { RightsStep } from "./steps";

const COOKIE = "birsa_rights_draft";

/** Partial answers carried across the rights journey's steps in the draft cookie. */
export type RightsDraft = {
  right?: string;
  name?: string;
  email?: string;
  details?: string;
};

const NEXT_STEP: Record<Exclude<RightsStep, "check">, RightsStep> = {
  what: "name",
  name: "email",
  email: "details",
  details: "check",
};

export type StepState = { status: "idle" | "invalid"; error?: string };

export type CheckState =
  { status: "idle" } | { status: "fallback"; draft: RightsDraft } | { status: "error" };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/** URL for a given step. Every step of this journey, including the first, has its own URL under `/privacy/your-data`. */
function stepHref(locale: Locale, step: RightsStep): string {
  return localeHref(locale, `/privacy/your-data/${step}`);
}

function destinationHref(
  locale: Locale,
  step: Exclude<RightsStep, "check">,
  returnTo?: string
): string {
  const target = returnTo === "check" ? "check" : NEXT_STEP[step];
  return stepHref(locale, target);
}

export async function getRightsDraft(): Promise<RightsDraft> {
  return readDraft<RightsDraft>(COOKIE);
}

export async function submitWhatStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const labels = buildRightsWizardLabels(locale);
  const value = String(formData.get("right") ?? "");
  const result = rightsRequestSchema.shape.right.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: labels.errors.whatRequired };
  }
  await mergeDraft<RightsDraft>(COOKIE, { right: result.data });
  redirect(destinationHref(locale, "what", returnTo));
}

export async function submitNameStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const dict = getDictionary(locale);
  const value = String(formData.get("name") ?? "");
  const result = rightsRequestSchema.shape.name.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: dict.form.errors.nameRequired };
  }
  await mergeDraft<RightsDraft>(COOKIE, { name: result.data });
  redirect(destinationHref(locale, "name", returnTo));
}

export async function submitEmailStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const dict = getDictionary(locale);
  const value = String(formData.get("email") ?? "");
  const result = rightsRequestSchema.shape.email.safeParse(value);
  if (!result.success) {
    return {
      status: "invalid",
      error: value.length === 0 ? dict.form.errors.emailRequired : dict.form.errors.emailInvalid,
    };
  }
  await mergeDraft<RightsDraft>(COOKIE, { email: result.data });
  redirect(destinationHref(locale, "email", returnTo));
}

export async function submitDetailsStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const value = String(formData.get("details") ?? "");
  const result = rightsRequestSchema.shape.details.safeParse(value || undefined);
  if (!result.success) {
    // Optional field: this only trips on the 2000-character max-length
    // bound, which a reader is very unlikely to hit by typing normally, so
    // there is no localized copy for it (matching how the start-a-club
    // journey's optional "members" step handles the same case).
    return { status: "invalid", error: undefined };
  }
  await mergeDraft<RightsDraft>(COOKIE, { details: result.data ?? "" });
  redirect(destinationHref(locale, "details", returnTo));
}

/** Maps a rightsRequestSchema field name to the step that collects it, for redirect-to-first-problem. */
const FIELD_TO_STEP: Record<string, RightsStep> = {
  right: "what",
  name: "name",
  email: "email",
  details: "details",
};

/**
 * Final "check your request" submission. Re-validates the whole draft with
 * the shared schema (defense in depth, and a safety net if a step was
 * reached directly without visiting the ones before it), then emails BIRSA
 * with the PDPA section and the section 30 deadline named in the subject and
 * body, so it can never be mistaken for ordinary correspondence.
 *
 * On success this redirects to `/privacy/your-data/sent` (Post/Redirect/Get)
 * rather than rendering an inline success state, so refreshing the
 * confirmation re-requests that page with a plain GET instead of resubmitting
 * the request.
 */
export async function submitRightsCheck(
  locale: Locale,
  _prev: CheckState,
  formData: FormData
): Promise<CheckState> {
  const draft = await readDraft<RightsDraft>(COOKIE);
  const nickname = String(formData.get("nickname") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "rights-request")) {
    return { status: "error" };
  }

  // Honeypot filled: silently accept and discard, never reveal detection.
  if (nickname) {
    await clearDraft(COOKIE);
    redirect(localeHref(locale, "/privacy/your-data/sent"));
  }

  const result = rightsRequestSchema.safeParse({
    right: draft.right ?? "",
    name: draft.name ?? "",
    email: draft.email ?? "",
    details: draft.details || undefined,
    nickname,
  });

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const path = firstIssue?.path[0];
    const step = typeof path === "string" ? FIELD_TO_STEP[path] : undefined;
    redirect(`${stepHref(locale, step ?? "what")}?returnTo=check`);
  }

  const { right, name, email, details } = result.data;
  const rightInfo = rightById(right);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "fallback", draft };
  }

  // `redirect()` throws internally, so it must never be called inside a
  // try/catch that would swallow it as a plain error: the send is isolated
  // in its own function, and the redirect happens only after it returns.
  const sent = await (async () => {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
      const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

      const deadlineIso = rightsDeadlineIso();
      const rendered = renderRightsRequest({
        name,
        email,
        rightNameEn: rightInfo?.name.en ?? right,
        rightNameTh: rightInfo?.name.th ?? right,
        section: rightInfo?.section ?? "",
        details,
        deadlineEn: formatDate("en", deadlineIso),
        deadlineTh: formatDate("th", deadlineIso),
      });

      await resend.emails.send({
        from,
        to: inbox,
        replyTo: email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      });

      return true;
    } catch {
      // Never log request details; a generic failure is all we surface. Keep
      // the draft so the reader can retry without retyping everything.
      return false;
    }
  })();

  if (!sent) {
    return { status: "error" };
  }

  await clearDraft(COOKIE);
  redirect(localeHref(locale, "/privacy/your-data/sent"));
}
