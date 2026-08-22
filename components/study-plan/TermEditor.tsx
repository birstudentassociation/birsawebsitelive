/**
 * One future term on the plan screen.
 *
 * The screen this lives on shows every term ahead of the student at once,
 * which used to mean ten stacked panels of prose, ten repetitions of a
 * "what this term still needs" block, and ten selects each holding the entire
 * remaining catalogue. Everything a student could possibly do was on screen
 * at all times, so nothing on screen said what they should do next. Three
 * things fix that, and they are the shape of this component:
 *
 * 1. A term is a `<details>`. Collapsed, it is one line: the term's name, the
 *    codes in it, and its credit total, which is what a student scanning for
 *    the right term actually reads. The plan screen opens exactly one.
 * 2. The recommendation IS the control. A course the recommended plan puts in
 *    this term is a button that adds it, grouped under the plan's own words
 *    for the choice ("Minor Elective Course 1"). Previously the same courses
 *    were listed as prose and then had to be found again in a select, so the
 *    student read the answer and then did the work of looking it up.
 * 3. Everything else is behind one disclosure. The full catalogue select and
 *    the free elective credits box are still there, unchanged and still
 *    working with JavaScript off, but a student following the recommended
 *    plan never has to open the drawer they live in.
 *
 * Every control is a plain `<form>` posting to a Server Action, as before, so
 * the whole screen still works with JavaScript off. `<details>` is native, so
 * the collapsing does too. Multiple courses share one add form: each button
 * carries its own `name="code"` value, so only the clicked course's code is
 * submitted, exactly as the remove buttons have always worked. The full
 * picker needs a form of its own, because a `<select name="code">` and a
 * `<button name="code">` in one form would both submit.
 *
 * The add-course control is `CourseCombobox`
 * (components/forms/CourseCombobox.tsx): before mount, and therefore with
 * JavaScript off, it is nothing but the same `<select>` with `<optgroup>`s
 * this drawer has always held, because that is native HTML that works
 * without JavaScript and with a screen reader. Only after mount does a
 * scripted typeahead layer over that baseline, letting a student type a
 * course name instead of hunting the whole remaining catalogue; it never
 * replaces the no-JS select, it sits on top of it. `<optgroup>`/`<option>`
 * still carries no markup and no ARIA description of its own, which is why
 * a missing prerequisite stays folded into the option's plain text. The
 * quick-add buttons are real elements and could carry markup, but they say
 * it the same way, so the two never disagree.
 */
import Button from "@/components/Button";
import CourseCombobox, {
  type CourseComboboxCopy,
  type CourseComboboxGroup,
} from "@/components/forms/CourseCombobox";
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
  pickSlotAnyCourse: string;
  pickNothingOwed: string;
  /** Shown in the collapsed summary of a term holding nothing at all. */
  termEmpty: string;
  /** Label of the disclosure holding the full catalogue picker and the free elective box. */
  moreOptionsLabel: string;
  /** Contains "{n}"; shown when a slot has more candidates than the quick-add row lists. */
  moreCandidatesTemplate: string;
  /** Contains "{n}"; shown when this term has reached its prescribed load. */
  recommendedTermCompleteTemplate: string;
  /** Contains "{n}"; filled with the credits still owed in a group. */
  pickRemainingTemplate: string;
  /** Contains "{codes}"; filled with a course's missing prerequisite codes, joined by ", ". */
  pickPrerequisiteTemplate: string;
  /** Shown in place of the pick panel and the add-course form when `internshipOnly` is true. */
  internshipOnlyTerm: string;
  /** Copy for the add-course `CourseCombobox`; shared verbatim with the fill step's slots. */
  courseSearch: CourseComboboxCopy;
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
  /** Whether this prescribed term has already reached its planned credit load. */
  recommendedTermComplete: boolean;
  /** The planned credit load used in `recommendedTermCompleteTemplate`. */
  recommendedCredits: number | null;
  /**
   * Whether this term starts expanded. The plan screen opens exactly one, so
   * the student lands on a page with a single term to act on rather than ten
   * competing for the same attention.
   */
  defaultOpen: boolean;
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
 * How many candidate courses one open choice offers as buttons. A named
 * either/or slot ("AH208 or EL295") has two; an open-category slot such as
 * "Minor Elective Course 1" can match a dozen, and a dozen buttons is the
 * wall of choices this component exists to get rid of. Past this many, the
 * rest stay one disclosure away in the full picker, which lists every
 * remaining course anyway.
 */
const MAX_CANDIDATE_BUTTONS = 6;

/** The URL fragment and anchor id for one term, shared with the plan screen's `?term=` parameter. */
export function termKey(term: TermRef): string {
  return `${term.year}-${term.kind}`;
}

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

/**
 * One course as a button that adds it to this term. The visible text is the
 * same sentence the select's option carries, so a student who uses one
 * control and then the other is never told two different things about the
 * same course. The accessible name gets the verb the plus sign only implies.
 */
