"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import { contactSchema } from "@/lib/validation";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

export type ContactFormProps = {
  locale: Locale;
  dict: Dictionary;
  /** Preselected category, e.g. from `?category=` search param. */
  initialCategory?: string;
};

type FieldErrors = Partial<Record<"name" | "email" | "category" | "subject" | "message", string>>;

type SubmitState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | { status: "fallback"; draft: string }
  | { status: "error" };

const CATEGORY_VALUES = ["question", "suggestion", "problem", "other"] as const;

function categoryLabel(dict: Dictionary, value: (typeof CATEGORY_VALUES)[number]): string {
  const labels: Record<(typeof CATEGORY_VALUES)[number], string> = {
    question: dict.locale === "th" ? "คำถามทั่วไป" : "A question",
    suggestion: dict.locale === "th" ? "ข้อเสนอแนะ" : "A suggestion",
    problem: dict.locale === "th" ? "แจ้งปัญหา" : "A problem to report",
    other: dict.locale === "th" ? "เรื่องอื่น ๆ" : "Something else",
  };
  return labels[value];
}

/**
 * Contact BIRSA form. Validates client-side with the shared zod schema,
 * posts JSON to /api/contact, and handles the three server outcomes: success,
 * not-configured (email fallback with the draft kept visible), and generic
 * error (fields kept intact so nothing is lost).
 */
export default function ContactForm({ dict, initialCategory }: ContactFormProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "question");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const fieldIds = {
    name: `${formId}-name`,
    email: `${formId}-email`,
    category: `${formId}-category`,
    subject: `${formId}-subject`,
    message: `${formId}-message`,
  };

  function buildDraft(): string {
    const catLabel = categoryLabel(dict, category as (typeof CATEGORY_VALUES)[number]);
    return [`${dict.form.yourName}: ${name}`, `${dict.form.email}: ${email}`, `${dict.form.category}: ${catLabel}`, `${dict.form.subject}: ${subject}`, "", message].join(
      "\n"
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = contactSchema.safeParse({
      name,
      email,
      category,
      subject,
      message,
      nickname,
    });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (path === "name") nextErrors.name = dict.form.errors.nameRequired;
        if (path === "email") {
          nextErrors.email = email.length === 0 ? dict.form.errors.emailRequired : dict.form.errors.emailInvalid;
        }
        if (path === "category") nextErrors.category = dict.form.errors.categoryRequired;
        if (path === "subject") nextErrors.subject = dict.form.errors.subjectRequired;
        if (path === "message") {
          nextErrors.message = message.length === 0 ? dict.form.errors.messageRequired : dict.form.errors.messageShort;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setState({ status: "pending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const body = (await response.json()) as { ok: boolean; reason?: string };

      if (body.ok) {
        setState({ status: "success" });
      } else if (body.reason === "not-configured") {
        setState({ status: "fallback", draft: buildDraft() });
      } else {
        setState({ status: "error" });
      }
    } catch {
      setState({ status: "error" });
    }
  }

  const errorItems: ErrorSummaryItem[] = Object.entries(errors)
    .filter(([, message]) => Boolean(message))
    .map(([key, message]) => ({ id: fieldIds[key as keyof typeof fieldIds], message: message as string }));

  if (state.status === "success") {
    return (
      <div role="status" className="border-success bg-success-tint text-ink rounded-lg border-l-4 p-6">
        <p className="font-semibold">{dict.form.successTitle}</p>
        <p className="mt-1 text-sm">{dict.form.successBody}</p>
      </div>
    );
  }

  if (state.status === "fallback") {
    return (
      <div className="flex flex-col gap-4">
        <div role="status" className="border-warning bg-warning-tint text-ink rounded-lg border-l-4 p-6">
          <p className="font-semibold">{dict.form.fallbackTitle}</p>
          <p className="mt-1 text-sm">
            {dict.form.fallbackBody}{" "}
            <a href="mailto:bir@tu.ac.th" className="text-brand-deep hover:text-brand-dark font-medium">
              bir@tu.ac.th
            </a>
          </p>
        </div>
        <Field
          as="textarea"
          name="draft"
          label={dict.form.message}
          value={state.draft}
          readOnly
          rows={8}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <ErrorSummary title={dict.form.errorSummaryTitle} errors={errorItems} />

      {state.status === "error" ? <Notice variant="error">{dict.form.genericError}</Notice> : null}

      {/* Honeypot — real visitors never see or fill this. Visually hidden,
          not display:none, so assistive tech that ignores CSS still gets an
          explicit instruction rather than a trap. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-nickname`}>Leave this field empty</label>
        <input
          id={`${formId}-nickname`}
          name="nickname"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
      </div>

      <Field
        id={fieldIds.name}
        name="name"
        label={dict.form.yourName}
        required
        requiredLabel={dict.actions.required}
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
        autoComplete="name"
      />
      <Field
        id={fieldIds.email}
        name="email"
        type="email"
        label={dict.form.email}
        hint={dict.form.emailHint}
        required
        requiredLabel={dict.actions.required}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <Field
        id={fieldIds.category}
        name="category"
        as="select"
        label={dict.form.category}
        required
        requiredLabel={dict.actions.required}
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        error={errors.category}
        options={CATEGORY_VALUES.map((value) => ({ value, label: categoryLabel(dict, value) }))}
      />
      <Field
        id={fieldIds.subject}
        name="subject"
        label={dict.form.subject}
        required
        requiredLabel={dict.actions.required}
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        error={errors.subject}
      />
      <Field
        id={fieldIds.message}
        name="message"
        as="textarea"
        label={dict.form.message}
        required
        requiredLabel={dict.actions.required}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        error={errors.message}
      />

      <p className="text-muted text-sm">{dict.form.privacyNote}</p>

      <div>
        <Button type="submit" disabled={state.status === "pending"}>
          {state.status === "pending" ? dict.form.sending : dict.form.send}
        </Button>
        {state.status === "pending" ? (
          <span role="status" className="sr-only">
            {dict.form.sending}
          </span>
        ) : null}
      </div>
    </form>
  );
}
