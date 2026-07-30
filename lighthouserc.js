/**
 * Frontend performance budget, enforced by `npm run perf` (Lighthouse CI)
 * and the `.github/workflows/perf.yml` pull request check.
 *
 * Source: GOV.UK "how to test frontend performance" -- set a budget early,
 * then follow it. The numbers below are deliberately tight rather than
 * generous, because this site has no excuse to be slow: it is static,
 * largely-text, CDN-cached HTML with self-hosted fonts and no client-side
 * framework beyond React itself.
 *
 * - largest-contentful-paint < 2000ms: Core Web Vitals treats 2500ms as the
 *   "good" ceiling for LCP. Halving that headroom to 2000ms is reasonable
 *   for a site with no hero images or client-side data fetching to wait on,
 *   so the number should catch a real regression rather than be a target
 *   that's comfortable to graze.
 * - cumulative-layout-shift < 0.05: the Core Web Vitals "good" threshold is
 *   0.1. This site sets explicit image dimensions and has no late-loading
 *   fonts, ads or embeds that would justify using that full allowance, so
 *   0.05 catches shift regressions (for example an unsized image slipping
 *   in) much earlier than the standard threshold would.
 * - total-byte-weight < 400KB: a text-and-markup site with a handful of
 *   self-hosted font files and no analytics-heavy client bundle should
 *   comfortably clear this per-page transfer budget. A page that exceeds it
 *   is a sign an image or font is unoptimised or duplicated.
 * - resource-summary:script:size < 150KB: React and Next.js's own runtime
 *   plus this site's client components (theme toggle, search, small
 *   interactive widgets) is the entire client-side script budget. There is
 *   no analytics SDK, ad tech, or heavy client framework to account for.
 * - categories:performance >= 0.9: a 90+ Lighthouse performance score is the
 *   standard "good" bar and should be the norm, not the exception, for a
 *   site this simple.
 * - categories:accessibility = 1.0 (no error budget): GOV.UK services are
 *   held to WCAG 2.2 AA, and this site's audience includes students who
 *   rely on assistive technology, so accessibility regressions are treated
 *   as build failures rather than warnings.
 */
module.exports = {
  ci: {
    collect: {
      // English and Thai homepages: both are representative of the site's
      // typical page weight (nav, footer, self-hosted fonts) without being
      // the heaviest page on the site, so they act as an early-warning
      // canary rather than a worst-case check.
      url: ["http://localhost:3000/en", "http://localhost:3000/th"],
      numberOfRuns: 3,
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 30000,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-byte-weight": ["error", { maxNumericValue: 409600 }],
        "resource-summary:script:size": ["error", { maxNumericValue: 153600 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
