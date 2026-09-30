/**
 * Old student-life URLs and where they moved to.
 *
 * Guides used to live at `/student-life/{home|international|handbook}/{slug}`
 * and now live at `/student-life/{topic}/{slug}`. Slugs changed when guides
 * were split or merged, so each old URL is listed explicitly; a wildcard
 * cannot express the mapping. Paths here are locale-less. `next.config.mjs`
 * turns them into permanent (308) redirects that keep the visitor's locale,
 * and `tests/unit/content.test.ts` checks every destination is a real guide.
 *
 * Fragments are not sent to the server, so deep links such as
 * `#warning-and-probation` land at the top of the destination guide.
 */

/** Old guide path -> new guide path. */
export const guideRedirects = {
  "/student-life/handbook/about-bir": "/student-life/first-weeks/about-bir",
  "/student-life/handbook/admission-and-fees": "/student-life/before-you-arrive/admission",
  "/student-life/handbook/academic-life": "/student-life/studying/registration",
  "/student-life/handbook/assessment-and-degree": "/student-life/studying/grades-and-graduation",
  "/student-life/handbook/curriculum-and-study-plan": "/student-life/studying/curriculum",
  "/student-life/handbook/internship": "/student-life/studying/internship",
  "/student-life/handbook/academic-activities": "/student-life/studying/exchange",
  "/student-life/home/study-support": "/student-life/studying/libraries-and-study-support",
  "/student-life/home/money-matters": "/student-life/money/student-discounts",
  "/student-life/home/food-and-budgeting": "/student-life/money/monthly-costs",
  "/student-life/home/places-nearby": "/student-life/living-nearby/where-to-eat",
  "/student-life/home/health-and-wellbeing": "/student-life/health-and-safety/getting-medical-help",
  "/student-life/home/safety-and-emergencies": "/student-life/health-and-safety/staying-safe",
  "/student-life/home/rights-and-welfare": "/student-life/rules-and-rights/rights-and-facilities",
  "/student-life/home/getting-involved": "/student-life/getting-involved/clubs-and-events",
  "/student-life/home/getting-around": "/student-life/getting-around/getting-to-campus",
  "/student-life/home/shuttle-bus": "/student-life/getting-around/shuttle-bus",
  "/student-life/home/live-bus-tracker": "/student-life/getting-around/live-bus-tracker",
  "/student-life/international/arrival-and-first-week": "/student-life/first-weeks/first-two-weeks",
  "/student-life/international/visa-and-immigration": "/student-life/rules-and-rights/visa-rules",
  "/student-life/international/banking-and-money": "/student-life/money/bank-account",
  "/student-life/international/phones-and-internet": "/student-life/first-weeks/sim-and-wifi",
  "/student-life/international/healthcare-and-insurance":
    "/student-life/health-and-safety/getting-medical-help",
  "/student-life/international/culture-and-language":
    "/student-life/first-weeks/culture-and-language",
};

/** Old audience index pages -> new pages. */
export const trackRedirects = {
  "/student-life/home": "/student-life",
  "/student-life/international": "/student-life/getting-started/international",
  "/student-life/handbook": "/student-life/studying",
};

/** Every redirect as a `next.config.mjs` entry, locale-preserving and permanent (308). */
export function studentLifeRedirects() {
  return Object.entries({ ...guideRedirects, ...trackRedirects }).map(([from, to]) => ({
    source: `/:lang${from}`,
    destination: `/:lang${to}`,
    permanent: true,
  }));
}
