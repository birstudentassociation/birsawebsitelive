import { describe, expect, it } from "vitest";
import { isUntracked } from "@/lib/analytics-exclusions";

describe("isUntracked", () => {
  it("drops welfare, safety and complaint pages in both languages", () => {
    expect(isUntracked("https://birsa.example/en/contact")).toBe(true);
    expect(isUntracked("https://birsa.example/th/contact/message?category=complaint")).toBe(true);
    expect(isUntracked("https://birsa.example/en/student-life/home/rights-and-welfare")).toBe(true);
    expect(isUntracked("https://birsa.example/th/answers/health-and-safety/q?step=2")).toBe(true);
    expect(isUntracked("https://birsa.example/en/emergency/flooding")).toBe(true);
  });

  it("keeps everything else", () => {
    expect(isUntracked("https://birsa.example/en")).toBe(false);
    expect(isUntracked("https://birsa.example/th/news")).toBe(false);
    expect(isUntracked("https://birsa.example/en/contacts-directory")).toBe(false);
    expect(isUntracked("https://birsa.example/en/services/equipment-loan")).toBe(false);
  });
});
