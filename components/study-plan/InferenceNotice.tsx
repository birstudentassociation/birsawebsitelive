/**
 * Warning shown wherever a curriculum version's data was borrowed from
 * another version, or carries a contradiction worth telling a student about
 * (`content/curriculum`'s `inferredParts` / `disclosures`). Renders nothing
 * when a version has neither, which is the case for cohorts whose curriculum
 * is fully published with no gaps: this notice earns its place on the page
 * only when there is something to disclose.
 */
import Notice from "@/components/Notice";
import { disclosures, inferredParts, type CurriculumVersion } from "@/content/curriculum";
import type { Locale } from "@/lib/i18n";
import { buildStudyPlanCopy } from "./studyPlanCopy";

export type InferenceNoticeProps = {
  version: CurriculumVersion;
  /** First two digits of the student's ID, used to scope cohort-specific disclosures. */
  cohortCode: string;
  locale: Locale;
};

export default function InferenceNotice({ version, cohortCode, locale }: InferenceNoticeProps) {
  const parts = inferredParts(version);
  const items = disclosures(version, cohortCode);

  if (parts.length === 0 && items.length === 0) return null;

  const copy = buildStudyPlanCopy(locale);

  // A derivation's `reason` and a contradiction's `disclosure` are
  // independent records that are allowed to say the same thing (2568's
  // borrowed study plan is both the reason recommendedPlan is "inferred" and
  // the thing the "no-2568-study-plan" contradiction discloses), and they
  // should stay independent: nulling one to avoid the repeat would let a
  // later edit to the derivation silently delete the disclosure too. So the
  // fix lives here, in what gets rendered, not in the data: collect every
  // sentence once and drop exact repeats, comparing the locale string a
  // reader would actually see.
  const seen = new Set<string>();
  const sentences: { key: string; text: string }[] = [];
  for (const [index, part] of parts.entries()) {
    if (part.kind !== "inferred") continue;
    // A suppressed derivation is still inferred and still returned by
    // inferredParts, so maintainers and tests can see it; only the sentence
    // shown to the student is withheld here, per the documented instruction
    // recorded on the derivation itself (`suppressed.reason/by/on`).
    if (part.suppressed) continue;
    const text = part.reason[locale];
    if (seen.has(text)) continue;
    seen.add(text);
    sentences.push({ key: `inferred-${index}`, text });
  }
  for (const item of items) {
    const text = item.disclosure?.[locale];
    if (!text || seen.has(text)) continue;
    seen.add(text);
    sentences.push({ key: item.id, text });
  }

  return (
    <Notice variant="warning" title={copy.inference.heading}>
      <ul className="flex flex-col gap-2">
        {sentences.map((sentence) => (
          <li key={sentence.key}>{sentence.text}</li>
        ))}
      </ul>
      <p className="mt-2">{copy.inference.askAdvisor}</p>
    </Notice>
  );
}
