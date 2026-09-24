/**
 * Pages analytics must never record. On welfare, safety and complaint pages,
 * being observed is the reason someone does not report
 * (`docs/CAPABILITY-ROADMAP.md` section 6), and GOV.UK guidance is to collect
 * no more than you need. Paths are matched after the locale segment, as a
 * prefix, so every step of a journey is covered.
 */
export const UNTRACKED_PATHS = [
  "/contact",
  "/privacy/your-data",
  "/emergency",
  "/student-life/home/rights-and-welfare",
  "/student-life/home/health-and-wellbeing",
  "/student-life/home/safety-and-emergencies",
  "/answers/health-and-safety",
  "/answers/rights-and-representation",
  "/news/covert-photography-warning-tha-prachan",
  "/staying-safe-online",
] as const;

export function isUntracked(url: string): boolean {
  let pathname: string;
  try {
    pathname = new URL(url, "https://example.invalid").pathname;
  } catch {
    return true;
  }
  const rest = pathname.replace(/^\/(th|en)(?=\/|$)/, "") || "/";
  return UNTRACKED_PATHS.some((path) => rest === path || rest.startsWith(`${path}/`));
}
