"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { renderContact } from "@/lib/email/templates";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";
import { readDraft, mergeDraft, clearDraft } from "@/components/forms/draftCookie";
import { CONTACT_STEPS, type ContactStep } from "./steps";
import { deriveContactSeed } from "./seed";

const COOKIE = "birsa_contact_draft";

/** Partial answers carried across the contact journey's steps in the draft cookie. */
export type ContactDraft = {
  category?: string;
  subject?: string;
  message?: string;
  name?: string;
  email?: string;
};

export type ContactValues = Record<"name" | "email" | "category" | "subject" | "message", string>;

const NEXT_STEP: Record<Exclude<ContactStep, "check">, ContactStep> = {
  category: "subject",
  subject: "message",
  message: "name",
  name: "email",
  email: "check",
};

const CATEGORY_LABELS: Record<string, string> = {
  question: "A question",
  suggestion: "A suggestion",
  problem: "A problem to report",
  other: "Something else",
};

export type StepState = { status: "idle" | "invalid"; error?: string };

export type CheckState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "fallback"; draft: ContactDraft }
  | { status: "error" };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * URL for a given step. The first step deliberately lives at the journey's
 * own root (`/contact`) rather than at `/contact/category`, so the reader is
 * asked the first question straight away instead of landing on a page whose
 * only purpose is a "start" button. Every step therefore has exactly one URL,
 * which is what the check-answers "change" links already point at.
 */
function stepHref(locale: Locale, step: ContactStep): string {
  const first = CONTACT_STEPS[0];
  return localeHref(locale, step === first ? "/contact" : `/contact/${step}`);
}

function destinationHref(
  locale: Locale,
  step: Exclude<ContactStep, "check">,
  returnTo?: string
): string {
  const target = returnTo === "check" ? "check" : NEXT_STEP[step];
  return stepHref(locale, target);
}

export async function getContactDraft(): Promise<ContactDraft> {
  return readDraft<ContactDraft>(COOKIE);
}

export async function submitCategoryStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const dict = getDictionary(locale);
  const value = String(formData.get("category") ?? "");
  const result = contactSchema.shape.category.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: dict.form.errors.categoryRequired };
  }

  // A deep link's seeded subject rides along as a hidden "seedFrom" field
  // rather than trusting a client-supplied subject: only the page path is
  // taken from the client, and it's re-validated by deriveContactSeed here.
  const seedFrom = String(formData.get("seedFrom") ?? "");
  const draft = await readDraft<ContactDraft>(COOKIE);
  const subject = draft.subject
    ? undefined
    : deriveContactSeed(locale, result.data, seedFrom).subject;

  await mergeDraft<ContactDraft>(COOKIE, {
    category: result.data,
    ...(subject ? { subject } : {}),
  });
  redirect(destinationHref(locale, "category", returnTo));
}

export async function submitSubjectStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const dict = getDictionary(locale);
  const value = String(formData.get("subject") ?? "");
  const result = contactSchema.shape.subject.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: dict.form.errors.subjectRequired };
  }
  await mergeDraft<ContactDraft>(COOKIE, { subject: result.data });
  redirect(destinationHref(locale, "subject", returnTo));
}

export async function submitMessageStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const dict = getDictionary(locale);
  const value = String(formData.get("message") ?? "");
  const result = contactSchema.shape.message.safeParse(value);
  if (!result.success) {
    const tooShort = value.trim().length > 0;
    return {
      status: "invalid",
      error: tooShort ? dict.form.errors.messageShort : dict.form.errors.messageRequired,
    };
  }
  await mergeDraft<ContactDraft>(COOKIE, { message: result.data });
  redirect(destinationHref(locale, "message", returnTo));
}

export async function submitNameStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const dict = getDictionary(locale);
  const value = String(formData.get("name") ?? "");
  const result = contactSchema.shape.name.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: dict.form.errors.nameRequired };
  }
  await mergeDraft<ContactDraft>(COOKIE, { name: result.data });
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
  const result = contactSchema.shape.email.safeParse(value);
  if (!result.success) {
    return {
      status: "invalid",
      error: value.length === 0 ? dict.form.errors.emailRequired : dict.form.errors.emailInvalid,
    };
  }
  await mergeDraft<ContactDraft>(COOKIE, { email: result.data });
  redirect(destinationHref(locale, "email", returnTo));
}

/** Maps a contactSchema field name to the step that collects it, for redirect-to-first-problem. */
const FIELD_TO_STEP: Record<string, ContactStep> = {
  category: "category",
  subject: "subject",
  message: "message",
  name: "name",
  email: "email",
};

/**
 * Final "check your answers" submission. Re-validates the whole draft with
 * the shared schema (defense in depth, and a safety net if a step was
 * reached directly without visiting the ones before it), then sends the
 * email exactly as the single-page form used to.
 */
export async function submitContactCheck(
  locale: Locale,
  _prev: CheckState,
  formData: FormData
): Promise<CheckState> {
  const draft = await readDraft<ContactDraft>(COOKIE);
  const nickname = String(formData.get("nickname") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "contact")) {
    return { status: "error" };
  }

  // Honeypot filled: silently accept and discard, never reveal detection.
  if (nickname) {
    await clearDraft(COOKIE);
    return { status: "success" };
  }

  const result = contactSchema.safeParse({ ...draft, nickname });
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const path = firstIssue?.path[0];
    const step = typeof path === "string" ? FIELD_TO_STEP[path] : undefined;
    redirect(`${stepHref(locale, step ?? "category")}?returnTo=check`);
  }

  const { name, email, category, subject, message } = result.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "fallback", draft };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
    const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

    const rendered = renderContact({
      name,
      email,
      categoryLabel: CATEGORY_LABELS[category] ?? category,
      subject,
      message,
    });

    await resend.emails.send({
      from,
      to: inbox,
      replyTo: email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    await clearDraft(COOKIE);
    return { status: "success" };
  } catch {
    // Never log message bodies; a generic failure is all we surface. Keep
    // the draft so the reader can retry without retyping everything.
    return { status: "error" };
  }
}
