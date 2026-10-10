import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ insertSubmission: vi.fn(), configured: true }));
const requester = vi.hoisted(() => ({ ip: "198.51.100.7" }));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": requester.ip }),
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock("@/lib/course-review/submissions", () => ({
  isCourseReviewConfigured: () => db.configured,
  insertSubmission: db.insertSubmission,
}));

import { submitReviewAction } from "@/app/[lang]/student-life/course-reviews/[code]/review/actions";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { REVIEW_RATE_LIMIT_SCOPE } from "@/lib/course-review/submit";
import { recentTerms, termKey } from "@/lib/course-review/terms";

let counter = 0;

function form(fields: Record<string, string> = {}): FormData {
  const data = new FormData();
  const values: Record<string, string> = {
    code: "PI280",
    locale: "en",
    term: termKey(recentTerms(new Date())[1]!),
    instructor: "other",
    workload: "About one reading a week and a short essay every fortnight.",
    workloadBand: "",
    assessment: "Two essays and a final exam, marked fairly quickly.",
    tip1: "",
    tip2: "",
    tip3: "",
    quote: "",
    nickname: "",
    ...fields,
  };
  for (const [key, value] of Object.entries(values)) data.append(key, value);
  return data;
}

async function redirectOf(promise: Promise<unknown>): Promise<string | null> {
  try {
    await promise;
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return message.startsWith("REDIRECT:") ? message.slice("REDIRECT:".length) : null;
  }
}

beforeEach(() => {
  db.insertSubmission.mockReset();
  db.insertSubmission.mockResolvedValue(true);
  db.configured = true;
  // A fresh address per test, so rate limit buckets never leak between them.
  counter += 1;
  requester.ip = `203.0.113.${counter}`;
});

describe("submitReviewAction", () => {
  it("stores a valid review and redirects to the confirmation page (Post/Redirect/Get)", async () => {
    const target = await redirectOf(submitReviewAction({ status: "idle" }, form()));
    expect(target).toBe("/en/student-life/course-reviews/PI280/review/sent");
    expect(db.insertSubmission).toHaveBeenCalledTimes(1);
    const saved = db.insertSubmission.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(saved).toMatchObject({ courseCode: "PI280", instructorKey: "other", locale: "en" });
  });

  it("redirects Thai readers to the Thai confirmation page", async () => {
    const target = await redirectOf(submitReviewAction({ status: "idle" }, form({ locale: "th" })));
    expect(target).toBe("/th/student-life/course-reviews/PI280/review/sent");
  });

  it("stores nothing about the submitter", async () => {
    await redirectOf(submitReviewAction({ status: "idle" }, form()));
    const saved = db.insertSubmission.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(JSON.stringify(saved)).not.toContain(requester.ip);
    expect(Object.keys(saved)).not.toEqual(
      expect.arrayContaining(["ip", "userAgent", "name", "email", "studentId"])
    );
  });

  it("returns the errors and the typed values, and stores nothing, for an invalid form", async () => {
    const state = await submitReviewAction(
      { status: "idle" },
      form({ workload: "", term: "", tip1: "Keep up" })
    );
    expect(state).toMatchObject({
      status: "invalid",
      errors: { workload: "required", term: "required" },
      values: { workload: "", tips: ["Keep up", "", ""] },
    });
    expect(db.insertSubmission).not.toHaveBeenCalled();
  });

  it("silently discards a filled honeypot, as if it had worked", async () => {
    const target = await redirectOf(
      submitReviewAction({ status: "idle" }, form({ nickname: "I am a bot" }))
    );
    expect(target).toBe("/en/student-life/course-reviews/PI280/review/sent");
    expect(db.insertSubmission).not.toHaveBeenCalled();
  });

  it("says so, and stores nothing, when the database is not configured", async () => {
    db.configured = false;
    const state = await submitReviewAction({ status: "idle" }, form());
    expect(state.status).toBe("not-configured");
    expect(db.insertSubmission).not.toHaveBeenCalled();
  });

  it("reports a failed insert rather than pretending it worked", async () => {
    db.insertSubmission.mockResolvedValue(false);
    const state = await submitReviewAction({ status: "idle" }, form());
    expect(state.status).toBe("error");
  });

  it("rejects an unknown course without storing anything", async () => {
    const state = await submitReviewAction({ status: "idle" }, form({ code: "XX999" }));
    expect(state.status).toBe("error");
    expect(db.insertSubmission).not.toHaveBeenCalled();
  });

  it("strips NUL characters, which Postgres text cannot hold", async () => {
    await redirectOf(
      submitReviewAction(
        { status: "idle" },
        form({ workload: "About one reading a week,\u0000 and a short essay." })
      )
    );
    const saved = db.insertSubmission.mock.calls[0]?.[0] as { workload: string };
    expect(saved.workload).not.toContain("\u0000");
  });
});

describe("the review rate limit", () => {
  it("is its own scope, so reviewing does not use up the contact form's budget", () => {
    expect(REVIEW_RATE_LIMIT_SCOPE).toBe("course-review");
    expect(REVIEW_RATE_LIMIT_SCOPE).not.toBe("contact");
    expect(REVIEW_RATE_LIMIT_SCOPE).not.toBe("feedback");
  });

  it("blocks the sixth stored review from one address in ten minutes", async () => {
    for (let i = 0; i < 5; i += 1) {
      const target = await redirectOf(submitReviewAction({ status: "idle" }, form()));
      expect(target, `attempt ${i + 1}`).not.toBeNull();
    }
    const state = await submitReviewAction({ status: "idle" }, form());
    expect(state.status).toBe("rate-limited");
    expect(db.insertSubmission).toHaveBeenCalledTimes(5);
  });

  it("does not count mistakes in the form against the reader", async () => {
    for (let i = 0; i < 8; i += 1) {
      const state = await submitReviewAction({ status: "idle" }, form({ workload: "" }));
      expect(state.status, `attempt ${i + 1}`).toBe("invalid");
    }
    const target = await redirectOf(submitReviewAction({ status: "idle" }, form()));
    expect(target).not.toBeNull();
  });

  it("is per address and per scope", async () => {
    for (let i = 0; i < 5; i += 1) {
      await redirectOf(submitReviewAction({ status: "idle" }, form()));
    }
    expect(checkRateLimit(requester.ip, "contact")).toBe(true);
    requester.ip = "192.0.2.250";
    const target = await redirectOf(submitReviewAction({ status: "idle" }, form()));
    expect(target).not.toBeNull();
  });
});
