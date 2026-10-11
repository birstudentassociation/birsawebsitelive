// @vitest-environment jsdom
/**
 * The client islands that read the plan back from this device: "Continue your
 * plan" on the study plan start page, and the "Your plan" panel on a course
 * page. Both are enhancements, so what matters most is that they are absent,
 * and harmless, whenever there is no usable plan: nothing stored, something
 * that is not a plan, or storage that throws.
 *
 * See study-plan-store.test.tsx for why the storage failures are simulated on
 * `Storage.prototype`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import ContinuePlan from "@/components/study-plan/ContinuePlan";
import YourPlanPanel from "@/components/course-review/YourPlanPanel";
import YourPlanPanelBody from "@/components/course-review/YourPlanPanelBody";
import AddOutcomeNotice from "@/components/study-plan/AddOutcomeNotice";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { allCourseCodes, counterparts, versionsOf } from "@/lib/courses/graph";
import { applyAddParam } from "@/lib/study-plan/addToPlan";
import {
  deserialisePlan,
  envelopeOf,
  serialiseEnvelope,
  serialisePlan,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import { addScenario } from "@/lib/study-plan/scenarioStore";

const KEY = "birsa-study-plan";
const copy = buildPlanLinkCopy("en");

const plan: StudyPlan = {
  versionId: "2564-rev2566",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: ["PI211"],
  freeElectiveCreditsPassed: 0,
  terms: [{ term: { year: 3, kind: "semester2" }, codes: ["PI340"], freeElectiveCredits: 0 }],
};

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("ContinuePlan", () => {
  const render_ = () =>
    render(<ContinuePlan copy={copy.resume} planHref="/en/services/study-plan/plan" />);

  it("offers to continue a stored plan, linking to the plan screen with that plan", () => {
    window.localStorage.setItem(KEY, serialisePlan(plan));
    const { container, getByRole } = render_();
    const link = getByRole("link", { name: "Continue your plan" });
    const href = link.getAttribute("href")!;
    expect(href.startsWith("/en/services/study-plan/plan?plan=")).toBe(true);
    const sent = decodeURIComponent(href.split("?plan=")[1]!);
    expect(deserialisePlan(sent)).toEqual(plan);
    expect(container.textContent).toContain("cohort 66");
    expect(container.textContent).toContain("Nothing is sent to BIRSA");
  });

  it("continues from the active scenario when several are saved", () => {
    const other = { ...plan, cohort: "67", startYear: 2567 };
    const envelope = addScenario(envelopeOf(plan), "Away", other)!;
    window.localStorage.setItem(KEY, serialiseEnvelope(envelope));
    const { container, getByRole } = render_();
    expect(container.textContent).toContain("cohort 67");
    const sent = decodeURIComponent(getByRole("link").getAttribute("href")!.split("?plan=")[1]!);
    expect(deserialisePlan(sent)).toEqual(other);
  });

  it("renders nothing for an envelope that has been tampered with", () => {
    const envelope = envelopeOf(plan);
    window.localStorage.setItem(KEY, JSON.stringify({ ...envelope, active: "gone" }));
    expect(render_().container.innerHTML).toBe("");
  });

  it("renders nothing when no plan is stored", () => {
    expect(render_().container.innerHTML).toBe("");
  });

  it("renders nothing for a stored value that is not a valid plan", () => {
    for (const junk of ["garbage", "{}", "e30", serialisePlan(plan).slice(0, -6)]) {
      window.localStorage.setItem(KEY, junk);
      const { container } = render_();
      expect(container.innerHTML, junk).toBe("");
      cleanup();
    }
  });

  it("builds its link from the validated plan, not the stored string", () => {
    // A plan with extra, unknown fields is re-serialised without them.
    const loose = serialisePlan({ ...plan, extra: "x" } as StudyPlan);
    window.localStorage.setItem(KEY, loose);
    const href = render_().getByRole("link").getAttribute("href")!;
    expect(decodeURIComponent(href.split("?plan=")[1]!)).toBe(serialisePlan(plan));
  });

  it("renders nothing, and does not throw, when reading storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("SecurityError");
    });
    let html = "not rendered";
    expect(() => {
      html = render_().container.innerHTML;
    }).not.toThrow();
    expect(html).toBe("");
  });
});

describe("YourPlanPanel", () => {
  const panel = () =>
    render(
      <YourPlanPanel
        code="PI300"
        locale="en"
        copy={copy}
        planHref="/en/services/study-plan/plan"
        courseLinkBase="/en/student-life/course-reviews"
      />
    );

  it("is absent when there is no plan, so the page is exactly what it was", () => {
    expect(panel().container.innerHTML).toBe("");
  });

  it("is absent for a stored value that is not a plan", () => {
    window.localStorage.setItem(KEY, "not a plan");
    expect(panel().container.innerHTML).toBe("");
  });

  it("is absent, and does not throw, when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("SecurityError");
    });
    expect(() => panel()).not.toThrow();
  });
});

describe("YourPlanPanelBody", () => {
  // September 2024 is semester 1 of academic year 2567, so a cohort 66 student
  // is in study year 2, semester 1, and the term the panel suggests is fixed.
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2024-09-01T12:00:00+07:00"), toFake: ["Date"] });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const body = (code: string, overrides: Partial<StudyPlan> = {}, locale: "en" | "th" = "en") => {
    const own = { ...plan, ...overrides };
    return render(
      <YourPlanPanelBody
        code={code}
        locale={locale}
        copy={buildPlanLinkCopy(locale)}
        planHref={`/${locale}/services/study-plan/plan`}
        courseLinkBase={`/${locale}/student-life/course-reviews`}
        plan={own}
        serialisedPlan={serialisePlan(own)}
      />
    );
  };

  it("says a course is planned, for which term, and links the plan screen", () => {
    const { container, getByRole } = body("PI340");
    expect(container.textContent).toContain("Planned for Year 3, Semester 2.");
    // Planned already, so there is nothing to add.
    expect(container.textContent).not.toContain("Add to your plan");
    expect(getByRole("link", { name: /Open your plan/ }).getAttribute("href")).toContain(
      "/en/services/study-plan/plan?plan="
    );
  });

  it("says what moving a planned course later does to graduation, and only for a planned course", () => {
    const planned = body("PI340").container.textContent ?? "";
    expect(planned).toContain("If you move it later");
    expect(planned).toContain("Moves PI340 from Year 3, Semester 2 to Year 4, Semester 1.");
    // The only planned course, so it is the last term: graduation moves with it.
    expect(planned).toContain("Graduation moves from Year 3, Semester 2 to Year 4, Semester 1.");
    cleanup();
    expect(body("PI211").container.textContent).not.toContain("If you move it later");
    cleanup();
    expect(body("PI300").container.textContent).not.toContain("If you move it later");
  });

  it("says a course is passed", () => {
    const { container } = body("PI211");
    expect(container.textContent).toContain("You have passed this course.");
    expect(container.textContent).not.toContain("Add to your plan");
  });

  it("names the prerequisites as links and says whether the plan covers them", () => {
    const { container, getAllByRole } = body("PI300");
    const links = getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(links).toContain("/en/student-life/course-reviews/PI211");
    expect(container.textContent).toContain("passed");
    expect(container.textContent).toContain("Your plan covers them.");
  });

  it("reports an unmet prerequisite plainly and still offers to add the course", () => {
    const { container, getByRole } = body("PI300", { passed: [] });
    expect(container.textContent).toContain("not in your plan");
    expect(container.textContent).toContain("does not cover all of them yet");
    const add = getByRole("link", { name: /Add to your plan/ }).getAttribute("href")!;
    expect(add).toContain("&add=PI300&term=");
  });

  it("builds an add link the plan screen accepts", () => {
    // Whatever term the panel suggests, applying it to the plan must work.
    const { getByRole } = body("PI300");
    const href = getByRole("link", { name: /Add to your plan/ }).getAttribute("href")!;
    const params = new URL(href, "https://example.test").searchParams;
    const sentPlan = deserialisePlan(params.get("plan")!)!;
    expect(sentPlan).toEqual(plan);
    const result = applyAddParam(sentPlan, params.get("add"), params.get("term"), {
      year: 2,
      kind: "semester1",
    });
    expect(result.status).toBe("added");
    expect(params.get("term")).toBe("3-semester1");
  });

  it("shows the counterpart when the student's curriculum knows the course by another code", () => {
    // LAS101 stands in for TU104 in 2564, so the panel is about TU104.
    const { container, getAllByRole, getByRole } = body("LAS101", {
      versionId: "2564",
      cohort: "64",
      passed: [],
      terms: [],
    });
    expect(container.textContent).toContain("this course is");
    expect(getAllByRole("link").map((a) => a.textContent)).toContain("TU104");
    expect(getByRole("link", { name: /Add to your plan/ }).getAttribute("href")).toContain(
      "&add=TU104&term="
    );
  });

  it("says so, and offers no add, when the student's curriculum has no such course", () => {
    const orphan = allCourseCodes().find(
      (code) => !versionsOf(code).includes("2564") && counterparts(code, "2564").length === 0
    )!;
    const { container, queryByRole } = body(orphan, {
      versionId: "2564",
      cohort: "64",
      passed: [],
      terms: [],
    });
    expect(container.textContent).toContain("is not in your curriculum");
    expect(queryByRole("link")).toBeNull();
  });

  it("names what it counts towards for the student's minor", () => {
    const governance = body("PI380", { minorId: "governance" }).container.textContent;
    expect(governance).toContain("required courses");
    cleanup();
    const gpe = body("PI380", { minorId: "globalPoliticalEconomy" }).container.textContent;
    expect(gpe).toContain("Electives outside");
  });

  it("renders in Thai with Thai text", () => {
    const { container } = body("PI340", {}, "th");
    expect(container.textContent).toContain("แผนการศึกษาของท่าน");
    expect(container.textContent).toContain("วางแผนไว้ที่ ชั้นปีที่ 3, ภาคการศึกษาที่ 2");
  });

  it("states facts and never a score", () => {
    const text = body("PI300", { passed: [] }).container.textContent ?? "";
    expect(text).not.toMatch(/\b(stars?|rating|score|difficulty)\b/i);
  });
});

describe("AddOutcomeNotice", () => {
  const version = CURRICULUM_VERSIONS[plan.versionId];
  const position = { year: 2, kind: "semester1" } as const;
  const notice = (code: string, term: string) =>
    render(
      <AddOutcomeNotice
        outcome={applyAddParam(plan, code, term, position)}
        linkCopy={copy}
        version={version}
        undoHref="/en/services/study-plan/plan?plan=ORIGINAL"
      />
    );

  it("confirms the add naming the course and the term, with an undo to the original plan", () => {
    const { container, getByRole } = notice("PI300", "3-semester1");
    expect(container.textContent).toContain("Added to your plan");
    expect(container.textContent).toContain("PI300");
    expect(container.textContent).toContain("Year 3, Semester 1");
    const undo = getByRole("link", { name: /Undo/ });
    expect(undo.getAttribute("href")).toBe("/en/services/study-plan/plan?plan=ORIGINAL");
  });

  it("explains a refusal and says nothing changed, with no undo to offer", () => {
    const { container, queryByRole } = notice("PI211", "3-semester1");
    expect(container.textContent).toContain("We did not change your plan");
    expect(container.textContent).toContain("You have already passed PI211.");
    expect(container.textContent).toContain("exactly as it was");
    expect(queryByRole("link")).toBeNull();
  });

  it("names the term in a refusal that is about the term", () => {
    expect(notice("PI300", "1-semester1").container.textContent).toContain(
      "Year 1, Semester 1 has already started or passed"
    );
  });

  it("says 'that code' rather than printing a blank when the link carried no code", () => {
    expect(notice("", "3-semester1").container.textContent).toContain(
      "We do not recognise that code as a course."
    );
  });

  it("never prints a raw placeholder, whatever the reason", () => {
    for (const [code, term] of [
      ["PI300", "3-semester1"],
      ["PI211", "3-semester1"],
      ["PI300", "nonsense"],
      ["ZZ999", "3-semester1"],
      ["", ""],
      ["PI300", "1-semester1"],
    ] as const) {
      expect(notice(code, term).container.textContent, `${code} ${term}`).not.toMatch(/\{\w+\}/);
      cleanup();
    }
  });
});
