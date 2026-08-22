/**
 * The draft-aware fetch helper (Wave 3A, REDESIGN-2.0 §6.5 step 2, §6.9).
 *
 * Page agents in later waves should call `sanityFetch` instead of
 * `client.fetch` wherever a page might be rendered in draft mode. It
 * resolves the published or draft perspective from Next's `draftMode()`
 * cookie automatically, so an officer previewing a draft in the
 * Presentation tool sees it rendered on the actual page (the real
 * component, the real layout), not a separate preview form that looks
 * different from the site. Everyone else gets the published perspective,
 * served through the CDN.
 *
 * `browserToken` is deliberately omitted (left `false`). `defineLive`
 * accepts one to let `<SanityLive includeDrafts />` open a draft-perspective
 * live connection from the browser, but that would mean shipping this
 * site's Sanity token to client JavaScript, and `sanity/lib/token.ts` is
 * explicit that the token is never sent to the browser under any
 * circumstance. The accepted tradeoff: `<SanityLive />` still live-updates
 * published content for every visitor without a token, but a draft does
 * not push live updates into the browser while an officer is editing it.
 * That does not break preview, because draft mode already renders every
 * request dynamically (no full route cache), so a refresh shows the
 * current draft regardless.
 *
 * Degrades rather than crashes when no token is configured (REDESIGN-2.0
 * §6.9): `readToken()` returns `undefined` and `sanityFetch` simply cannot
 * resolve a draft perspective, which only affects preview, never the
 * published site.
 */
import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { readToken } from "@/sanity/lib/token";

const liveClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

export const { sanityFetch, SanityLive } = defineLive({
  client: liveClient,
  serverToken: readToken(),
  browserToken: false,
});
