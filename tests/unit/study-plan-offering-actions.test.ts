import { beforeEach, describe, expect, it, vi } from "vitest";
import { canPlaceInTerm, CURRICULUM_VERSIONS } from "@/content/curriculum";
import { assumedHistory } from "@/lib/study-plan/derive";
import { deserialisePlan, PLAN_FIELD, serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

const draftState = vi.hoisted(() => ({ draft: {} as Record<string, string> }));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

vi.mock("@/components/forms/draftCookie", () => ({
  readDraft: async () => draftState.draft,
  mergeDraft: async () => undefined,
  clearDraft: async () => undefined,
}));

import {
  addCourseToTerm,
  populatePlanFromRecommended,
  submitFillStep,
} from "@/app/[lang]/services/study-plan/actions";

const basePlan: StudyPlan = {
  versionId: "2564-rev2566",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: [],
  freeElectiveCreditsPassed: 0,
  terms: [],
};

async function redirectOf(run: () => Promise<unknown>): Promise<URL> {
  try {
    await run();
  } catch (error) {
    const message = (error as Error).message;
    if (message.startsWith("REDIRECT:")) return new URL(message.slice(9), "https://example.test");
    throw error;
  }
  throw new Error("expected a redirect");
}

function form(fields: Record<string, string | string[]>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    for (const v of Array.isArray(value) ? value : [value]) data.append(key, v);
  }
  return data;
}

beforeEach(() => {
  draftState.draft = {};
});

describe("addCourseToTerm and semester 2 only courses", () => {
  it("refuses a semester 2 only course in a semester 1 term, even when the form posts it", async () => {
    const url = await redirectOf(() =>
      addCourseToTerm(
        "en",
        form({ [PLAN_FIELD]: serialisePlan(basePlan), year: "3", kind: "semester1", code: "PI320" })
      )
    );
    const plan = deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "");
    expect(plan?.terms.flatMap((t) => t.codes)).not.toContain("PI320");
    expect(url.searchParams.get("notice")).toBe("notOffered");
  });

  it("refuses it when the course is named by title rather than code", async () => {
    const title = CURRICULUM_VERSIONS["2564-rev2566"].courses.value.find(
      (c) => c.code === "PI320"
    )!.title;
    const url = await redirectOf(() =>
      addCourseToTerm(
        "en",
        form({ [PLAN_FIELD]: serialisePlan(basePlan), year: "3", kind: "semester1", code: title })
      )
    );
    const plan = deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "");
    expect(plan?.terms.flatMap((t) => t.codes)).not.toContain("PI320");
  });

  it("adds it to a semester 2 term", async () => {
    const url = await redirectOf(() =>
      addCourseToTerm(
        "en",
        form({ [PLAN_FIELD]: serialisePlan(basePlan), year: "3", kind: "semester2", code: "PI320" })
      )
    );
    const plan = deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "");
    expect(plan?.terms[0]?.codes).toEqual(["PI320"]);
    expect(url.searchParams.get("notice")).toBeNull();
  });

  it("adds it to a summer term, which is not restricted", async () => {
    const url = await redirectOf(() =>
      addCourseToTerm(
        "en",
        form({ [PLAN_FIELD]: serialisePlan(basePlan), year: "3", kind: "summer", code: "PI320" })
      )
    );
    const plan = deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "");
    expect(plan?.terms[0]?.codes).toEqual(["PI320"]);
  });

  it("still adds a course with no designation to a semester 1 term", async () => {
    const url = await redirectOf(() =>
      addCourseToTerm(
        "en",
        form({ [PLAN_FIELD]: serialisePlan(basePlan), year: "3", kind: "semester1", code: "PI390" })
      )
    );
    const plan = deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "");
    expect(plan?.terms[0]?.codes).toEqual(["PI390"]);
  });
});

describe("populatePlanFromRecommended and semester 2 only courses", () => {
  it("places no such course in a semester 1 term of the 2568 plan", async () => {
    draftState.draft = { positionYear: "1", positionKind: "semester1" };
    const plan: StudyPlan = { ...basePlan, versionId: "2568", cohort: "68", startYear: 2568 };
    const url = await redirectOf(() =>
      populatePlanFromRecommended("en", form({ [PLAN_FIELD]: serialisePlan(plan) }))
    );
    const result = deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "");
    expect(result).not.toBeNull();
    for (const term of result!.terms) {
      if (term.term.kind !== "semester1") continue;
      for (const code of term.codes) expect(canPlaceInTerm(code, "semester1"), code).toBe(true);
    }
  });
});

describe("submitFillStep and semester 2 only courses", () => {
  it("drops a posted course that cannot sit in the slot's semester 1 term", async () => {
    const version = CURRICULUM_VERSIONS["2564"];
    draftState.draft = { positionYear: "4", positionKind: "semester2" };
    const { placeholders } = assumedHistory(version, { year: 4, kind: "semester2" });
    const slot = placeholders.find(
      (s) => s.term.kind === "semester1" && s.category === "concentrationElectiveArea"
    )!;
    const designated = version.courses.value.find(
      (c) => c.category === "concentrationElectiveArea" && !canPlaceInTerm(c.code, "semester1")
    )!;
    const allowed = version.courses.value.find(
      (c) => c.category === "concentrationElectiveArea" && canPlaceInTerm(c.code, "semester1")
    )!;
    const plan: StudyPlan = { ...basePlan, versionId: "2564", cohort: "64", startYear: 2564 };

    const refused = await redirectOf(() =>
      submitFillStep(
        "en",
        { status: "idle" },
        form({ [PLAN_FIELD]: serialisePlan(plan), [`slot-${slot.id}`]: designated.code })
      )
    );
    expect(deserialisePlan(refused.searchParams.get(PLAN_FIELD) ?? "")?.passed).not.toContain(
      designated.code
    );

    const accepted = await redirectOf(() =>
      submitFillStep(
        "en",
        { status: "idle" },
        form({ [PLAN_FIELD]: serialisePlan(plan), [`slot-${slot.id}`]: allowed.code })
      )
    );
    expect(deserialisePlan(accepted.searchParams.get(PLAN_FIELD) ?? "")?.passed).toContain(
      allowed.code
    );
  });
});
