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
  locale: Locale;
};

export default function InferenceNotice({ version, locale }: InferenceNoticeProps) {
  const parts = inferredParts(version);
  const items = disclosures(version);

  if (parts.length === 0 && items.length === 0) return null;

  const copy = buildStudyPlanCopy(locale);

  return (
    <Notice variant="warning" title={copy.inference.heading}>
      <ul className="flex flex-col gap-2">
        {parts.map((part, index) =>
          // inferredParts() is typed Derivation[], not narrowed to the
          // "inferred" branch, even though every element it returns already
          // satisfies `kind === "inferred"`; narrow again here to reach
          // `reason`, which only that branch carries.
          part.kind === "inferred" ? <li key={`inferred-${index}`}>{part.reason[locale]}</li> : null
        )}
        {items.map((item) => (
          <li key={item.id}>{item.disclosure?.[locale]}</li>
        ))}
      </ul>
      <p className="mt-2">{copy.inference.askAdvisor}</p>
    </Notice>
  );
}
