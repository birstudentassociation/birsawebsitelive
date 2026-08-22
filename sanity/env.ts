/**
 * Environment plumbing for the embedded Studio and the server side Sanity
 * clients (Wave 3A, REDESIGN-2.0 §6.4, §6.5).
 *
 * The project id, dataset and API version are NOT environment variables.
 * They live in `sanity/projectConfig.ts` as literals, because
 * `projectConfig.ts` explains they are not secret. This file re-exports
 * them under the names the rest of `sanity/` imports, so every consumer
 * goes through one file, and adds the one thing that genuinely is
 * environment specific: the Studio's own mount path.
 *
 * The secret value, the API token, is NOT here. It lives in
 * `sanity/lib/token.ts`, which is never imported by anything that reaches
 * the browser. Keeping the token out of this file matters because
 * `sanity.config.ts` imports `env.ts` and `sanity.config.ts` is bundled
 * into the Studio's client JavaScript.
 */
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "@/sanity/projectConfig";

export const projectId = SANITY_PROJECT_ID;
export const dataset = SANITY_DATASET;
export const apiVersion = SANITY_API_VERSION;

/**
 * Where the embedded Studio is mounted (`app/studio/[[...tool]]/page.tsx`).
 * Deliberately outside `/[lang]`: the Studio is not a bilingual public page
 * and a locale segment would give it a language it has no use for.
 */
export const studioBasePath = "/studio";
