/**
 * The Sanity API read token (Wave 3A, REDESIGN-2.0 §6.5, §6.9).
 *
 * Used for anything that must see unpublished content: draft mode preview
 * (`app/api/draft-mode/enable/route.ts`) and the draft-aware fetch helper
 * (`sanity/lib/live.ts`). NEVER hardcoded, and NEVER imported by a client
 * component. Every caller of this module is server only code, and
 * `tests/unit/sanity-wiring.test.ts` asserts that nothing under
 * `components/`, `app/**\/page.tsx` or any file marked `"use client"`
 * imports it.
 *
 * `SANITY_API_READ_TOKEN` is the name next-sanity's own examples use for
 * this token, kept here rather than invented, so a developer who has seen
 * a Sanity starter recognises it immediately.
 */
import { projectId } from "@/sanity/env";

const TOKEN_ENV_VAR = "SANITY_API_READ_TOKEN";

/** Reads the token straight from the environment. `undefined` when unset. */
export function readToken(): string | undefined {
  return process.env[TOKEN_ENV_VAR];
}

/**
 * Whether preview (draft mode, the live/draft fetch helper) can work at
 * all. The same "is this configured" shape as
 * `lib/inventory/auth.ts`'s `isInventoryAuthConfigured`, so a caller can
 * ask before depending on the token rather than discovering its absence
 * from a thrown error.
 */
export function isPreviewConfigured(): boolean {
  return Boolean(readToken());
}

/**
 * Reads the token for a code path that cannot do its job without one.
 *
 * In development, a missing token is a setup mistake worth stopping on, so
 * this throws with a message that says what to do. In production it
 * degrades instead: it returns `undefined` and lets the caller treat
 * preview as not configured, the same "report itself as not configured
 * rather than crashing" convention REDESIGN-2.0 §6.9 sets for the whole
 * site, and the same shape `lib/inventory/notifications.ts` uses for a
 * missing `RESEND_API_KEY` (return null, skip the feature, never throw out
 * of the module).
 *
 * `NODE_ENV === "development"` only, deliberately: the test suite runs
 * with `NODE_ENV === "test"` and must not trip this throw when no token is
 * configured in the checkout running it.
 */
export function requireTokenOrDegrade(): string | undefined {
  const token = readToken();
  if (token) {
    return token;
  }
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      `${TOKEN_ENV_VAR} is not set. Draft mode preview needs it to read unpublished content from Sanity. Add it to .env.local with a token that has at least Viewer access to the ${projectId} project.`
    );
  }
  return undefined;
}
