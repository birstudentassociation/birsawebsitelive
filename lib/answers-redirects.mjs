/**
 * Old Smart Answers URLs and where they moved to.
 *
 * The "Get an answer" section at `/answers` was retired. Three of its checks
 * now live on the page they belong to, and the rest were always a guide in
 * disguise, so they point at that guide. Paths here are locale-less.
 * `next.config.mjs` turns them into permanent (308) redirects that keep the
 * visitor's locale, and `tests/unit/answers-redirects.test.ts` checks every
 * destination exists.
 *
 * Both `/answers/{slug}` and `/answers/{slug}/q` are covered. Next carries the
 * old `?a=` query along; answer ids that no longer exist are dropped by the
 * engine, so a stale link lands on the first question rather than an error.
 */

/** Old `/answers/{slug}` -> new path. */
export const answerRedirects = {
  "activity-approval": "/activity/approval-check",
  "start-a-club-check": "/clubs/start-check",
  "who-to-contact": "/contact/where-to-go",
  "raise-a-problem": "/contact/where-to-go",
  "borrow-equipment": "/services/equipment-loan",
  "academic-rules": "/student-life/studying",
  "internship-check": "/student-life/studying/internship",
  "choose-courses": "/student-life/studying/curriculum",
  "settle-in": "/student-life/first-weeks",
  "money-and-fees": "/student-life/money",
  "health-and-safety": "/student-life/health-and-safety",
  "getting-around": "/student-life/getting-around",
  "rights-and-representation": "/student-life/rules-and-rights",
  // The hub and the audience step have no equivalent; the student life index is the nearest.
  you: "/student-life",
  start: "/student-life",
};

/** Every redirect as a `next.config.mjs` entry, locale-preserving and permanent (308). */
export function answersRedirects() {
  const hub = {
    source: "/:lang/answers",
    destination: "/:lang/student-life",
    permanent: true,
  };
  const topics = Object.entries(answerRedirects).flatMap(([slug, to]) => [
    { source: `/:lang/answers/${slug}`, destination: `/:lang${to}`, permanent: true },
    { source: `/:lang/answers/${slug}/q`, destination: `/:lang${to}`, permanent: true },
  ]);
  return [hub, ...topics];
}
