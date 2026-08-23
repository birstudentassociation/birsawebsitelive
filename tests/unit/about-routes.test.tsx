// @vitest-environment jsdom
/**
 * Unit tests for Wave 5 (`/about`): committee, portfolios, this year,
 * minutes, decisions, budget and elections (REDESIGN-2.0 SS3.2, Decision 2).
 *
 * Follows `tests/unit/whatson-routes.test.tsx`'s pattern for rendering an
 * async server component page directly: `await Page({ params })`, then
 * `render(el)`.
 *
 * `@/sanity/lib/client` is mocked because `app/[lang]/about/cms.ts` reads
 * `minutes`, `decision` and `budgetEntry` documents through it, and no
 * content has actually been published through the CMS in this checkout yet
 * (`cms.ts`'s own header comment). `mockSanityFetch` below dispatches on
 * each query's `_type` so the same mock serves every page. Every fixture
 * fed through it is obviously fictional, named as such, and never a real
 * BIRSA meeting, decision, budget line or person (BUILD-BRIEF-2.0 SS9,
 * SS3: "never invent an institutional fact").
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("@/sanity/lib/client", () => ({
  client: { fetch: vi.fn() },
}));
import { client } from "@/sanity/lib/client";

import AboutPage from "@/app/[lang]/about/page";
import AboutCommitteePage from "@/app/[lang]/about/committee/page";
import AboutPortfoliosPage from "@/app/[lang]/about/portfolios/page";
import AboutPortfolioDetailPage from "@/app/[lang]/about/portfolios/[portfolio]/page";
import AboutThisYearPage from "@/app/[lang]/about/this-year/page";
import AboutElectionsPage from "@/app/[lang]/about/elections/page";
import AboutMinutesIndexPage from "@/app/[lang]/about/minutes/page";
import AboutMinutesDetailPage from "@/app/[lang]/about/minutes/[slug]/page";
import AboutDecisionsIndexPage from "@/app/[lang]/about/decisions/page";
import AboutDecisionDetailPage from "@/app/[lang]/about/decisions/[slug]/page";
import AboutBudgetPage from "@/app/[lang]/about/budget/page";

import { about as aboutEn } from "@/content/dictionaries/en/about";
import Portrait from "@/components/bds/Portrait";
import { findPortrait } from "@/lib/committee-portrait";
import type { MinutesDetail, DecisionDetail, BudgetEntryRecord } from "@/app/[lang]/about/cms";

afterEach(() => {
  cleanup();
  vi.mocked(client.fetch).mockReset();
});

// ---------------------------------------------------------------------------
// Shared assertions, matching tests/unit/whatson-routes.test.tsx's pattern.
// ---------------------------------------------------------------------------

/** Any Tailwind font-size or line-height utility (BUILD-BRIEF-2.0 SS7, defect D7). */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

