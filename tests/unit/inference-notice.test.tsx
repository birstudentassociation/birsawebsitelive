// @vitest-environment jsdom
/**
 * Regression coverage for several related behaviours of the same component.
 *
 * A design doc once flagged the component's empty-return branch
 * (`parts.length === 0 && items.length === 0`) as unreachable and therefore
 * untested, because no real curriculum version yielded zero inferred parts and
 * zero applicable disclosures. That stopped being true on 2026-08-02, and then
 * became true of every version. The component was deciding whether to render
 * from the raw, unfiltered `parts`/`items` counts rather than from what would
 * actually be shown, so it rendered an empty warning box (heading and "check
 * the source documents" line, no content) instead of nothing. The fix moved
 * the render decision to the final, filtered sentence list.
 *
 * The tests below cover that branch with real curriculum data. What changed on
 * the second pass through the sources is that the branch is no longer reached
 * by suppressing and nulling things: 2568's plan turned out to be published
 * (section 4.3.2.3 of its own document) and the 2023 revision's 127-credit
 * total turned out to be printed (page 12 of the Student Handbook 2021), so
 * there is genuinely nothing left to warn anyone about. That is also why the
 * control test, which proves the fix did not simply disable the component, now
 * has to build a version with a disclosure rather than borrow a real one.
 *
 * The dedup logic in `InferenceNotice` (identical sentences appearing as both
 * an `inferredParts()` reason and a `disclosures()` entry) is unchanged and
 * untouched by any of this.
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
// This repo has no global vitest setup file, so the jest-dom matchers
// (toBeEmptyDOMElement, used below) are imported per-file where needed.
import "@testing-library/jest-dom/vitest";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { CurriculumVersion } from "@/content/curriculum";

afterEach(() => {
  cleanup();
});

describe("InferenceNotice", () => {
  // The borrowed-study-plan sentence used to be suppressed for cohort 68 by a
  // flag in the data. It is now gone from the data altogether: the 2568
  // document's own study plan was found at section 4.3.2.3 and the plan's
  // derivation is `published`, so there is no inference left to describe. The
  // check that it does not reach a student is kept, because it is the sentence
  // this component exists to gate, but it holds for a stronger reason now.
  it("does not render a borrowed-study-plan warning for cohort 68", () => {
    render(<InferenceNotice version={CURRICULUM_VERSIONS["2568"]} cohortCode="68" locale="en" />);
    expect(screen.queryByText(/no published study plan/i)).toBeNull();
  });

  // The two tests that used to live here (cohort 66 not seeing, cohort 67
  // seeing, the "no published document" attestation disclosure) were removed
  // on 2026-08-02: the official curriculum page now documents cohort 67
  // directly, the cohort-67-attested contradiction was deleted, and neither
  // cohort sees that notice anymore. Nothing replaces them here; the
  // equivalent cohort-69/68 scoping is already covered in
  // tests/unit/curriculum-registry.test.ts.

  // The empty-return branch is still the point of this file: the component
  // must decide whether to render from the final, filtered sentence list, not
  // from the raw `inferredParts`/`disclosures` counts, or it draws a heading
  // and a "check the source documents" line over nothing. No shipped version
  // reaches that branch any more, because the plan-deviation disclosures
  // (`semester2-courses-moved`, `minor-required-slots-semester2`) are real
  // student-facing sentences. So the branch is covered with a synthetic
  // version whose only contradictions have `disclosure: null`, and the shipped
  // 2568 cohorts are checked to show exactly the sentences that exist.
  it("renders nothing at all when every contradiction is nulled and nothing is inferred", () => {
    const quiet: CurriculumVersion = {
      ...CURRICULUM_VERSIONS["2568"],
      verification: {
        ...CURRICULUM_VERSIONS["2568"].verification,
        contradictions: CURRICULUM_VERSIONS["2568"].verification.contradictions.map((c) => ({
          ...c,
          disclosure: null,
        })),
      },
    };
    const { container } = render(<InferenceNotice version={quiet} cohortCode="68" locale="en" />);
    expect(container).toBeEmptyDOMElement();
  });

  for (const cohortCode of ["68", "69"]) {
    it(`tells a cohort ${cohortCode} student about both plan changes on 2568, in both languages`, () => {
      for (const locale of ["en", "th"] as const) {
        const { container, unmount } = render(
          <InferenceNotice
            version={CURRICULUM_VERSIONS["2568"]}
            cohortCode={cohortCode}
            locale={locale}
          />
        );
        expect(container).not.toBeEmptyDOMElement();
        const items = container.querySelectorAll("li");
        expect(items).toHaveLength(2);
        const text = container.textContent ?? "";
        expect(text).toContain("LAS101");
        expect(text).toContain(locale === "en" ? "minor required" : "วิชาโทบังคับ");
        unmount();
      }
    });
  }

  it("still renders normally when there is something to say, proving the fix did not disable the component", () => {
    // The control for the two empty-render tests above: it proves the fix is
    // conditional on there being nothing left to show, not an accidental way
    // to silence the component for every version.
    //
    // This used to run on cohort 66 and the 2023 revision's real
    // total-never-printed disclosure. That disclosure was stood down on
    // 2026-08-02 once the Student Handbook 2021 was found to print "Total 127"
    // outright, so the control is synthetic. It borrows a real version for
    // every other field and overrides only the contradiction list, so the
    // component is still driven by a well-formed CurriculumVersion.
    const withSomethingToSay: CurriculumVersion = {
      ...CURRICULUM_VERSIONS["2564-rev2566"],
      verification: {
        ...CURRICULUM_VERSIONS["2564-rev2566"].verification,
        contradictions: [
          {
            id: "fixture-disclosure",
            summary: "fixture: a contradiction with something to tell a student",
            disclosure: {
              en: "This is a fixture disclosure with a real sentence in it.",
              th: "นี่คือข้อความเปิดเผยสำหรับการทดสอบ",
            },
          },
        ],
      },
    };
    const { container } = render(
      <InferenceNotice version={withSomethingToSay} cohortCode="66" locale="en" />
    );
    expect(container).not.toBeEmptyDOMElement();
    expect(
      screen.getByText("This is a fixture disclosure with a real sentence in it.")
    ).toBeInTheDocument();
  });

  it("no longer shows the deleted attestation disclosure to a cohort 67 student", () => {
    render(
      <InferenceNotice version={CURRICULUM_VERSIONS["2564-rev2566"]} cohortCode="67" locale="en" />
    );
    // The minor-slot disclosure on this version is not cohort-scoped, so the
    // notice does render for cohort 67; this confirms the attestation notice truly
    // stopped rendering rather than merely being replaced by a passing test.
    expect(
      screen.queryByText(/No published document says which curriculum cohort 67 follows/)
    ).toBeNull();
  });
});
