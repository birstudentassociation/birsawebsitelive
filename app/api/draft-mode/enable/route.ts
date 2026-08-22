/**
 * Turns draft mode on (Wave 3A, REDESIGN-2.0 §6.5 step 2). The Presentation
 * tool inside the Studio calls this route when an officer opens preview; it
 * is never a link an officer clicks directly.
 *
 * AUTHORISATION. `defineEnableDraftMode` (from `next-sanity/draft-mode`)
 * requires a `sanity-preview-secret` query parameter and validates it
 * against a `sanity.previewUrlSecret` document in the dataset, using
 * `@sanity/preview-url-secret`'s `validatePreviewUrl`. That secret document
 * can only be created by a request authenticated with a Sanity token, which
 * only the Presentation tool inside a real Studio session can do (a
 * visitor with no Studio access has no way to obtain a valid secret, and
 * `sanity-preview-secret` is not guessable). A request with a missing or
 * invalid secret gets a 401 and draft mode is never enabled: an
 * unauthenticated visitor cannot read unpublished content by visiting this
 * URL, which is exactly what this route must guarantee.
 *
 * This is Sanity's own, already-reviewed mechanism for this exact problem
 * rather than a bespoke check written for this route, which is deliberate:
 * "verify a request is authorised before turning on access to unpublished
 * content" is precisely the kind of security logic that should not be
 * reinvented per project.
 *
 * DEGRADE, DO NOT CRASH (§6.9), AND THE GUARD BELOW EXISTS BECAUSE OF IT.
 * `client.withConfig({ token })` is built with `requireTokenOrDegrade()`,
 * which throws in development when `SANITY_API_READ_TOKEN` is missing (a
 * local setup mistake worth stopping on) but returns `undefined` in
 * production, so this module keeps loading with no token. Without the
 * `isPreviewConfigured()` check below, an actual request to this route
 * with no token configured does NOT reach a clean 401. `@sanity/preview-
 * url-secret`'s `validatePreviewUrl` builds a Sanity client and throws a
 * raw `TypeError` ("client must have a token specified") the moment it
 * sees no token on the client, before it ever inspects the request's
 * secret, and that throw is not caught anywhere inside
 * `defineEnableDraftMode`. Confirmed by calling the built `GET` directly,
 * offline, with an unconfigured client (`tests/unit/sanity-wiring.test.ts`
 * reproduces it): the request throws rather than 401s. Next.js turns an
 * uncaught route handler throw into a 500 for that one request, so this
 * was never able to take the rest of the site down, but a 500 with a
 * server stack trace is not "reports itself as not configured", so the
 * explicit check restores the behaviour the rest of this file's comments
 * already promised. With a token configured, `isPreviewConfigured()` is
 * true and this route behaves exactly as the rest of this comment
 * describes, unchanged.
 */
import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { isPreviewConfigured, requireTokenOrDegrade } from "@/sanity/lib/token";

const { GET: enableDraftMode } = defineEnableDraftMode({
  client: client.withConfig({ token: requireTokenOrDegrade() }),
});

export async function GET(request: Request) {
  if (!isPreviewConfigured()) {
    return new Response("Preview is not configured", { status: 401 });
  }
  return enableDraftMode(request);
}
