"use client";

import { Analytics } from "@vercel/analytics/next";
import { isUntracked } from "@/lib/analytics-exclusions";

/** Vercel Analytics (cookieless), minus the pages listed in lib/analytics-exclusions.ts. */
export default function SiteAnalytics() {
  return <Analytics beforeSend={(event) => (isUntracked(event.url) ? null : event)} />;
}
