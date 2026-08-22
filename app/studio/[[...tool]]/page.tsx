/**
 * The embedded Studio (Wave 3A, REDESIGN-2.0 §6.4). Mounted at `/studio`,
 * deliberately outside `app/[lang]`: the Studio is not a bilingual public
 * page and a locale segment would give it a language it has no use for.
 * `/officer` links here rather than to a separately deployed Studio, so
 * officers have one origin and one place to go.
 *
 * `[[...tool]]` is the catch-all Sanity's own routing needs: the Studio is
 * a client-side single page app and handles every path under `/studio`
 * itself (the structure tool, individual documents, the Presentation tool,
 * Vision), so this one route handler covers all of them.
 *
 * `NextStudio` (imported from `next-sanity/studio`, not the raw
 * `next-sanity/studio/client-component`) is a server component that
 * preloads Sanity's bridge script and lazily mounts the actual Studio
 * client-side; this file does not need `"use client"` itself.
 *
 * `viewport` and `metadata` are re-exported as-is: `next-sanity/studio`'s
 * defaults set `robots: noindex`, which matters because nothing about
 * `/studio` should turn up in search results, and the officer's job is
 * signing in, not being found by a search engine.
 */
import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
