"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { inventoryLoanRequestSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { createLoanRequest, getItemAvailabilityForRange } from "@/lib/inventory/loans";
import { getItemByKey } from "@/lib/inventory/items";
import { renderOfficerNewRequest } from "@/lib/email/templates";
import { localeHref, type Locale } from "@/lib/i18n";
import { todayInBangkok } from "@/lib/bangkok-today";
import { readDraft, writeDraft, clearDraft } from "@/components/forms/draftCookie";
import type { LoanWizardLabels } from "@/components/equipment/loanWizardCopy";
import type { LoanStep } from "./steps";

const COOKIE = "birsa_loan_request_draft";

/** Partial answers carried across the loan request journey's steps in the draft cookie. */
export type LoanDraft = {
  itemKey?: string;
  studentName?: string;
  studentId?: string;
  studentEmail?: string;
  phone?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
};

const NEXT_STEP: Record<Exclude<LoanStep, "check">, LoanStep> = {
  name: "studentId",
  studentId: "email",
  email: "phone",
  phone: "dates",
  dates: "reason",
  reason: "check",
};

const STEP_SLUG: Record<LoanStep, string> = {
  name: "name",
  studentId: "student-id",
  email: "email",
  phone: "phone",
  dates: "dates",
  reason: "reason",
  check: "check",
};

export type StepState = { status: "idle" | "invalid"; error?: string };

export type DatesStepState =
  | { status: "idle" }
  | { status: "invalid"; errors: { startDate?: string; endDate?: string } }
  | { status: "unavailable" }
  | { status: "check-error" };

export type CheckState =
  | { status: "idle" }
  | { status: "success"; reference: string }
  | {
      status:
        | "unavailable"
        | "blocklisted"
        | "limit-exceeded"
        | "not-configured"
        | "rate-limited"
        | "error";
    };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * The student's own calendar day. This runs on a UTC server, so
 * `now.getFullYear()`/`getMonth()`/`getDate()` would report yesterday for the
 * first seven hours of every Bangkok day and let a pickup date that is
 * already past slip through the check below.
 */
function todayISO(): string {
  return todayInBangkok();
}

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function stepHref(locale: Locale, itemKey: string, step: LoanStep): string {
  return localeHref(locale, `/services/equipment-loan/${itemKey}/request/${STEP_SLUG[step]}`);
}

function destinationHref(
  locale: Locale,
  itemKey: string,
  step: Exclude<LoanStep, "check">,
  returnTo?: string
): string {
  const target = returnTo === "check" ? "check" : NEXT_STEP[step];
  return stepHref(locale, itemKey, target);
}

/**
 * Reads the draft. Runs during page render, where cookie writes are not
 * allowed, so a draft belonging to a different item (a reader who abandoned
 * a request for one item and started another) is ignored here rather than
 * cleared: the returned value drops its answers, but the stale cookie is
 * left in place until the next step submission corrects it via
 * `mergeLoanDraft`.
 */
export async function getLoanDraft(itemKey: string): Promise<LoanDraft> {
  const current = await readDraft<LoanDraft>(COOKIE);
  if (current.itemKey && current.itemKey !== itemKey) {
    return { itemKey };
  }
  return { ...current, itemKey };
}

/**
 * Merges `patch` into the draft cookie, scoping it to `itemKey`. If the
 * existing cookie belongs to a different item (abandoned request), starts
 * from an empty base first so that item's answers can't leak into this one.
 * This is the write-time counterpart of the reset `getLoanDraft` used to do
 * during render, moved here because step actions are real Server Actions
 * where cookie writes are legal.
 */
async function mergeLoanDraft(itemKey: string, patch: Partial<LoanDraft>): Promise<void> {
  const current = await readDraft<LoanDraft>(COOKIE);
  const base = current.itemKey && current.itemKey !== itemKey ? {} : current;
  await writeDraft(COOKIE, { ...base, itemKey, ...patch });
}

