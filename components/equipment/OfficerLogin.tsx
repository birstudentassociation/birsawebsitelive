"use client";

/**
 * Passcode entry screen for the equipment-loan officer dashboard. Not a
 * proper account system: officers share one passcode (`OFFICER_PASSCODE`)
 * and a correct submission sets an httpOnly session cookie, after which the
 * server component that renders this page re-checks the cookie and swaps in
 * the request queue.
 */
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Button from "@/components/Button";
import type { Locale } from "@/lib/i18n";

export type OfficerLoginProps = {
  locale: Locale;
};

type Copy = {
  intro: string;
  passcodeLabel: string;
  required: string;
  errorSummaryTitle: string;
  errorRequired: string;
  errorIncorrect: string;
  errorNetwork: string;
  signIn: string;
  signingIn: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    intro: "Enter the officer passcode to view and manage equipment loan requests.",
    passcodeLabel: "Passcode",
    required: "required",
    errorSummaryTitle: "There is a problem",
    errorRequired: "Enter the passcode",
    errorIncorrect: "Incorrect passcode. Please try again.",
    errorNetwork: "Something went wrong. Please try again.",
    signIn: "Sign in",
    signingIn: "Signing in...",
  },
  th: {
    intro: "กรอกรหัสผ่านเจ้าหน้าที่เพื่อดูและจัดการคำขอยืมอุปกรณ์",
    passcodeLabel: "รหัสผ่าน",
    required: "จำเป็น",
    errorSummaryTitle: "พบข้อผิดพลาด กรุณาตรวจสอบ",
    errorRequired: "กรุณากรอกรหัสผ่าน",
    errorIncorrect: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
    errorNetwork: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    signIn: "เข้าสู่ระบบ",
    signingIn: "กำลังเข้าสู่ระบบ...",
  },
};

/**
 * Client-side passcode form. On success it calls `router.refresh()` so the
 * parent server component re-reads the now-set cookie and renders the
 * request queue in place, without a full page navigation.
 */
export default function OfficerLogin({ locale }: OfficerLoginProps) {
  const t = copy[locale];
  const router = useRouter();
  const formId = useId();
  const passcodeId = `${formId}-passcode`;

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!passcode) {
      setError(t.errorRequired);
      return;
    }

    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/equipment-loan/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const body = (await response.json().catch(() => null)) as { ok?: boolean } | null;

      if (response.ok && body?.ok) {
        setPasscode("");
        router.refresh();
        return;
      }

      setError(t.errorIncorrect);
    } catch {
      setError(t.errorNetwork);
    } finally {
      setPending(false);
    }
  }

  const errorItems: ErrorSummaryItem[] = error ? [{ id: passcodeId, message: error }] : [];

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <ErrorSummary title={t.errorSummaryTitle} errors={errorItems} />

        <p className="text-muted text-sm">{t.intro}</p>

        <Field
          id={passcodeId}
          name="passcode"
          type="password"
          label={t.passcodeLabel}
          required
          requiredLabel={t.required}
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
          error={error ?? undefined}
          autoComplete="current-password"
        />

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
