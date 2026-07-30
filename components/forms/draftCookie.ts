/**
 * Small httpOnly cookie that carries a form journey's partial answers across
 * one-question-per-page steps, so a reader with JavaScript switched off (who
 * cannot hold state in memory) still gets their earlier answers back when
 * they reach later steps, the check-answers step, or a "change" link.
 *
 * Chosen over server-side session storage because this site has no
 * guaranteed database (Postgres is optional elsewhere on the site, e.g. the
 * inventory system degrades without it) and no existing session store for
 * public visitors. Chosen over localStorage/sessionStorage because those are
 * JavaScript-only, and this data must survive with JavaScript off. The
 * cookie is httpOnly (page JavaScript cannot read or exfiltrate it), sameSite
 * lax (sent on the plain-link navigations between steps, not on cross-site
 * requests), secure in production, and holds only what the reader already
 * typed into a previous step of the same journey. Values are base64url-JSON
 * encoded, not encrypted: the payload is never anything more sensitive than
 * the reader's own in-progress answers (name, email, a message draft, a
 * reason for a loan), which they can already see in the browser's own
 * cookie inspector, and the server independently re-validates every field
 * with the shared zod schemas before acting on anything, so a tampered
 * cookie cannot bypass validation, only, at worst, desync the draft shown
 * back to the reader.
 */
import { cookies } from "next/headers";

const THIRTY_MINUTES = 60 * 30;

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Reads and decodes a draft cookie. Safe to call from a Server Component (read-only). Never throws. */
export async function readDraft<T extends Record<string, unknown>>(
  cookieName: string
): Promise<Partial<T>> {
  try {
    const store = await cookies();
    const raw = store.get(cookieName)?.value;
    if (!raw) return {};
    const parsed: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Partial<T>;
    }
    return {};
  } catch {
    return {};
  }
}

/** Writes (replaces) a draft cookie. Must be called from a Server Action or Route Handler. */
export async function writeDraft<T extends Record<string, unknown>>(
  cookieName: string,
  value: Partial<T>
): Promise<void> {
  const store = await cookies();
  const encoded = Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
  store.set(cookieName, encoded, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    path: "/",
    maxAge: THIRTY_MINUTES,
  });
}

/** Merges `patch` into the existing draft and writes it back. Must be called from a Server Action. */
export async function mergeDraft<T extends Record<string, unknown>>(
  cookieName: string,
  patch: Partial<T>
): Promise<Partial<T>> {
  const current = await readDraft<T>(cookieName);
  const next = { ...current, ...patch };
  await writeDraft(cookieName, next);
  return next;
}

/** Clears a draft cookie on journey completion (or abandonment). Must be called from a Server Action. */
export async function clearDraft(cookieName: string): Promise<void> {
  const store = await cookies();
  store.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    path: "/",
    maxAge: 0,
  });
}
