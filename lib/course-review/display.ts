/**
 * Words for facts about a course that more than one page states: where the
 * recommended plan puts it, and which bucket it counts towards in a curriculum.
 *
 * The course page and the compare page both state them, and a fact stated two
 * ways on two pages is how they come to disagree, so they are written once.
 * Pure functions over the dictionary's `courseReview` copy and the curriculum.
 */
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { CategoryId, CurriculumVersionId, TermRef } from "@/content/curriculum/types";
import type { getDictionary, Locale } from "@/lib/i18n";

type Dict = ReturnType<typeof getDictionary>["courseReview"];

/** "Year 2, Semester 1; Year 2, Summer", or the fallback when the plan never names the course. */
export function termsText(terms: readonly TermRef[], t: Dict): string {
  return terms.length > 0
    ? terms.map((term) => `${t.yearLabel} ${term.year}, ${t[term.kind]}`).join("; ")
    : t.notInPlan;
}

/**
 * The bucket a course counts towards in one version, in that version's own
 * words. Minor courses carry the pooled `"minor"` category, which has no
 * credit category of its own, so it gets a plain label here.
 */
export function categoryName(
  versionId: CurriculumVersionId,
  category: CategoryId,
  locale: Locale,
  t: Dict
): string {
  if (category === "minor") return t.minorCourseCategory;
  const found = CURRICULUM_VERSIONS[versionId].categories.find((c) => c.id === category);
  return found ? found.name[locale] : category;
}
