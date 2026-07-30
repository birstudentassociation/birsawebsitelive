"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { startClubSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { renderStartClub } from "@/lib/email/templates";
import { localeHref, type Locale } from "@/lib/i18n";
import { readDraft, mergeDraft, clearDraft } from "@/components/forms/draftCookie";
import { buildStartClubWizardLabels } from "@/components/forms/startClubWizardCopy";
import { START_CLUB_STEPS, type StartClubStep } from "./steps";

const COOKIE = "birsa_start_club_draft";

/** Partial answers carried across the start-a-club journey's steps in the draft cookie. */
export type StartClubDraft = {
  clubName?: string;
  members?: string;
  description?: string;
  name?: string;
  email?: string;
};

const NEXT_STEP: Record<Exclude<StartClubStep, "check">, StartClubStep> = {
  clubName: "members",
  members: "description",
  description: "name",
  name: "email",
  email: "check",
};

export type StepState = { status: "idle" | "invalid"; error?: string };

export type CheckState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "fallback"; draft: StartClubDraft }
  | { status: "error" };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * URL for a given step. The first step deliberately lives at the journey's
 * own root (`/clubs/start`) rather than at `/clubs/start/clubName`, so the
 * reader is asked the first question straight away instead of landing on a
 * page whose only purpose is a "start" button. Every step therefore has
 * exactly one URL, which is what the check-answers "change" links already
 * point at.
 */
function stepHref(locale: Locale, step: StartClubStep): string {
  const first = START_CLUB_STEPS[0];
  return localeHref(locale, step === first ? "/clubs/start" : `/clubs/start/${step}`);
}

function destinationHref(
  locale: Locale,
  step: Exclude<StartClubStep, "check">,
  returnTo?: string
): string {
  const target = returnTo === "check" ? "check" : NEXT_STEP[step];
  return stepHref(locale, target);
}

export async function getStartClubDraft(): Promise<StartClubDraft> {
  return readDraft<StartClubDraft>(COOKIE);
}

export async function submitClubNameStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const labels = buildStartClubWizardLabels(locale);
  const value = String(formData.get("clubName") ?? "");
  const result = startClubSchema.shape.clubName.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: labels.errors.clubNameRequired };
  }
  await mergeDraft<StartClubDraft>(COOKIE, { clubName: result.data });
  redirect(destinationHref(locale, "clubName", returnTo));
}

export async function submitMembersStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const value = String(formData.get("members") ?? "");
  const result = startClubSchema.shape.members.safeParse(value || undefined);
  if (!result.success) {
    // members has no localized error copy: it's optional, so this only
    // trips on the max-length bound, which the input itself doesn't allow
    // a reader to exceed by typing normally.
    return { status: "invalid", error: undefined };
  }
  await mergeDraft<StartClubDraft>(COOKIE, { members: result.data ?? "" });
  redirect(destinationHref(locale, "members", returnTo));
}

export async function submitDescriptionStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const labels = buildStartClubWizardLabels(locale);
  const value = String(formData.get("description") ?? "");
  const result = startClubSchema.shape.description.safeParse(value);
  if (!result.success) {
    const tooShort = value.trim().length > 0;
    return {
      status: "invalid",
      error: tooShort ? labels.errors.descriptionShort : labels.errors.descriptionRequired,
    };
  }
  await mergeDraft<StartClubDraft>(COOKIE, { description: result.data });
  redirect(destinationHref(locale, "description", returnTo));
}

export async function submitStartClubNameStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const labels = buildStartClubWizardLabels(locale);
  const value = String(formData.get("name") ?? "");
  const result = startClubSchema.shape.name.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: labels.errors.nameRequired };
  }
  await mergeDraft<StartClubDraft>(COOKIE, { name: result.data });
  redirect(destinationHref(locale, "name", returnTo));
}

export async function submitStartClubEmailStep(
  locale: Locale,
  returnTo: string | undefined,
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const labels = buildStartClubWizardLabels(locale);
  const value = String(formData.get("email") ?? "");
  const result = startClubSchema.shape.email.safeParse(value);
  if (!result.success) {
    return {
      status: "invalid",
      error: value.length === 0 ? labels.errors.emailRequired : labels.errors.emailInvalid,
    };
  }
  await mergeDraft<StartClubDraft>(COOKIE, { email: result.data });
  redirect(destinationHref(locale, "email", returnTo));
}

const FIELD_TO_STEP: Record<string, StartClubStep> = {
  clubName: "clubName",
  members: "members",
  description: "description",
  name: "name",
  email: "email",
};

export async function submitStartClubCheck(
  locale: Locale,
  _prev: CheckState,
  formData: FormData
): Promise<CheckState> {
  const draft = await readDraft<StartClubDraft>(COOKIE);
  const nickname = String(formData.get("nickname") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "start-club")) {
    return { status: "error" };
  }

  // Honeypot filled: silently accept and discard, never reveal detection.
  if (nickname) {
    await clearDraft(COOKIE);
    return { status: "success" };
  }

  const result = startClubSchema.safeParse({
    name: draft.name ?? "",
    email: draft.email ?? "",
    clubName: draft.clubName ?? "",
    description: draft.description ?? "",
    members: draft.members || undefined,
    nickname,
  });

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const path = firstIssue?.path[0];
    const step = typeof path === "string" ? FIELD_TO_STEP[path] : undefined;
    redirect(`${stepHref(locale, step ?? "clubName")}?returnTo=check`);
  }

  const { name, email, clubName, description, members } = result.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "fallback", draft };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
    const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

    const rendered = renderStartClub({ name, email, clubName, description, members });

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
    return { status: "error" };
  }
}