function AddCourseButton({ course, copy }: { course: TermEditorCourse; copy: TermEditorCopy }) {
  return (
    <button
      type="submit"
      name="code"
      value={course.code}
      className="focus-halo flex items-start gap-2 rounded-md border border-line bg-surface px-3 py-2 text-left text-sm text-ink transition-colors hover:border-brand-deep hover:bg-brand-tint"
    >
      <span aria-hidden="true" className="font-semibold text-brand-deep">
        +
      </span>
      <span className="min-w-0">
        <span className="sr-only">{copy.addButtonLabel} </span>
        {`${course.code} ${course.title}`}
        <span className="text-muted">
          {" · "}
          {course.credits} {copy.creditsUnit}
          {course.missingPrerequisites.length > 0
            ? ` · ${copy.pickPrerequisiteTemplate.replace("{codes}", course.missingPrerequisites.join(", "))}`
            : ""}
        </span>
      </span>
    </button>
  );
}

export default function TermEditor({
  term,
  termLabel,
  plan,
  placed,
  freeElectiveCredits,
  courseGroups,
  openSlots,
  recommendedTermComplete,
  recommendedCredits,
  defaultOpen,
  internshipOnly,
  addAction,
  removeAction,
  freeElectiveAction,
  copy,
}: TermEditorProps) {
  const termCredits = placed.reduce((sum, course) => sum + course.credits, 0) + freeElectiveCredits;
  const addFieldId = `add-course-${termKey(term)}`;
  const hasCourses = courseGroups.some((group) => group.courses.length > 0);
  // The full-catalogue combobox's groups, in the same shape and the same
  // text as the select they replace: same group label (groupOptionLabel)
  // and option label (courseOptionLabel), so a student reads the identical
  // sentence whether or not JavaScript has enhanced the control. Groups with
  // nothing left in them are dropped, matching the select's own behaviour.
  const courseComboboxGroups: CourseComboboxGroup[] = courseGroups
    .filter((group) => group.courses.length > 0)
    .map((group) => ({
      id: group.id,
      label: groupOptionLabel(copy, group),
      options: group.courses.map((course) => ({
        value: course.code,
        label: courseOptionLabel(copy, course),
      })),
    }));
  const owedGroups = courseGroups.filter(
    (group) => group.remaining !== null && group.remaining > 0
  );

  // The courses the recommended plan names for this exact term, minus any that
  // an open slot below already offers. `suggestForTerm` deliberately files a
  // slot's candidates in the "recommended" group too, so that the select's
  // grouping reflects them; here that would print the same course twice, once
  // under its slot's own label and once under a generic heading.
  const slotCandidateCodes = new Set(
    openSlots.flatMap((slot) => slot.candidates.map((c) => c.code))
  );
  const namedRecommended = (
    courseGroups.find((group) => group.id === "recommended")?.courses ?? []
  ).filter((course) => !slotCandidateCodes.has(course.code));

  // The panel shows when it has something to put in it: an open choice, a
  // recommended course, or, for a term the recommended plan says nothing
  // about, the buckets the degree still owes. All three empty means no panel,
  // not a heading with nothing underneath. That empty-shell failure is one
  // `InferenceNotice` has already shipped once, on this same screen.
  const showsOwedGroups = openSlots.length === 0 && namedRecommended.length === 0;
  const showPickPanel =
    !recommendedTermComplete &&
    (openSlots.length > 0 ||
      namedRecommended.length > 0 ||
      (showsOwedGroups && owedGroups.length > 0));

  // The free elective box is the answer to a free-elective slot, so it comes
  // out of the drawer whenever this term has one; otherwise it stays with the
  // rest of the manual controls. Never shown for an internship summer, where
  // the rule zeroes it anyway (see `internshipOnly` above).
  const freeElectiveInline =
    !recommendedTermComplete && openSlots.some((slot) => slot.candidates.length === 0);

  const summaryCodes = placed.map((course) => course.code).join(", ");

  const freeElectiveForm = (
    <TermFreeElectiveForm
      term={term}
      plan={plan}
      freeElectiveCredits={freeElectiveCredits}
      action={freeElectiveAction}
      label={copy.freeElectiveLabel}
      updateLabel={copy.updateFreeElectiveLabel}
      errorSummaryTitle={copy.errorSummaryTitle}
    />
  );

  return (
    <details
      id={`term-${termKey(term)}`}
      open={defaultOpen}
      className="group rounded-lg border border-line"
    >
      <summary className="focus-halo flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-5 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="font-display text-lg text-ink">{termLabel}</span>
          <span className="mt-0.5 block text-sm text-muted">
            {placed.length === 0 && freeElectiveCredits === 0
              ? copy.termEmpty
              : `${summaryCodes}${summaryCodes ? " · " : ""}${copy.creditsTemplate.replace("{n}", String(termCredits))}`}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-muted transition-transform group-open:rotate-180"
        >
          &darr;
        </span>
      </summary>

      <div className="flex flex-col gap-4 border-t border-line p-5">
        {placed.length > 0 ? (
          <form action={removeAction} className="flex flex-col gap-2">
            <input type="hidden" name={PLAN_FIELD} value={plan} />
            <input type="hidden" name="year" value={term.year} />
            <input type="hidden" name="kind" value={term.kind} />
            <ul className="flex flex-col gap-2">
              {placed.map((course) => (
                <li
                  key={course.code}
                  className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface p-3 text-sm"
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
                    className="focus-halo shrink-0 text-sm font-semibold text-brand-deep hover:underline"
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
          The free elective form is skipped entirely for the same reason,
          rather than left to render and silently reset to 0.
        */}
        {internshipOnly ? (
          <p className="text-sm text-muted">{copy.internshipOnlyTerm}</p>
        ) : (
          <>
            {recommendedTermComplete && recommendedCredits !== null ? (
              <p className="text-sm text-muted">
                {copy.recommendedTermCompleteTemplate.replace("{n}", String(recommendedCredits))}
              </p>
            ) : showPickPanel ? (
              <form action={addAction} className="flex flex-col gap-4">
                <input type="hidden" name={PLAN_FIELD} value={plan} />
                <input type="hidden" name="year" value={term.year} />
                <input type="hidden" name="kind" value={term.kind} />

                <h4 className="font-display text-sm font-semibold text-ink">{copy.pickHeading}</h4>

                {/*
                  One block per open choice: the recommended plan's own label
                  for the choice, then the courses that fill it as buttons that
                  do the filling. A slot the catalogue cannot list, which in
                  practice means a free elective, has no buttons to offer, so it
                  says what does count instead, and the free elective credits
                  box is lifted out of the drawer below to answer it.
                */}
                {openSlots.map((slot) => (
                  <div key={slot.id} className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-ink">{slot.label}</p>
                    {slot.candidates.length > 0 ? (
                      <>
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                          {slot.candidates.slice(0, MAX_CANDIDATE_BUTTONS).map((course) => (
                            <AddCourseButton key={course.code} course={course} copy={copy} />
                          ))}
                        </div>
                        {slot.candidates.length > MAX_CANDIDATE_BUTTONS ? (
                          <p className="text-sm text-muted">
                            {copy.moreCandidatesTemplate.replace(
                              "{n}",
                              String(slot.candidates.length - MAX_CANDIDATE_BUTTONS)
                            )}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-sm text-muted">{copy.pickSlotAnyCourse}</p>
                    )}
                  </div>
                ))}

                {namedRecommended.length > 0 ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {namedRecommended.map((course) => (
                      <AddCourseButton key={course.code} course={course} copy={copy} />
                    ))}
                  </div>
                ) : null}

                {/*
                  The buckets still owed, but only for a term with no
                  term-specific answer of its own: one the student appended
                  after the recommended plan runs out. There the question "what
                  should go here?" can only be answered by what the degree as a
                  whole still wants. Deliberately not shown alongside the slots
                  above: these figures are about the whole plan, they are
                  already on this page once in the "what you still owe" table,
                  and repeating them under every term would bury the one thing
                  on this panel that IS specific to the term being looked at.
                */}
                {showsOwedGroups && owedGroups.length > 0 ? (
                  <ul className="flex flex-col gap-1 text-sm">
                    {owedGroups.map((group) => (
                      <li key={group.id} className="leading-relaxed">
                        <span className="font-semibold text-ink">{group.label}</span>
                        <span className="text-muted">
                          {": "}
                          {copy.pickRemainingTemplate.replace("{n}", String(group.remaining))}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </form>
            ) : !recommendedTermComplete ? (
              <p className="text-sm text-muted">{copy.pickNothingOwed}</p>
            ) : null}

            {freeElectiveInline ? freeElectiveForm : null}

            {/*
              Everything the recommended plan does not answer, one press away
              rather than always on screen: the whole remaining catalogue, and
              (unless a free elective slot already lifted it out above) the
              free elective credits box. A student following the plan never
              opens this; a student who is not still has every option they had
              before, in the same native controls.
            */}
            <details className="text-sm">
              <summary className="focus-halo cursor-pointer font-semibold text-brand-deep">
                {copy.moreOptionsLabel}
              </summary>
              <div className="mt-4 flex flex-col gap-4">
                {hasCourses ? (
                  <form action={addAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <input type="hidden" name={PLAN_FIELD} value={plan} />
                    <input type="hidden" name="year" value={term.year} />
                    <input type="hidden" name="kind" value={term.kind} />
                    <div className="min-w-0 flex-1">
                      <CourseCombobox
                        id={addFieldId}
                        name="code"
                        label={copy.addLabel}
                        groups={courseComboboxGroups}
                        copy={copy.courseSearch}
                      />
                    </div>
                    <Button type="submit" variant="secondary">
                      {copy.addButtonLabel}
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-muted">{copy.noCoursesAvailable}</p>
                )}

                {freeElectiveInline ? null : freeElectiveForm}
              </div>
            </details>
          </>
        )}
      </div>
    </details>
  );
}
