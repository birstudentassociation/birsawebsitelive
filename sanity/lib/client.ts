/**
 * The public read client (Wave 3A, REDESIGN-2.0 §6.5, §6.9).
 *
 * Published content only: `perspective: "published"` and no token, so this
 * client cannot see a draft even by mistake. CDN on, which gives every read
 * a second layer of resilience against a Sanity outage on top of whatever
 * caching the calling page applies (`useCdn: true` serves from Sanity's
 * global edge cache rather than the origin API).
 *
 * Configured entirely from `sanity/env.ts`, which mirrors
 * `sanity/projectConfig.ts`. Nothing here is a literal: this file exists so
 * `tests/unit/sanity-wiring.test.ts` can assert the project id appears
 * nowhere in the repository except `projectConfig.ts` itself.
 *
 * Page agents in later waves that need draft awareness (an officer
 * previewing an unpublished edit) should use `sanityFetch` from
 * `sanity/lib/live.ts` instead of this client directly. Use this client for
 * reads that are always published only, such as `generateStaticParams`.
 */
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
