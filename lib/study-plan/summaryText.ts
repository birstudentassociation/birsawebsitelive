/**
 * A plan as plain text, for the "Ask Academic Affairs about this plan" route.
 *
 * The officer who answers reads an email, not the plan screen, so the summary
 * says what the plan screen would: the curriculum and minor, the courses in
 * each planned term with their credits, and what the service found, worst
 * first. It leaves out the cohort, the student's name and the courses they
 * have passed, none of which the question needs. The student reads and edits
 * this text before sending it (see the contact form's check step), so it is
 * written to be read by a person, not parsed.
 *
 * The text rides in the contact journey's draft cookie, which a browser
 * silently drops past about 4 KB, so it is held to `PLAN_SUMMARY_LIMIT`
 * characters. Courses are never dropped to fit; findings are, least serious
 * last, with a line saying how many are on the plan screen instead.
 */
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import type { Locale } from "@/lib/i18n";
import { checkPlan, type Finding, type FindingSources } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { plannedTermsForPrint } from "@/lib/study-plan/print";

/** The longest summary this module will produce, in characters. */
export const PLAN_SUMMARY_LIMIT = 1800;

export type PlanSummaryLabels = {
  heading: string;
  curriculum: string;
  minor: string;
  coursesHeading: string;
  noCourses: string;
  /** Contains "{n}". */
  creditsTemplate: string;
  /** Contains "{n}". */
  freeElectiveTemplate: string;
  findingsHeading: string;
  noFindings: string;
  severity: Record<Finding["severity"], string>;
  /** Contains "{n}". Says how many findings were left out to keep the summary short. */
  moreFindingsTemplate: string;
  /** Said when even the courses did not fit and the end was cut. */
  truncated: string;
  /** Year and term names, the same ones the plan screen uses. */
  terms: { yearTemplate: string; semester1: string; semester2: string; summer: string };
};

const SEVERITY_ORDER: Record<Finding["severity"], number> = { problem: 0, warning: 1, note: 2 };

function termText(labels: PlanSummaryLabels, term: TermRef): string {
  return `${labels.terms.yearTemplate.replace("{n}", String(term.year))}, ${labels.terms[term.kind]}`;
}

/** The summary of `plan`, in `locale`, at most `limit` characters. */
export function planSummaryText(
  plan: StudyPlan,
  locale: Locale,
  labels: PlanSummaryLabels,
  limit: number = PLAN_SUMMARY_LIMIT,
  sources?: FindingSources
): string {
  const version = CURRICULUM_VERSIONS[plan.versionId];
  const minor = version.minors.find((m) => m.id === plan.minorId)?.name[locale] ?? "";

  const lines: string[] = [
    labels.heading,
    "",
    `${labels.curriculum}: ${version.label[locale]}`,
    `${labels.minor}: ${minor}`,
    "",
    labels.coursesHeading,
  ];

  const planned = plannedTermsForPrint(version, plan.terms);
  if (planned.length === 0) {
    lines.push(labels.noCourses);
  }
  for (const entry of planned) {
    const credits =
      entry.courses.reduce((n, course) => n + course.credits, 0) + entry.freeElectiveCredits;
    const parts = entry.courses.map((course) => course.code);
    if (entry.freeElectiveCredits > 0) {
      parts.push(labels.freeElectiveTemplate.replace("{n}", String(entry.freeElectiveCredits)));
    }
    lines.push(
      `${termText(labels, entry.term)}: ${parts.join(", ")} (${labels.creditsTemplate.replace("{n}", String(credits))})`
    );
  }

  const base = lines.join("\n");
  if (base.length > limit) {
    const cut = base.slice(0, Math.max(0, limit - labels.truncated.length - 1));
    return `${cut.slice(0, Math.max(cut.lastIndexOf("\n"), 0))}\n${labels.truncated}`;
  }

  const findings = [...checkPlan(version, plan, sources)].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );
  const out = [base, "", labels.findingsHeading];
  if (findings.length === 0) {
    out.push(labels.noFindings);
    return out.join("\n");
  }

  let length = out.join("\n").length;
  let shown = 0;
  for (const finding of findings) {
    const line = `- ${labels.severity[finding.severity]}: ${finding.message[locale]}`;
    // Leave room for the "n more" line that follows if this is not the last one.
    const reserve = shown + 1 < findings.length ? labels.moreFindingsTemplate.length + 6 : 0;
    if (length + 1 + line.length + reserve > limit) break;
    out.push(line);
    length += 1 + line.length;
    shown += 1;
  }
  if (shown < findings.length) {
    out.push(labels.moreFindingsTemplate.replace("{n}", String(findings.length - shown)));
  }
  return out.join("\n");
}