function assertNoRawTypeUtilities(container: HTMLElement) {
  for (const node of container.querySelectorAll<HTMLElement>("*")) {
    const classAttr = node.getAttribute("class") ?? "";
    expect(classAttr).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

/**
 * None of this wave's own pages carries a personal phone number, a personal
 * email address, a student id or an address. `content/committee.ts` and the
 * CMS types this wave reads (`committeeMember`, `budgetEntry`, `decision`)
 * have nowhere to hold any of the four, so this is a regression guard, not a
 * speculative check.
 */
function assertNoPersonalData(container: HTMLElement) {
  const text = container.textContent ?? "";
  // A Thai mobile number, with or without separators (e.g. 08-1234-5678).
  expect(text).not.toMatch(/\b0\d{1,2}[\s.-]?\d{3}[\s.-]?\d{3,4}\b/);
  // A Thammasat student id: ten digits starting 6.
  expect(text).not.toMatch(/\b6\d{9}\b/);
  // A street address in either language.
  expect(text).not.toMatch(/\b(soi|ซอย|ถนน)\b/i);
  // Any email address at all: no page in this wave renders one yet, even a
  // role address (see AboutPortfolioDetailPage's honest "no role email
  // published" copy), so any "@word.word" is a regression.
  expect(text).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
}

function assertOneH1(expectedTitle: string) {
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s).toHaveLength(1);
  expect(h1s[0]).toHaveTextContent(expectedTitle);
}

// ---------------------------------------------------------------------------
// Sanity fixtures. Every one is fictional and says so in its own text, per
// BUILD-BRIEF-2.0 SS9: "unknown facts must be plausible but clearly marked."
// ---------------------------------------------------------------------------

function mockSanityFetch(fixtures: {
  minutesList?: unknown[];
  minutesDetail?: MinutesDetail | null;
  decisionsList?: unknown[];
  decisionDetail?: DecisionDetail | null;
  budgetEntries?: BudgetEntryRecord[];
}) {
  // Sanity's `fetch` is overloaded, and TypeScript resolves the raw-response
  // overload here rather than the plain one these fixtures return. The cast is
  // on the mock implementation only, at the boundary where a test is
  // deliberately standing in for the client, so nothing in the pages under test
  // loses its real types.
  const impl = async (rawQuery: unknown) => {
    const query = String(rawQuery);
    const isDetail = query.includes("slug.current == $slug");
    if (query.includes('_type == "minutes"')) {
      return isDetail ? (fixtures.minutesDetail ?? null) : (fixtures.minutesList ?? []);
    }
    if (query.includes('_type == "decision"')) {
      return isDetail ? (fixtures.decisionDetail ?? null) : (fixtures.decisionsList ?? []);
    }
    if (query.includes('_type == "budgetEntry"')) {
      return fixtures.budgetEntries ?? [];
    }
    return null;
  };
  vi.mocked(client.fetch).mockImplementation(impl as unknown as typeof client.fetch);
}

const FIXTURE_MINUTES_LIST = [
  {
    slug: "fixture-meeting-one",
    title: "Fixture committee meeting, test data only",
    meetingDate: "2026-09-01",
  },
];

const FIXTURE_MINUTES_DETAIL: MinutesDetail = {
  title: "Fixture committee meeting, test data only",
  meetingDate: "2026-09-01",
  publicSummary: {
    en: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "This is fixture public summary text for a meeting that never happened.",
          },
        ],
      },
    ],
    th: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "นี่คือข้อความสรุปทดสอบสำหรับการประชุมสมมติที่ไม่เคยเกิดขึ้นจริง",
          },
        ],
      },
    ],
  },
  redactedItems: [
    { itemNumber: 4, category: "welfare" },
    { itemNumber: 7, category: "personnel" },
  ],
};

const FIXTURE_DECISIONS_LIST = [
  {
    slug: "fixture-decision-one",
    title: "Fixture decision, test data only",
    decisionDate: "2026-08-15",
  },
];

const FIXTURE_DECISION_DETAIL: DecisionDetail = {
  title: "Fixture decision, test data only",
  decisionDate: "2026-08-15",
  summary: [
    {
      _type: "block",
      _key: "b1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s1",
          text: "This is a fixture decision summary, describing a decision BIRSA never made.",
        },
      ],
    },
  ],
  whatChanged: {
    en: "Fixture effect, printed here only to prove the field renders.",
    th: "ผลจำลองสำหรับการทดสอบเท่านั้น ไม่ใช่เหตุการณ์จริง",
  },
  portfolioId: "treasury",
  meeting: null,
};

