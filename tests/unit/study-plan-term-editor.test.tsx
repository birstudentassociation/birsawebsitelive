// @vitest-environment jsdom
/**
 * The smart picker's rendering, as opposed to the engine that decides what
 * goes in it (`lib/study-plan/suggest.ts`, covered by
 * study-plan-suggest.test.ts).
 *
 * Two cases are worth naming. The first is the panel that renders its heading
 * with nothing underneath: this screen's `InferenceNotice` shipped exactly
 * that bug once, an alarming box with no sentence in it, and the picker panel
 * has the same shape of condition (show when there is an open slot OR a
 * recommended course OR an owed bucket), so it can fail the same way. A test
 * that only checked "the panel appears" would have passed for the broken
 * version too.
 *
 * The second is the recommended course appearing twice. `suggestForTerm`
 * files a slot's candidates in the "recommended" group as well, so that the
 * select's grouping reflects them; rendering both without subtracting one
 * from the other would print the same course under its slot's label and
 * again under a generic heading, in the same panel.
 *
 * Every query is scoped to the render's own `container` with `within` rather
 * than going through `screen`. There is no global testing-library cleanup in
 * vitest.config.ts, so renders accumulate in the document across cases in a
 * file, and a document-wide query for text this component repeats (the
 * "no courses left" line, say) would match an earlier case's markup.
 */
import { describe, expect, it } from "vitest";
import { render, within } from "@testing-library/react";
import TermEditor, {
  type TermEditorCopy,
  type TermEditorCourseGroup,
  type TermEditorSlot,
} from "@/components/study-plan/TermEditor";
import type { TermFreeElectiveState } from "@/components/study-plan/TermFreeElectiveForm";

const copy: TermEditorCopy = {
  creditsTemplate: "{n} credits",
  addLabel: "Add a course",
  addPrompt: "Choose a course",
  addButtonLabel: "Add",
  noCoursesAvailable: "No courses left to add.",
  removeLabel: "Remove",
  freeElectiveLabel: "Free elective credits",
  updateFreeElectiveLabel: "Update",
  creditsUnit: "credits",
  errorSummaryTitle: "There is a problem",
  pickHeading: "What this term still needs",
  pickSlotAnyCourse: "Any Thammasat course counts here.",
  pickNothingOwed: "This plan already covers every requirement.",
  termEmpty: "Nothing planned yet",
  moreOptionsLabel: "Add something else to this term",
  moreCandidatesTemplate: "{n} more courses fit this choice.",
  recommendedTermCompleteTemplate:
    "This term already has the {n} credits the recommended plan schedules.",
  pickRemainingTemplate: "{n} credits still needed",
  pickPrerequisiteTemplate: "needs {codes} first",
  internshipOnlyTerm: "This summer is given over to the internship.",
};

const noop = async () => {};
const noopState = async (): Promise<TermFreeElectiveState> => ({ status: "idle" });

function renderEditor(overrides: {
  courseGroups?: TermEditorCourseGroup[];
  openSlots?: TermEditorSlot[];
  internshipOnly?: boolean;
  recommendedTermComplete?: boolean;
  recommendedCredits?: number | null;
  placed?: TermEditorCourseGroup["courses"];
  freeElectiveCredits?: number;
  defaultOpen?: boolean;
}) {
  const { container } = render(
    <TermEditor
      term={{ year: 3, kind: "semester1" }}
      termLabel="Year 3, Semester 1"
      plan="PLAN"
      placed={overrides.placed ?? []}
      freeElectiveCredits={overrides.freeElectiveCredits ?? 0}
      courseGroups={overrides.courseGroups ?? []}
      openSlots={overrides.openSlots ?? []}
      internshipOnly={overrides.internshipOnly ?? false}
      recommendedTermComplete={overrides.recommendedTermComplete ?? false}
      recommendedCredits={overrides.recommendedCredits ?? null}
      defaultOpen={overrides.defaultOpen ?? true}
      addAction={noop}
      removeAction={noop}
      freeElectiveAction={noopState}
      copy={copy}
    />
  );
  return { container, ui: within(container) };
}

const pi470 = { code: "PI470", title: "Research Methods", credits: 3, missingPrerequisites: [] };
const pi380 = {
  code: "PI380",
  title: "Public Policy",
  credits: 3,
  missingPrerequisites: ["PI121"],
};

const recommended: TermEditorCourseGroup = {
  id: "recommended",
  label: "Recommended for this term",
  remaining: null,
  courses: [pi470],
};

const minorRequired: TermEditorCourseGroup = {
  id: "minorRequired",
  label: "Governance required courses",
  remaining: 6,
  courses: [pi380],
};

/** The submit buttons that add a course, as opposed to the ones that remove one. */
function addButtonValues(container: HTMLElement): string[] {
  return [...container.querySelectorAll<HTMLButtonElement>('button[name="code"]')]
    .filter((button) => button.textContent?.includes(copy.addButtonLabel))
    .map((button) => button.value);
}

