"use server";

import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { checkRateLimit } from "@/app/api/_lib/guard";
import {
  OFFICER_COOKIE,
  authenticateOfficer,
  createSessionToken,
  isInventoryAuthConfigured,
} from "@/lib/inventory/auth";
import { recordAudit } from "@/lib/inventory/audit";

type OfficerLoginField = "email" | "passcode";

export type OfficerLoginState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: Partial<Record<OfficerLoginField, "required">>;
      values: { email: string };
    }
  | { status: "incorrect" }
  | { status: "not-configured" }
  | { status: "rate-limited" };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * Server action behind the no-JavaScript officer sign-in form. Mirrors
 * `app/api/officer/session/route.ts` (rate limit, honeypot, per-officer auth,
 * same cookie options) but ends in a redirect to the console instead of a
 * JSON response, since a plain form POST has no client fetch to read one.
 */
export async function submitOfficerLogin(
  _prev: OfficerLoginState,
  formData: FormData
): Promise<OfficerLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const passcode = String(formData.get("passcode") ?? "");
  const nickname = String(formData.get("nickname") ?? "");
  const localeInput = String(formData.get("locale") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "/officer/inventory");
  const locale: Locale = isLocale(localeInput) ? localeInput : defaultLocale;

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "officer-login")) {
    return { status: "rate-limited" };
  }

  // Honeypot filled: behave exactly like a failed sign-in, never reveal detection.
  if (nickname) {
    return { status: "incorrect" };
  }

  // Validate fields before the configuration check: "enter your email" is
  // useful feedback in any environment and reveals nothing about the setup.
  if (!email || !passcode) {
    const errors: Partial<Record<OfficerLoginField, "required">> = {};
    if (!email) errors.email = "required";
    if (!passcode) errors.passcode = "required";
    return { status: "invalid", errors, values: { email } };
  }

  if (!isInventoryAuthConfigured()) {
    return { status: "not-configured" };
  }

  const officer = await authenticateOfficer(email, passcode);
  if (!officer) {
    return { status: "incorrect" };
  }

  const token = createSessionToken({ id: officer.id, role: officer.role });
  const cookieStore = await cookies();
  cookieStore.set(OFFICER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  await recordAudit({
    officerId: officer.id,
    action: "officer.login",
    entityType: "officer",
    entityId: officer.id,
    detail: { email: officer.email },
  });

  redirect(localeHref(locale, returnTo));
}
