import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { ok: true, officer: { id: "officer-1", role: "academic_affairs", custodianId: null } } as
    | { ok: true; officer: { id: string; role: string; custodianId: string | null } }
    | { ok: false; status: 401 | 403 },
  recordAudit: vi.fn(),
  revalidatePath: vi.fn(),
  decideSubmission: vi.fn(),
  listGroupSubmissions: vi.fn(),
  publishGroup: vi.fn(),
  unpublishGroup: vi.fn(),
  getPublishedGroup: vi.fn(),
  summarise: vi.fn(),
  summariserConfigured: true,
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock("@/lib/course-review/access", () => ({
  requireReviewOfficer: async () => mocks.auth,
}));
vi.mock("@/lib/inventory/audit", () => ({ recordAudit: mocks.recordAudit }));
vi.mock("@/lib/course-review/submissions", () => ({
  decideSubmission: mocks.decideSubmission,
  listGroupSubmissions: mocks.listGroupSubmissions,
}));
vi.mock("@/lib/course-review/published", () => ({
  publishGroup: mocks.publishGroup,
  unpublishGroup: mocks.unpublishGroup,
  getPublishedGroup: mocks.getPublishedGroup,
}));
vi.mock("@/lib/course-review/summarise", () => ({
  isSummariserConfigured: () => mocks.summariserConfigured,
  summariseSubmissions: mocks.summarise,
}));

import {
  decideSubmissionAction,
  draftSummaryAction,
  publishSummaryAction,
  unpublishSummaryAction,
} from "@/app/[lang]/officer/inventory/course-reviews/actions";
import { summaryToFields } from "@/lib/course-review/summary-form";

const GROUP = "PI280|2567-1|other";
const ID = "11111111-1111-4111-8111-111111111111";
const SUMMARY = {
  workload: { en: "A steady load across the term.", th: "ภาระงานสม่ำเสมอตลอดภาคการศึกษา" },
  assessment: { en: "Two essays and a final exam.", th: "เรียงความสองชิ้นและสอบปลายภาค" },
  tips: [{ en: "Start early", th: "เริ่มแต่เนิ่น ๆ" }],
  quotes: [],
};

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
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

function approved(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: `s-${i}`,
    status: "approved",
    locale: "en",
    workload: "w",
    assessment: "a",
    tips: [],
    quote: null,
    workloadBand: null,
  }));
}

beforeEach(() => {
  mocks.auth = {
    ok: true,
    officer: { id: "officer-1", role: "academic_affairs", custodianId: null },
  };
  for (const mock of [
    mocks.recordAudit,
    mocks.revalidatePath,
    mocks.decideSubmission,
    mocks.listGroupSubmissions,
    mocks.publishGroup,
    mocks.unpublishGroup,
    mocks.getPublishedGroup,
    mocks.summarise,
  ]) {
    mock.mockReset();
  }
  mocks.summariserConfigured = true;
  mocks.decideSubmission.mockResolvedValue({
    courseCode: "PI280",
    term: { year: 2567, semester: 1 },
    instructorKey: "other",
  });
  mocks.listGroupSubmissions.mockResolvedValue(approved(5));
  mocks.publishGroup.mockResolvedValue({ ok: true, reviewCount: 5 });
  mocks.unpublishGroup.mockResolvedValue(true);
  mocks.getPublishedGroup.mockResolvedValue({ reviewCount: 5 });
  mocks.summarise.mockResolvedValue({ ok: true, summary: SUMMARY });
});

