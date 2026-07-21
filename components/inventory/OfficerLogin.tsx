"use client";

/**
 * Email + passcode sign-in for the inventory management console. Each
 * officer has their own account rather than a shared passcode.
 *
 * Progressive-enhancement wrapper, mirroring `StatusLookup.tsx`: without
 * JavaScript (and before hydration) it renders a fallback that posts to a
 * server action and redirects to the console on success, a real HTML form
 * with no client fetch. Once JS loads it swaps to the interactive tool,
 * which calls `/api/officer/session` and uses `router.refresh()` so the
 * parent server component re-reads the now-set session cookie and swaps in
 * the console content, without a full page navigation.
 */
import { useActionState, useEffect, useId, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import type { Locale } from "@/lib/i18n";
import { submitOfficerLogin, type OfficerLoginState } from "@/app/[lang]/officer/inventory/actions";

export type OfficerLoginProps = {
  locale: Locale;
};

type Copy = {
  intro: string;
  emailLabel: string;
  passcodeLabel: string;
  required: string;
  errorSummaryTitle: string;
  errorRequired: string;
  errorIncorrect: string;
  errorNetwork: string;
  notConfiguredTitle: string;
  notConfiguredBody: string;
  rateLimitedTitle: string;
  rateLimitedBody: string;
  signIn: string;
  signingIn: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    intro: "Sign in with your officer email and passcode to open the inventory console.",
    emailLabel: "Email",
    passcodeLabel: "Passcode",
    required: "required",
    errorSummaryTitle: "There is a problem",
    errorRequired: "Enter your email and passcode",
    errorIncorrect: "Incorrect email or passcode",
    errorNetwork: "Something went wrong. Try again.",
    notConfiguredTitle: "Officer accounts are not set up yet",
    notConfiguredBody: "This console has not been configured, so nobody can sign in yet.",
    rateLimitedTitle: "Too many attempts",
    rateLimitedBody: "Wait a moment and try again.",
    signIn: "Sign in",
    signingIn: "Signing in...",
  },
  th: {
    intro: "เข้าสู่ระบบด้วยอีเมลและรหัสผ่านของเจ้าหน้าที่เพื่อเปิดคอนโซลจัดการครุภัณฑ์",
    emailLabel: "อีเมล",
    passcodeLabel: "รหัสผ่าน",
    required: "จำเป็น",
    errorSummaryTitle: "พบข้อผิดพลาด กรุณาตรวจสอบ",
    errorRequired: "กรุณากรอกอีเมลและรหัสผ่าน",
    errorIncorrect: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    errorNetwork: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    notConfiguredTitle: "ยังไม่ได้ตั้งค่าบัญชีเจ้าหน้าที่",
    notConfiguredBody: "ยังไม่ได้ตั้งค่าคอนโซลนี้ จึงยังไม่มีใครเข้าสู่ระบบได้",
    rateLimitedTitle: "ลองใหม่บ่อยเกินไป",
    rateLimitedBody: "กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
    signIn: "เข้าสู่ระบบ",
    signingIn: "กำลังเข้าสู่ระบบ...",
  },
};

type SessionResponse = {
  ok: boolean;
  reason?: string;
};

/**
 * Progressive-enhancement wrapper. Without JavaScript (and before hydration)
 * it renders a fallback that posts to a server action; once JS loads it
 * swaps to the interactive fetch-based tool.
 */
export default function OfficerLogin(props: OfficerLoginProps) {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);

  if (!enhanced) return <OfficerLoginFallback {...props} />;
  return <InteractiveOfficerLogin {...props} />;
}

