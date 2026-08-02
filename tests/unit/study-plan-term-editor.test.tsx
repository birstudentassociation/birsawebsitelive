// @vitest-environment jsdom
/**
 * The smart picker's rendering, as opposed to the engine that decides what
 * goes in it (`lib/study-plan/suggest.ts`, covered by
 * study-plan-suggest.test.ts).
 *
 * The case worth naming is the last but one: a panel that renders its heading
 * with nothing underneath. This screen's `InferenceNotice` shipped exactly
 * that bug once, an alarming box with no sentence in it, and the picker panel
 * has the same shape of condition (show when there are open slots OR an owed
 * bucket), so it can fail the same way. A test that only checked "the panel
 * appears" would have passed for the broken version too.
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
  addButtonLabel: "Add",
  noCoursesAvailable: "No courses left to add.",
  removeLabel: "Remove",
  freeElectiveLabel: "Free elective credits",
  updateFreeElectiveLabel: "Update",
  creditsUnit: "credits",
  errorSummaryTitle: "There is a problem",
  pickHeading: "What this term still needs",
  pickSlotsHint: "The recommended plan leaves these choices to you in this term.",
  pickSlotCandidates: "Courses that fit",
  pickSlotAnyCourse: "Any Thammasat course counts here.",
  pickNothingOwed: "This plan already covers every requirement.",
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
  placed?: TermEditorCourseGroup["courses"];
}) {
  const { container } = render(
    <TermEditor
      term={{ year: 3, kind: "semester1" }}
      termLabel="Year 3, Semester 1"
      plan="PLAN"
      placed={overrides.placed ?? []}
      freeElectiveCredits={0}
      courseGroups={overrides.courseGroups ?? []}
      openSlots={overrides.openSlots ?? []}
      internshipOnly={overrides.internshipOnly ?? false}
      addAction={noop}
      removeAction={noop}
      freeElectiveAction={noopState}
      copy={copy}
    />
  );
  return { container, ui: within(container) };
}

const recommended: TermEditorCourseGroup = {
  id: "recommended",
  label: "Recommended for this term",
  remaining: null,
  courses: [{ code: "PI470", title: "Research Methods", credits: 3, missingPrerequisites: [] }],
};

const minorRequired: TermEditorCourseGroup = {
  id: "minorRequired",
  label: "Governance required courses",
  remaining: 6,
  courses: [{ code: "PI380", title: "Public Policy", credits: 3, missingPrerequisites: ["PI121"] }],
};

describe("TermEditor", () => {
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

  it("lists the open choices the recommended plan leaves in this term", () => {
    const { ui } = renderEditor({
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
  });

  it("says any course counts for a slot the catalogue cannot list, such as a free elective", () => {
    const { ui } = renderEditor({
      openSlots: [{ id: "freeElective1", label: "Free Elective 1", candidates: [] }],
    });
    expect(ui.getByText(/Any Thammasat course counts here/)).toBeDefined();
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

  it("never renders the panel heading with nothing underneath it", () => {
    // The regression guard. With no open slots and no owed bucket the panel
    // must not appear at all; the "nothing owed" line takes its place.
    const { ui } = renderEditor({ courseGroups: [recommended] });
    expect(ui.queryByText("What this term still needs")).toBeNull();
    expect(ui.getByText("This plan already covers every requirement.")).toBeDefined();
  });

  it("shows the no-courses-left line instead of an empty select", () => {
    const { container, ui } = renderEditor({ courseGroups: [] });
    expect(container.querySelector("select")).toBeNull();
    expect(ui.getByText("No courses left to add.")).toBeDefined();
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
