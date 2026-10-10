import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  deserialisePlan,
  MAX_CODES_PER_TERM,
  MAX_PASSED_COURSES,
  MAX_TERMS,
  PLAN_FIELD,
  serialisePlan,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";

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
  addTermToPlan,
  submitAssumedStep,
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

function codes(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `ZZ${String(i).padStart(3, "0")}`);
}

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

describe("plan limits", () => {
  it("accepts a plan with a term for every year, semester and summer the UI allows", () => {
    const terms = [1, 2, 3, 4, 5, 6, 7, 8].flatMap((year) =>
      (["semester1", "semester2", "summer"] as const).map((kind) => ({
        term: { year, kind },
        codes: [],
        freeElectiveCredits: 0,
      }))
    );
    expect(terms).toHaveLength(MAX_TERMS);
    expect(deserialisePlan(serialisePlan({ ...basePlan, terms }))).not.toBeNull();
  });
});

describe("addCourseToTerm", () => {
  it("does not add a course to a term that is already full, and says so", async () => {
    const full = {
      ...basePlan,
      terms: [
        {
          term: { year: 4, kind: "semester1" as const },
          codes: codes(MAX_CODES_PER_TERM),
          freeElectiveCredits: 0,
        },
      ],
    };
    const url = await redirectOf(() =>
      addCourseToTerm(
        "en",
        form({ [PLAN_FIELD]: serialisePlan(full), year: "4", kind: "semester1", code: "PI574" })
      )
    );
    const plan = deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "");
    expect(plan?.terms[0]?.codes).toHaveLength(MAX_CODES_PER_TERM);
    expect(url.searchParams.get("notice")).toBe("termFull");
  });
});

describe("addTermToPlan", () => {
  it("keeps the plan readable after adding the last possible term", async () => {
    const url = await redirectOf(() =>
      addTermToPlan(
        "en",
        form({ [PLAN_FIELD]: serialisePlan(basePlan), year: "8", kind: "summer" })
      )
    );
    expect(deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "")?.terms).toHaveLength(1);
  });
});

describe("submitAssumedStep", () => {
  it("rejects a passed course code the plan schema would reject", async () => {
    const result = await submitAssumedStep(
      "en",
      { status: "idle" },
      form({
        [PLAN_FIELD]: serialisePlan(basePlan),
        freeElectiveCreditsPassed: "0",
        passed: ["not a code"],
      })
    );
    expect(result).toEqual({
      status: "invalid",
      error: buildStudyPlanCopy("en").assumed.passedError,
    });
  });

  it("rejects more passed courses than the plan can hold", async () => {
    const result = await submitAssumedStep(
      "en",
      { status: "idle" },
      form({
        [PLAN_FIELD]: serialisePlan(basePlan),
        freeElectiveCreditsPassed: "0",
        passed: codes(MAX_PASSED_COURSES + 1),
      })
    );
    expect(result.status).toBe("invalid");
  });

  it("carries valid passed courses into the plan", async () => {
    const url = await redirectOf(() =>
      submitAssumedStep(
        "en",
        { status: "idle" },
        form({
          [PLAN_FIELD]: serialisePlan(basePlan),
          freeElectiveCreditsPassed: "0",
          passed: ["PI211"],
        })
      )
    );
    expect(deserialisePlan(url.searchParams.get(PLAN_FIELD) ?? "")?.passed).toEqual(["PI211"]);
  });
});
