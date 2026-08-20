/**
 * The generic draft cookie (REDESIGN-2.0 §5.1 item 2, §9's WCAG 3.3.7 note).
 *
 * Every chassis service gets one draft cookie, scoped to its own id, so a
 * reader's answers survive a refresh, a back link, or closing the tab and
 * coming back within the window, exactly the property
 * `components/forms/draftCookie.ts` already gives the equipment loan wizard.
 * This file is a new, generic version of that same idea rather than a reuse
 * of that module directly: that file is not on this wave's owned path list
 * (BUILD-BRIEF-2.0 §10, "you own a disjoint set of file paths"), and a
 * generic chassis needs one cookie name PER SERVICE, not one per journey
 * hand-written into a constant.
 *
 * httpOnly, so page JavaScript cannot read or exfiltrate it. sameSite lax, so
 * it is sent on the plain-link navigations between question steps (a real
 * `<form action>` POST, per BUILD-BRIEF-2.0 §7, never a client fetch). Not
 * encrypted: the payload is never anything more sensitive than the reader's
 * own in-progress answers, which they can already see in their browser's own
 * cookie inspector, and every answer is re-validated server-side
 * (`lib/services/validate.ts`) before anything acts on it, so a tampered
 * cookie can at worst desync what is shown back to the reader, never bypass
 * validation. This is the same reasoning `components/forms/draftCookie.ts`
 * documents for the loan wizard's cookie, applied to a name that varies by
 * service instead of being hardcoded per journey.
 */
import { cookies } from "next/headers";

import type { AnswerValue } from "@/lib/services/validate";

const THIRTY_MINUTES = 60 * 30;

/** Matches `components/forms/draftCookie.ts`'s own cap: high enough that no real answer is ever truncated, low enough that an unbounded field cannot turn into a `Cookie` header a browser or proxy answers with a 431 instead of a page. */
const MAX_VALUE_CHARS = 6000;

export type ServiceDraft = Record<string, AnswerValue>;

/** `birsa_do_<serviceId>_draft`, so two services in progress on the same device never share a draft, and `/officer` (a different cookie namespace entirely) never collides with either. */
export function draftCookieName(serviceId: string): string {
  return `birsa_do_${serviceId}_draft`;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function capValue(value: AnswerValue): AnswerValue {
  if (Array.isArray(value)) {
    return value.map((v) => (v.length > MAX_VALUE_CHARS ? v.slice(0, MAX_VALUE_CHARS) : v));
  }
  return value.length > MAX_VALUE_CHARS ? value.slice(0, MAX_VALUE_CHARS) : value;
}

function capDraft(draft: ServiceDraft): ServiceDraft {
  const capped: ServiceDraft = {};
  for (const [key, value] of Object.entries(draft)) {
    capped[key] = capValue(value);
  }
  return capped;
}

/** Reads a service's draft. Safe to call from a Server Component (read-only). Never throws: a missing, expired or corrupt cookie is simply an empty draft. */
export async function readServiceDraft(serviceId: string): Promise<ServiceDraft> {
  try {
    const store = await cookies();
    const raw = store.get(draftCookieName(serviceId))?.value;
    if (!raw) return {};
    const parsed: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as ServiceDraft;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeServiceDraft(serviceId: string, draft: ServiceDraft): Promise<void> {
  const store = await cookies();
  const encoded = Buffer.from(JSON.stringify(capDraft(draft)), "utf8").toString("base64url");
  store.set(draftCookieName(serviceId), encoded, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    path: "/",
    maxAge: THIRTY_MINUTES,
  });
}

/** Merges one question's answer into the draft. Must be called from a Server Action (cookie writes are illegal during render). This is the ONLY write path a question step's server action needs: read the current draft is unnecessary first, this does it. */
export async function mergeServiceDraftAnswer(
  serviceId: string,
  questionId: string,
  value: AnswerValue
): Promise<ServiceDraft> {
  const current = await readServiceDraft(serviceId);
  const next = { ...current, [questionId]: value };
  await writeServiceDraft(serviceId, next);
  return next;
}

/** Clears a service's draft on submission or abandonment. Must be called from a Server Action. */
export async function clearServiceDraft(serviceId: string): Promise<void> {
  const store = await cookies();
  store.set(draftCookieName(serviceId), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    path: "/",
    maxAge: 0,
  });
}

const CONFIRMATION_COOKIE_MINUTES = 30;

/**
 * A separate, short-lived cookie carrying only the reference number, written
 * the instant a submission succeeds and read once by the confirmation page.
 * Kept apart from the answer draft (which is cleared at that same moment) so
 * the reference survives long enough to render `ConfirmationPanel`
 * (REDESIGN-2.0 §5.1 item 4) without putting it in the URL: a reference
 * number is not a secret (BUILD-BRIEF-2.0's own line, "a reference number is
 * not a secret but a student ID is"), but a URL is what ends up in server
 * logs, browser history and a `Referer` header, and there is no reason to
 * put it there when a cookie does the same job more quietly.
 */
export async function writeConfirmationCookie(serviceId: string, reference: string): Promise<void> {
  const store = await cookies();
  store.set(`birsa_do_${serviceId}_confirm`, reference, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    path: "/",
    maxAge: 60 * CONFIRMATION_COOKIE_MINUTES,
  });
}

export async function readConfirmationCookie(serviceId: string): Promise<string | null> {
  const store = await cookies();
  return store.get(`birsa_do_${serviceId}_confirm`)?.value || null;
}
