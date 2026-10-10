import { describe, expect, it } from "vitest";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";

/** Every string in a copy object with its path, so en and th can be compared leaf by leaf. */
function leaves(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      leaves(child, path ? `${path}.${key}` : key)
    );
  }
  return [];
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("plan link copy", () => {
  const en = leaves(buildPlanLinkCopy("en"));
  const th = leaves(buildPlanLinkCopy("th"));

  it("has the same keys in English and Thai", () => {
    expect(th.map(([path]) => path)).toEqual(en.map(([path]) => path));
  });

  it("has no empty string in either language", () => {
    for (const [path, text] of [...en, ...th]) expect(text.trim().length, path).toBeGreaterThan(0);
  });

  it("fills the same placeholders in both languages, so neither shows a raw {token}", () => {
    en.forEach(([path, text], i) => {
      expect(placeholders(th[i]![1]), path).toEqual(placeholders(text));
    });
  });

  it("writes Thai as Thai: every Thai string contains Thai script", () => {
    for (const [path, text] of th) {
      // Templates that are only a number or a code ("{n}%") still carry Thai words.
      expect(text, path).toMatch(/[฀-๿]/);
    }
  });

  it("explains every way an add can be refused", () => {
    const reasons = buildPlanLinkCopy("en").add.reasons;
    expect(Object.keys(reasons).sort()).toEqual(
      [
        "alreadyPassed",
        "alreadyPlanned",
        "badTerm",
        "internshipTerm",
        "notInVersion",
        "pastTerm",
        "termFull",
        "tooManyTerms",
        "unavailableTerm",
        "unknownCourse",
      ].sort()
    );
  });

  it("uses no dashes of any kind, and no scores or ratings", () => {
    for (const [path, text] of [...en, ...th]) {
      expect(text, path).not.toMatch(/[‒-―−]|--/);
      expect(text, path).not.toMatch(/\b(stars?|rating|rated|score)\b/i);
    }
  });
});
