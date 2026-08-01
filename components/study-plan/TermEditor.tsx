/**
 * One future term on the plan screen: the courses already placed in it (each
 * with a "Remove" button), a select of courses not yet placed anywhere in
 * the plan with an "Add" button, and a number input for free elective
 * credits, since a free elective has no course code to select.
 *
 * Three separate `<form>`s, not one, because plain HTML only lets a form
 * post to a single action. Splitting them (rather than reaching for a client
 * component with `onClick` handlers) is what keeps every control on this
 * screen working with JavaScript off, matching the rest of this journey.
 * Multiple courses share one remove form: each course's button carries its
 * own `name="code"` value, so only the clicked course's code is submitted.
 */
import Button from "@/components/Button";
import { PLAN_FIELD } from "@/lib/study-plan/plan";
import type { TermRef } from "@/content/curriculum";

export type TermEditorCourse = {
  code: string;
  title: string;
  credits: number;
};

export type TermEditorCopy = {
  creditsTemplate: string;
  addLabel: string;
  addButtonLabel: string;
  noCoursesAvailable: string;
  removeLabel: string;
  freeElectiveLabel: string;
  updateFreeElectiveLabel: string;
  creditsUnit: string;
};

export type TermEditorProps = {
  term: TermRef;
  termLabel: string;
  /** The plan as it stands on arrival at this screen, carried by every form here. */
  plan: string;
  placed: TermEditorCourse[];
  freeElectiveCredits: number;
  /** Catalogue courses not yet passed and not yet placed in any term. */
  availableCourses: TermEditorCourse[];
  addAction: (formData: FormData) => Promise<void>;
  removeAction: (formData: FormData) => Promise<void>;
  freeElectiveAction: (formData: FormData) => Promise<void>;
  copy: TermEditorCopy;
};

export default function TermEditor({
  term,
  termLabel,
  plan,
  placed,
  freeElectiveCredits,
  availableCourses,
  addAction,
  removeAction,
  freeElectiveAction,
  copy,
}: TermEditorProps) {
  const termCredits = placed.reduce((sum, course) => sum + course.credits, 0) + freeElectiveCredits;
  const addFieldId = `add-course-${term.year}-${term.kind}`;
  const freeElectiveFieldId = `free-elective-${term.year}-${term.kind}`;

  return (
    <section className="border-line flex flex-col gap-4 rounded-lg border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg">{termLabel}</h3>
        <p className="text-muted text-sm">{copy.creditsTemplate.replace("{n}", String(termCredits))}</p>
      </div>

      {placed.length > 0 ? (
        <form action={removeAction} className="flex flex-col gap-2">
          <input type="hidden" name={PLAN_FIELD} value={plan} />
          <input type="hidden" name="year" value={term.year} />
          <input type="hidden" name="kind" value={term.kind} />
          <ul className="flex flex-col gap-2">
            {placed.map((course) => (
              <li
                key={course.code}
                className="bg-surface flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
              >
                <span className="text-ink">
                  <span className="font-semibold">{course.code}</span>
                  {course.title ? ` ${course.title}` : ""} &middot; {course.credits} {copy.creditsUnit}
                </span>
                <button
                  type="submit"
                  name="code"
                  value={course.code}
                  className="focus-halo text-brand-deep shrink-0 text-sm font-semibold hover:underline"
                >
                  {copy.removeLabel}
                  <span className="sr-only"> {course.code}</span>
                </button>
              </li>
            ))}
          </ul>
        </form>
      ) : null}

      {availableCourses.length > 0 ? (
        <form action={addAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name={PLAN_FIELD} value={plan} />
          <input type="hidden" name="year" value={term.year} />
          <input type="hidden" name="kind" value={term.kind} />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <label htmlFor={addFieldId} className="text-ink text-sm font-semibold">
              {copy.addLabel}
            </label>
            <select
              id={addFieldId}
              name="code"
              className="focus-halo border-input-border bg-surface text-ink w-full rounded-md border px-3.5 py-2.5 text-[0.95rem]"
            >
              {availableCourses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} {course.title}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="secondary">
            {copy.addButtonLabel}
          </Button>
        </form>
      ) : (
        <p className="text-muted text-sm">{copy.noCoursesAvailable}</p>
      )}

      <form action={freeElectiveAction} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name={PLAN_FIELD} value={plan} />
        <input type="hidden" name="year" value={term.year} />
        <input type="hidden" name="kind" value={term.kind} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor={freeElectiveFieldId} className="text-ink text-sm font-semibold">
            {copy.freeElectiveLabel}
          </label>
          <input
            id={freeElectiveFieldId}
            name="freeElectiveCredits"
            type="number"
            min={0}
            max={21}
            defaultValue={freeElectiveCredits}
            className="focus-halo border-input-border bg-surface text-ink w-24 rounded-md border px-3.5 py-2.5 text-[0.95rem]"
          />
        </div>
        <Button type="submit" variant="secondary">
          {copy.updateFreeElectiveLabel}
        </Button>
      </form>
    </section>
  );
}
