/**
 * One future term on the plan screen: the courses already placed in it (each
 * with a "Remove" button), a panel showing what the term still needs, a
 * grouped select of courses not yet placed anywhere in the plan with an
 * "Add" button, and (via `TermFreeElectiveForm`) a number input for free
 * elective credits, since a free elective has no course code to select.
 *
 * Separate `<form>`s, not one, because plain HTML only lets a form post to a
 * single action. Splitting them (rather than reaching for a client component
 * with `onClick` handlers) is what keeps every control on this screen
 * working with JavaScript off, matching the rest of this journey. Multiple
 * courses share one remove form: each course's button carries its own
 * `name="code"` value, so only the clicked course's code is submitted.
 *
 * The add-course select groups courses with `<optgroup>` rather than a
 * scripted filtering combobox, for the same reason: an `<optgroup>` is
 * native HTML that works with JavaScript off and with a screen reader, while
 * a filtering widget would need client script to do anything at all. It
 * also means an `<optgroup>`/`<option>` pair can carry no markup and no ARIA
 * description of its own, which is why a missing prerequisite is folded
 * into the option's plain text instead of, say, a title attribute or an
 * adjacent icon: text is the one channel every rendering of this control,
 * scripted or not, actually gets.
 */
import Button from "@/components/Button";
import { PLAN_FIELD } from "@/lib/study-plan/plan";
import type { TermRef } from "@/content/curriculum";
import TermFreeElectiveForm, { type TermFreeElectiveState } from "./TermFreeElectiveForm";

export type TermEditorCourse = {
  code: string;
  title: string;
  credits: number;
  /** Prerequisite codes not met before this term. Annotated, never withheld. */
  missingPrerequisites: string[];
};

export type TermEditorCourseGroup = {
  id: string;
  /** Already localised and, for minor buckets, already named for the student's own minor. */
  label: string;
  /** Credits still owed in this group, or null where the idea does not apply (the recommended and other groups). */
  remaining: number | null;
  courses: TermEditorCourse[];
};

export type TermEditorSlot = {
  id: string;
  /** The recommended plan's own words for the choice, already localised. */
  label: string;
  candidates: TermEditorCourse[];
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
  errorSummaryTitle: string;
  pickHeading: string;
  pickSlotsHint: string;
  pickSlotCandidates: string;
  pickSlotAnyCourse: string;
  pickNothingOwed: string;
  /** Contains "{n}"; filled with the credits still owed in a group. */
  pickRemainingTemplate: string;
  /** Contains "{codes}"; filled with a course's missing prerequisite codes, joined by ", ". */
  pickPrerequisiteTemplate: string;
  /** Shown in place of the pick panel and the add-course form when `internshipOnly` is true. */
  internshipOnlyTerm: string;
};

export type TermEditorProps = {
  term: TermRef;
  termLabel: string;
  /** The plan as it stands on arrival at this screen, carried by every form here. */
  plan: string;
  placed: TermEditorCourse[];
  freeElectiveCredits: number;
  /** Catalogue courses not yet passed and not yet placed in any term, grouped by what they would count toward. */
  courseGroups: TermEditorCourseGroup[];
  /** Choices the recommended plan leaves open in this term ("Minor Elective Course 1"). */
  openSlots: TermEditorSlot[];
  /**
   * True when this term is a summer given over to the internship (see
   * `isInternshipSummer` in lib/study-plan/derive.ts). The internship is the
   * whole of that term, so both the "what this term still needs" panel and
   * the add-course form are replaced by one explanatory line, and the free
   * elective input is hidden too: the rule zeroes a term's free elective
   * credits the moment it holds the internship (`clearInternshipSummers`),
   * and an input that silently resets whatever the student types is worse
   * than no input at all. The remove buttons for placed courses still show,
   * so a student can take the internship back out of the term if that is
   * not actually what they meant to plan.
   */
  internshipOnly: boolean;
  addAction: (formData: FormData) => Promise<void>;
  removeAction: (formData: FormData) => Promise<void>;
  freeElectiveAction: (
    prevState: TermFreeElectiveState,
    formData: FormData
  ) => Promise<TermFreeElectiveState>;
  copy: TermEditorCopy;
};

/**
 * An optgroup's visible label: the group's own name, plus how many credits
 * it still owes when that number is positive. `remaining` is null for the
 * "recommended" and "other" groups (owing nothing is not a fact about them,
 * it just does not apply), and 0 reads the same as "nothing to add", so both
 * are left unadorned.
 */
function groupOptionLabel(copy: TermEditorCopy, group: TermEditorCourseGroup): string {
  if (group.remaining === null || group.remaining <= 0) return group.label;
  return `${group.label} (${copy.pickRemainingTemplate.replace("{n}", String(group.remaining))})`;
}

/**
 * An option's visible text: code, title, credits, and, when the course has an
 * unmet prerequisite, a note saying so. The note lives here rather than
 * being hidden or left off entirely because this service never blocks a
 * student on a missing prerequisite (see the header of findings.ts); it
 * tells them, and an `<option>`'s text is the only place left to tell them
 * once `<optgroup>` has already been spent on grouping.
 */
function courseOptionLabel(copy: TermEditorCopy, course: TermEditorCourse): string {
  const base = `${course.code} ${course.title} · ${course.credits} ${copy.creditsUnit}`;
  if (course.missingPrerequisites.length === 0) return base;
  const note = copy.pickPrerequisiteTemplate.replace(
    "{codes}",
    course.missingPrerequisites.join(", ")
  );
  return `${base} (${note})`;
}

