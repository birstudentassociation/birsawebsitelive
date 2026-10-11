/**
 * The share-with-an-advisor link carries the plan in the URL fragment. These
 * tests cover the codec both ways, and the failure cases that matter: a link
 * cut short by a chat app, one edited by hand, one with a forged date or a
 * second plan smuggled in, and input that is simply not a link.
 */
import { describe, expect, it } from "vitest";
import {
  decodeShareFragment,
  encodeShareFragment,
  formatShareDate,
  MAX_FRAGMENT_LENGTH,
  shareDateOf,
  shareLink,
} from "@/lib/study-plan/shareFragment";
import { serialisePlan, toBase64Url, type StudyPlan } from "@/lib/study-plan/plan";

const plan: StudyPlan = {
  versionId: "2568",
  cohort: "68",
  startYear: 2568,
  minorId: "governance",
  passed: ["PI121", "PI122"],
  freeElectiveCreditsPassed: 3,
  terms: [
    { term: { year: 3, kind: "semester1" }, codes: ["PI364", "PI313"], freeElectiveCredits: 0 },
    { term: { year: 3, kind: "summer" }, codes: [], freeElectiveCredits: 3 },
  ],
};

describe("encodeShareFragment and decodeShareFragment", () => {
  it("round-trips a plan and the day the link was made", () => {
    const fragment = encodeShareFragment(plan, "2026-10-11");
    expect(decodeShareFragment(fragment)).toEqual({ plan, sharedOn: "2026-10-11" });
  });

  it("accepts the fragment with its leading #, as location.hash gives it", () => {
    const fragment = encodeShareFragment(plan, "2026-10-11");
    expect(decodeShareFragment(`#${fragment}`)).toEqual({ plan, sharedOn: "2026-10-11" });
  });

  it("carries the plan in the format every other step uses, and only a date besides", () => {
    const fragment = encodeShareFragment(plan, "2026-10-11");
    expect(fragment).toBe(`p=${serialisePlan(plan)}&d=2026-10-11`);
    expect(fragment).not.toMatch(/[^A-Za-z0-9_=&-]/);
  });

  it("builds a link with the plan after the # and nothing in the path or query", () => {
    const link = shareLink("/en/services/study-plan/view", plan, "2026-10-11");
    const [beforeHash, afterHash] = link.split("#");
    expect(beforeHash).toBe("/en/services/study-plan/view");
    expect(afterHash).toBe(encodeShareFragment(plan, "2026-10-11"));
    // What a server would see of this URL names no plan.
    expect(new URL(link, "https://example.org").search).toBe("");
  });

  it("leaves the date out when it is not a real day, and the plan still reads", () => {
    for (const bad of ["", "yesterday", "2026-13-01", "2026-02-30", "26-10-11"]) {
      const fragment = encodeShareFragment(plan, bad);
      expect(fragment, bad).toBe(`p=${serialisePlan(plan)}`);
      expect(decodeShareFragment(fragment), bad).toEqual({ plan, sharedOn: null });
    }
  });
});

describe("decodeShareFragment with tampered or broken input", () => {
  const good = encodeShareFragment(plan, "2026-10-11");

  it("returns null for nothing at all", () => {
    for (const empty of ["", "#", "#&", "&&&", "p", "p=", "#p="]) {
      expect(decodeShareFragment(empty), empty).toBeNull();
    }
  });

  it("returns null for a link cut short in the middle of the plan", () => {
    const planPart = serialisePlan(plan);
    for (const cut of [10, 40, planPart.length - 5, planPart.length - 1]) {
      expect(decodeShareFragment(`p=${planPart.slice(0, cut)}`), String(cut)).toBeNull();
    }
  });

  it("returns null when a character in the plan is changed", () => {
    const planPart = serialisePlan(plan);
    const broken = `${planPart.slice(0, 20)}!${planPart.slice(21)}`;
    expect(decodeShareFragment(`p=${broken}`)).toBeNull();
    const otherPlan = toBase64Url(JSON.stringify({ ...plan, versionId: "1999" }));
    expect(decodeShareFragment(`p=${otherPlan}`)).toBeNull();
  });

  it("returns null for a plan that is valid JSON but not a plan", () => {
    for (const value of [{}, [], "text", 42, { versionId: "2568" }, { ...plan, cohort: "6" }]) {
      expect(decodeShareFragment(`p=${toBase64Url(JSON.stringify(value))}`)).toBeNull();
    }
    expect(decodeShareFragment(`p=${toBase64Url("not json")}`)).toBeNull();
  });

  it("returns null for a plan that breaks the schema's limits", () => {
    const tooMany = { ...plan, passed: Array.from({ length: 200 }, (_, i) => `PI${100 + i}`) };
    expect(decodeShareFragment(`p=${serialisePlan(tooMany as StudyPlan)}`)).toBeNull();
    const badCode = { ...plan, passed: ["<script>"] };
    expect(decodeShareFragment(`p=${serialisePlan(badCode as StudyPlan)}`)).toBeNull();
  });

  it("returns null for a fragment longer than any plan can be, without parsing it", () => {
    const huge = `p=${"A".repeat(MAX_FRAGMENT_LENGTH)}`;
    expect(decodeShareFragment(huge)).toBeNull();
  });

  it("ignores a forged or malformed date but keeps the plan", () => {
    const planPart = serialisePlan(plan);
    for (const date of [
      "<script>alert(1)</script>",
      "2026-99-99",
      "9999999999",
      "",
      "2026-10-11x",
    ]) {
      expect(decodeShareFragment(`p=${planPart}&d=${date}`), date).toEqual({
        plan,
        sharedOn: null,
      });
    }
  });

  it("ignores keys it does not know and lets the first plan win over a second", () => {
    const other = { ...plan, cohort: "67" };
    const fragment = `${good}&p=${serialisePlan(other)}&x=1`;
    expect(decodeShareFragment(fragment)).toEqual({ plan, sharedOn: "2026-10-11" });
  });

  it("never throws, whatever it is given", () => {
    const inputs = ["%", "%%%", "p=%E0%A4%A", "#p=\u0000", "p=" + "é".repeat(50), "=p", "p=a=b=c"];
    for (const input of inputs) {
      expect(() => decodeShareFragment(input), input).not.toThrow();
      expect(decodeShareFragment(input), input).toBeNull();
    }
    expect(decodeShareFragment(undefined as unknown as string)).toBeNull();
    expect(decodeShareFragment(null as unknown as string)).toBeNull();
  });
});

describe("the day on a shared link", () => {
  it("is the Bangkok day, whatever timezone the host is in", () => {
    // 17:30 UTC on the 10th is 00:30 on the 11th in Bangkok.
    expect(shareDateOf(new Date("2026-10-10T17:30:00Z"))).toBe("2026-10-11");
    expect(shareDateOf(new Date("2026-10-10T16:30:00Z"))).toBe("2026-10-10");
  });

  it("is shown in words in each language, and refuses what is not a day", () => {
    expect(formatShareDate("2026-10-11", "en")).toBe("11 October 2026");
    expect(formatShareDate("2026-10-11", "th")).toMatch(/2569/);
    expect(formatShareDate("2026-02-30", "en")).toBeNull();
    expect(formatShareDate("soon", "th")).toBeNull();
  });
});