// Amounts chosen so no total ever coincides with an individual row's
// amount, which would otherwise make `screen.getByText` ambiguous.
const FIXTURE_BUDGET_ENTRIES: BudgetEntryRecord[] = [
  {
    id: "fixture-budget-1",
    description: {
      en: "Fixture catering cost, test data only",
      th: "ค่าอาหารทดสอบ ไม่ใช่ข้อมูลจริง",
    },
    amount: 1500,
    direction: "expense",
    entryDate: "2026-08-01",
    portfolioId: "student-activities",
  },
  {
    id: "fixture-budget-2",
    description: {
      en: "Fixture membership fee income, test data only",
      th: "รายรับค่าสมาชิกทดสอบ ไม่ใช่ข้อมูลจริง",
    },
    amount: 3000,
    direction: "income",
    entryDate: "2026-08-03",
    portfolioId: "treasury",
  },
  {
    id: "fixture-budget-3",
    description: {
      en: "Fixture sponsorship income, test data only",
      th: "รายรับสปอนเซอร์ทดสอบ ไม่ใช่ข้อมูลจริง",
    },
    amount: 2000,
    direction: "income",
    entryDate: "2026-08-05",
    portfolioId: "treasury",
  },
  {
    id: "fixture-budget-4",
    description: {
      en: "Fixture equipment cost, test data only",
      th: "ค่าอุปกรณ์ทดสอบ ไม่ใช่ข้อมูลจริง",
    },
    amount: 800,
    direction: "expense",
    entryDate: "2026-08-10",
    portfolioId: "sport",
  },
];

// ---------------------------------------------------------------------------
// The minutes redaction model.
// ---------------------------------------------------------------------------

describe("/about/minutes/[slug]: the redaction model", () => {
  it("renders the public summary and names each withheld item by its number and category", async () => {
    mockSanityFetch({ minutesDetail: FIXTURE_MINUTES_DETAIL });
    const el = await AboutMinutesDetailPage({
      params: Promise.resolve({ lang: "en", slug: "fixture-meeting-one" }),
    });
    const { container } = render(el);

    assertOneH1(FIXTURE_MINUTES_DETAIL.title);
    expect(screen.getByText(/fixture public summary text/i)).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();
    expect(screen.getByText("Item 7")).toBeInTheDocument();
    expect(screen.getByText("A welfare matter")).toBeInTheDocument();
    expect(screen.getByText("A personnel matter")).toBeInTheDocument();

    assertNoRawTypeUtilities(container);
  });

  it("never implies a fuller account of a withheld item exists anywhere a reader could ask for", async () => {
    mockSanityFetch({ minutesDetail: FIXTURE_MINUTES_DETAIL });
    const el = await AboutMinutesDetailPage({
      params: Promise.resolve({ lang: "en", slug: "fixture-meeting-one" }),
    });
    const { container } = render(el);

    const text = container.textContent ?? "";
    // No invitation to ask for more, and no claim that a fuller record
    // exists somewhere: `minutes.ts`'s schema has nowhere to hold one, and
    // this page must not pretend otherwise (DECISIONS-2.0.md's redaction
    // model).
    expect(text).not.toMatch(/request/i);
    expect(text).not.toMatch(/full (minutes|record|account)/i);
    expect(text).not.toMatch(/unredact/i);
    expect(screen.queryByRole("link", { name: /request/i })).not.toBeInTheDocument();

    assertNoPersonalData(container);
  });

  it("orders withheld items by their own item number, not by publish order", async () => {
    const outOfOrder: MinutesDetail = {
      ...FIXTURE_MINUTES_DETAIL,
      redactedItems: [
        { itemNumber: 9, category: "disciplinary" },
        { itemNumber: 2, category: "legal-advice" },
      ],
    };
    mockSanityFetch({ minutesDetail: outOfOrder });
    const el = await AboutMinutesDetailPage({
      params: Promise.resolve({ lang: "en", slug: "fixture-meeting-one" }),
    });
    render(el);

    const rows = screen.getAllByRole("rowheader");
    expect(rows.map((row) => row.textContent)).toEqual(["Item 2", "Item 9"]);
  });
});

