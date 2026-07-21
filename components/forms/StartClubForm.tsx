"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Email from "@/components/Email";
import {
  submitStartClub,
  type StartClubErrorCode,
  type StartClubState,
} from "@/app/[lang]/clubs/start/actions";
import type { Dictionary, Locale } from "@/lib/i18n";

export type StartClubFormProps = {
  locale: Locale;
  dict: Dictionary;
};

type StartClubField = "name" | "email" | "clubName" | "description";

const copy: Record<
  Locale,
  {
    yourName: string;
    email: string;
    emailHint: string;
    clubName: string;
    clubNameHint: string;
    description: string;
    descriptionHint: string;
    members: string;
    membersHint: string;
    send: string;
    sending: string;
    successTitle: string;
    successBody: string;
    errorSummaryTitle: string;
    errors: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      clubNameRequired: string;
      descriptionRequired: string;
      descriptionShort: string;
    };
  }
> = {
  en: {
    yourName: "Your name",
    email: "Email address",
    emailHint: "We'll only use this to reply to you.",
    clubName: "Proposed club name",
    clubNameHint: "It's fine if this changes later.",
    description: "What would the club do?",
    descriptionHint: "A few sentences on the idea, who it's for, and roughly how often you'd meet.",
    members: "Who else is interested?",
    membersHint: "Optional: names or a rough headcount, if you have them.",
    send: "Submit idea",
    sending: "Sending…",
    successTitle: "Thanks, your club idea is on its way",
    successBody:
      "A member of the BIRSA committee will get back to you by email to talk through next steps.",
    errorSummaryTitle: "There is a problem",
    errors: {
      nameRequired: "Enter your name",
      emailRequired: "Enter your email address",
      emailInvalid: "Enter an email address in the correct format, like name@example.com",
      clubNameRequired: "Enter a proposed club name",
      descriptionRequired: "Tell us what the club would do",
      descriptionShort: "Add a little more detail",
    },
  },
  th: {
    yourName: "ชื่อของคุณ",
    email: "อีเมล",
    emailHint: "เราจะใช้อีเมลนี้เพื่อตอบกลับคุณเท่านั้น",
    clubName: "ชื่อชมรมที่เสนอ",
    clubNameHint: "เปลี่ยนภายหลังได้ ไม่ต้องเป๊ะตอนนี้",
    description: "ชมรมนี้จะทำอะไร",
    descriptionHint: "อธิบายไอเดียสั้น ๆ กลุ่มเป้าหมายคือใคร และคาดว่าจะนัดพบกันบ่อยแค่ไหน",
    members: "มีใครสนใจร่วมด้วยอีกไหม",
    membersHint: "ไม่บังคับ: ใส่ชื่อหรือจำนวนคร่าว ๆ ถ้ามี",
    send: "ส่งไอเดีย",
    sending: "กำลังส่ง…",
    successTitle: "ขอบคุณ ไอเดียชมรมของคุณถูกส่งแล้ว",
    successBody: "กรรมการ BIRSA จะติดต่อกลับทางอีเมลเพื่อคุยขั้นตอนถัดไป",
    errorSummaryTitle: "มีข้อมูลที่ต้องแก้ไข",
    errors: {
      nameRequired: "กรอกชื่อของคุณ",
      emailRequired: "กรอกอีเมลของคุณ",
      emailInvalid: "กรอกอีเมลให้ถูกต้อง เช่น name@example.com",
      clubNameRequired: "กรอกชื่อชมรมที่ต้องการเสนอ",
      descriptionRequired: "บอกเราว่าชมรมนี้จะทำอะไร",
      descriptionShort: "กรุณาเล่ารายละเอียดเพิ่มอีกนิด",
    },
  },
};

const initialState: StartClubState = { status: "idle" };

/**
 * "Start a club" idea submission form: same HTML-first pattern as ContactForm,
 * posting to the `submitStartClub` server action (works without JavaScript) and
 * enhanced with `useActionState`. The action returns error codes, mapped here to
 * localized messages.
 */