describe("decideSubmissionAction", () => {
  it("records the decision, audits it, and returns to the group", async () => {
    const target = await redirectOf(
      decideSubmissionAction(form({ id: ID, decision: "approve", group: GROUP, locale: "en" }))
    );
    expect(mocks.decideSubmission).toHaveBeenCalledWith(ID, "approved", "officer-1");
    expect(mocks.recordAudit).toHaveBeenCalledWith({
      officerId: "officer-1",
      action: "course_review.approve",
      entityType: "course_review_submission",
      entityId: ID,
      detail: { group: GROUP },
    });
    expect(target).toBe(
      `/en/officer/inventory/course-reviews/group?g=${encodeURIComponent(GROUP)}`
    );
  });

  it("audits a rejection under its own action", async () => {
    await redirectOf(
      decideSubmissionAction(form({ id: ID, decision: "reject", group: GROUP, locale: "th" }))
    );
    expect(mocks.decideSubmission).toHaveBeenCalledWith(ID, "rejected", "officer-1");
    expect(mocks.recordAudit.mock.calls[0]![0]).toMatchObject({ action: "course_review.reject" });
  });

  it("never puts a submission's text in the audit log", async () => {
    await redirectOf(
      decideSubmissionAction(form({ id: ID, decision: "approve", group: GROUP, locale: "en" }))
    );
    const entry = JSON.stringify(mocks.recordAudit.mock.calls[0]![0]);
    expect(entry).not.toMatch(/workload|assessment|quote|tip/i);
  });

  it("does nothing for an officer who may not moderate", async () => {
    mocks.auth = { ok: false, status: 403 };
    const target = await redirectOf(
      decideSubmissionAction(form({ id: ID, decision: "approve", group: GROUP, locale: "en" }))
    );
    expect(target).toBe("/en/officer/inventory");
    expect(mocks.decideSubmission).not.toHaveBeenCalled();
    expect(mocks.recordAudit).not.toHaveBeenCalled();
  });

  it("ignores a malformed id, decision or group", async () => {
    for (const bad of [
      { id: "not-a-uuid", decision: "approve", group: GROUP },
      { id: ID, decision: "delete", group: GROUP },
      { id: ID, decision: "approve", group: "garbage" },
      { id: ID, decision: "approve", group: "XX999|2567-1|other" },
    ]) {
      const target = await redirectOf(decideSubmissionAction(form({ ...bad, locale: "en" })));
      expect(target, JSON.stringify(bad)).toBe("/en/officer/inventory/course-reviews");
    }
    expect(mocks.decideSubmission).not.toHaveBeenCalled();
  });

  it("does not audit a decision the database did not record", async () => {
    mocks.decideSubmission.mockResolvedValue(null);
    await redirectOf(
      decideSubmissionAction(form({ id: ID, decision: "approve", group: GROUP, locale: "en" }))
    );
    expect(mocks.recordAudit).not.toHaveBeenCalled();
  });
});

describe("draftSummaryAction", () => {
  it("drafts from the approved submissions only, and audits the request", async () => {
    mocks.listGroupSubmissions.mockResolvedValue([
      ...approved(5),
      { ...approved(1)[0], id: "p", status: "pending" },
      { ...approved(1)[0], id: "r", status: "rejected" },
    ]);
    const state = await draftSummaryAction({ status: "idle" }, form({ group: GROUP }));
    expect(state).toMatchObject({ status: "drafted", summary: SUMMARY });
    const sent = mocks.summarise.mock.calls[0]![2] as { status: string }[];
    expect(sent).toHaveLength(5);
    expect(sent.every((s) => s.status === "approved")).toBe(true);
    expect(mocks.recordAudit.mock.calls[0]![0]).toMatchObject({
      action: "course_review.draft_summary",
      entityId: GROUP,
      detail: { ok: true, submissions: 5 },
    });
  });

  it("does not store the draft anywhere", async () => {
    await draftSummaryAction({ status: "idle" }, form({ group: GROUP }));
    expect(mocks.publishGroup).not.toHaveBeenCalled();
  });

  it("refuses below the threshold without calling Claude", async () => {
    mocks.listGroupSubmissions.mockResolvedValue(approved(4));
    const state = await draftSummaryAction({ status: "idle" }, form({ group: GROUP }));
    expect(state).toEqual({ status: "failed", reason: "below-threshold" });
    expect(mocks.summarise).not.toHaveBeenCalled();
  });

  it("explains that drafting is off when there is no API key", async () => {
    mocks.summariserConfigured = false;
    const state = await draftSummaryAction({ status: "idle" }, form({ group: GROUP }));
    expect(state).toEqual({ status: "failed", reason: "not-configured" });
    expect(mocks.summarise).not.toHaveBeenCalled();
  });

  it("passes a refusal through to the officer, and audits the failure", async () => {
    mocks.summarise.mockResolvedValue({ ok: false, reason: "refused" });
    const state = await draftSummaryAction({ status: "idle" }, form({ group: GROUP }));
    expect(state).toEqual({ status: "failed", reason: "refused" });
    expect(mocks.recordAudit.mock.calls[0]![0]).toMatchObject({
      detail: { ok: false, reason: "refused", submissions: 5 },
    });
  });

  it("is closed to other roles", async () => {
    mocks.auth = { ok: false, status: 403 };
    const state = await draftSummaryAction({ status: "idle" }, form({ group: GROUP }));
    expect(state).toEqual({ status: "failed", reason: "forbidden" });
    expect(mocks.summarise).not.toHaveBeenCalled();
  });
});

