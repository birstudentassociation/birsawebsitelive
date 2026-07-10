import { describe, expect, it } from "vitest";
import { DUE_SOON_DAYS, isDueSoon } from "@/lib/inventory/notifications";

describe("isDueSoon", () => {
  it("is true when the loan is due today", () => {
    expect(isDueSoon("2026-07-10", "2026-07-10", DUE_SOON_DAYS)).toBe(true);
  });

  it("is true when the loan is due within the window", () => {
    expect(isDueSoon("2026-07-11", "2026-07-10", DUE_SOON_DAYS)).toBe(true);
    expect(isDueSoon("2026-07-12", "2026-07-10", DUE_SOON_DAYS)).toBe(true);
  });

  it("is false when the loan is due after the window", () => {
    expect(isDueSoon("2026-07-13", "2026-07-10", DUE_SOON_DAYS)).toBe(false);
  });

  it("is false when the loan is already overdue (end date before today)", () => {
    expect(isDueSoon("2026-07-09", "2026-07-10", DUE_SOON_DAYS)).toBe(false);
  });

  it("is false for an invalid date string", () => {
    expect(isDueSoon("not-a-date", "2026-07-10", DUE_SOON_DAYS)).toBe(false);
  });
});
