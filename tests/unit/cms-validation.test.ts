/**
 * Tests for the CMS validation library (REDESIGN-2.0 section 10, section
 * 3.6, section 6.5 step 3): bilingual parity, house style, the generic
 * bilingual field scanner, and staleness reporting.
 *
 * Link integrity and the cron route live in tests/unit/cms-link-integrity.
 * test.ts instead, because that half needs a faked fetch and a faked
 * Sanity client; nothing here touches the network.
 */
import { describe, expect, it } from "vitest";

import {
  checkBilingualParity,
  countByLocale,
  blocksPublication as parityBlocksPublication,
  type ParityField,
} from "@/lib/cms/validation/bilingualParity";
import {
  checkHouseStyleFields,
  advisoryFindings,
  blocksPublication as houseStyleBlocksPublication,
  type HouseStyleFieldInput,
} from "@/lib/cms/validation/houseStyle";
import {
  computeStalenessReport,
  groupStalenessByOwner,
  type StalenessSubject,
} from "@/lib/cms/validation/staleness";
import { extractLocalizedFields, validateBilingualDocument } from "@/lib/cms/validation";
import type { Lifecycle } from "@/lib/content/lifecycle";
import type { PortfolioId } from "@/lib/portfolios";

// ---------------------------------------------------------------------------
// Bilingual parity
// ---------------------------------------------------------------------------

