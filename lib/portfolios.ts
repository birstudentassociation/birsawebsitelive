/**
 * The committee portfolios, as a closed vocabulary.
 *
 * FROZEN CONTRACT. Wave 0 owns this file (REDESIGN-2.0 §11.1).
 *
 * Three parts of 2.0 need to name a portfolio and must all name the same set:
 *
 *   - §7.1 grants, which are a portfolio plus a verb (`news:publish`).
 *   - §6.4's Studio structure, which gives each portfolio its own entry so an
 *     officer sees their job rather than a list of document types.
 *   - §10's `owner` field, required on every document, and §5.2's owning
 *     portfolio on every service definition.
 *
 * Written down once because a portfolio spelled three ways is three
 * portfolios, and because §7.2's two-person rule can only be checked against
 * a set the cron can enumerate.
 *
 * A PORTFOLIO IS NOT A PERSON AND NOT A SEAT. `content/committee.ts` holds who
 * currently sits where and turns over every June; this file holds the standing
 * jobs and changes only when BIRSA changes its own structure. Both the officer
 * and the assistant officer for an area hold the same portfolio, which is
 * principle 11 falling out of the structure rather than being remembered: the
 * two-person rule has somewhere to point.
 *
 * The labels are taken from the role titles in `content/committee.ts`, not
 * invented. Where a portfolio covers an officer and an assistant officer, the
 * officer's title is the label.
 */
import type { Locale } from "@/lib/i18n";

export type PortfolioId =
  | "president"
  | "secretariat"
  | "treasury"
  | "spokesperson"
  | "public-relations"
  | "academic-affairs"
  | "general-coordination"
  | "sport"
  | "rights-and-welfare"
  | "student-activities"
  | "foreign-students"
  | "merchandise"
  | "it-infrastructure";

export type Portfolio = {
  id: PortfolioId;
  label: Record<Locale, string>;
  /**
   * The committee role titles, exactly as `content/committee.ts` spells them,
   * that hold this portfolio. The access register (§6.8) joins on these, and
   * the daily cron uses them to raise a portfolio held by fewer than two
   * people (§7.2).
   */
  heldBy: string[];
};

export const portfolios: Portfolio[] = [
  {
    id: "president",
    label: { en: "President", th: "นายกสโมสร" },
    heldBy: ["President"],
  },
  {
    id: "secretariat",
    label: { en: "Secretariat", th: "ฝ่ายเลขานุการ" },
    heldBy: ["Secretary 1", "Secretary 2", "Assistant Officer, Secretariat"],
  },
  {
    id: "treasury",
    label: { en: "Treasurer", th: "เหรัญญิก" },
    heldBy: ["Treasurer"],
  },
  {
    id: "spokesperson",
    label: { en: "Spokesperson", th: "โฆษก" },
    heldBy: ["Spokesperson"],
  },
  {
    id: "public-relations",
    label: { en: "Public Relations", th: "ฝ่ายประชาสัมพันธ์" },
    heldBy: [
      "Vice President and Public Relations Commissioner",
      "Assistant Officer, Public Relations",
    ],
  },
  {
    id: "academic-affairs",
    label: { en: "Academic Affairs", th: "ฝ่ายวิชาการ" },
    heldBy: ["Academic Affairs Officer", "Assistant Officer, Academic Affairs"],
  },
  {
    id: "general-coordination",
    label: { en: "General Coordinator", th: "ฝ่ายประสานกิจการภายในและรังสิต" },
    heldBy: ["General Coordinator"],
  },
  {
    id: "sport",
    label: { en: "Sport", th: "ฝ่ายกีฬา" },
    heldBy: ["Sport Coordinator", "Assistant Officer, Sport Coordination"],
  },
  {
    id: "rights-and-welfare",
    label: { en: "Rights and Student Welfare", th: "ฝ่ายพิทักษ์สิทธิ์และสวัสดิการ" },
    heldBy: [
      "Rights Advocate and Student Welfare Officer",
      "Assistant Officer, Rights Advocacy and Student Welfare",
    ],
  },
  {
    id: "student-activities",
    label: { en: "Student Activities", th: "ฝ่ายกิจกรรมนักศึกษา" },
    heldBy: ["Assistant Officer, Student Activities"],
  },
  {
    id: "foreign-students",
    label: { en: "Foreign Students Assistance", th: "ฝ่ายบริการนักศึกษาต่างชาติ" },
    heldBy: ["Assistant Officer, Foreign Students Assistance"],
  },
  {
    id: "merchandise",
    label: { en: "Merchandise", th: "ฝ่ายการขาย" },
    heldBy: ["Assistant Officer, Merchandise"],
  },
  {
    id: "it-infrastructure",
    label: { en: "IT Infrastructure", th: "ฝ่ายเทคโนโลยีสารสนเทศ" },
    heldBy: ["Assistant Officer, IT Infrastructure"],
  },
];

export const portfolioIds: PortfolioId[] = portfolios.map((p) => p.id);

export function getPortfolio(id: PortfolioId): Portfolio {
  const found = portfolios.find((p) => p.id === id);
  // The type makes this unreachable; the throw is here so a cast at a call
  // site fails loudly rather than rendering `undefined` as a portfolio name.
  if (!found) throw new Error(`Unknown portfolio: ${id}`);
  return found;
}

/**
 * The verbs a grant can carry (§7.1). A grant is a portfolio plus a verb, so
 * the President can give the Treasurer `finance:publish` without giving them
 * `cases:read`. Extending this list is code, deliberately: a new verb is a new
 * access rule (§6.12).
 */
export const grantVerbs = [
  "news:publish",
  "calendar:edit",
  "roster:edit",
  "finance:publish",
  "cases:read",
  "emergency:toggle",
  "service:create",
  "nav:edit",
] as const;

export type GrantVerb = (typeof grantVerbs)[number];

export type Grant = {
  portfolio: PortfolioId;
  verb: GrantVerb;
};
