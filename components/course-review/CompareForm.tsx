/**
 * The form that picks two courses to compare, which is a plain GET form to the
 * compare page, so it works with JavaScript off. Its courses are chosen with
 * `CourseCombobox`, a native `<select>` that a typeahead layers over once
 * scripting is running, exactly as the plan screen's course picker is.
 *
 * It has two shapes. On a course page `code` is given, so the form is one line:
 * the page's course is sent as `a` and the reader picks the other. On the
 * compare page itself neither is fixed and both are chosen, each showing the
 * value in the address, so a reader who followed a link can change either
 * course. A server component with no hooks of its own.
 */
import Button from "@/components/Button";
import CourseCombobox from "@/components/forms/CourseCombobox";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import { COMPARE_A, COMPARE_B, comparableCourses } from "@/lib/courses/compare";
import { localeHref, type Locale } from "@/lib/i18n";

export type CompareFormProps = {
  locale: Locale;
  /** The course the form is on, sent as `a`. Absent shows a picker for both courses. */
  code?: string;
  /** The values to show selected, from the address. */
  selected?: { a?: string; b?: string };
};

export default function CompareForm({ locale, code, selected }: CompareFormProps) {
  const copy = buildTermInsightCopy(locale).courseCompare;
  const search = buildStudyPlanCopy(locale).courseSearch;
  const groups = [
    {
      id: "all",
      label: "",
      options: comparableCourses(locale, code).map((course) => ({
        value: course.code,
        label: `${course.code} ${course.title}`,
      })),
    },
  ];
  const action = localeHref(locale, "/student-life/course-reviews/compare");

  if (code) {
    return (
      <form method="get" action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name={COMPARE_A} value={code} />
        <div className="min-w-0 flex-1">
          <CourseCombobox
            id="compare-with"
            name={COMPARE_B}
            label={copy.pageFormLabel.replace("{code}", code)}
            groups={groups}
            copy={search}
          />
        </div>
        <Button type="submit" variant="secondary">
          {copy.pageFormButton}
        </Button>
      </form>
    );
  }

  return (
    <form method="get" action={action} className="flex flex-col gap-4">
      <h2 className="font-display text-lg sm:text-xl">{copy.pickHeading}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <CourseCombobox
          id="compare-a"
          name={COMPARE_A}
          label={copy.firstLabel}
          groups={groups}
          defaultValue={selected?.a ?? ""}
          copy={search}
        />
        <CourseCombobox
          id="compare-b"
          name={COMPARE_B}
          label={copy.secondLabel}
          groups={groups}
          defaultValue={selected?.b ?? ""}
          copy={search}
        />
      </div>
      <div>
        <Button type="submit" variant="secondary">
          {copy.pickButton}
        </Button>
      </div>
    </form>
  );
}
