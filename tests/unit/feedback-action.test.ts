import { beforeEach, describe, expect, it, vi } from "vitest";

const feedback = vi.hoisted(() => ({ submitFeedback: vi.fn() }));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "198.51.100.7" }),
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock("@/lib/feedback", () => ({
  isFeedbackConfigured: () => true,
  submitFeedback: feedback.submitFeedback,
}));

import { submitFeedbackAction } from "@/app/[lang]/feedback/actions";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

beforeEach(() => {
  feedback.submitFeedback.mockReset();
  feedback.submitFeedback.mockResolvedValue(true);
});

describe("submitFeedbackAction", () => {
  it("truncates an over-long path instead of rejecting the submission", async () => {
    const longPath = `/en/${"a".repeat(500)}`;
    await expect(
      submitFeedbackAction(
        { status: "idle" },
        form({ rating: "satisfied", comment: "", locale: "en", path: longPath })
      )
    ).rejects.toThrow("REDIRECT:/en/feedback/sent");
    expect(feedback.submitFeedback).toHaveBeenCalledTimes(1);
    const saved = feedback.submitFeedback.mock.calls[0]?.[0] as { path: string };
    expect(saved.path).toBe(longPath.slice(0, 300));
  });
});
