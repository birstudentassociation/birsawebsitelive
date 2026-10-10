import { describe, expect, it } from "vitest";
import {
  contactSchema,
  inventoryLoanRequestSchema,
  isRealCalendarDate,
  loanRequestSchema,
} from "@/lib/validation";

const validInput = {
  name: "Alex",
  email: "alex@example.com",
  category: "question" as const,
  subject: "A question about registration",
  message: "This message is long enough to pass the minimum length check.",
  nickname: "",
};

describe("contactSchema", () => {
  it("accepts valid input", () => {
    const result = contactSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email, with the error path on 'email'", () => {
    const result = contactSchema.safeParse({ ...validInput, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find((issue) => issue.path[0] === "email");
      expect(emailIssue).toBeDefined();
    }
  });

  it("rejects a message that is too short", () => {
    const result = contactSchema.safeParse({ ...validInput, message: "Too short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messageIssue = result.error.issues.find((issue) => issue.path[0] === "message");
      expect(messageIssue).toBeDefined();
    }
  });

  it("fails validation when the honeypot (nickname) field is filled", () => {
    // `nickname` only permits an empty string (or omission); a real visitor
    // never fills it, so any non-empty value fails schema validation. This
    // is the mechanism the API route relies on to detect bots.
    const result = contactSchema.safeParse({ ...validInput, nickname: "a bot filled this in" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nicknameIssue = result.error.issues.find((issue) => issue.path[0] === "nickname");
      expect(nicknameIssue).toBeDefined();
    }
  });

  it("accepts when the honeypot (nickname) field is omitted", () => {
    const { nickname: _nickname, ...withoutNickname } = validInput;
    const result = contactSchema.safeParse(withoutNickname);
    expect(result.success).toBe(true);
  });
});

describe("isRealCalendarDate", () => {
  it("accepts real dates, including a leap day", () => {
    expect(isRealCalendarDate("2026-02-28")).toBe(true);
    expect(isRealCalendarDate("2028-02-29")).toBe(true);
    expect(isRealCalendarDate("2026-12-31")).toBe(true);
  });

  it("rejects dates that roll over into the next month", () => {
    expect(isRealCalendarDate("2026-02-31")).toBe(false);
    expect(isRealCalendarDate("2026-02-29")).toBe(false);
    expect(isRealCalendarDate("2026-04-31")).toBe(false);
  });

  it("rejects out-of-range months and days, and malformed strings", () => {
    expect(isRealCalendarDate("2026-13-01")).toBe(false);
    expect(isRealCalendarDate("2026-00-10")).toBe(false);
    expect(isRealCalendarDate("2026-01-00")).toBe(false);
    expect(isRealCalendarDate("2026-1-1")).toBe(false);
    expect(isRealCalendarDate("")).toBe(false);
  });
});

describe("loan request schemas and calendar dates", () => {
  const base = {
    itemKey: "first-aid-kit",
    studentName: "Alex",
    studentId: "6512345678",
    studentEmail: "alex@example.com",
  };

  it("inventoryLoanRequestSchema rejects 2026-02-31", () => {
    const result = inventoryLoanRequestSchema.safeParse({
      ...base,
      startDate: "2026-02-31",
      endDate: "2026-03-05",
    });
    expect(result.success).toBe(false);
  });

  it("inventoryLoanRequestSchema accepts real dates", () => {
    const result = inventoryLoanRequestSchema.safeParse({
      ...base,
      startDate: "2026-02-27",
      endDate: "2026-03-05",
    });
    expect(result.success).toBe(true);
  });

  it("loanRequestSchema rejects an impossible return date", () => {
    const result = loanRequestSchema.safeParse({
      ...base,
      pickupDate: "2026-02-27",
      returnDate: "2026-02-30",
    });
    expect(result.success).toBe(false);
  });
});