describe("checkBilingualParity", () => {
  it("names the field and the locale when Thai text never arrived", () => {
    const fields: ParityField[] = [
      { path: "sections[2].heading", value: { en: "Orientation week", th: "" } },
    ];

    const findings = checkBilingualParity(fields);

    expect(findings).toHaveLength(1);
    const [finding] = findings;
    // The field is named, in a form an officer can act on...
    expect(finding!.path).toBe("sections[2].heading");
    // ...and it names the locale that is MISSING, not the one that has text.
    expect(finding!.locale).toBe("th");
    expect(finding!.message.en).toContain("sections[2].heading");
    expect(finding!.message.th).toContain("sections[2].heading");
    // The message says what to fix, not only that something failed.
    expect(finding!.message.en.toLowerCase()).toContain("add it before publishing");
  });

  it("names English as the missing locale when the English side is blank", () => {
    const findings = checkBilingualParity([{ path: "title", value: { en: "  ", th: "หัวข้อ" } }]);

    expect(findings).toHaveLength(1);
    expect(findings[0]!.locale).toBe("en");
    expect(findings[0]!.path).toBe("title");
  });

  it("does not report a field that is blank in both locales", () => {
    // Both blank is a required-field problem, not a parity problem: the
    // schema's own required-field validation owns that, per this file's own
    // header. Reporting it here would make the parity message lie about
    // what is actually wrong.
    const findings = checkBilingualParity([{ path: "summary", value: { en: "", th: undefined } }]);
    expect(findings).toEqual([]);
  });

  it("does not report a field present in both locales", () => {
    const findings = checkBilingualParity([
      { path: "title", value: { en: "Welcome", th: "ยินดีต้อนรับ" } },
    ]);
    expect(findings).toEqual([]);
  });

  it("skips a field explicitly marked as legitimately locale only", () => {
    const findings = checkBilingualParity([
      { path: "socialLink", value: { en: "https://example.com/en-only" }, required: false },
    ]);
    expect(findings).toEqual([]);
  });

  it("counts findings by locale for a cron summary", () => {
    const findings = checkBilingualParity([
      { path: "a", value: { en: "x", th: "" } },
      { path: "b", value: { en: "y", th: "" } },
      { path: "c", value: { en: "", th: "z" } },
    ]);
    expect(countByLocale(findings)).toEqual({ en: 1, th: 2 });
  });

  it("blocks publication whenever any parity finding exists", () => {
    expect(parityBlocksPublication([])).toBe(false);
    expect(
      parityBlocksPublication(checkBilingualParity([{ path: "title", value: { en: "x", th: "" } }]))
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// House style: the blocking dash and colon rules, in both locales
// ---------------------------------------------------------------------------

describe("checkHouseStyleFields: blocking rules, in both locales", () => {
  it("catches an em dash in English and in Thai, and blocks publication", () => {
    const fields: HouseStyleFieldInput[] = [
      {
        path: "body",
        value: { en: "The fair opens at noon — do not miss it.", th: "งานเริ่มเที่ยง — ห้ามพลาด" },
      },
    ];
    const findings = checkHouseStyleFields(fields);

    const emDashes = findings.filter((f) => f.rule === "em-dash");
    expect(emDashes.map((f) => f.locale).sort()).toEqual(["en", "th"]);
    for (const f of emDashes) {
      expect(f.severity).toBe("block");
      expect(f.text).toBe("—");
    }
    expect(houseStyleBlocksPublication(findings)).toBe(true);
  });

  it("catches an en dash in English and in Thai", () => {
    const fields: HouseStyleFieldInput[] = [
      { path: "body", value: { en: "Open 10–14 August.", th: "เปิด 10–14 สิงหาคม" } },
    ];
    const findings = checkHouseStyleFields(fields);

    const enDashes = findings.filter((f) => f.rule === "en-dash");
    expect(enDashes.map((f) => f.locale).sort()).toEqual(["en", "th"]);
    expect(enDashes.every((f) => f.severity === "block")).toBe(true);
  });

  it("catches a stray colon in English and in Thai", () => {
    const fields: HouseStyleFieldInput[] = [
      {
        path: "body",
        value: { en: "Bring the following: your ID card.", th: "นำสิ่งนี้มาด้วย: บัตรนักศึกษา" },
      },
    ];
    const findings = checkHouseStyleFields(fields);

    const colons = findings.filter((f) => f.rule === "colon");
    expect(colons.map((f) => f.locale).sort()).toEqual(["en", "th"]);
    expect(colons.every((f) => f.severity === "block")).toBe(true);
  });

  // This is the false positive that would make officers distrust the whole
  // tool: a clock time and a URL both contain a colon that is not the "site
  // default connector" colon NEWS-STYLE.md 2.6 bans. A tool that flags
  // "09:30" or "https://example.com" teaches an officer to ignore it, and a
  // tool officers ignore at 9pm before an event is worse than no tool.
  it("does NOT flag a colon inside a clock time or a URL, in either locale", () => {
    const fields: HouseStyleFieldInput[] = [
      {
        path: "body",
        value: {
          en: "Doors open at 09:30. Full details at https://example.com/orientation.",
          th: "ประตูเปิดเวลา 09:30 น. ดูรายละเอียดเพิ่มเติมที่ https://example.com/orientation",
        },
      },
    ];
    const findings = checkHouseStyleFields(fields);

    expect(findings.filter((f) => f.rule === "colon")).toEqual([]);
  });
});

describe("checkHouseStyleFields: advisory rules never block", () => {
  it("flags a GOV.UK weak word as advice, English only", () => {
    const fields: HouseStyleFieldInput[] = [
      {
        path: "body",
        value: { en: "We will ensure this happens.", th: "เราจะทำให้สิ่งนี้เกิดขึ้น" },
      },
    ];
    const findings = checkHouseStyleFields(fields);

    const weakWords = findings.filter((f) => f.rule === "weak-word");
    expect(weakWords).toHaveLength(1);
    expect(weakWords[0]!.locale).toBe("en");
    expect(weakWords[0]!.severity).toBe("advice");
    expect(houseStyleBlocksPublication(weakWords)).toBe(false);
  });

  it("flags a probable passive construction as a hint, not a rule", () => {
    const fields: HouseStyleFieldInput[] = [
      { path: "body", value: { en: "The winners were picked by the judges.", th: "" } },
    ];
    const findings = checkHouseStyleFields(fields);

    const passive = findings.filter((f) => f.rule === "passive-voice-hint");
    expect(passive).toHaveLength(1);
    expect(passive[0]!.severity).toBe("advice");
    expect(passive[0]!.message.en.toLowerCase()).toContain("hint");
  });

  it("flags a sentence over the 25 word guideline, located without quoting it", () => {
    const longSentence = Array(30).fill("word").join(" ") + ".";
    const findings = checkHouseStyleFields([{ path: "body", value: { en: longSentence, th: "" } }]);

    const longs = findings.filter((f) => f.rule === "long-sentence");
    expect(longs).toHaveLength(1);
    expect(longs[0]!.severity).toBe("advice");
    // Every other rule's `text` is the matched token itself; a run-on
    // sentence has no single token, so it is located by position ("sentence
    // 1 of 1") rather than by quoting any of what was actually written.
    expect(longs[0]!.text).toBe("sentence 1 of 1");
  });

  it("separates advisory findings from the full list", () => {
    const findings = checkHouseStyleFields([
      { path: "body", value: { en: "We will ensure this — now.", th: "" } },
    ]);
    const advice = advisoryFindings(findings);
    expect(advice.every((f) => f.severity === "advice")).toBe(true);
    expect(advice.some((f) => f.rule === "em-dash")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// The generic bilingual field scanner (index.ts)
// ---------------------------------------------------------------------------

describe("extractLocalizedFields", () => {
  it("finds a plain string field and a Portable Text field, by path", () => {
    const doc = {
      _id: "news.abc123",
      _type: "news",
      title: { en: "Orientation week", th: "" },
      body: {
        en: [{ _type: "block", _key: "a", children: [{ _type: "span", text: "Welcome." }] }],
        th: [{ _type: "block", _key: "b", children: [{ _type: "span", text: "ยินดีต้อนรับ" }] }],
      },
    };

    const fields = extractLocalizedFields(doc);
    const byPath = Object.fromEntries(fields.map((f) => [f.path, f.value]));

    expect(byPath.title).toEqual({ en: "Orientation week", th: "" });
    expect(byPath.body).toEqual({ en: "Welcome.", th: "ยินดีต้อนรับ" });
  });

  it("ignores Sanity's own bookkeeping keys", () => {
    const doc = {
      _id: "x",
      _type: "news",
      _rev: "r1",
      _createdAt: "2024",
      title: { en: "A", th: "B" },
    };
    const fields = extractLocalizedFields(doc);
    expect(fields.map((f) => f.path)).toEqual(["title"]);
  });

  it("walks nested arrays and objects, naming the path with indices", () => {
    const doc = {
      sections: [
        { _key: "s1", heading: { en: "First", th: "" } },
        { _key: "s2", heading: { en: "", th: "ที่สอง" } },
      ],
    };
    const fields = extractLocalizedFields(doc);
    expect(fields.map((f) => f.path).sort()).toEqual([
      "sections[0].heading",
      "sections[1].heading",
    ]);
  });
});

describe("validateBilingualDocument", () => {
  it("runs parity and house style together and blocks on either", () => {
    const doc = {
      _id: "news.def456",
      _type: "news",
      title: { en: "Big event — do not miss it", th: "" },
    };
    const result = validateBilingualDocument(doc);

    expect(result.parity.some((f) => f.path === "title" && f.locale === "th")).toBe(true);
    expect(result.houseStyle.some((f) => f.rule === "em-dash")).toBe(true);
    expect(result.blocksPublication).toBe(true);
  });

  it("does not block on a clean, fully bilingual document", () => {
    const doc = { _id: "news.ghi789", _type: "news", title: { en: "Welcome", th: "ยินดีต้อนรับ" } };
    const result = validateBilingualDocument(doc);
    expect(result.blocksPublication).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Staleness
// ---------------------------------------------------------------------------

function makeLifecycle(overrides: Partial<Lifecycle> = {}): Lifecycle {
  return {
    status: "published",
    publishAt: null,
    owner: "academic-affairs",
    lastReviewed: "2024-01-01",
    reviewBy: "2024-06-01",
    slugHistory: [],
    maintainedBecause: null,
    ...overrides,
  };
}

describe("computeStalenessReport", () => {
  const TODAY = "2026-06-01";

  it("reports an overdue document WITH its owner, so a portfolio can act on it", () => {
    const subjects: StalenessSubject[] = [
      {
        id: "news.overdue",
        documentType: "news",
        lifecycle: makeLifecycle({ reviewBy: "2024-01-01" }),
      },
    ];

    const report = computeStalenessReport(subjects, TODAY);

    expect(report).toHaveLength(1);
    const entry = report[0]!;
    expect(entry.id).toBe("news.overdue");
    expect(entry.owner).toBe("academic-affairs");
    expect(entry.ownerLabel).toEqual({ en: "Academic Affairs", th: "ฝ่ายวิชาการ" });
    expect(entry.reviewBy).toBe("2024-01-01");
    expect(entry.overdueDays).toBeGreaterThan(0);
  });

  it("excludes a document not yet due for review", () => {
    const subjects: StalenessSubject[] = [
      {
        id: "news.fine",
        documentType: "news",
        lifecycle: makeLifecycle({ reviewBy: "2027-01-01" }),
      },
    ];
    expect(computeStalenessReport(subjects, TODAY)).toEqual([]);
  });

  it("sorts most overdue first, so the list is one a portfolio can act on", () => {
    const subjects: StalenessSubject[] = [
      {
        id: "news.a-bit-late",
        documentType: "news",
        lifecycle: makeLifecycle({ reviewBy: "2026-05-01" }),
      },
      {
        id: "news.very-late",
        documentType: "news",
        lifecycle: makeLifecycle({ reviewBy: "2023-01-01" }),
      },
    ];
    const report = computeStalenessReport(subjects, TODAY);
    expect(report.map((e) => e.id)).toEqual(["news.very-late", "news.a-bit-late"]);
  });

  it("flags a maintainedBecause page as the standing trigger to re-check delegation", () => {
    const subjects: StalenessSubject[] = [
      {
        id: "student-life.no-authoritative-source",
        documentType: "student-life",
        lifecycle: makeLifecycle({
          reviewBy: "2024-01-01",
          maintainedBecause: "TUSU does not publish this yet",
        }),
      },
    ];
    const [entry] = computeStalenessReport(subjects, TODAY);
    expect(entry!.keptBecauseNoAuthoritativeSource).toBe(true);
  });

  it("degrades to the id itself rather than throwing on an unrecognised portfolio", () => {
    // Section 6.9's "degrade rather than throw" applied one level down: a
    // portfolio id that does not resolve is a data problem worth reporting,
    // not a reason to crash the whole staleness pass. Cast past the closed
    // PortfolioId union on purpose, to exercise the fallback branch.
    const subjects: StalenessSubject[] = [
      {
        id: "news.orphaned",
        documentType: "news",
        lifecycle: makeLifecycle({
          reviewBy: "2024-01-01",
          owner: "no-such-portfolio" as PortfolioId,
        }),
      },
    ];
    const [entry] = computeStalenessReport(subjects, TODAY);
    expect(entry!.ownerLabel).toEqual({ en: "no-such-portfolio", th: "no-such-portfolio" });
  });
});

describe("groupStalenessByOwner", () => {
  it("groups entries under their owning portfolio", () => {
    const subjects: StalenessSubject[] = [
      {
        id: "a",
        documentType: "news",
        lifecycle: makeLifecycle({ owner: "academic-affairs", reviewBy: "2024-01-01" }),
      },
      {
        id: "b",
        documentType: "news",
        lifecycle: makeLifecycle({ owner: "sport", reviewBy: "2024-01-01" }),
      },
      {
        id: "c",
        documentType: "news",
        lifecycle: makeLifecycle({ owner: "academic-affairs", reviewBy: "2024-02-01" }),
      },
    ];
    const grouped = groupStalenessByOwner(computeStalenessReport(subjects, "2026-06-01"));

    expect(grouped["academic-affairs"]!.map((e) => e.id).sort()).toEqual(["a", "c"]);
    expect(grouped.sport!.map((e) => e.id)).toEqual(["b"]);
  });
});

// ---------------------------------------------------------------------------
// No validator output contains personal data or document content
// ---------------------------------------------------------------------------

describe("no validator output contains personal data or document content", () => {
  // Obviously fictional: a fabricated name and a fabricated ID that are not
  // real BIRSA institutional facts, standing in for the kind of sentence a
  // real news post or contact field could actually contain.
  const sensitiveSentence =
    "Jane Testperson, student ID TEST0000000, called about her lost bag near the Prachan Gate.";

  it("a bilingual parity finding carries only the path and the locale name, never the field text", () => {
    const findings = checkBilingualParity([
      { path: "contactNote", value: { en: sensitiveSentence, th: "" } },
    ]);
    expect(findings).toHaveLength(1);
    const dump = JSON.stringify(findings[0]);
    expect(dump).not.toContain("Jane Testperson");
    expect(dump).not.toContain("TEST0000000");
    expect(dump).toContain("contactNote");
  });

  it("a house style finding never carries more than its own short offending token", () => {
    const longSensitiveSentence = `${sensitiveSentence} ${Array(20).fill("more").join(" ")}.`;
    const findings = checkHouseStyleFields([
      { path: "contactNote", value: { en: longSensitiveSentence, th: "" } },
    ]);

    for (const finding of findings) {
      expect(finding.text.length).toBeLessThanOrEqual(41);
      expect(finding.text).not.toContain("Jane Testperson");
      expect(finding.message.en).not.toContain("Jane Testperson");
      expect(finding.message.en).not.toContain("TEST0000000");
    }
  });

  it("a staleness report entry carries only ids and dates, never a title or body", () => {
    const subjects: StalenessSubject[] = [
      {
        id: "news.contact-note",
        documentType: "news",
        lifecycle: makeLifecycle({ reviewBy: "2024-01-01" }),
      },
    ];
    const [entry] = computeStalenessReport(subjects, "2026-06-01");
    // The entry's own key set is closed and does not include a title or
    // body field at all, which is the guarantee this test checks for.
    expect(Object.keys(entry!).sort()).toEqual(
      [
        "id",
        "documentType",
        "owner",
        "ownerLabel",
        "reviewBy",
        "overdueDays",
        "keptBecauseNoAuthoritativeSource",
      ].sort()
    );
  });
});
