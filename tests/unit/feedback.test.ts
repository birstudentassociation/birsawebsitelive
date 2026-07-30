import { describe, expect, it } from "vitest";
import { FEEDBACK_RATINGS, feedbackSchema } from "@/lib/validation";
import { mergeRatingCounts, satisfactionRate, zeroRatingCounts } from "@/lib/feedback";

const validInput = {
  rating: "satisfied" as const,
  comment: "The catalogue page could load a little faster.",
  locale: "en" as const,
  path: "/en/services/equipment-loan",
  nickname: "",
};

describe("feedbackSchema", () => {
  it.each(FEEDBACK_RATINGS)("accepts the rating %s", (rating) => {
    const result = feedbackSchema.safeParse({ ...validInput, rating });
    expect(result.success).toBe(true);
  });

  it("rejects a rating outside the five permitted values", () => {
    const result = feedbackSchema.safeParse({ ...validInput, rating: "meh" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const ratingIssue = result.error.issues.find((issue) => issue.path[0] === "rating");
      expect(ratingIssue).toBeDefined();
    }
  });

  it("accepts an empty comment", () => {
    const result = feedbackSchema.safeParse({ ...validInput, comment: "" });
    expect(result.success).toBe(true);
  });

  it("accepts when the comment is omitted entirely", () => {
    const { comment: _comment, ...withoutComment } = validInput;
    const result = feedbackSchema.safeParse(withoutComment);
    expect(result.success).toBe(true);
  });

  it("rejects a comment longer than the maximum length", () => {
    const result = feedbackSchema.safeParse({ ...validInput, comment: "a".repeat(1201) });
    expect(result.success).toBe(false);
    if (!result.success) {
      const commentIssue = result.error.issues.find((issue) => issue.path[0] === "comment");
      expect(commentIssue).toBeDefined();
    }
  });

  it("accepts a comment right at the maximum length", () => {
    const result = feedbackSchema.safeParse({ ...validInput, comment: "a".repeat(1200) });
    expect(result.success).toBe(true);
  });

  it("fails validation when the honeypot (nickname) field is filled", () => {
    // `nickname` only permits an empty string (or omission); a real visitor
    // never fills it, so any non-empty value fails schema validation. This
    // is the mechanism the server action relies on to detect bots.
    const result = feedbackSchema.safeParse({ ...validInput, nickname: "a bot filled this in" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nicknameIssue = result.error.issues.find((issue) => issue.path[0] === "nickname");
      expect(nicknameIssue).toBeDefined();
    }
  });

  it("accepts when the honeypot (nickname) field is omitted", () => {
    const { nickname: _nickname, ...withoutNickname } = validInput;
    const result = feedbackSchema.safeParse(withoutNickname);
    expect(result.success).toBe(true);
  });

  it("rejects an unsupported locale", () => {
    const result = feedbackSchema.safeParse({ ...validInput, locale: "fr" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty path", () => {
    const result = feedbackSchema.safeParse({ ...validInput, path: "" });
    expect(result.success).toBe(false);
  });
});

describe("zeroRatingCounts", () => {
  it("returns every rating set to 0", () => {
    const counts = zeroRatingCounts();
    for (const rating of FEEDBACK_RATINGS) {
      expect(counts[rating]).toBe(0);
    }
  });
});

describe("mergeRatingCounts", () => {
  it("fills in 0 for ratings that had no rows", () => {
    const counts = mergeRatingCounts([{ rating: "very_satisfied", count: 4 }]);
    expect(counts.very_satisfied).toBe(4);
    expect(counts.satisfied).toBe(0);
    expect(counts.neither).toBe(0);
    expect(counts.dissatisfied).toBe(0);
    expect(counts.very_dissatisfied).toBe(0);
  });

  it("carries over every provided count", () => {
    const counts = mergeRatingCounts([
      { rating: "very_satisfied", count: 10 },
      { rating: "satisfied", count: 5 },
      { rating: "neither", count: 3 },
      { rating: "dissatisfied", count: 2 },
      { rating: "very_dissatisfied", count: 1 },
    ]);
    expect(counts).toEqual({
      very_satisfied: 10,
      satisfied: 5,
      neither: 3,
      dissatisfied: 2,
      very_dissatisfied: 1,
    });
  });
});

describe("satisfactionRate", () => {
  it("returns 0 when there are no responses at all", () => {
    expect(satisfactionRate(zeroRatingCounts())).toBe(0);
  });

  it("counts only satisfied and very satisfied as satisfied", () => {
    const counts = mergeRatingCounts([
      { rating: "very_satisfied", count: 3 },
      { rating: "satisfied", count: 2 },
      { rating: "neither", count: 1 },
      { rating: "dissatisfied", count: 3 },
      { rating: "very_dissatisfied", count: 1 },
    ]);
    // 5 satisfied out of 10 total = 50%.
    expect(satisfactionRate(counts)).toBe(50);
  });

  it("rounds to the nearest whole percent", () => {
    const counts = mergeRatingCounts([
      { rating: "very_satisfied", count: 1 },
      { rating: "satisfied", count: 0 },
      { rating: "neither", count: 0 },
      { rating: "dissatisfied", count: 0 },
      { rating: "very_dissatisfied", count: 2 },
    ]);
    // 1 out of 3 = 33.33...%, rounds to 33.
    expect(satisfactionRate(counts)).toBe(33);
  });
});
