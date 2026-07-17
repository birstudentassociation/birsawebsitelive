import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation";

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