function InteractiveOfficerLogin({ locale }: OfficerLoginProps) {
  const t = copy[locale];
  const router = useRouter();
  const formId = useId();
  const emailId = `${formId}-email`;
  const passcodeId = `${formId}-passcode`;

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [nickname, setNickname] = useState("");
  // Tracks *why* the form is in error so we can point aria-invalid /
  // inline messages at whichever field(s) are actually responsible,
  // instead of always blaming the email field (WCAG 3.3.1 Error
  // Identification).
  const [errorKind, setErrorKind] = useState<"required" | "incorrect" | "network" | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !passcode) {
      setErrorKind("required");
      return;
    }

    setErrorKind(null);
    setNotConfigured(false);
    setPending(true);

    try {
      const response = await fetch("/api/officer/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passcode, nickname }),
      });
      const body = (await response.json().catch(() => null)) as SessionResponse | null;

      if (response.ok && body?.ok) {
        setPasscode("");
        router.refresh();
        return;
      }

      if (body?.reason === "not-configured") {
        setNotConfigured(true);
        return;
      }

      setErrorKind("incorrect");
    } catch {
      setErrorKind("network");
    } finally {
      setPending(false);
    }
  }

  const error =
    errorKind === "required"
      ? t.errorRequired
      : errorKind === "incorrect"
        ? t.errorIncorrect
        : errorKind === "network"
          ? t.errorNetwork
          : null;
  // "required" only implicates whichever field is actually empty; an
  // incorrect-credentials response is deliberately ambiguous about which
  // field was wrong, so both are flagged; a network error isn't a field
  // problem at all.
  const emailInvalid = errorKind === "required" ? !email : errorKind === "incorrect";
  const passcodeInvalid = errorKind === "required" ? !passcode : errorKind === "incorrect";

  const errorItems: ErrorSummaryItem[] = error ? [{ id: emailId, message: error }] : [];

  return (
    <div className="max-w-md" aria-live="polite">
      {notConfigured ? (
        <Notice variant="warning" title={t.notConfiguredTitle} className="mb-6">
          {t.notConfiguredBody}
        </Notice>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <ErrorSummary title={t.errorSummaryTitle} errors={errorItems} />

        <p className="text-muted text-sm">{t.intro}</p>

        <Field
          id={emailId}
          name="email"
          type="email"
          label={t.emailLabel}
          required
          requiredLabel={t.required}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailInvalid ? (error ?? undefined) : undefined}
          autoComplete="username"
        />

        <Field
          id={passcodeId}
          name="passcode"
          type="password"
          label={t.passcodeLabel}
          required
          requiredLabel={t.required}
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
          error={passcodeInvalid ? (error ?? undefined) : undefined}
          autoComplete="current-password"
        />

        {/* Honeypot: real visitors never see or fill this. Visually hidden,
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

        <div>
          <Button type="submit" disabled={pending}>
            {pending ? t.signingIn : t.signIn}
          </Button>
          {pending ? (
            <span role="status" className="sr-only">
              {t.signingIn}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}

/**
 * No-JavaScript fallback: sign-in posts to a server action, which sets the
 * session cookie and redirects to the console on success. Errors re-render
 * this form server-side with a typed state instead of a client fetch.
 */
function OfficerLoginFallback({ locale }: OfficerLoginProps) {
  const t = copy[locale];
  const formId = useId();
  const emailId = `${formId}-email`;
  const passcodeId = `${formId}-passcode`;
  const [state, formAction, isPending] = useActionState<OfficerLoginState, FormData>(
    submitOfficerLogin,
    { status: "idle" }
  );

  const values = state.status === "invalid" ? state.values : undefined;
  const errors = state.status === "invalid" ? state.errors : undefined;

  const emailInvalid = Boolean(errors?.email) || state.status === "incorrect";
  const passcodeInvalid = Boolean(errors?.passcode) || state.status === "incorrect";

  const error =
    state.status === "invalid"
      ? t.errorRequired
      : state.status === "incorrect"
        ? t.errorIncorrect
        : null;

  const errorItems: ErrorSummaryItem[] = error ? [{ id: emailId, message: error }] : [];

  return (
    <div className="max-w-md" aria-live="polite">
      {state.status === "not-configured" ? (
        <Notice variant="warning" title={t.notConfiguredTitle} className="mb-6">
          {t.notConfiguredBody}
        </Notice>
      ) : null}
      {state.status === "rate-limited" ? (
        <Notice variant="warning" title={t.rateLimitedTitle} className="mb-6">
          {t.rateLimitedBody}
        </Notice>
      ) : null}

      <form action={formAction} noValidate className="flex flex-col gap-5">
        <ErrorSummary title={t.errorSummaryTitle} errors={errorItems} />

        <p className="text-muted text-sm">{t.intro}</p>

        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="returnTo" value="/officer/inventory" />

        <Field
          id={emailId}
          name="email"
          type="email"
          label={t.emailLabel}
          required
          requiredLabel={t.required}
          defaultValue={values?.email}
          error={emailInvalid ? (error ?? undefined) : undefined}
          autoComplete="username"
        />

        <Field
          id={passcodeId}
          name="passcode"
          type="password"
          label={t.passcodeLabel}
          required
          requiredLabel={t.required}
          error={passcodeInvalid ? (error ?? undefined) : undefined}
          autoComplete="current-password"
        />

        {/* Honeypot: real visitors never see or fill this. */}
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

        <div>
          <Button type="submit" disabled={isPending}>
            {isPending ? t.signingIn : t.signIn}
          </Button>
        </div>
      </form>
    </div>
  );
}