describe("TermEditor", () => {
  it("collapses to the term's own name, contents and credit total", () => {
    const { container, ui } = renderEditor({
      defaultOpen: false,
      placed: [pi470],
      freeElectiveCredits: 3,
    });
    expect(container.querySelector("details")?.open).toBe(false);
    expect(ui.getByText("Year 3, Semester 1")).toBeDefined();
    expect(ui.getByText("PI470 · 6 credits")).toBeDefined();
  });

  it("says so rather than showing a credit total when the term holds nothing", () => {
    const { ui } = renderEditor({ defaultOpen: false });
    expect(ui.getByText("Nothing planned yet")).toBeDefined();
  });

  it("opens the term the plan screen tells it to", () => {
    const { container } = renderEditor({ defaultOpen: true });
    expect(container.querySelector("details")?.open).toBe(true);
  });

  it("offers a recommended course as a button that adds it, not as prose to look up", () => {
    // The change this component exists for: the same course used to be named
    // in a sentence and then had to be found again in a select of the whole
    // remaining catalogue.
    const { container } = renderEditor({ courseGroups: [recommended] });
    expect(addButtonValues(container)).toContain("PI470");
  });

  it("groups the select by what each course counts toward, in the order given", () => {
    const { container } = renderEditor({ courseGroups: [recommended, minorRequired] });
    const groups = [...container.querySelectorAll("optgroup")];
    expect(groups.map((g) => g.getAttribute("label"))).toEqual([
      "Recommended for this term",
      "Governance required courses (6 credits still needed)",
    ]);
  });

  it("puts the unmet prerequisite in the option's own text", () => {
    // An optgroup/option pair carries no markup and no ARIA description, so
    // text is the only channel a screen reader and a JavaScript-off browser
    // both get. See the header comment of TermEditor.tsx.
    const { container } = renderEditor({ courseGroups: [minorRequired] });
    const option = container.querySelector('option[value="PI380"]');
    expect(option?.textContent).toContain("needs PI121 first");
  });

  it("still offers a course whose prerequisite is unmet, rather than hiding it", () => {
    // The service tells the student, it never blocks them. See findings.ts.
    const { container } = renderEditor({ courseGroups: [minorRequired] });
    expect(container.querySelector('option[value="PI380"]')).not.toBeNull();
  });

  it("carries the unmet prerequisite on the quick-add button too", () => {
    const { container } = renderEditor({
      courseGroups: [{ ...recommended, courses: [pi380] }],
    });
    const button = container.querySelector<HTMLButtonElement>('button[value="PI380"]');
    expect(button?.textContent).toContain("needs PI121 first");
  });

  it("puts each open choice under the recommended plan's own words for it", () => {
    const { ui, container } = renderEditor({
      courseGroups: [minorRequired],
      openSlots: [
        {
          id: "minorElective1",
          label: "Minor Elective Course 1",
          candidates: [
            { code: "PI381", title: "Local Government", credits: 3, missingPrerequisites: [] },
          ],
        },
      ],
    });
    expect(ui.getByText("Minor Elective Course 1")).toBeDefined();
    expect(ui.getByText(/PI381 Local Government/)).toBeDefined();
    expect(addButtonValues(container)).toContain("PI381");
  });

  it("does not offer a slot's candidate a second time under a generic heading", () => {
    // suggestForTerm files slot candidates in the "recommended" group as well,
    // so the select's grouping reflects them. Printing both unfiltered would
    // put the same course on screen twice in the same panel.
    const { container } = renderEditor({
      courseGroups: [{ ...recommended, courses: [pi470] }],
      openSlots: [{ id: "genEd1", label: "General Education Course 1", candidates: [pi470] }],
    });
    expect(addButtonValues(container)).toEqual(["PI470"]);
  });

  it("keeps the longest candidate lists out of the panel", () => {
    const candidates = Array.from({ length: 9 }, (_, i) => ({
      code: `PI4${String(i).padStart(2, "0")}`,
      title: `Course ${i}`,
      credits: 3,
      missingPrerequisites: [],
    }));
    const { container, ui } = renderEditor({
      openSlots: [{ id: "minorElective1", label: "Minor Elective Course 1", candidates }],
    });
    expect(addButtonValues(container)).toHaveLength(6);
    expect(ui.getByText("3 more courses fit this choice.")).toBeDefined();
  });

  it("says any course counts for a slot the catalogue cannot list, such as a free elective", () => {
    const { ui } = renderEditor({
      openSlots: [{ id: "freeElective1", label: "Free Elective 1", candidates: [] }],
    });
    expect(ui.getByText(/Any Thammasat course counts here/)).toBeDefined();
  });

  it("lifts the free elective box out of the drawer for a term with a free elective slot", () => {
    // The box is the answer to that slot, so it sits next to the question
    // rather than a press away behind the manual controls.
    const { container } = renderEditor({
      openSlots: [{ id: "freeElective1", label: "Free Elective 1", candidates: [] }],
    });
    // The nearest enclosing `<details>` is the term itself, not the drawer of
    // manual controls, which is the one that carries no id.
    const input = container.querySelector('input[name="freeElectiveCredits"]');
    expect(input).not.toBeNull();
    expect(input?.closest("details")?.id).toBe("term-3-semester1");
  });

  it("keeps the free elective box with the manual controls when no slot asks for one", () => {
    const { container } = renderEditor({ courseGroups: [minorRequired] });
    const input = container.querySelector('input[name="freeElectiveCredits"]');
    expect(input?.closest("details")?.querySelector("summary")?.textContent).toBe(
      "Add something else to this term"
    );
  });

  it("names the buckets still owed even when the term has no open slots", () => {
    const { ui } = renderEditor({ courseGroups: [minorRequired] });
    expect(ui.getByText("What this term still needs")).toBeDefined();
    expect(ui.getByText(/6 credits still needed/)).toBeDefined();
  });

  it("does not repeat the whole-plan owed figures under a term that has open slots", () => {
    // The owed figures are about the degree, not this term, and the "what you
    // still owe" table already carries them once on this page. Under a term
    // with its own open choices they would bury the term-specific answer.
    const { ui } = renderEditor({
      courseGroups: [minorRequired],
      openSlots: [{ id: "minorElective1", label: "Minor Elective Course 1", candidates: [] }],
    });
    expect(ui.getByText("Minor Elective Course 1")).toBeDefined();
    expect(ui.queryByText(/6 credits still needed/)).toBeNull();
  });

  it("does not repeat them under a term that has a recommended course either", () => {
    const { ui } = renderEditor({ courseGroups: [recommended, minorRequired] });
    expect(ui.queryByText(/6 credits still needed/)).toBeNull();
  });

  it("never renders the panel heading with nothing underneath it", () => {
    // The regression guard. With no open slot, no recommended course and no
    // owed bucket the panel must not appear at all; the "nothing owed" line
    // takes its place.
    const { ui } = renderEditor({
      courseGroups: [{ id: "other", label: "Everything else", remaining: null, courses: [pi470] }],
    });
    expect(ui.queryByText("What this term still needs")).toBeNull();
    expect(ui.getByText("This plan already covers every requirement.")).toBeDefined();
  });

  it("shows the no-courses-left line instead of an empty select", () => {
    const { container, ui } = renderEditor({ courseGroups: [] });
    expect(container.querySelector("select")).toBeNull();
    expect(ui.getByText("No courses left to add.")).toBeDefined();
  });

  it("ends recommendations but keeps manual add controls once the planned load is filled", () => {
    const { container, ui } = renderEditor({
      recommendedTermComplete: true,
      recommendedCredits: 18,
      courseGroups: [recommended, minorRequired],
      openSlots: [{ id: "minorElective1", label: "Minor Elective Course 1", candidates: [] }],
    });

    const select = container.querySelector("select");
    expect(select).not.toBeNull();
    expect(select?.value).toBe("");
    expect(select?.querySelector('option[value=""]')?.textContent).toBe("Choose a course");
    expect(container.querySelector('input[name="freeElectiveCredits"]')).not.toBeNull();
    expect(addButtonValues(container)).toEqual([]);
    expect(ui.queryByText("What this term still needs")).toBeNull();
    expect(ui.queryByText("Minor Elective Course 1")).toBeNull();
    expect(
      ui.getByText("This term already has the 18 credits the recommended plan schedules.")
    ).toBeDefined();
  });
});

describe("TermEditor internshipOnly", () => {
  it("hides the add-course select and the what-this-term-needs panel, and shows the explanatory line instead", () => {
    const { container, ui } = renderEditor({
      internshipOnly: true,
      courseGroups: [recommended, minorRequired],
      openSlots: [
        {
          id: "minorElective1",
          label: "Minor Elective Course 1",
          candidates: [],
        },
      ],
    });
    expect(container.querySelector("select")).toBeNull();
    expect(ui.queryByText("What this term still needs")).toBeNull();
    expect(ui.queryByText("Minor Elective Course 1")).toBeNull();
    expect(container.querySelector('input[name="freeElectiveCredits"]')).toBeNull();
    expect(ui.getByText("This summer is given over to the internship.")).toBeDefined();
  });

  it("still renders the remove buttons for placed courses", () => {
    const { ui } = renderEditor({
      internshipOnly: true,
      placed: [{ code: "PI574", title: "Internship", credits: 1, missingPrerequisites: [] }],
    });
    expect(ui.getByText("Remove")).toBeDefined();
  });
});
