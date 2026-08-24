/**
 * Unit tests for `lib/migration/modules.ts` (Wave 6B, REDESIGN-2.0 §11.4
 * item 6).
 *
 * Every transform under test is pure, so these run entirely in memory
 * against small, hand-built fixtures shaped like the real content modules
 * rather than the real corpus (the real corpus is exercised end to end by
 * actually running `scripts/migrate-modules.mjs`, which this suite does not
 * need to do to prove the transform logic itself is correct). `idFor` here
 * is a trivial stub (`type-key`), never `lib/migration/ids.ts` — this file
 * must typecheck and pass whether or not that file exists yet in the
 * checkout, per that file's own header and the shared Wave 6 brief.
 */
import { describe, expect, it } from "vitest";

import {
  assessCalendarEvents,
  assessQuickLinks,
  assessReporting,
  countRegulationStructure,
  findPortfolioForRole,
  parseThaiAnnouncementDate,
  transformCommitteeMember,
  transformPortfolios,
  transformRegulationDocument,
  transformSiteSettings,
  type IdFor,
} from "@/lib/migration/modules";
import type { RegulationDoc } from "@/content/activity/regulations/types";
import type { CalendarEvent } from "@/content/calendar/events";
import type { CommitteeMember } from "@/content/committee";
import type { Portfolio } from "@/lib/portfolios";
import type { QuickGroup } from "@/content/quick";
import type { PortfolioId } from "@/lib/portfolios";

const idFor: IdFor = (parts) => parts.join("-");

// ---------------------------------------------------------------------------
// parseThaiAnnouncementDate
// ---------------------------------------------------------------------------

describe("parseThaiAnnouncementDate", () => {
  it("parses the three real made.th strings in the regulation corpus", () => {
    expect(parseThaiAnnouncementDate("ประกาศ ณ วันที่ 24 กุมภาพันธ์ พ.ศ. 2565")).toBe("2022-02-24");
    expect(parseThaiAnnouncementDate("ประกาศ ณ วันที่ 8 ตุลาคม พุทธศักราช 2563")).toBe(
      "2020-10-08"
    );
    expect(parseThaiAnnouncementDate("ประกาศ ณ วันที่ 30 มิถุนายน พ.ศ. 2568")).toBe("2025-06-30");
  });

  it("returns null, never a guess, for a string that does not match the expected pattern", () => {
    expect(parseThaiAnnouncementDate("ยังไม่ได้ประกาศ")).toBeNull();
    expect(parseThaiAnnouncementDate("")).toBeNull();
  });

  it("returns null for an impossible calendar date rather than rolling over to the next month", () => {
    // 31 กุมภาพันธ์ ("31 February") does not exist.
    expect(parseThaiAnnouncementDate("ประกาศ ณ วันที่ 31 กุมภาพันธ์ พ.ศ. 2565")).toBeNull();
  });

  it("is a pure function of its input: same string in, same result out, every time", () => {
    const th = "ประกาศ ณ วันที่ 1 มกราคม พ.ศ. 2560";
    const results = Array.from({ length: 5 }, () => parseThaiAnnouncementDate(th));
    expect(new Set(results).size).toBe(1);
    expect(results[0]).toBe("2017-01-01");
  });
});

// ---------------------------------------------------------------------------
// Regulation fixtures + transformRegulationDocument / countRegulationStructure
// ---------------------------------------------------------------------------