export async function submitNameStep(
  locale: Locale,
  itemKey: string,
  returnTo: string | undefined,
  labels: LoanWizardLabels,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const value = String(formData.get("studentName") ?? "").trim();
  const schema = inventoryLoanRequestSchema.innerType();
  if (!schema.shape.studentName.safeParse(value).success) {
    return { status: "invalid", error: labels.name.errorRequired };
  }
  await mergeLoanDraft(itemKey, { studentName: value });
  redirect(destinationHref(locale, itemKey, "name", returnTo));
}

export async function submitStudentIdStep(
  locale: Locale,
  itemKey: string,
  returnTo: string | undefined,
  labels: LoanWizardLabels,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const value = String(formData.get("studentId") ?? "").trim();
  const schema = inventoryLoanRequestSchema.innerType();
  if (!schema.shape.studentId.safeParse(value).success) {
    return { status: "invalid", error: labels.studentId.errorRequired };
  }
  await mergeLoanDraft(itemKey, { studentId: value });
  redirect(destinationHref(locale, itemKey, "studentId", returnTo));
}

export async function submitEmailStep(
  locale: Locale,
  itemKey: string,
  returnTo: string | undefined,
  labels: LoanWizardLabels,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const value = String(formData.get("studentEmail") ?? "").trim();
  const schema = inventoryLoanRequestSchema.innerType();
  if (value.length === 0) {
    return { status: "invalid", error: labels.email.errorRequired };
  }
  if (!schema.shape.studentEmail.safeParse(value).success) {
    return { status: "invalid", error: labels.email.errorInvalid };
  }
  await mergeLoanDraft(itemKey, { studentEmail: value });
  redirect(destinationHref(locale, itemKey, "email", returnTo));
}

export async function submitPhoneStep(
  locale: Locale,
  itemKey: string,
  returnTo: string | undefined,
  labels: LoanWizardLabels,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const value = String(formData.get("phone") ?? "").trim();
  const schema = inventoryLoanRequestSchema.innerType();
  if (value.length > 0 && !schema.shape.phone.safeParse(value).success) {
    return { status: "invalid", error: labels.phone.errorInvalid };
  }
  await mergeLoanDraft(itemKey, { phone: value });
  redirect(destinationHref(locale, itemKey, "phone", returnTo));
}

/**
 * Validates the collection/return date range, checks live availability for
 * that range server-side (the interactive wizard used to do this via a
 * client `fetch` to `/api/loans/availability`; here it happens directly, in
 * the same request that validates the step), and either redirects onward or
 * re-renders the same page with the "nothing free" notice. The raw values
 * are saved to the draft on every outcome so the fields keep whatever the
 * reader typed if they need to try a different range.
 */
export async function submitDatesStep(
  locale: Locale,
  itemKey: string,
  returnTo: string | undefined,
  labels: LoanWizardLabels,
  maxLoanDays: number,
  _prev: DatesStepState,
  formData: FormData
): Promise<DatesStepState> {
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  await mergeLoanDraft(itemKey, { startDate, endDate });

  const errors: { startDate?: string; endDate?: string } = {};

  if (!startDate) errors.startDate = labels.dates.errorStartRequired;
  else if (!ISO_DATE.test(startDate)) errors.startDate = labels.dates.errorStartInvalid;
  else if (startDate < todayISO()) errors.startDate = labels.dates.errorStartPast;

  if (!endDate) errors.endDate = labels.dates.errorEndRequired;
  else if (!ISO_DATE.test(endDate)) errors.endDate = labels.dates.errorEndInvalid;
  else if (startDate && endDate < startDate) errors.endDate = labels.dates.errorEndBeforeStart;
  else if (startDate && endDate > addDaysISO(startDate, maxLoanDays)) {
    errors.endDate = labels.dates.errorTooLong;
  }

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
  }

  const ip = ipFromHeaders(await headers());
  if (!checkRateLimit(ip, "loan-availability", 60)) {
    return { status: "check-error" };
  }

  try {
    const availability = await getItemAvailabilityForRange(itemKey, startDate, endDate);
    if (availability.available <= 0) {
      return { status: "unavailable" };
    }
  } catch {
    return { status: "check-error" };
  }

  redirect(destinationHref(locale, itemKey, "dates", returnTo));
}