export default function TermEditor({
  term,
  termLabel,
  plan,
  placed,
  freeElectiveCredits,
  courseGroups,
  openSlots,
  internshipOnly,
  addAction,
  removeAction,
  freeElectiveAction,
  copy,
}: TermEditorProps) {
  const termCredits = placed.reduce((sum, course) => sum + course.credits, 0) + freeElectiveCredits;
  const addFieldId = `add-course-${term.year}-${term.kind}`;
  const hasCourses = courseGroups.some((group) => group.courses.length > 0);
  const hasRemainingGroup = courseGroups.some(
    (group) => group.remaining !== null && group.remaining > 0
  );
  const showPickPanel = openSlots.length > 0 || hasRemainingGroup;

  return (
    <section className="border-line flex flex-col gap-4 rounded-lg border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg">{termLabel}</h3>
        <p className="text-muted text-sm">
          {copy.creditsTemplate.replace("{n}", String(termCredits))}
        </p>
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
                  {course.title ? ` ${course.title}` : ""} &middot; {course.credits}{" "}
                  {copy.creditsUnit}
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

      {/*
        An internship summer replaces BOTH the "what this term still needs"
        panel and the add-course form with one explanatory line: there is
        nothing to add, nothing to pick, because the internship is the whole
        of this term (see the `internshipOnly` prop's own comment above).
        The free elective form further down is skipped entirely for the same
        reason, rather than left to render and silently reset to 0.
      */}
      {internshipOnly ? (
        <p className="text-muted text-sm">{copy.internshipOnlyTerm}</p>
      ) : (
        <>
          {/*
            This panel is guidance sitting next to a form, not a finding or a
            caveat about the plan, so it does not use `Notice`: `Notice` carries
            a border colour and an icon that mean "pay attention to this
            exception", and there is nothing exceptional about a term still
            having open choices, that is the ordinary state of an unfinished
            plan. A quiet bordered block matches how the rest of this screen
            separates sections without raising an alarm.
          */}
          {showPickPanel ? (
            <div className="border-line bg-surface flex flex-col gap-3 rounded-md border p-4 text-sm">
              <h4 className="text-ink font-display text-sm font-semibold">{copy.pickHeading}</h4>
              {openSlots.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-muted">{copy.pickSlotsHint}</p>
                  <ul className="flex flex-col gap-2">
                    {openSlots.map((slot) => (
                      <li key={slot.id} className="leading-relaxed">
                        <span className="text-ink font-semibold">{slot.label}</span>
                        {slot.candidates.length > 0 ? (
                          <span className="text-muted">
                            {" "}
                            {copy.pickSlotCandidates}:{" "}
                            {slot.candidates.map((c) => `${c.code} ${c.title}`).join(", ")}
                          </span>
                        ) : (
                          <span className="text-muted"> {copy.pickSlotAnyCourse}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/*
                The buckets still owed, but only for a term the recommended plan
                has no open choices in: a term the student appended themselves, or
                one they have already filled every recommended slot of. There the
                question "what should go here?" has no term-specific answer, so
                the honest one is what the degree as a whole still wants.

                Deliberately not shown alongside the slots above. These figures are
                about the whole plan, not this term, and they are already on this
                page once in the "what you still owe" table; repeating all of them
                under every term would bury the one thing on this panel that IS
                specific to the term the student is looking at.

                This is also what keeps the panel from ever being a heading with
                nothing underneath: the panel shows when there are open slots OR an
                owed bucket, and those are exactly the two branches here. That
                empty-shell failure is one `InferenceNotice` has already shipped
                once, on this same screen.
              */}
              {openSlots.length === 0 && hasRemainingGroup ? (
                <ul className="flex flex-col gap-1">
                  {courseGroups
                    .filter((group) => group.remaining !== null && group.remaining > 0)
                    .map((group) => (
                      <li key={group.id} className="leading-relaxed">
                        <span className="text-ink font-semibold">{group.label}</span>
                        <span className="text-muted">
                          {": "}
                          {copy.pickRemainingTemplate.replace("{n}", String(group.remaining))}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <p className="text-muted text-sm">{copy.pickNothingOwed}</p>
          )}

          {hasCourses ? (
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
                  {courseGroups.map((group) =>
                    group.courses.length > 0 ? (
                      <optgroup key={group.id} label={groupOptionLabel(copy, group)}>
                        {group.courses.map((course) => (
                          <option key={course.code} value={course.code}>
                            {courseOptionLabel(copy, course)}
                          </option>
                        ))}
                      </optgroup>
                    ) : null
                  )}
                </select>
              </div>
              <Button type="submit" variant="secondary">
                {copy.addButtonLabel}
              </Button>
            </form>
          ) : (
            <p className="text-muted text-sm">{copy.noCoursesAvailable}</p>
          )}

          <TermFreeElectiveForm
            term={term}
            plan={plan}
            freeElectiveCredits={freeElectiveCredits}
            action={freeElectiveAction}
            label={copy.freeElectiveLabel}
            updateLabel={copy.updateFreeElectiveLabel}
            errorSummaryTitle={copy.errorSummaryTitle}
          />
        </>
      )}
    </section>
  );
}
