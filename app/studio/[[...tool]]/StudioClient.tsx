"use client";

/**
 * The Studio, mounted client side.
 *
 * WHY THIS FILE EXISTS AT ALL. `page.tsx` used to render `NextStudio` from
 * `next-sanity/studio` directly, which is the documented route and reads
 * better: a server component that preloads Sanity's bridge script and mounts
 * the Studio lazily, with no `"use client"` anywhere.
 *
 * It does not build. Next 16 builds with Turbopack by default, and
 * `next-sanity/studio`'s lazy chain resolves
 * `next-sanity/studio/client-component` expecting a default export from a
 * module that only has a named one, so `next build` fails with "Export
 * default doesn't exist in target module". Nothing in this repository is
 * wrong: typecheck, lint and the whole test suite pass against the previous
 * version, which is precisely why the wave boundary runs an actual build
 * rather than trusting green tests.
 *
 * So the Studio is mounted from the client component entry point directly,
 * skipping the lazy wrapper that Turbopack cannot resolve. The cost is this
 * file and a `"use client"` boundary. `page.tsx` stays a server component so
 * it can still export `metadata` and `viewport`, which a client component
 * may not do, and which carry the `robots: noindex` that keeps `/studio` out
 * of search results.
 *
 * If a later version of next-sanity fixes the resolution, this file can go
 * and `page.tsx` can import `NextStudio` from `next-sanity/studio` again.
 * Check with a real `next build`, not with the test suite.
 */
import { NextStudio } from "next-sanity/studio/client-component";

import config from "@/sanity.config";

export default function StudioClient() {
  return <NextStudio config={config} />;
}
