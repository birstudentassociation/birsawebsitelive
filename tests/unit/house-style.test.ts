/**
 * House style as validation (REDESIGN-2.0 §10, §6.5 step 3).
 *
 * Acceptance test row 16: an officer tries to publish with an em dash and is
 * blocked, inline, fixably in five seconds. These are the assertions behind
 * that row. Row 34 is the other half: "the message says what to fix, not what
 * failed", which is why every finding carries a bilingual message and an
 * offset rather than a boolean.
 */
import { describe, expect, it } from "vitest";

import { blocksPublication, checkHouseStyle } from "@/lib/content/houseStyle";

describe("dashes", () => {
  it("blocks an em dash", () => {
    const findings = checkHouseStyle("The fair runs all week — come along.");
    expect(findings.map((f) => f.rule)).toContain("em-dash");
    expect(blocksPublication(findings)).toBe(true);
  });

  it("blocks an en dash", () => {
    expect(checkHouseStyle("10–14 August").map((f) => f.rule)).toContain("en-dash");
  });

  it("blocks a dash in Thai copy too", () => {
    // The rule is the same in both languages (NEWS-STYLE §2 Thai section).
    expect(checkHouseStyle("งานจัดทั้งสัปดาห์ — เชิญทุกคน").map((f) => f.rule)).toContain(
      "em-dash"
    );
  });

  it("accepts a hyphen, which is a different character and a different job", () => {
    expect(checkHouseStyle("The BIR-wide survey")).toEqual([]);
  });
});

describe("colons", () => {
  it("blocks a colon used as a connector", () => {
    expect(checkHouseStyle("What to bring: your student card").map((f) => f.rule)).toContain(
      "colon"
    );
  });

  it("allows a clock time", () => {
    // §2.6: no colons at all, except in clock times and URLs.
    expect(checkHouseStyle("Doors open at 09:30 and close at 17:00")).toEqual([]);
  });

  it("allows a URL", () => {
    expect(checkHouseStyle("Read it at https://www.reg.tu.ac.th for the full rules")).toEqual([]);
  });

  it("still catches a stray colon in a string that also has a time", () => {
    // Masking must not swallow the rest of the string.
    const findings = checkHouseStyle("Doors: 09:30");
    expect(findings.map((f) => f.rule)).toEqual(["colon"]);
    expect(findings[0]!.at).toBe(5);
  });
});

describe("link text", () => {
  it("blocks 'click here'", () => {
    expect(checkHouseStyle("To join a club, click here").map((f) => f.rule)).toContain(
      "click-here"
    );
  });

  it("blocks a bare 'read more'", () => {
    expect(checkHouseStyle("read more").map((f) => f.rule)).toContain("click-here");
  });

  it("does not fire on 'here' used as an ordinary word", () => {
    expect(checkHouseStyle("The committee meets here every Tuesday")).toEqual([]);
  });
});

describe("headings", () => {
  it("flags a capitalised word that may not be a proper noun", () => {
    const findings = checkHouseStyle("Welcome Week Guide", { isHeading: true });
    expect(findings.map((f) => f.text)).toEqual(["Week", "Guide"]);
  });

  it("accepts a real proper noun mid-heading", () => {
    expect(checkHouseStyle("Getting around Thammasat", { isHeading: true })).toEqual([]);
  });

  it("flags a trailing full stop on a heading", () => {
    expect(
      checkHouseStyle("How to start a club.", { isHeading: true }).map((f) => f.rule)
    ).toContain("heading-full-stop");
  });

  it("applies neither heading rule to body copy", () => {
    expect(checkHouseStyle("How to start a club. Read the rules first.")).toEqual([]);
  });

  it("does not block publication on a sentence case hint alone", () => {
    // A rule that cannot tell a proper noun from a mistake must not block, or
    // the first officer to write "Welcome week at Thammasat" is stuck with no
    // way forward and no developer to ask.
    const findings = checkHouseStyle("Welcome Week Guide", { isHeading: true });
    expect(findings.length).toBeGreaterThan(0);
    expect(blocksPublication(findings)).toBe(false);
  });
});

describe("the shape of a finding", () => {
  it("points at the character to fix", () => {
    const findings = checkHouseStyle("Come along — it is free");
    expect(findings[0]!.at).toBe(11);
  });

  it("carries a message in both languages", () => {
    // §6.5: the message appears next to the field, in the EDITOR's language.
    // A Thai-first officer meeting an English-only error message is section
    // 6.4's exclusion happening one validation rule at a time.
    for (const finding of checkHouseStyle("A — b : click here")) {
      expect(finding.message.en.length, finding.rule).toBeGreaterThan(10);
      expect(finding.message.th.length, finding.rule).toBeGreaterThan(10);
      expect(finding.message.th, finding.rule).toMatch(/[฀-๿]/);
    }
  });

  it("reports every problem rather than the first", () => {
    // An officer fixing one error at a time across six round trips gives up.
    const rules = checkHouseStyle("A — b – c : d").map((f) => f.rule);
    expect(new Set(rules)).toEqual(new Set(["em-dash", "en-dash", "colon"]));
  });

  it("returns findings in document order", () => {
    const findings = checkHouseStyle("first : second — third");
    expect(findings.map((f) => f.at)).toEqual([...findings.map((f) => f.at)].sort((a, b) => a - b));
  });
});
