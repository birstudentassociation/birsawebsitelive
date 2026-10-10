/**
 * The course review suite must build and render with no environment at all:
 * no POSTGRES_URL, no OFFICER_SESSION_SECRET and no ANTHROPIC_API_KEY. Each
 * data-access function returns a neutral value rather than throwing or
 * touching a connection, which is what lets a static build, a preview with no
 * secrets and a half-configured site all work. Nothing is mocked here, so a
 * call that tried to reach a database would fail loudly.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  decideSubmission,
  insertSubmission,
  isCourseReviewConfigured,
  listGroupSubmissions,
  listSubmissionGroups,
} from "@/lib/course-review/submissions";
import {
  getPublishedGroup,
  listPublishedGroupIds,
  listPublishedReviews,
  publishGroup,
  unpublishGroup,
} from "@/lib/course-review/published";
import { isSummariserConfigured, summariseSubmissions } from "@/lib/course-review/summarise";
import { purgeExpiredPersonalData } from "@/lib/privacy/retention";

const KEY = {
  courseCode: "PI280",
  term: { year: 2567, semester: 1 as const },
  instructorKey: "other",
};

beforeEach(() => {
  vi.stubEnv("POSTGRES_URL", "");
  vi.stubEnv("ANTHROPIC_API_KEY", "");
  vi.stubEnv("OFFICER_SESSION_SECRET", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("course reviews with no environment configured", () => {
  it("reports itself as not configured", () => {
    expect(isCourseReviewConfigured()).toBe(false);
    expect(isSummariserConfigured()).toBe(false);
  });

  it("reads return nothing", async () => {
    await expect(listPublishedReviews("PI280")).resolves.toEqual([]);
    await expect(listSubmissionGroups()).resolves.toEqual([]);
    await expect(listGroupSubmissions(KEY)).resolves.toEqual([]);
    await expect(getPublishedGroup(KEY)).resolves.toBeNull();
    await expect(listPublishedGroupIds()).resolves.toEqual(new Map());
  });

  it("writes fail quietly instead of throwing", async () => {
    await expect(
      insertSubmission({
        courseCode: "PI280",
        term: { year: 2567, semester: 1 },
        instructorKey: "other",
        workload: "w",
        workloadBand: null,
        assessment: "a",
        tips: [],
        quote: null,
        locale: "en",
      })
    ).resolves.toBe(false);
    await expect(
      decideSubmission("00000000-0000-4000-8000-000000000000", "approved", "o")
    ).resolves.toBeNull();
    await expect(
      publishGroup(
        KEY,
        { workload: { en: "a", th: "ก" }, assessment: { en: "a", th: "ก" }, tips: [], quotes: [] },
        undefined,
        "officer"
      )
    ).resolves.toEqual({ ok: false, reason: "not-configured" });
    await expect(unpublishGroup(KEY)).resolves.toBe(false);
  });

  it("drafting is unavailable and never builds a client", async () => {
    const submissions = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      courseCode: "PI280",
      term: { year: 2567, semester: 1 as const },
      instructorKey: "other",
      workload: "w",
      workloadBand: null,
      assessment: "a",
      tips: [],
      quote: null,
      locale: "en" as const,
      status: "approved" as const,
      moderatedAt: null,
      createdAt: "2026-01-01T00:00:00Z",
    }));
    await expect(
      summariseSubmissions({ code: "PI280", title: "t" }, "term", submissions)
    ).resolves.toEqual({ ok: false, reason: "not-configured" });
  });

  it("the retention purge has nothing to do", async () => {
    await expect(purgeExpiredPersonalData()).resolves.toEqual({
      ok: false,
      reason: "not-configured",
    });
  });
});
