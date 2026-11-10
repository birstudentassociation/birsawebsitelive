// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import PlanCard from "@/components/home/PlanCard";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { Finding } from "@/lib/study-plan/findings";
import { serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

const stored: { value: { plan: StudyPlan; serialised: string } | null } = { value: null };

vi.mock("@/components/study-plan/useStoredPlan", () => ({
  useStoredPlan: () => stored.value,
}));

const findingsOverride: { value: Finding[] | null } = { value: null };

vi.mock("@/lib/study-plan/findings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/study-plan/findings")>();
  return {
    ...actual,
    checkPlan: (...args: Parameters<typeof actual.checkPlan>) =>
      findingsOverride.value ?? actual.checkPlan(...args),
  };
});

afterEach(() => {
  findingsOverride.value = null;
  cleanup();
  stored.value = null;
});

function basePlan(overrides: Partial<StudyPlan> = {}): StudyPlan {
  const versionId = Object.keys(CURRICULUM_VERSIONS)[0] as StudyPlan["versionId"];
  const version = CURRICULUM_VERSIONS[versionId];
  return {
    versionId,
    cohort: "66",
    startYear: 2566,
    minorId: version.minors[0]!.id,
    passed: [],
    freeElectiveCreditsPassed: 12,
    terms: [],
    ...overrides,
  };
}

function store(plan: StudyPlan) {
  stored.value = { plan, serialised: serialisePlan(plan) };
}

describe("PlanCard", () => {
  it("shows the empty state with no plan", () => {
    const { container } = render(<PlanCard locale="en" />);
    expect(container.querySelector("h2")?.textContent).toBe("Plan your BIR degree");
    const link = container.querySelector("a");
    expect(link?.textContent).toBe("Start a plan");
    expect(link?.getAttribute("href")).toBe("/en/services/study-plan");
  });

  it("shows the empty state in Thai", () => {
    const { container } = render(<PlanCard locale="th" />);
    expect(container.querySelector("h2")?.textContent).toBe("วางแผนการเรียน BIR");
  });

  it("shows credits done out of the total and a ring", () => {
    const plan = basePlan();
    store(plan);
    const total = CURRICULUM_VERSIONS[plan.versionId].graduationCredits.value;
    const { container } = render(<PlanCard locale="en" />);
    expect(container.textContent).toMatch(new RegExp(`\\d+ of ${total} credits done`));
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("h2")?.textContent).toBe("Your study plan");
  });

  it("shows the next term line", () => {
    const plan = basePlan({
      terms: [
        { term: { year: 3, kind: "semester2" }, codes: ["PI574"], freeElectiveCredits: 0 },
        {
          term: { year: 2, kind: "semester1" },
          codes: ["LAS101", "LAS102"],
          freeElectiveCredits: 0,
        },
      ],
    });
    store(plan);
    const { container } = render(<PlanCard locale="en" />);
    expect(container.textContent).toContain("2 courses chosen for year 2, semester 1");
  });

  it("offers Continue your plan when there is no finding", () => {
    findingsOverride.value = [];
    store(basePlan());
    const { container } = render(<PlanCard locale="en" />);
    const links = [...container.querySelectorAll("a")].map((a) => a.textContent);
    expect(links).toContain("Continue your plan");
    expect(links).toContain("Clear saved plan");
    expect(container.textContent).toContain("Saved only on this device.");
  });

  it("shows only one finding, with a prerequisite link", () => {
    const plan = basePlan();
    const version = CURRICULUM_VERSIONS[plan.versionId];
    const withPrereq = version.courses.value.filter((c) => c.prerequisites.length > 0).slice(0, 2);
    plan.terms = [
      {
        term: { year: 1, kind: "semester1" },
        codes: withPrereq.map((c) => c.code),
        freeElectiveCredits: 0,
      },
    ];
    store(plan);
    const { container } = render(<PlanCard locale="en" />);
    const alerts = container.querySelectorAll(".bg-warning-tint");
    expect(alerts).toHaveLength(1);
    const links = [...container.querySelectorAll("a")].map((a) => a.textContent);
    expect(links).toContain("Fix the prerequisite in your plan");
    expect(links).not.toContain("Continue your plan");
    const href = [...container.querySelectorAll("a")]
      .find((a) => a.textContent === "Fix the prerequisite in your plan")
      ?.getAttribute("href");
    expect(href).toContain("/en/services/study-plan/plan?plan=");
  });

  it("does not throw when storage is unavailable", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => render(<PlanCard locale="en" />)).not.toThrow();
    getItem.mockRestore();
  });
});
