// @vitest-environment jsdom
/**
 * Unit tests for `components/study-plan/PlanStore.tsx` and
 * `DeletePlanButton.tsx`, the two pieces of this task the preview browser
 * could not exercise: that environment runs no client effects at all (not
 * even a click handler on the pre-existing, unrelated `ThemeToggle`), so the
 * localStorage write/clear was verified there only by reading the code.
 * jsdom, unlike that preview, does run React effects and click handlers, so
 * it can actually catch a broken effect dependency, a missing try/catch, or
 * a delete button that forgets to call `clearStoredPlan`.
 *
 * `vitest.config.ts` sets `environment: "node"` globally (most of this
 * repo's tests are pure content/logic checks with no DOM), so the
 * `@vitest-environment jsdom` docblock above is required per-file, matching
 * `tests/unit/confirm-dialog.test.tsx`.
 *
 * The degradation tests below spy on `Storage.prototype`, not on
 * `window.localStorage` directly (`vi.spyOn(window.localStorage, "setItem")`,
 * or a plain reassignment of `window.localStorage.setItem`) . jsdom's
 * `localStorage` is a WebIDL "legacy platform object": its own-property slots
 * for named storage keys shadow ordinary property assignment, so neither a
 * direct reassignment nor `vi.spyOn` on the instance actually intercepts the
 * calls `PlanStore` makes; the mock is silently never invoked. Spying on
 * `Storage.prototype` instead, which really does hold `setItem`/`getItem`/
 * `removeItem` as configurable, writable methods, works and was checked
 * against production code before being relied on here (see the fix-round
 * section of the task report for how each variant was diagnosed).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";

import PlanStore, { clearStoredPlan, readStoredPlan } from "@/components/study-plan/PlanStore";
import DeletePlanButton from "@/components/study-plan/DeletePlanButton";
import {
  envelopeOf,
  parseStoredPlans,
  serialiseEnvelope,
  serialisePlan,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import { addScenario, switchScenario } from "@/lib/study-plan/scenarioStore";

const KEY = "birsa-study-plan";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

const plan: StudyPlan = {
  versionId: "2564-rev2566",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: ["PI211"],
  freeElectiveCreditsPassed: 0,
  terms: [],
};
const otherPlan: StudyPlan = { ...plan, passed: ["PI211", "PI271"] };

/** What is in storage, parsed. */
const stored = () => parseStoredPlans(window.localStorage.getItem(KEY));

describe("PlanStore", () => {
  it("writes the plan to localStorage under birsa-study-plan as a one-scenario envelope", () => {
    render(<PlanStore plan={serialisePlan(plan)} />);
    expect(stored()).toEqual({
      v: 2,
      active: "s1",
      plans: [{ id: "s1", name: "Main", plan }],
      dismissedReviewPrompts: [],
    });
    expect(window.localStorage.getItem(KEY)?.startsWith("{")).toBe(true);
  });

  it("names the first scenario in the page's language", () => {
    render(<PlanStore plan={serialisePlan(plan)} defaultName="แผนหลัก" />);
    expect(stored()?.plans[0]?.name).toBe("แผนหลัก");
  });

  it("overwrites the stored plan when re-rendered with a different plan", () => {
    const { rerender } = render(<PlanStore plan={serialisePlan(plan)} />);
    rerender(<PlanStore plan={serialisePlan(otherPlan)} />);
    expect(stored()?.plans).toHaveLength(1);
    expect(stored()?.plans[0]?.plan).toEqual(otherPlan);
  });

  it("saves the plan on screen as the active scenario and leaves the others alone", () => {
    const envelope = addScenario(envelopeOf(plan), "Away", plan)!;
    window.localStorage.setItem(KEY, serialiseEnvelope(switchScenario(envelope, "s1")!));
    render(<PlanStore plan={serialisePlan(otherPlan)} />);
    expect(stored()?.plans.map((p) => [p.id, p.name, p.plan.passed.length])).toEqual([
      ["s1", "Main", 2],
      ["s2", "Away", 1],
    ]);
    expect(stored()?.active).toBe("s1");
  });

  it("upgrades a plan stored by an earlier visit without losing it", () => {
    window.localStorage.setItem(KEY, serialisePlan(plan));
    render(<PlanStore plan={serialisePlan(otherPlan)} />);
    expect(stored()?.plans).toEqual([{ id: "s1", name: "Main", plan: otherPlan }]);
  });

  it("writes nothing for a value that is not a plan", () => {
    render(<PlanStore plan="plan-a" />);
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it("renders no DOM, which is what makes skipping the mounted/hydration gate correct", () => {
    const { container } = render(<PlanStore plan={serialisePlan(plan)} />);
    expect(container.innerHTML).toBe("");
  });

  it("does not throw, and leaves nothing stored, when localStorage.setItem throws (quota or private browsing)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    expect(() => render(<PlanStore plan={serialisePlan(plan)} />)).not.toThrow();
    // Reach past the mock (still active) to confirm nothing was written:
    // getItem is untouched, so this reads the real, empty storage.
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});

describe("readStoredPlan / clearStoredPlan", () => {
  it("readStoredPlan returns null when nothing is stored", () => {
    expect(readStoredPlan()).toBeNull();
  });

  it("clearStoredPlan removes the key, and readStoredPlan returns null afterwards", () => {
    window.localStorage.setItem(KEY, "plan-a");
    clearStoredPlan();
    expect(window.localStorage.getItem(KEY)).toBeNull();
    expect(readStoredPlan()).toBeNull();
  });

  it("readStoredPlan does not throw, and returns null, when localStorage.getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("SecurityError");
    });

    let result: string | null = "not-null";
    expect(() => {
      result = readStoredPlan();
    }).not.toThrow();
    expect(result).toBeNull();
  });

  it("clearStoredPlan does not throw when localStorage.removeItem throws, and leaves the key in place", () => {
    window.localStorage.setItem(KEY, "plan-a");
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("SecurityError");
    });

    expect(() => clearStoredPlan()).not.toThrow();
    // getItem is untouched by the mock, so this proves removeItem's failure
    // was swallowed rather than partially applied.
    expect(window.localStorage.getItem(KEY)).toBe("plan-a");
  });
});

describe("DeletePlanButton", () => {
  it("clicking it calls clearStoredPlan, removing the stored key", () => {
    window.localStorage.setItem(KEY, "plan-a");
    const { getByRole } = render(
      // type="submit" with no surrounding <form> is deliberate: it isolates
      // the click handler under test from a real form submission, which
      // jsdom does not implement anyway (no navigation).
      <DeletePlanButton>Delete this plan</DeletePlanButton>
    );

    fireEvent.click(getByRole("button", { name: "Delete this plan" }));
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});