describe("publishSummaryAction", () => {
  const goodFields = (): Record<string, string> => ({
    ...summaryToFields(SUMMARY),
    group: GROUP,
    locale: "en",
  });

  it("publishes an edited summary, audits it, refreshes both course pages and returns to the group", async () => {
    const target = await redirectOf(
      publishSummaryAction({ status: "idle" }, form({ ...goodFields(), origin: "claude-draft" }))
    );
    expect(mocks.publishGroup).toHaveBeenCalledTimes(1);
    const [key, summary, instructor, officerId] = mocks.publishGroup.mock.calls[0]!;
    expect(key).toMatchObject({ courseCode: "PI280", instructorKey: "other" });
    expect(summary).toEqual(SUMMARY);
    expect(instructor).toBeUndefined();
    expect(officerId).toBe("officer-1");
    expect(mocks.recordAudit.mock.calls[0]![0]).toMatchObject({
      action: "course_review.publish",
      entityType: "published_course_review",
      entityId: GROUP,
      detail: { reviewCount: 5, origin: "claude-draft" },
    });
    expect(mocks.revalidatePath.mock.calls.map((call) => call[0]).sort()).toEqual([
      "/en/student-life/course-reviews/PI280",
      "/th/student-life/course-reviews/PI280",
    ]);
    expect(target).toBe(
      `/en/officer/inventory/course-reviews/group?g=${encodeURIComponent(GROUP)}&done=published`
    );
  });

  it("works for a summary written by hand, and says so in the audit log", async () => {
    await redirectOf(publishSummaryAction({ status: "idle" }, form(goodFields())));
    expect(mocks.recordAudit.mock.calls[0]![0]).toMatchObject({ detail: { origin: "manual" } });
  });

  it("never publishes a summary that fails validation, and hands the fields back", async () => {
    const fields = goodFields();
    fields.tip1_th = "";
    const state = await publishSummaryAction({ status: "idle" }, form(fields));
    expect(state).toMatchObject({
      status: "invalid",
      errors: { tip1_th: "pairIncomplete" },
      fields: { tip1_en: "Start early" },
    });
    expect(mocks.publishGroup).not.toHaveBeenCalled();
    expect(mocks.recordAudit).not.toHaveBeenCalled();
  });

  it("does not claim success when the threshold is not met", async () => {
    mocks.publishGroup.mockResolvedValue({ ok: false, reason: "below-threshold" });
    const state = await publishSummaryAction({ status: "idle" }, form(goodFields()));
    expect(state).toMatchObject({ status: "failed", reason: "below-threshold" });
    expect(mocks.recordAudit).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("is closed to other roles", async () => {
    mocks.auth = { ok: false, status: 401 };
    const state = await publishSummaryAction({ status: "idle" }, form(goodFields()));
    expect(state).toMatchObject({ status: "failed", reason: "forbidden" });
    expect(mocks.publishGroup).not.toHaveBeenCalled();
  });
});

describe("unpublishSummaryAction", () => {
  it("takes the summary down, audits it and refreshes the course pages", async () => {
    const target = await redirectOf(unpublishSummaryAction(form({ group: GROUP, locale: "th" })));
    expect(mocks.unpublishGroup).toHaveBeenCalledTimes(1);
    expect(mocks.recordAudit.mock.calls[0]![0]).toMatchObject({
      action: "course_review.unpublish",
      entityId: GROUP,
    });
    expect(mocks.revalidatePath).toHaveBeenCalledTimes(2);
    expect(target).toBe(
      `/th/officer/inventory/course-reviews/group?g=${encodeURIComponent(GROUP)}&done=unpublished`
    );
  });

  it("does not audit an unpublish that removed nothing", async () => {
    mocks.getPublishedGroup.mockResolvedValue(null);
    await redirectOf(unpublishSummaryAction(form({ group: GROUP, locale: "en" })));
    expect(mocks.unpublishGroup).not.toHaveBeenCalled();
    expect(mocks.recordAudit).not.toHaveBeenCalled();
  });

  it("is closed to other roles", async () => {
    mocks.auth = { ok: false, status: 403 };
    await redirectOf(unpublishSummaryAction(form({ group: GROUP, locale: "en" })));
    expect(mocks.unpublishGroup).not.toHaveBeenCalled();
  });
});