const fixtureRegulation: RegulationDoc = {
  slug: "fixture-reg-2565",
  shortTitle: { en: "Fixture Regulation", th: "ระเบียบตัวอย่าง" },
  citation: { en: "Fixture Citation", th: "การอ้างอิงตัวอย่าง" },
  authority: { en: "Fixture Authority", th: "หน่วยงานตัวอย่าง" },
  preamble: { en: "Fixture preamble.", th: "คำปรารภตัวอย่าง" },
  made: { en: "Made on 1 January B.E. 2560 (2017)", th: "ประกาศ ณ วันที่ 1 มกราคม พ.ศ. 2560" },
  signatory: { en: "Fixture Signatory", th: "ผู้ลงนามตัวอย่าง" },
  sections: [
    {
      kind: { en: "Part", th: "ส่วนที่" },
      number: "1",
      title: { en: "Fixture part", th: "ส่วนตัวอย่าง" },
      provisions: [
        {
          num: 1,
          title: { en: "Fixture provision", th: "ข้อตัวอย่าง" },
          lead: { en: "Lead text.", th: "ข้อความนำ" },
          items: [
            {
              marker: "(1)",
              text: { en: "Item one.", th: "ข้อที่หนึ่ง" },
              children: [{ marker: "A.", text: { en: "Nested item.", th: "ข้อย่อย" } }],
            },
          ],
          definitions: [
            { term: { en: "Term", th: "คำนิยาม" }, meaning: { en: "Means x", th: "หมายถึง x" } },
          ],
        },
      ],
      children: [
        {
          title: { en: "Nested group", th: "กลุ่มย่อย" },
          provisions: [
            {
              num: 2,
              title: { en: "Second provision", th: "ข้อที่สอง" },
              body: [
                { kind: "para", text: { en: "Para.", th: "ย่อหน้า" } },
                {
                  kind: "list",
                  items: [{ marker: "(1)", text: { en: "Body item.", th: "ข้อความในเนื้อหา" } }],
                },
                {
                  kind: "definitions",
                  entries: [{ term: { en: "T2", th: "น2" }, meaning: { en: "M2", th: "ม2" } }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe("countRegulationStructure", () => {
  it("counts section groups, provisions and provision items/definitions, including nesting", () => {
    const counts = countRegulationStructure(fixtureRegulation);
    // Section groups: the top-level Part, plus its one child group = 2.
    expect(counts.sectionGroups).toBe(2);
    // Provisions: num 1 and num 2 = 2.
    expect(counts.provisions).toBe(2);
    // Provision items/definitions: provision 1's items[0] + its nested
    // child (2) + its one definition (1) = 3; provision 2's body list item
    // (1) + body definitions entry (1) = 2. Total 5.
    expect(counts.provisionItems).toBe(5);
  });
});

describe("transformRegulationDocument", () => {
  const { document, gaps } = transformRegulationDocument(fixtureRegulation, idFor);

  it("emits only title, slug and a derived effectiveDate — nothing the schema cannot hold", () => {
    expect(document).toEqual({
      _id: "regulation-fixture-reg-2565",
      _type: "regulation",
      title: { en: "Fixture Regulation", th: "ระเบียบตัวอย่าง" },
      slug: { _type: "slug", current: "fixture-reg-2565" },
      effectiveDate: "2017-01-01",
    });
  });

  it("reports the section tree, the front-matter fields with no field, and lifecycle.owner as gaps", () => {
    const fields = gaps.map((g) => g.field);
    expect(fields).toContain("citation, authority, preamble, signatory");
    expect(fields).toContain("sections (the whole provision tree)");
    expect(fields).toContain("lifecycle.owner");
    expect(gaps.every((g) => g.scope === "regulation:fixture-reg-2565")).toBe(true);
  });

  it("reports effectiveDate as a gap, and omits the field, when made.th does not parse", () => {
    const noDate: RegulationDoc = {
      ...fixtureRegulation,
      made: { en: "Undated", th: "ไม่มีวันที่" },
    };
    const result = transformRegulationDocument(noDate, idFor);
    expect(result.document?.effectiveDate).toBeUndefined();
    expect(result.gaps.some((g) => g.field === "effectiveDate")).toBe(true);
  });

  it("is deterministic: the same document and idFor produce byte-identical JSON on repeat calls", () => {
    const a = transformRegulationDocument(fixtureRegulation, idFor);
    const b = transformRegulationDocument(fixtureRegulation, idFor);
    expect(JSON.stringify(a.document)).toBe(JSON.stringify(b.document));
  });
});

// ---------------------------------------------------------------------------
// Calendar
// ---------------------------------------------------------------------------

describe("assessCalendarEvents", () => {
  const events: CalendarEvent[] = [
    {
      id: "z-orphan",
      start: "2026-01-01",
      title: { en: "Z", th: "แซด" },
      slug: "no-such-post",
      kind: "university",
    },
    {
      id: "a-real",
      start: "2026-01-02",
      title: { en: "A", th: "เอ" },
      slug: "real-post",
      kind: "birsa",
    },
  ];

  it("classifies each entry by whether its slug has matching migrated content, sorted by id", () => {
    const result = assessCalendarEvents(events, new Set(["real-post"]));
    expect(result).toEqual([
      { id: "a-real", matchedSlug: "real-post", outcome: "points-to-migrated-content" },
      { id: "z-orphan", matchedSlug: "no-such-post", outcome: "orphan-no-content" },
    ]);
  });

  it("never emits a document — this function only classifies for the report", () => {
    // Type-level: assessCalendarEvents's return type carries no `document`
    // field at all. This test is the runtime companion, asserting the same
    // by checking no result object has a `document` key.
    const result = assessCalendarEvents(events, new Set());
    for (const r of result) expect("document" in r).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Committee + portfolios
// ---------------------------------------------------------------------------

const portfolios: Portfolio[] = [
  { id: "president", label: { en: "President", th: "นายก" }, heldBy: ["President"] },
  {
    id: "secretariat",
    label: { en: "Secretariat", th: "เลขา" },
    heldBy: ["Secretary 1", "Secretary 2"],
  },
];

const committee: CommitteeMember[] = [
  {
    key: "alice",
    group: "officer",
    en: { firstName: "Alice", lastName: "A", nickname: "Al", title: "President" },
    th: { firstName: "อลิซ", lastName: "เอ", nickname: "อัล", title: "นายก" },
  },
  {
    key: "bob",
    group: "officer",
    en: { firstName: "Bob", lastName: "B", nickname: "Bo", title: "Secretary 1" },
    th: { firstName: "บ็อบ", lastName: "บี", nickname: "โบ", title: "เลขา 1" },
  },
  {
    key: "carol",
    group: "assistant",
    en: { firstName: "Carol", lastName: "C", nickname: "Ca", title: "Secretary 2" },
    th: { firstName: "แครอล", lastName: "ซี", nickname: "แค", title: "เลขา 2" },
  },
  {
    key: "dave",
    group: "assistant",
    en: { firstName: "Dave", lastName: "D", nickname: "Da", title: "Unmatched Role" },
    th: { firstName: "เดฟ", lastName: "ดี", nickname: "เดฟ", title: "ตำแหน่งไม่ตรง" },
  },
];

describe("findPortfolioForRole", () => {
  it("finds the one portfolio naming this exact title", () => {
    expect(findPortfolioForRole("President", portfolios)).toBe("president");
    expect(findPortfolioForRole("Secretary 2", portfolios)).toBe("secretariat");
  });

  it("returns null when no portfolio names the title", () => {
    expect(findPortfolioForRole("Nonexistent Role", portfolios)).toBeNull();
  });

  it("returns null (never guesses) when more than one portfolio names the same title", () => {
    const ambiguous: Portfolio[] = [
      ...portfolios,
      { id: "spokesperson", label: { en: "Spokesperson", th: "โฆษก" }, heldBy: ["President"] },
    ];
    expect(findPortfolioForRole("President", ambiguous)).toBeNull();
  });
});

describe("transformPortfolios", () => {
  const { documents, gaps } = transformPortfolios(portfolios, committee, idFor);

  it("migrates a portfolio with two or more matched holders, in committee.ts's own order", () => {
    const secretariat = documents.find((d) => d.portfolioId === "secretariat");
    expect(secretariat).toEqual({
      _id: "portfolio-secretariat",
      _type: "portfolio",
      portfolioId: "secretariat",
      holder: { _type: "reference", _ref: "committee-member-bob" },
      secondHolder: { _type: "reference", _ref: "committee-member-carol" },
      lifecycle: { status: "draft", owner: "secretariat" },
    });
  });

  it("does not migrate a portfolio with fewer than two matched holders, and reports why", () => {
    expect(documents.find((d) => d.portfolioId === "president")).toBeUndefined();
    const gap = gaps.find((g) => g.scope === "portfolio:president");
    expect(gap).toBeDefined();
    expect(gap!.reason).toMatch(/only 1 member/);
  });
});

describe("transformCommitteeMember", () => {
  it("resolves and references a portfolio that was itself migrated", () => {
    const migrated = new Set<PortfolioId>(["secretariat"]);
    const { document, gaps } = transformCommitteeMember(committee[1]!, portfolios, migrated, idFor);
    expect(document?.portfolio).toEqual({ _type: "reference", _ref: "portfolio-secretariat" });
    expect(gaps.some((g) => g.field === "portfolio")).toBe(false);
  });

  it("omits the portfolio reference (never a dangling one) when the resolved portfolio was not migrated, and reports it", () => {
    const migrated = new Set<PortfolioId>(); // "president" resolves, but is not in this set.
    const { document, gaps } = transformCommitteeMember(committee[0]!, portfolios, migrated, idFor);
    expect(document?.portfolio).toBeUndefined();
    // lifecycle.owner is still set: it is a closed-vocabulary string, not a
    // reference, so it does not need the portfolio DOCUMENT to exist.
    expect(document?.lifecycle.owner).toBe("president");
    expect(gaps.some((g) => g.field === "portfolio" && /was not migrated/.test(g.reason))).toBe(
      true
    );
  });

  it("reports a portfolio gap, with no reference at all, when no portfolio names the role", () => {
    const { document, gaps } = transformCommitteeMember(
      committee[3]!,
      portfolios,
      new Set(),
      idFor
    );
    expect(document?.portfolio).toBeUndefined();
    expect(document?.lifecycle.owner).toBeUndefined();
    expect(gaps.some((g) => g.field === "portfolio" && /No portfolio/.test(g.reason))).toBe(true);
  });

  it("always reports portrait/roleEmail as unmigrated, since committee.ts never carries either", () => {
    const { gaps } = transformCommitteeMember(
      committee[0]!,
      portfolios,
      new Set(["president"]),
      idFor
    );
    expect(gaps.some((g) => g.field === "portrait, roleEmail")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

describe("transformSiteSettings", () => {
  it("migrates the contact block and reports socials/officialLinks/lifecycle.owner as gaps", () => {
    const { document, gaps } = transformSiteSettings({
      address: { en: "1 Fixture Rd", th: "1 ถนนตัวอย่าง" },
      phone: "02-000-0000",
      email: "contact@example.org",
      secondaryEmail: "alt@example.org",
    });
    expect(document).toEqual({
      _id: "siteSettings",
      _type: "siteSettings",
      contact: {
        email: "contact@example.org",
        secondaryEmail: "alt@example.org",
        phone: "02-000-0000",
        address: { en: "1 Fixture Rd", th: "1 ถนนตัวอย่าง" },
      },
    });
    const fields = gaps.map((g) => g.field);
    expect(fields).toContain("socials (instagram, facebook, email, line)");
    expect(fields).toContain("officialLinks (birProgram, faculty, registrar, university)");
    expect(fields).toContain("lifecycle.owner");
  });
});

// ---------------------------------------------------------------------------
// Quick links + reporting (assessment only)
// ---------------------------------------------------------------------------

describe("assessQuickLinks", () => {
  it("reports one gap per item, distinguishing external from internal-path items", () => {
    const groups: QuickGroup[] = [
      {
        key: "g1",
        en: { heading: "Group" },
        th: { heading: "กลุ่ม" },
        items: [
          {
            key: "internal-item",
            href: "/news",
            icon: "calendar",
            en: { label: "News" },
            th: { label: "ข่าว" },
          },
          {
            key: "external-item",
            href: "https://example.org",
            external: true,
            icon: "external",
            en: { label: "Ext" },
            th: { label: "ภายนอก" },
          },
        ],
      },
    ];
    const gaps = assessQuickLinks(groups);
    expect(gaps).toHaveLength(2);
    expect(gaps.find((g) => g.scope === "quick:g1/internal-item")!.reason).toMatch(
      /no route registry/
    );
    expect(gaps.find((g) => g.scope === "quick:g1/external-item")!.reason).toMatch(/External href/);
  });
});

describe("assessReporting", () => {
  it("always returns exactly one gap for the whole module", () => {
    const gaps = assessReporting();
    expect(gaps).toHaveLength(1);
    expect(gaps[0]!.scope).toBe("reporting");
  });
});
