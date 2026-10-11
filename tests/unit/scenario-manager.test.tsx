// @vitest-environment jsdom
/**
 * The scenario switcher and the "keep this as a scenario" button: client
 * enhancements over localStorage. As with the other islands that read the plan
 * back, what matters most is that they are absent and harmless without a usable
 * plan, and that they never claim to have saved when storage refused.
 *
 * See study-plan-store.test.tsx for why storage failures are simulated on
 * `Storage.prototype`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import SaveScenarioButton from "@/components/study-plan/SaveScenarioButton";
import ScenarioManager from "@/components/study-plan/ScenarioManager";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import {
  deserialisePlan,
  envelopeOf,
  parseStoredPlans,
  serialiseEnvelope,
  serialisePlan,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import { addScenario } from "@/lib/study-plan/scenarioStore";

const KEY = "birsa-study-plan";
const copy = buildTermInsightCopy("en").scenarios;
const PLAN_HREF = "/en/services/study-plan/plan";

const plan: StudyPlan = {
  versionId: "2564-rev2566",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: ["PI211"],
  freeElectiveCreditsPassed: 0,
  terms: [],
};
const away: StudyPlan = { ...plan, passed: ["PI211", "PI271"] };

const stored = () => parseStoredPlans(window.localStorage.getItem(KEY));
const assign = vi.fn();

beforeEach(() => {
  window.localStorage.clear();
  assign.mockReset();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, assign },
  });
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

const manager = () =>
  render(<ScenarioManager copy={copy} currentPlan={serialisePlan(plan)} planHref={PLAN_HREF} />);

/** Two scenarios, "Main" (current) and "Away". */
function twoScenarios() {
  const envelope = addScenario(envelopeOf(plan), "Away", away)!;
  window.localStorage.setItem(KEY, serialiseEnvelope({ ...envelope, active: "s1" }));
}

describe("ScenarioManager", () => {
  it("renders nothing when no plan is stored, so the page is what it was", () => {
    expect(manager().container.innerHTML).toBe("");
  });

  it("renders nothing for a stored value that is not a plan", () => {
    window.localStorage.setItem(KEY, "not a plan");
    expect(manager().container.innerHTML).toBe("");
  });

  it("renders nothing, and does not throw, when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("SecurityError");
    });
    let html = "not rendered";
    expect(() => {
      html = manager().container.innerHTML;
    }).not.toThrow();
    expect(html).toBe("");
  });

  it("lists the saved scenarios, marks the current one and links a comparison with the other", () => {
    twoScenarios();
    const { container, getByRole } = manager();
    expect(container.textContent).toContain("Main");
    expect(container.textContent).toContain("Away");
    expect(container.textContent).toContain("Current");
    const link = getByRole("link", { name: /Compare with current/ });
    const params = new URL(link.getAttribute("href")!, "https://example.test").searchParams;
    expect(deserialisePlan(params.get("plan")!)).toEqual(plan);
    expect(deserialisePlan(params.get("compare")!)).toEqual(away);
    expect(params.get("compareName")).toBe("Away");
    expect(link.getAttribute("href")).toMatch(/#compare$/);
  });

  it("opens a scenario by making it active and loading the plan screen with its plan", () => {
    twoScenarios();
    const { getByRole } = manager();
    fireEvent.click(getByRole("button", { name: /Open/ }));
    expect(stored()?.active).toBe("s2");
    expect(assign).toHaveBeenCalledTimes(1);
    const target = new URL(assign.mock.calls[0]![0] as string, "https://example.test");
    expect(target.pathname).toBe(PLAN_HREF);
    expect(deserialisePlan(target.searchParams.get("plan")!)).toEqual(away);
  });

  it("saves a copy of the plan on screen as a new scenario and makes it current", () => {
    window.localStorage.setItem(KEY, serialiseEnvelope(envelopeOf(plan)));
    const { getByLabelText, getByRole } = manager();
    fireEvent.change(getByLabelText(/Name for the new scenario/), {
      target: { value: "Term abroad" },
    });
    fireEvent.click(getByRole("button", { name: /Save a copy of this plan/ }));
    expect(stored()?.plans.map((p) => p.name)).toEqual(["Main", "Term abroad"]);
    expect(stored()?.active).toBe("s2");
    expect(stored()?.plans[1]?.plan).toEqual(plan);
  });

  it("renames a scenario", () => {
    twoScenarios();
    const { getAllByRole, getByLabelText, getByRole } = manager();
    fireEvent.click(getAllByRole("button", { name: /Rename/ })[1]!);
    fireEvent.change(getByLabelText("New name"), { target: { value: "Exchange" } });
    fireEvent.click(getByRole("button", { name: "Save" }));
    expect(stored()?.plans.map((p) => p.name)).toEqual(["Main", "Exchange"]);
  });

  it("asks before deleting, and deletes only when confirmed", () => {
    twoScenarios();
    const { getAllByRole, getByRole } = manager();
    fireEvent.click(getAllByRole("button", { name: /^Delete/ })[1]!);
    expect(stored()?.plans).toHaveLength(2);
    fireEvent.click(getByRole("button", { name: /Yes, delete/ }));
    expect(stored()?.plans.map((p) => p.name)).toEqual(["Main"]);
  });

  it("offers no delete for the only scenario", () => {
    window.localStorage.setItem(KEY, serialiseEnvelope(envelopeOf(plan)));
    const { queryByRole } = manager();
    expect(queryByRole("button", { name: /^Delete/ })).toBeNull();
  });

  it("says so, and changes nothing, when storage refuses a write", () => {
    window.localStorage.setItem(KEY, serialiseEnvelope(envelopeOf(plan)));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });
    const { container, getByRole } = manager();
    fireEvent.click(getByRole("button", { name: /Save a copy of this plan/ }));
    expect(container.textContent).toContain("We could not save to this device");
    expect(stored()?.plans).toHaveLength(1);
  });

  it("stops offering new scenarios at the limit", () => {
    let envelope = envelopeOf(plan);
    for (let i = 1; i < 6; i += 1) envelope = addScenario(envelope, `Plan ${i}`, plan)!;
    window.localStorage.setItem(KEY, serialiseEnvelope(envelope));
    const { container, getByRole } = manager();
    expect(container.textContent).toContain("up to 6 scenarios");
    expect(
      (getByRole("button", { name: /Save a copy of this plan/ }) as HTMLButtonElement).disabled
    ).toBe(true);
  });
});

describe("SaveScenarioButton", () => {
  const button = () =>
    render(
      <SaveScenarioButton
        plan={serialisePlan(away)}
        name="If I switch to Public Administration"
        label="Keep this as a scenario"
        copy={copy}
        planHref={PLAN_HREF}
      />
    );

  it("adds the previewed plan as a new scenario and opens the plan screen on it", () => {
    window.localStorage.setItem(KEY, serialiseEnvelope(envelopeOf(plan)));
    fireEvent.click(button().getByRole("button", { name: "Keep this as a scenario" }));
    expect(stored()?.plans.map((p) => p.name)).toEqual([
      "Main",
      "If I switch to Public Administration",
    ]);
    expect(stored()?.plans[1]?.plan).toEqual(away);
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("says so rather than navigating when there is no saved plan to add to", () => {
    const { container, getByRole } = button();
    fireEvent.click(getByRole("button", { name: "Keep this as a scenario" }));
    expect(container.textContent).toContain("We could not save to this device");
    expect(assign).not.toHaveBeenCalled();
  });
});
