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
 * DEGRADE, DO NOT CRASH (§6.9). `client.withConfig({ token })` is built
 * with `requireTokenOrDegrade()`, which throws in development when
 * `SANITY_API_READ_TOKEN` is missing (a local setup mistake worth stopping
 * on) but returns `undefined` in production. Without a token,
 * `validatePreviewUrl` cannot read the secret document and every request
 * here 401s; preview is simply unavailable, and the public site, which
 * never imports this route, is entirely unaffected.
 */
import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { requireTokenOrDegrade } from "@/sanity/lib/token";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: requireTokenOrDegrade() }),
});