export async function submitReasonStep(
  locale: Locale,
  itemKey: string,
  returnTo: string | undefined,
  _labels: LoanWizardLabels,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const value = String(formData.get("reason") ?? "").trim();
  await mergeLoanDraft(itemKey, { reason: value });
  redirect(destinationHref(locale, itemKey, "reason", returnTo));
}

const FIELD_TO_STEP: Record<string, LoanStep> = {
  studentName: "name",
  studentId: "studentId",
  studentEmail: "email",
  phone: "phone",
  startDate: "dates",
  endDate: "dates",
};

/**
 * Final "check your answers" submission. Re-runs the shared schema against
 * the full draft (defense in depth), then behaves exactly like the previous
 * single-page fallback form: rate limit, honeypot, `createLoanRequest`,
 * best-effort officer email, and the same terminal outcomes.
 */
export async function submitLoanRequestCheck(
  locale: Locale,
  itemKey: string,
  _prev: CheckState,
  formData: FormData
): Promise<CheckState> {
  const draft = await readDraft<LoanDraft>(COOKIE);
  const nickname = String(formData.get("nickname") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "loan-request")) {
    return { status: "rate-limited" };
  }

  // Honeypot filled: silently accept and discard, never reveal detection.
  if (nickname) {
    await clearDraft(COOKIE);
    return { status: "success", reference: "" };
  }

  const item = await getItemByKey(itemKey);
  if (!item || item.isRetired) {
    return { status: "error" };
  }

  const values = {
    studentName: (draft.studentName ?? "").trim(),
    studentId: (draft.studentId ?? "").trim(),
    studentEmail: (draft.studentEmail ?? "").trim(),
    phone: (draft.phone ?? "").trim(),
    startDate: draft.startDate ?? "",
    endDate: draft.endDate ?? "",
    reason: (draft.reason ?? "").trim(),
  };

  const parsed = inventoryLoanRequestSchema.safeParse({
    itemKey,
    studentName: values.studentName,
    studentId: values.studentId,
    studentEmail: values.studentEmail,
    phone: values.phone || undefined,
    startDate: values.startDate,
    endDate: values.endDate,
    reason: values.reason || undefined,
    nickname,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path[0];
    const step = typeof path === "string" ? FIELD_TO_STEP[path] : undefined;
    redirect(`${stepHref(locale, itemKey, step ?? "name")}?returnTo=check`);
  }

  const created = await createLoanRequest({
    itemKey,
    startDate: values.startDate,
    endDate: values.endDate,
    reason: values.reason || null,
    borrower: {
      tuStudentId: values.studentId,
      name: values.studentName,
      email: values.studentEmail,
      phone: values.phone || null,
    },
  });

  if (!created.ok) {
    switch (created.reason) {
      case "not-configured":
        return { status: "not-configured" };
      case "unavailable":
        return { status: "unavailable" };
      case "blocklisted":
        return { status: "blocklisted" };
      case "limit-exceeded":
        return { status: "limit-exceeded" };
      default:
        return { status: "error" };
    }
  }

  // Best-effort officer notification email; never blocks the response.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
      const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

      const email = renderOfficerNewRequest({
        itemNameEn: item.name.en,
        itemNameTh: item.name.th ?? item.name.en,
        reference: created.reference,
        studentName: values.studentName,
        studentId: values.studentId,
        studentEmail: values.studentEmail,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason || undefined,
      });

      await resend.emails.send({
        from,
        to: inbox,
        replyTo: values.studentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
    } catch {
      // Notification email is optional; the request itself already succeeded.
    }
  }

  await clearDraft(COOKIE);
  return { status: "success", reference: created.reference };
}
