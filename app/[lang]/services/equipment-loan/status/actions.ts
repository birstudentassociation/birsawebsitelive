"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { loanLookupSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { getLoanByReferenceAndEmail, cancelLoan } from "@/lib/inventory/loans";
import { getItem } from "@/lib/inventory/items";
import type { LoanStatus } from "@/lib/inventory/types";
import { localeHref, type Locale } from "@/lib/i18n";
import { readDraft, mergeDraft, clearDraft } from "@/components/forms/draftCookie";
import type { StatusLookupLabels } from "@/components/equipment/StatusLookup";

const COOKIE = "birsa_loan_status_draft";

/** Partial answers carried across the loan status journey's steps in the draft cookie. */
export type LoanStatusDraft = {
  reference?: string;
  email?: string;
};

export type LoanLookupResult = {
  reference: string;
  status: LoanStatus;
  startDate: string;
  endDate: string;
  itemName: { en: string; th: string } | null;
};

export type StepState = { status: "idle" | "invalid"; error?: string };

export type LookupState =
  | { status: "idle" }
  | { status: "invalid"; error: string }
  | { status: "not-found" }
  | { status: "rate-limited" }
  | { status: "error" }
  | { status: "success"; loan: LoanLookupResult };

export type CancelState =
  | { status: "idle" }
  | { status: "done" }
  | { status: "not-found" }
  | { status: "rate-limited" }
  | { status: "error" };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

export async function getLoanStatusDraft(): Promise<LoanStatusDraft> {
  return readDraft<LoanStatusDraft>(COOKIE);
}

/**
 * Clears the status-lookup draft cookie and sends the visitor back to the
 * start of the journey. This has to be a Server Action behind a form POST
 * rather than a plain `?reset=1` link: cookie writes are only legal inside a
 * Server Action (or Route Handler), not while a Server Component renders, so
 * a GET link to this route would throw. Bound with `.bind(null, locale)` for
 * use as a `<form action>`, matching `submitReferenceStep`.
 */
export async function resetLoanStatusDraft(locale: Locale, _formData: FormData): Promise<void> {
  await clearDraft(COOKIE);
  redirect(localeHref(locale, "/services/equipment-loan/status"));
}

export async function submitReferenceStep(
  locale: Locale,
  labels: StatusLookupLabels,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const value = String(formData.get("reference") ?? "").trim();
  const result = loanLookupSchema.shape.reference.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: labels.errors.referenceRequired };
  }
  await mergeDraft<LoanStatusDraft>(COOKIE, { reference: result.data });
  redirect(localeHref(locale, "/services/equipment-loan/status/email"));
}

/**
 * The email step both collects the last input and runs the lookup: unlike
 * the create-a-record journeys, a status check has nothing to "confirm"
 * before executing (it only reads data), so there is no separate
 * check-answers step here. Mirrors `submitLoanLookup` (the previous
 * no-JavaScript fallback's action): rate limit, honeypot, shared schema,
 * generic not-found to avoid reference enumeration.
 */
export async function submitLookupStep(
  labels: StatusLookupLabels,
  _prev: LookupState,
  formData: FormData
): Promise<LookupState> {
  const draft = await readDraft<LoanStatusDraft>(COOKIE);
  const email = String(formData.get("email") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "");

  const emailResult = loanLookupSchema.shape.email.safeParse(email);
  if (!emailResult.success) {
    return {
      status: "invalid",
      error: email.length === 0 ? labels.errors.emailRequired : labels.errors.emailInvalid,
    };
  }
  await mergeDraft<LoanStatusDraft>(COOKIE, { email });

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "loan-status")) {
    return { status: "rate-limited" };
  }

  // Honeypot filled: behave exactly like a miss, never reveal detection.
  if (nickname) {
    return { status: "not-found" };
  }

  const parsed = loanLookupSchema.safeParse({ reference: draft.reference ?? "", email, nickname });
  if (!parsed.success) {
    return { status: "not-found" };
  }

  try {
    const loan = await getLoanByReferenceAndEmail(parsed.data.reference, parsed.data.email);
    if (!loan) {
      return { status: "not-found" };
    }

    const item = await getItem(loan.itemId);

    return {
      status: "success",
      loan: {
        reference: loan.reference,
        status: loan.status,
        startDate: loan.startDate,
        endDate: loan.endDate,
        itemName: item ? { en: item.name.en, th: item.name.th } : null,
      },
    };
  } catch {
    return { status: "error" };
  }
}

/**
 * Cancels the pending loan named by the draft cookie's reference + email.
 * Previously cancellation was a JavaScript-only enhancement (a client
 * `confirm()` dialog before a `fetch` call); it now has a real "are you
 * sure" page (`/status/cancel`) backed by this action, so it also works
 * without JavaScript.
 */
export async function submitCancelConfirm(
  _prev: CancelState,
  formData: FormData
): Promise<CancelState> {
  const draft = await readDraft<LoanStatusDraft>(COOKIE);
  const nickname = String(formData.get("nickname") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "loan-cancel")) {
    return { status: "rate-limited" };
  }

  if (nickname) {
    return { status: "done" };
  }

  const parsed = loanLookupSchema.safeParse({
    reference: draft.reference ?? "",
    email: draft.email ?? "",
    nickname,
  });
  if (!parsed.success) {
    return { status: "not-found" };
  }

  const loan = await getLoanByReferenceAndEmail(parsed.data.reference, parsed.data.email);
  if (!loan || loan.status !== "pending") {
    return { status: "not-found" };
  }

  const cancelled = await cancelLoan({ id: loan.id });
  if (!cancelled.ok) {
    return { status: "error" };
  }

  await clearDraft(COOKIE);
  return { status: "done" };
}