export default function StartClubForm({ locale, dict }: StartClubFormProps) {
  const t = copy[locale];
  const formId = useId();
  const [state, formAction, isPending] = useActionState(submitStartClub, initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  // On success/fallback the form (and the focused submit button) unmounts, so
  // move focus to the result message, otherwise focus falls back to <body>
  // and keyboard users lose their place (2.4.3).
  useEffect(() => {
    if (state.status === "success" || state.status === "fallback") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  const fieldIds = {
    name: `${formId}-name`,
    email: `${formId}-email`,
    clubName: `${formId}-clubName`,
    description: `${formId}-description`,
    members: `${formId}-members`,
  };

  function messageFor(field: StartClubField, code: StartClubErrorCode): string {
    switch (field) {
      case "name":
        return t.errors.nameRequired;
      case "email":
        return code === "invalid" ? t.errors.emailInvalid : t.errors.emailRequired;
      case "clubName":
        return t.errors.clubNameRequired;
      case "description":
        return code === "short" ? t.errors.descriptionShort : t.errors.descriptionRequired;
    }
  }

  const values = state.values;

  function buildDraft(): string {
    const v = state.values;
    if (!v) return "";
    return [
      `${t.yourName}: ${v.name}`,
      `${t.email}: ${v.email}`,
      `${t.clubName}: ${v.clubName}`,
      v.members ? `${t.members}: ${v.members}` : null,
      "",
      v.description,
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
  }

  if (state.status === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="border-success bg-success-tint text-ink focus-halo rounded-lg border-l-4 p-6"
      >
        <p className="font-semibold">{t.successTitle}</p>
        <p className="mt-1 text-sm">{t.successBody}</p>
      </div>
    );
  }

  if (state.status === "fallback") {
    return (
      <div className="flex flex-col gap-4">
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="border-warning bg-warning-tint text-ink focus-halo rounded-lg border-l-4 p-6"
        >
          <p className="font-semibold">{dict.form.fallbackTitle}</p>
          <p className="mt-1 text-sm">
            {dict.form.fallbackBody}{" "}
            <Email
              address="birsa@tu.ac.th"
              className="text-brand-deep hover:text-brand-dark font-medium"
            />
          </p>
        </div>
        <Field
          as="textarea"
          name="draft"
          label={t.description}
          value={buildDraft()}
          readOnly
          rows={8}
        />
      </div>
    );
  }

  const errorItems: ErrorSummaryItem[] = Object.entries(state.errors ?? {})
    .filter(([, code]) => Boolean(code))
    .map(([key, code]) => ({
      id: fieldIds[key as keyof typeof fieldIds],
      message: messageFor(key as StartClubField, code as StartClubErrorCode),
    }));

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <ErrorSummary title={t.errorSummaryTitle} errors={errorItems} />

      {state.status === "error" ? <Notice variant="error">{dict.form.genericError}</Notice> : null}

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-nickname`}>Leave this field empty</label>
        <input
          id={`${formId}-nickname`}
          name="nickname"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <Field
        id={fieldIds.name}
        name="name"
        label={t.yourName}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.name}
        error={state.errors?.name ? messageFor("name", state.errors.name) : undefined}
        autoComplete="name"
      />
      <Field
        id={fieldIds.email}
        name="email"
        type="email"
        label={t.email}
        hint={t.emailHint}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.email}
        error={state.errors?.email ? messageFor("email", state.errors.email) : undefined}
        autoComplete="email"
      />
      <Field
        id={fieldIds.clubName}
        name="clubName"
        label={t.clubName}
        hint={t.clubNameHint}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.clubName}
        error={state.errors?.clubName ? messageFor("clubName", state.errors.clubName) : undefined}
      />
      <Field
        id={fieldIds.description}
        name="description"
        as="textarea"
        label={t.description}
        hint={t.descriptionHint}
        required
        requiredLabel={dict.actions.required}
        defaultValue={values?.description}
        error={
          state.errors?.description
            ? messageFor("description", state.errors.description)
            : undefined
        }
      />
      <Field
        id={fieldIds.members}
        name="members"
        label={t.members}
        hint={t.membersHint}
        optionalLabel={dict.actions.optional}
        defaultValue={values?.members}
      />

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? t.sending : t.send}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {t.sending}
          </span>
        ) : null}
      </div>
    </form>
  );
}
