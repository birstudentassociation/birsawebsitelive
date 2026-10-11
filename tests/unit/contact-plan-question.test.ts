/**
 * "Ask Academic Affairs about this plan": the route from the plan screen into
 * the contact journey. Starting it only prepares a draft; the summary comes
 * back on the check step in a box the student can edit or empty; and what is
 * emailed is what was in that box when they pressed send, nothing more.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const draft = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
const sent = vi.hoisted(() => ({ emails: [] as { text: string; html: string }[] }));
const requester = vi.hoisted(() => ({ ip: "198.51.100.7" }));

vi.mock("@/components/forms/draftCookie", () => ({
  readDraft: async () => ({ ...draft.value }),
  mergeDraft: async (_cookie: string, patch: Record<string, unknown>) => {
    draft.value = { ...draft.value, ...patch };
    // The real cookie is JSON, which drops undefined, so a patch of undefined clears the key.
    draft.value = JSON.parse(JSON.stringify(draft.value));
    return draft.value;
  },
  clearDraft: async () => {
    draft.value = {};
  },
}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": requester.ip }),
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: async (message: { text: string; html: string }) => {
        sent.emails.push(message);
        return { data: { id: "1" }, error: null };
      },
    };
  },
}));

import {
  startPlanQuestion,
  submitCategoryStep,
  submitContactCheck,
} from "@/app/[lang]/contact/actions";
import { contactSchema } from "@/lib/validation";
import { buildPlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import { contactCategoryOptions } from "@/components/forms/contactWizardCopy";
import { serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

const plan: StudyPlan = {
  versionId: "2568",
  cohort: "68",
  startYear: 2568,
  minorId: "governance",
  passed: ["PI121"],
  freeElectiveCreditsPassed: 0,
  terms: [
    { term: { year: 2, kind: "semester1" }, codes: ["PI300", "PI364"], freeElectiveCredits: 0 },
  ],
};

async function redirectOf(promise: Promise<unknown>): Promise<string | null> {
  try {
    await promise;
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return message.startsWith("REDIRECT:") ? message.slice("REDIRECT:".length) : null;
  }
}

function planForm(value: string): FormData {
  const data = new FormData();
  data.append("plan", value);
  return data;
}

let counter = 0;

beforeEach(() => {
  draft.value = {};
  sent.emails = [];
  counter += 1;
  requester.ip = `203.0.113.${counter}`;
  vi.stubEnv("RESEND_API_KEY", "re_test");
});

describe("the academic category", () => {
  it("is one of the contact form's options, in both languages, before 'something else'", () => {
    for (const locale of ["en", "th"] as const) {
      const options = contactCategoryOptions(locale);
      const values = options.map((o) => o.value);
      expect(values).toContain("academic");
      expect(values.indexOf("academic")).toBeLessThan(values.indexOf("other"));
      expect(options.find((o) => o.value === "academic")!.label.length).toBeGreaterThan(3);
    }
    expect(contactCategoryOptions("th").find((o) => o.value === "academic")!.label).toBe(
      "การเรียนและฝ่ายวิชาการ"
    );
  });

  it("is accepted by the contact schema, and the old categories still are", () => {
    for (const category of ["question", "suggestion", "problem", "academic", "other"]) {
      const result = contactSchema.safeParse({
        name: "Somchai",
        email: "somchai@example.com",
        category,
        subject: "Subject",
        message: "A message that is long enough.",
      });
      expect(result.success, category).toBe(true);
    }
  });
});

describe("startPlanQuestion", () => {
  it("preselects the academic category, sets a subject and attaches the summary, then sends the student to write", async () => {
    const target = await redirectOf(startPlanQuestion("en", planForm(serialisePlan(plan))));
    expect(target).toBe("/en/contact/message");
    expect(draft.value.category).toBe("academic");
    expect(draft.value.subject).toBe(buildPlanOutreachCopy("en").ask.subject);
    const summary = String(draft.value.planSummary);
    expect(summary).toContain("Year 2, Semester 1: PI300, PI364");
    expect(summary).toContain("Minor: Governance");
  });

  it("sends nothing: no email until the student presses send on the last page", async () => {
    await redirectOf(startPlanQuestion("en", planForm(serialisePlan(plan))));
    expect(sent.emails).toEqual([]);
  });

  it("writes only the category, the subject and the summary into the draft", async () => {
    await redirectOf(startPlanQuestion("en", planForm(serialisePlan(plan))));
    expect(Object.keys(draft.value).sort()).toEqual(["category", "planSummary", "subject"]);
  });

  it("keeps what the student already typed in the draft, such as their name", async () => {
    draft.value = { name: "Somchai", email: "somchai@example.com" };
    await redirectOf(startPlanQuestion("en", planForm(serialisePlan(plan))));
    expect(draft.value).toMatchObject({ name: "Somchai", email: "somchai@example.com" });
  });

  it("works in Thai: Thai subject, Thai summary, Thai route", async () => {
    const target = await redirectOf(startPlanQuestion("th", planForm(serialisePlan(plan))));
    expect(target).toBe("/th/contact/message");
    expect(draft.value.subject).toBe("คำถามเกี่ยวกับแผนการศึกษา");
    expect(String(draft.value.planSummary)).toContain("สรุปแผนการศึกษา");
  });

  it("starts the plan journey over, and writes no draft, for a plan that does not validate", async () => {
    for (const bad of ["", "garbage", serialisePlan(plan).slice(0, -8)]) {
      draft.value = {};
      const target = await redirectOf(startPlanQuestion("en", planForm(bad)));
      expect(target, bad).toBe("/en/services/study-plan/minor");
      expect(draft.value, bad).toEqual({});
    }
  });
});

describe("choosing a different category afterwards", () => {
  it("drops the plan summary, which belongs to the academic question", async () => {
    await redirectOf(startPlanQuestion("en", planForm(serialisePlan(plan))));
    const data = new FormData();
    data.append("category", "suggestion");
    await redirectOf(submitCategoryStep("en", undefined, { status: "idle" }, data));
    expect(draft.value.category).toBe("suggestion");
    expect(draft.value.planSummary).toBeUndefined();
  });

  it("keeps it when academic is chosen again", async () => {
    await redirectOf(startPlanQuestion("en", planForm(serialisePlan(plan))));
    const data = new FormData();
    data.append("category", "academic");
    await redirectOf(submitCategoryStep("en", undefined, { status: "idle" }, data));
    expect(draft.value.planSummary).toBeDefined();
  });
});

describe("sending from the check step", () => {
  const complete = {
    category: "academic",
    subject: "Question about my study plan",
    message: "Can I take PI364 in year 2 if I pass PI280 this summer?",
    name: "Somchai",
    email: "somchai@example.com",
  };

  function checkForm(fields: Record<string, string> = {}): FormData {
    const data = new FormData();
    data.append("nickname", "");
    for (const [key, value] of Object.entries(fields)) data.append(key, value);
    return data;
  }

  it("sends the summary that is in the box, with the message", async () => {
    draft.value = { ...complete, planSummary: "SUMMARY FROM THE DRAFT" };
    const result = await submitContactCheck(
      "en",
      { status: "idle" },
      checkForm({ planSummary: "Year 2, Semester 1: PI300, PI364" })
    );
    expect(result).toEqual({ status: "success" });
    expect(sent.emails).toHaveLength(1);
    expect(sent.emails[0]!.text).toContain("Can I take PI364 in year 2");
    expect(sent.emails[0]!.text).toContain("Year 2, Semester 1: PI300, PI364");
    // The message comes first, then the summary.
    expect(sent.emails[0]!.text.indexOf("Can I take")).toBeLessThan(
      sent.emails[0]!.text.indexOf("Year 2, Semester 1")
    );
  });

  it("sends what the student edited it to, not what was drafted", async () => {
    draft.value = { ...complete, planSummary: "ORIGINAL SUMMARY" };
    await submitContactCheck(
      "en",
      { status: "idle" },
      checkForm({ planSummary: "Only the second term, please." })
    );
    expect(sent.emails[0]!.text).toContain("Only the second term, please.");
    expect(sent.emails[0]!.text).not.toContain("ORIGINAL SUMMARY");
  });

  it("sends the message alone when the student empties the box", async () => {
    draft.value = { ...complete, planSummary: "ORIGINAL SUMMARY" };
    for (const emptied of ["", "   \n  "]) {
      sent.emails = [];
      draft.value = { ...complete, planSummary: "ORIGINAL SUMMARY" };
      await submitContactCheck("en", { status: "idle" }, checkForm({ planSummary: emptied }));
      expect(sent.emails[0]!.text).not.toContain("ORIGINAL SUMMARY");
      expect(sent.emails[0]!.text.trimEnd().endsWith("this summer?")).toBe(true);
    }
  });

  it("never sends a drafted summary the form did not post", async () => {
    draft.value = { ...complete, planSummary: "ORIGINAL SUMMARY" };
    await submitContactCheck("en", { status: "idle" }, checkForm());
    expect(sent.emails[0]!.text).not.toContain("ORIGINAL SUMMARY");
  });

  it("caps what a request can attach, and strips the NUL character", async () => {
    draft.value = { ...complete };
    await submitContactCheck(
      "en",
      { status: "idle" },
      checkForm({ planSummary: `a\u0000b${"x".repeat(5000)}` })
    );
    const text = sent.emails[0]!.text;
    expect(text).not.toContain("\u0000");
    expect(text.match(/x{100,}/)![0].length).toBeLessThanOrEqual(2500);
  });

  it("clears the draft, summary included, after a successful send", async () => {
    draft.value = { ...complete, planSummary: "ORIGINAL SUMMARY" };
    await submitContactCheck("en", { status: "idle" }, checkForm({ planSummary: "kept" }));
    expect(draft.value).toEqual({});
  });

  it("shows the summary in the copy-it-yourself fallback when email is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    draft.value = { ...complete, planSummary: "ORIGINAL SUMMARY" };
    const result = await submitContactCheck(
      "en",
      { status: "idle" },
      checkForm({ planSummary: "The edited summary" })
    );
    expect(result).toMatchObject({
      status: "fallback",
      draft: { category: "academic", planSummary: "The edited summary" },
    });
    expect(sent.emails).toEqual([]);
  });

  it("labels the category for the officer who reads it", async () => {
    draft.value = { ...complete };
    await submitContactCheck("en", { status: "idle" }, checkForm());
    expect(sent.emails[0]!.text).toContain("Category: Studies and Academic Affairs");
  });
});
