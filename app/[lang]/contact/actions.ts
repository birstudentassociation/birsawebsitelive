"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { renderContact } from "@/lib/email/templates";
import { defaultLocale, getDictionary, isLocale, type Locale } from "@/lib/i18n";

type ContactFieldName = "name" | "email" | "category" | "subject" | "message";

export type ContactValues = Record<ContactFieldName, string>;

/**
 * Result of a contact submission, driving what the form renders next:
 * - `invalid`  — validation failed; show field errors, keep the typed values
 * - `success`  — message sent (or honeypot silently swallowed)
 * - `fallback` — email isn't configured; show the draft to send manually
 * - `error`    — rate-limited or send failed; show a generic error, keep values
 */
export type ContactState = {
  status: "idle" | "invalid" | "success" | "fallback" | "error";
  errors?: Partial<Record<ContactFieldName, string>>;
  values?: ContactValues;
};

const CATEGORY_LABELS: Record<string, string> = {
  question: "A question",
  suggestion: "A suggestion",
  problem: "A problem to report",
  other: "Something else",
};

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * Server action for the contact form. Runs on a normal form POST even without
 * JavaScript (Next serialises it to an endpoint), so the whole journey works
 * HTML-first; `useActionState` layers the inline behaviour on top. Mirrors the
 * JSON route handler at `app/api/contact/route.ts`: rate limit, honeypot,
 * shared zod schema, then Resend — never revealing the honeypot to bots.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values: ContactValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    category: String(formData.get("category") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const nickname = String(formData.get("nickname") ?? "");
  const localeRaw = String(formData.get("locale") ?? "");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : defaultLocale;
  const dict = getDictionary(locale);

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h))) {
    return { status: "error", values };
  }

  // Honeypot filled — silently accept and discard, never reveal detection.
  if (nickname) {
    return { status: "success" };
  }

  const result = contactSchema.safeParse({ ...values, nickname });
  if (!result.success) {
    const errors: Partial<Record<ContactFieldName, string>> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0];
      if (path === "name") errors.name = dict.form.errors.nameRequired;
      if (path === "email") {
        errors.email =
          values.email.length === 0 ? dict.form.errors.emailRequired : dict.form.errors.emailInvalid;
      }
      if (path === "category") errors.category = dict.form.errors.categoryRequired;
      if (path === "subject") errors.subject = dict.form.errors.subjectRequired;
      if (path === "message") {
        errors.message =
          values.message.length === 0
            ? dict.form.errors.messageRequired
            : dict.form.errors.messageShort;
      }
    }
    return { status: "invalid", errors, values };
  }

  const { name, email, category, subject, message } = result.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "fallback", values };
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

    return { status: "success" };
  } catch {
    // Never log message bodies; a generic failure is all we surface.
    return { status: "error", values };
  }
}
