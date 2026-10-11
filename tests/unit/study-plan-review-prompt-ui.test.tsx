// @vitest-environment jsdom
/**
 * The reminder to review a course just finished, as a reader meets it: on the
 * plan screen and in a course page's "Your plan" panel. Worked out in the
 * browser from the plan and the date, only when the review form is live, and
 * dismissible per course with the dismissal kept in the stored envelope.
 *
 * Storage failures are exercised on `Storage.prototype`, for the reason given
 * in study-plan-store.test.tsx: jsdom's localStorage shadows direct assignment.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import ReviewPrompt from "@/components/study-plan/ReviewPrompt";
import YourPlanPanelBody from "@/components/course-review/YourPlanPanelBody";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import {
  envelopeOf,
  parseStoredPlans,
  serialiseEnvelope,
  serialisePlan,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import { dismissReviewPrompt } from "@/lib/study-plan/scenarioStore";

const KEY = "birsa-study-plan";
const BASE = "/en/student-life/course-reviews";

// Cohort 66: study year 3 is academic year 2568, which ended on 31 July 2026.
const plan: StudyPlan = {
  versionId: "2568",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: ["PI121", "PI271"],
  freeElectiveCreditsPassed: 0,
  terms: [
    { term: { year: 3, kind: "semester2" }, codes: ["PI280", "PI390"], freeElectiveCredits: 0 },
    { term: { year: 4, kind: "semester1" }, codes: ["PI364"], freeElectiveCredits: 0 },
  ],
};

const copy = buildPlanLinkCopy("en");

function stored() {
  return parseStoredPlans(window.localStorage.getItem(KEY));
}

beforeEach(() => {
  window.localStorage.clear();
  // Mid-June 2026 in Bangkok, in the summer session: semester 2 of 2568 has just ended.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-06-15T05:00:00Z"));
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const renderPrompt = (props: Partial<React.ComponentProps<typeof ReviewPrompt>> = {}) =>
  render(
    <ReviewPrompt plan={plan} live copy={copy.reviewPrompt} courseLinkBase={BASE} {...props} />
  );

describe("ReviewPrompt", () => {
  it("renders nothing on the server, so no markup depends on the date or on storage", () => {
    const html = renderToStaticMarkup(
      <ReviewPrompt plan={plan} live copy={copy.reviewPrompt} courseLinkBase={BASE} />
    );
    expect(html).toBe("");
  });

  it("asks about each course of the term that just ended, with a link to its review form", () => {
    const { container } = renderPrompt();
    const text = container.textContent ?? "";
    expect(text).toContain(
      "You finished PI280 last term. Two minutes to help next year's students?"
    );
    expect(text).toContain("You finished PI390 last term.");
    // The next term's course is not asked about yet.
    expect(text).not.toContain("PI364");
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([`${BASE}/PI280/review`, `${BASE}/PI390/review`]);
  });

  it("says nothing tracks the reminder", () => {
    const { container } = renderPrompt();
    expect(container.textContent).toContain("nothing about it is sent to BIRSA");
  });

  it("shows nothing when the review form is not live", () => {
    const { container } = renderPrompt({ live: false });
    expect(container.textContent).toBe("");
  });

  it("shows nothing outside the term after the one that just ended", () => {
    vi.setSystemTime(new Date("2026-03-10T05:00:00Z"));
    const { container } = renderPrompt();
    // In March only semester 1 of 2568 has ended, and the plan holds nothing in it.
    expect(container.textContent).toBe("");
  });

  it("asks only about the course it is told to, as on a course page", () => {
    const { container } = renderPrompt({ onlyCode: "PI390" });
    expect(container.textContent).toContain("PI390");
    expect(container.textContent).not.toContain("PI280");
    cleanup();
    const none = renderPrompt({ onlyCode: "PI364" });
    expect(none.container.textContent).toBe("");
  });

  it("dismisses one course, remembers it in the stored envelope and keeps the others", () => {
    window.localStorage.setItem(KEY, serialiseEnvelope(envelopeOf(plan)));
    const ui = renderPrompt();
    fireEvent.click(ui.getByRole("button", { name: /Not now\s*PI280/ }));

    expect(ui.container.textContent).not.toContain("You finished PI280");
    expect(ui.container.textContent).toContain("You finished PI390");
    expect(ui.getByRole("status").textContent).toContain("We will not ask about PI280 again");
    expect(stored()?.dismissedReviewPrompts).toEqual(["PI280"]);
    expect(stored()?.plans[0]?.plan).toEqual(plan);
  });

  it("does not ask again after a reload", () => {
    window.localStorage.setItem(
      KEY,
      serialiseEnvelope(dismissReviewPrompt(envelopeOf(plan), "PI280"))
    );
    const ui = renderPrompt();
    expect(ui.container.textContent).not.toContain("You finished PI280");
    expect(ui.container.textContent).toContain("You finished PI390");
  });

  it("reads a version 1 stored plan as having dismissed nothing", () => {
    window.localStorage.setItem(KEY, serialisePlan(plan));
    const ui = renderPrompt();
    expect(ui.container.textContent).toContain("You finished PI280");
  });

  it("still hides a dismissed prompt for the session when storage refuses the write", () => {
    window.localStorage.setItem(KEY, serialiseEnvelope(envelopeOf(plan)));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const ui = renderPrompt();
    expect(() =>
      fireEvent.click(ui.getByRole("button", { name: /Not now\s*PI280/ }))
    ).not.toThrow();
    expect(ui.container.textContent).not.toContain("You finished PI280");
  });

  it("copes with storage that cannot be read at all", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const ui = renderPrompt();
    expect(ui.container.textContent).toContain("You finished PI280");
    expect(() =>
      fireEvent.click(ui.getByRole("button", { name: /Not now\s*PI280/ }))
    ).not.toThrow();
  });

  it("is dismissed per course, so dismissing both leaves nothing but the announcement", () => {
    window.localStorage.setItem(KEY, serialiseEnvelope(envelopeOf(plan)));
    const ui = renderPrompt();
    fireEvent.click(ui.getByRole("button", { name: /Not now\s*PI280/ }));
    fireEvent.click(ui.getByRole("button", { name: /Not now\s*PI390/ }));
    expect(ui.queryByRole("link")).toBeNull();
    expect(stored()?.dismissedReviewPrompts).toEqual(["PI280", "PI390"]);
  });

  it("speaks Thai", () => {
    const thai = buildPlanLinkCopy("th");
    const { container } = render(
      <ReviewPrompt
        plan={plan}
        live
        copy={thai.reviewPrompt}
        courseLinkBase="/th/student-life/course-reviews"
      />
    );
    expect(container.textContent).toMatch(/[฀-๿]/);
    expect(container.textContent).toContain("PI280");
    expect(container.textContent).not.toMatch(/\{\w+\}/);
  });
});

describe("the prompt in a course page's Your plan panel", () => {
  const panel = (code: string, reviewLive: boolean) =>
    render(
      <YourPlanPanelBody
        code={code}
        locale="en"
        copy={copy}
        planHref="/en/services/study-plan/plan"
        courseLinkBase={BASE}
        reviewLive={reviewLive}
        plan={plan}
        serialisedPlan={serialisePlan(plan)}
      />
    );

  it("appears on the page of a course in the term that just ended", () => {
    const ui = panel("PI280", true);
    expect(ui.container.textContent).toContain("You finished PI280 last term");
    expect(
      within(ui.container)
        .getByRole("link", { name: /Write a review\s*PI280/ })
        .getAttribute("href")
    ).toBe(`${BASE}/PI280/review`);
    // Only this course, not the other in the same term.
    expect(ui.container.textContent).not.toContain("You finished PI390");
  });

  it("is absent from the page of a course that is planned for a later term", () => {
    expect(panel("PI364", true).container.textContent).not.toContain("You finished");
  });

  it("is absent when the review form is not live", () => {
    expect(panel("PI280", false).container.textContent).not.toContain("You finished");
  });
});