describe("/about/minutes: the index", () => {
  it("lists published minutes so a reader can see when the next meeting is", async () => {
    mockSanityFetch({ minutesList: FIXTURE_MINUTES_LIST });
    const el = await AboutMinutesIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(aboutEn.about.minutesIndex.title);
    expect(screen.getByRole("link", { name: FIXTURE_MINUTES_LIST[0]!.title })).toHaveAttribute(
      "href",
      "/en/about/minutes/fixture-meeting-one"
    );
    assertNoRawTypeUtilities(container);
  });

  it("states plainly when nothing has been published yet, rather than an unexplained empty page", async () => {
    mockSanityFetch({ minutesList: [] });
    const el = await AboutMinutesIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    expect(screen.getByText(aboutEn.about.minutesIndex.empty)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Decisions.
// ---------------------------------------------------------------------------

describe("/about/decisions/[slug]: what was decided, by which portfolio, and what changed", () => {
  it("names the owning portfolio and states what the decision changed", async () => {
    mockSanityFetch({ decisionDetail: FIXTURE_DECISION_DETAIL });
    const el = await AboutDecisionDetailPage({
      params: Promise.resolve({ lang: "en", slug: "fixture-decision-one" }),
    });
    const { container } = render(el);

    assertOneH1(FIXTURE_DECISION_DETAIL.title);
    // "treasury" -> "Treasurer" (lib/portfolios.ts).
    expect(screen.getByText("Treasurer")).toBeInTheDocument();
    expect(screen.getByText(FIXTURE_DECISION_DETAIL.whatChanged.en)).toBeInTheDocument();

    assertNoPersonalData(container);
    assertNoRawTypeUtilities(container);
  });
});

describe("/about/decisions: the index", () => {
  it("lists published decisions", async () => {
    mockSanityFetch({ decisionsList: FIXTURE_DECISIONS_LIST });
    const el = await AboutDecisionsIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    assertOneH1(aboutEn.about.decisionsIndex.title);
    expect(screen.getByRole("link", { name: FIXTURE_DECISIONS_LIST[0]!.title })).toHaveAttribute(
      "href",
      "/en/about/decisions/fixture-decision-one"
    );
  });

  it("states plainly when nothing has been published yet", async () => {
    mockSanityFetch({ decisionsList: [] });
    const el = await AboutDecisionsIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    expect(screen.getByText(aboutEn.about.decisionsIndex.empty)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Budget: entries that add up, with the total computed rather than typed.
// ---------------------------------------------------------------------------

describe("/about/budget: entries that add up, with the total computed", () => {
  it("renders every entry and totals computed from the rows, never a typed-in figure", async () => {
    mockSanityFetch({ budgetEntries: FIXTURE_BUDGET_ENTRIES });
    const el = await AboutBudgetPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(aboutEn.about.budget.title);
    for (const entry of FIXTURE_BUDGET_ENTRIES) {
      expect(screen.getByText(entry.description.en)).toBeInTheDocument();
    }

    // The same arithmetic the component itself does, so this test would
    // catch a total that drifted away from the rows above it, not just
    // confirm the component agrees with itself.
    const expectedIncome = FIXTURE_BUDGET_ENTRIES.filter((e) => e.direction === "income").reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const expectedExpense = FIXTURE_BUDGET_ENTRIES.filter((e) => e.direction === "expense").reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const expectedNet = expectedIncome - expectedExpense;
    const fmt = (amount: number) => new Intl.NumberFormat("en-GB").format(amount);

    expect(screen.getByText(fmt(expectedIncome))).toBeInTheDocument();
    expect(screen.getByText(fmt(expectedExpense))).toBeInTheDocument();
    expect(screen.getByText(fmt(expectedNet))).toBeInTheDocument();

    assertNoPersonalData(container);
    assertNoRawTypeUtilities(container);
  });

  it("states plainly when nothing has been published yet", async () => {
    mockSanityFetch({ budgetEntries: [] });
    const el = await AboutBudgetPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    expect(screen.getByText(aboutEn.about.budget.empty)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Portfolios and the two person rule.
// ---------------------------------------------------------------------------

describe("/about/portfolios/[portfolio]: holders, and the two person rule", () => {
  it("shows both holders for a portfolio with two, and no single holder warning", async () => {
    // "academic-affairs" is a real lib/portfolios.ts entry with two real
    // content/committee.ts holders today.
    const el = await AboutPortfolioDetailPage({
      params: Promise.resolve({ lang: "en", portfolio: "academic-affairs" }),
    });
    const { container } = render(el);

    expect(screen.getByText("Pitchayamon Jensirisak (Mook)")).toBeInTheDocument();
    expect(screen.getByText("Pannawit Binsanorh (Fida)")).toBeInTheDocument();
    expect(
      screen.queryByText(aboutEn.about.portfolioDetail.singleHolderNote)
    ).not.toBeInTheDocument();

    assertNoPersonalData(container);
    assertNoRawTypeUtilities(container);
  });

  it("shows one holder honestly, with a note, rather than hiding that the rule is not met", async () => {
    // "president" is a real lib/portfolios.ts entry with exactly one real
    // holder today: precisely the gap REDESIGN-2.0 SS7.2 exists to surface.
    const el = await AboutPortfolioDetailPage({
      params: Promise.resolve({ lang: "en", portfolio: "president" }),
    });
    const { container } = render(el);

    assertOneH1("President");
    expect(screen.getByText("Chayapon Srisukho (Best)")).toBeInTheDocument();
    expect(screen.getByText(aboutEn.about.portfolioDetail.singleHolderNote)).toBeInTheDocument();
    expect(screen.getByText(aboutEn.about.portfolioDetail.noRoleEmail)).toBeInTheDocument();

    assertNoPersonalData(container);
  });
});

describe("/about/portfolios: the directory", () => {
  it("links to every standing portfolio with a holder count", async () => {
    const el = await AboutPortfoliosPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    assertOneH1(aboutEn.about.portfolios.title);
    expect(screen.getByRole("link", { name: "President" })).toHaveAttribute(
      "href",
      "/en/about/portfolios/president"
    );
  });
});

// ---------------------------------------------------------------------------
// Portraits: the placeholder fallback.
// ---------------------------------------------------------------------------

describe("portraits: the placeholder fallback", () => {
  it("falls back to the placeholder silhouette, never an img, exactly as lib/committee-portrait.ts does", () => {
    const assetId = "test-fixture-committee-member-no-photo";
    // The real, unmocked lookup: nothing under public/committee/ carries
    // this fixture key, which is the point.
    expect(findPortrait(assetId)).toBeNull();

    render(<Portrait image={{ assetId, decorative: true, alt: null, ratio: "1:1" }} locale="en" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.querySelector('[aria-hidden="true"] svg')).not.toBeNull();
  });

  it("/about/committee falls back to the placeholder for a real committee member with no photo file", async () => {
    // chayapon-srisukho (President) has no file under public/committee/.
    expect(findPortrait("chayapon-srisukho")).toBeNull();

    const el = await AboutCommitteePage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(aboutEn.about.committee.title);
    expect(container.querySelector('img[src*="chayapon-srisukho"]')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// This year and elections: no invented plan, no invented date or result.
// ---------------------------------------------------------------------------

describe("/about/this-year", () => {
  it("links to minutes and decisions rather than an invented plan for the year", async () => {
    const el = await AboutThisYearPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(aboutEn.about.thisYear.title);
    expect(screen.getByRole("link", { name: aboutEn.about.thisYear.decisionsCta })).toHaveAttribute(
      "href",
      "/en/about/decisions"
    );
    expect(screen.getByRole("link", { name: aboutEn.about.thisYear.minutesCta })).toHaveAttribute(
      "href",
      "/en/about/minutes"
    );

    assertNoPersonalData(container);
    assertNoRawTypeUtilities(container);
  });
});

describe("/about/elections", () => {
  it("links to the source regulation and to decisions for results, and invents no date or result", async () => {
    const el = await AboutElectionsPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(aboutEn.about.elections.title);
    expect(
      screen.getByRole("link", { name: aboutEn.about.elections.regulationCta })
    ).toHaveAttribute("href", "/en/activity/regulations/political-science-2565");
    expect(screen.getByRole("link", { name: aboutEn.about.elections.resultsCta })).toHaveAttribute(
      "href",
      "/en/about/decisions"
    );

    assertNoPersonalData(container);
    assertNoRawTypeUtilities(container);
  });
});

// ---------------------------------------------------------------------------
// The hub.
// ---------------------------------------------------------------------------

describe("/about: the hub", () => {
  it("links straight to minutes and budget, the two card sort tasks this family exists for (Decision 2)", async () => {
    const el = await AboutPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(aboutEn.about.hub.title);
    expect(
      screen.getByRole("link", { name: aboutEn.about.hub.sections.minutes.title })
    ).toHaveAttribute("href", "/en/about/minutes");
    expect(
      screen.getByRole("link", { name: aboutEn.about.hub.sections.budget.title })
    ).toHaveAttribute("href", "/en/about/budget");

    assertNoPersonalData(container);
    assertNoRawTypeUtilities(container);
  });

  it("renders in Thai too, with the same one heading floor", async () => {
    const el = await AboutPage({ params: Promise.resolve({ lang: "th" }) });
    render(el);
    assertOneH1("เกี่ยวกับ BIRSA");
  });
});

// ---------------------------------------------------------------------------
// Every page in this family: the shared floor. One h1, no personal data
// beyond a public roster's role, portfolio, name and role email, and no raw
// Tailwind font-size or line-height utility.
// ---------------------------------------------------------------------------

describe("every /about page: the shared floor", () => {
  const pages: Array<[string, () => Promise<React.ReactElement>]> = [
    ["/about", () => AboutPage({ params: Promise.resolve({ lang: "en" }) })],
    ["/about/committee", () => AboutCommitteePage({ params: Promise.resolve({ lang: "en" }) })],
    ["/about/portfolios", () => AboutPortfoliosPage({ params: Promise.resolve({ lang: "en" }) })],
    [
      "/about/portfolios/president",
      () =>
        AboutPortfolioDetailPage({
          params: Promise.resolve({ lang: "en", portfolio: "president" }),
        }),
    ],
    [
      "/about/portfolios/academic-affairs",
      () =>
        AboutPortfolioDetailPage({
          params: Promise.resolve({ lang: "en", portfolio: "academic-affairs" }),
        }),
    ],
    ["/about/this-year", () => AboutThisYearPage({ params: Promise.resolve({ lang: "en" }) })],
    ["/about/elections", () => AboutElectionsPage({ params: Promise.resolve({ lang: "en" }) })],
    [
      "/about/minutes",
      () => {
        mockSanityFetch({ minutesList: FIXTURE_MINUTES_LIST });
        return AboutMinutesIndexPage({ params: Promise.resolve({ lang: "en" }) });
      },
    ],
    [
      "/about/minutes/fixture-meeting-one",
      () => {
        mockSanityFetch({ minutesDetail: FIXTURE_MINUTES_DETAIL });
        return AboutMinutesDetailPage({
          params: Promise.resolve({ lang: "en", slug: "fixture-meeting-one" }),
        });
      },
    ],
    [
      "/about/decisions",
      () => {
        mockSanityFetch({ decisionsList: FIXTURE_DECISIONS_LIST });
        return AboutDecisionsIndexPage({ params: Promise.resolve({ lang: "en" }) });
      },
    ],
    [
      "/about/decisions/fixture-decision-one",
      () => {
        mockSanityFetch({ decisionDetail: FIXTURE_DECISION_DETAIL });
        return AboutDecisionDetailPage({
          params: Promise.resolve({ lang: "en", slug: "fixture-decision-one" }),
        });
      },
    ],
    [
      "/about/budget",
      () => {
        mockSanityFetch({ budgetEntries: FIXTURE_BUDGET_ENTRIES });
        return AboutBudgetPage({ params: Promise.resolve({ lang: "en" }) });
      },
    ],
  ];

  for (const [name, factory] of pages) {
    it(`${name}: exactly one h1, no personal data, no raw Tailwind type utility`, async () => {
      const el = await factory();
      const { container } = render(el);

      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      assertNoPersonalData(container);
      assertNoRawTypeUtilities(container);
    });
  }
});
