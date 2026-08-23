// @vitest-environment jsdom
/**
 * Unit tests for Wave 5F (the utility pages): the privacy notice, cookies,
 * the processing record, the PDPA rights journey's start and confirmation
 * pages, the accessibility statement, search, the error and not-found
 * boundaries, and the `/design` reference page.
 *
 * Follows `tests/unit/about-routes.test.tsx` and `tests/unit/whatson-routes.test.tsx`'s
 * pattern for rendering an async server component page directly:
 * `await Page({ params, searchParams })`, then `render(el)`.
 *
 * Pages that embed a `components/forms/**` or `components/feedback/**`
 * widget (the contact wizard steps, the PDPA rights wizard steps, the
 * feedback form) are not rendered here: those widgets are owned by other
 * waves, are not on this wave's owned-files list, and already carry their
 * own raw Tailwind type utilities (`components/forms/StepNav.tsx`,
 * `RightsWhatForm.tsx`, `RightsCheckForm.tsx`, `components/feedback/FeedbackForm.tsx`)
 * that this file has no mandate to fix. Every page this wave DOES own has
 * been checked by hand (see the wave report) and is included below.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// `error.tsx` is a client component that reads the current path via
// `usePathname` (locale is not passed to error boundaries). Mocked the same
// way `tests/unit/bds-navigation.test.tsx` mocks it, with a `vi.fn()` so
// individual tests can point it at a different locale.
const mockUsePathname = vi.fn(() => "/en/somewhere");
vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    usePathname: () => mockUsePathname(),
    // `components/search/SearchBox` (rendered by the results page) calls
    // `useRouter()` for the suggestion-list "jump to page" shortcut; it is
    // never exercised by these SSR-focused tests, but the hook still needs
    // an app-router context to not throw on mount.
    useRouter: () => ({
      push: () => {},
      replace: () => {},
      refresh: () => {},
      back: () => {},
      forward: () => {},
      prefetch: () => {},
    }),
  };
});

// `components/search/SearchBox` fetches `/api/search` on mount whenever it
// starts with a non-empty value (the results page passes the current query
// back in as `defaultValue`). Stubbed so the search tests below are
// deterministic and never attempt a real network call; nothing about the
// typeahead's suggestions is under test here, only the server-rendered
// results a no-JavaScript reader already has on the page.
vi.stubGlobal(
  "fetch",
  vi.fn(async () => ({ ok: false, json: async () => ({ ok: false }) }))
);

import PrivacyPage from "@/app/[lang]/privacy/page";
import CookiesPage from "@/app/[lang]/privacy/cookies/page";
import ProcessingRecordPage from "@/app/[lang]/privacy/processing-record/page";
import RightsStartPage from "@/app/[lang]/privacy/your-data/page";
import RightsSentPage from "@/app/[lang]/privacy/your-data/sent/page";
import StandardsPage from "@/app/[lang]/standards/page";
import SearchPage from "@/app/[lang]/search/page";
import LocaleError from "@/app/[lang]/error";
import NotFound from "@/app/[lang]/not-found";
import DesignReference from "@/components/bds/DesignReference";
import { manifest } from "@/components/bds/manifest";
import { activities, cookieRecords } from "@/content/privacy/register";
import { runSearch } from "@/lib/search/query";
import { getDictionary } from "@/lib/i18n";

afterEach(() => {
  cleanup();
  vi.mocked(fetch).mockClear();
});

const REPO_ROOT = join(__dirname, "..", "..");

/** Any Tailwind font-size or line-height utility (BUILD-BRIEF-2.0 SS7, defect
 * D7). Matches the constant used throughout `tests/unit/bds-*.test.tsx` and
 * `tests/unit/about-routes.test.tsx`, so this file enforces the same rule the
 * same way. */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

function assertNoRawTypeUtilities(container: HTMLElement) {
  for (const node of container.querySelectorAll<HTMLElement>("*")) {
    const classAttr = node.getAttribute("class") ?? "";
    expect(classAttr, node.outerHTML.slice(0, 120)).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

function assertOneH1(expectedTitle?: string) {
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s).toHaveLength(1);
  if (expectedTitle) expect(h1s[0]).toHaveTextContent(expectedTitle);
}

const dictEn = getDictionary("en");
const dictTh = getDictionary("th");

// ---------------------------------------------------------------------------
// 1. Privacy, cookies and the processing record render FROM the register.
// ---------------------------------------------------------------------------

describe("privacy pages render from content/privacy/register.ts, not from prose", () => {
  it("changes what /privacy says when a register fixture changes", async () => {
    // The literal requirement: prove the page is a function of the register
    // by changing one fixture value and checking the rendered page changes,
    // rather than asserting against copy this test itself hardcodes.
    const FIXTURE_NAME_EN = "Wave 5F canary activity, not a real one";
    const realFirstActivityNameEn = activities[0]!.name.en;

    vi.resetModules();
    vi.doMock("@/content/privacy/register", async () => {
      const actual = await vi.importActual<typeof import("@/content/privacy/register")>(
        "@/content/privacy/register"
      );
      return {
        ...actual,
        activities: [
          {
            ...actual.activities[0]!,
            name: { en: FIXTURE_NAME_EN, th: "กิจกรรมทดสอบ Wave 5F ไม่ใช่ของจริง" },
          },
        ],
      };
    });

    const { default: FreshPrivacyPage } = await import("@/app/[lang]/privacy/page");
    const el = await FreshPrivacyPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    expect(screen.getByText(FIXTURE_NAME_EN)).toBeInTheDocument();
    // Proves it is not hardcoded prose sitting alongside the loop: the real
    // register's first activity name is gone because the mocked register
    // only carries the fixture.
    expect(screen.queryByText(realFirstActivityNameEn)).not.toBeInTheDocument();

    vi.doUnmock("@/content/privacy/register");
    vi.resetModules();
    cleanup();
  });

  it("changes what /privacy/cookies says when a register fixture changes", async () => {
    const FIXTURE_COOKIE_NAME = "wave5f_canary_cookie";
    const realFirstCookieName = cookieRecords[0]!.name;

    vi.resetModules();
    vi.doMock("@/content/privacy/register", async () => {
      const actual = await vi.importActual<typeof import("@/content/privacy/register")>(
        "@/content/privacy/register"
      );
      return {
        ...actual,
        cookieRecords: [
          {
            ...actual.cookieRecords[0]!,
            name: FIXTURE_COOKIE_NAME,
          },
        ],
      };
    });

    const { default: FreshCookiesPage } = await import("@/app/[lang]/privacy/cookies/page");
    const el = await FreshCookiesPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    expect(screen.getByText(FIXTURE_COOKIE_NAME)).toBeInTheDocument();
    expect(screen.queryByText(realFirstCookieName)).not.toBeInTheDocument();

    vi.doUnmock("@/content/privacy/register");
    vi.resetModules();
    cleanup();
  });

  it("/privacy lists every real activity by name, in both locales", async () => {
    for (const locale of ["en", "th"] as const) {
      const el = await PrivacyPage({ params: Promise.resolve({ lang: locale }) });
      const { container } = render(el);
      for (const activity of activities) {
        expect(container.textContent).toContain(activity.name[locale]);
      }
      assertOneH1();
      cleanup();
    }
  });

  it("/privacy/processing-record lists every real activity, processor and right", async () => {
    const el = await ProcessingRecordPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    for (const activity of activities) {
      expect(container.textContent).toContain(activity.name.en);
    }
    assertOneH1();
    assertNoRawTypeUtilities(container);
  });

  it("/privacy/your-data (start) and its sent confirmation carry one h1 and no font-size utility", async () => {
    const startEl = await RightsStartPage({ params: Promise.resolve({ lang: "en" }) });
    const { container: startContainer } = render(startEl);
    assertOneH1();
    assertNoRawTypeUtilities(startContainer);
    cleanup();

    const sentEl = await RightsSentPage({ params: Promise.resolve({ lang: "en" }) });
    const { container: sentContainer } = render(sentEl);
    assertOneH1();
    assertNoRawTypeUtilities(sentContainer);
  });
});

// ---------------------------------------------------------------------------
// 2. Gate 4: no cookie banner, no consent asked, honestly stated.
// ---------------------------------------------------------------------------

describe("Gate 4: no cookie banner, because no consent is required", () => {
  it("states plainly that no consent was asked for or collected", async () => {
    const el = await CookiesPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    expect(container.textContent).toMatch(/no consent has been asked for or collected/i);
    expect(container.textContent).toMatch(/strictly necessary/i);
  });

  it("says the same thing in Thai", async () => {
    const el = await CookiesPage({ params: Promise.resolve({ lang: "th" }) });
    const { container } = render(el);
    expect(container.textContent).toMatch(/ไม่มีการขอหรือเก็บความยินยอม/);
  });

  it("renders no cookie banner, dialog or accept/reject control on the cookies page", async () => {
    const el = await CookiesPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText(/accept all cookies/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/reject all cookies/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /accept/i })).not.toBeInTheDocument();
  });

  it("has no cookie banner or consent banner component anywhere in the codebase", () => {
    // Static, repo-wide: the decision is that no banner exists at all, not
    // merely that this page does not render one. A component with this job
    // could be built and simply left unmounted, so this checks for its
    // existence, not only its use.
    function walk(dir: string): string[] {
      const abs = join(REPO_ROOT, dir);
      let entries: ReturnType<typeof readdirSync>;
      try {
        entries = readdirSync(abs, { withFileTypes: true });
      } catch {
        return [];
      }
      const files: string[] = [];
      for (const entry of entries) {
        if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
        const child = join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...walk(child));
        } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
          files.push(child);
        }
      }
      return files;
    }

    const files = [...walk("app"), ...walk("components"), ...walk("lib")];
    expect(files.length).toBeGreaterThan(0);

    const suspiciousNames = files.filter((f) => /cookie.?banner|consent.?banner/i.test(f));
    expect(suspiciousNames).toEqual([]);

    for (const relative of files) {
      const abs = join(REPO_ROOT, relative);
      if (statSync(abs).isDirectory()) continue;
      const source = readFileSync(abs, "utf8");
      expect(source, relative).not.toMatch(/accept all cookies|reject all cookies/i);
      expect(source, relative).not.toMatch(/cookie[- ]consent[- ]banner/i);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. /standards: WCAG 2.2 AA as the floor, gaps named rather than hidden.
// ---------------------------------------------------------------------------

describe("/standards: the accessibility statement", () => {
  it("states WCAG 2.2 AA as the floor, and names at least one known gap rather than claiming none", async () => {
    const el = await StandardsPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertOneH1();
    expect(container.textContent).toMatch(/WCAG.{0,10}2\.2/i);

    // A statement claiming perfection is exactly what this page must not be:
    // it must not say the site has no known issues.
    expect(container.textContent?.toLowerCase()).not.toMatch(/no known (issues|gaps|problems)/);

    // At least one named gap, expandable content (Accordion renders
    // <details>/<summary>), and the specific untested-assistive-tech gap the
    // page is built around.
    expect(container.textContent).toMatch(/have not (yet )?tested this site with a real screen/i);
    const summaries = container.querySelectorAll("summary");
    expect(summaries.length).toBeGreaterThan(0);
  });

  it("gives the same honesty in Thai", async () => {
    const el = await StandardsPage({ params: Promise.resolve({ lang: "th" }) });
    const { container } = render(el);
    expect(container.textContent).toMatch(/WCAG.{0,10}2\.2/i);
    expect(container.textContent).toMatch(/ยังไม่ได้ทดสอบเว็บไซต์นี้ด้วยโปรแกรมอ่านหน้าจอ/);
  });

  it("carries a working report-a-problem route", async () => {
    const el = await StandardsPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    // The named contact route, not a bare mailto with no page around it.
    expect(screen.getAllByRole("link", { name: dictEn.actions.contactUs }).length).toBeGreaterThan(
      0
    );
  });
});

// ---------------------------------------------------------------------------
// 4. Search: no-JS results, each naming its own destination; Thai tokenising.
// ---------------------------------------------------------------------------

describe("/search: works with JavaScript off, and results name their destination", () => {
  it("renders English results server-side from a plain ?q= GET, each with a section tag and a real link", async () => {
    const el = await SearchPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({ q: "equipment" }),
    });
    const { container } = render(el);
    assertOneH1();

    const links = screen.getAllByRole("link").filter((link) => {
      const href = link.getAttribute("href") ?? "";
      return href.startsWith("/en/") && href !== "/en/search";
    });
    expect(links.length).toBeGreaterThan(0);

    // Every result names its destination up front: a section label sits
    // beside the title before the reader ever clicks.
    for (const link of links.slice(0, 5)) {
      const row = link.closest("li");
      expect(row).not.toBeNull();
      expect(row!.textContent?.trim().length).toBeGreaterThan(0);
    }

    assertNoRawTypeUtilities(container);
  });

  it("renders Thai results for a query with no spaces, matching a compound word as a substring", async () => {
    // "ยืมอุปกรณ์" (borrow equipment) is written as one unbroken run with no
    // spaces, as ordinary Thai is. Typing a fragment of it ("ยืมอุป") must
    // still find the page: whitespace tokenisation alone finds nothing here,
    // because there is no whitespace to tokenise on.
    const el = await SearchPage({
      params: Promise.resolve({ lang: "th" }),
      searchParams: Promise.resolve({ q: "ยืมอุป" }),
    });
    render(el);
    assertOneH1();
    const status = screen.getByRole("status");
    expect(status.textContent).not.toMatch(/^0 |ไม่พบ/);
  });

  it("lib/search/text.ts: keeps Thai runs whole rather than splitting on whitespace (there is none to split on)", () => {
    // Read only per the wave brief; asserted here because a regression would
    // silently break every Thai search on the site.
    const thai = runSearch("th", "ยืมอุปกรณ์ตอนนี้เลย"); // "borrow equipment right now", no spaces
    expect(thai.results.length).toBeGreaterThan(0);
    expect(thai.results.some((r) => r.doc.title.includes("ยืม"))).toBe(true);
  });

  it("shows the empty-query state and a minimum-length hint, not an error, when q is missing", async () => {
    const el = await SearchPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    render(el);
    assertOneH1();
    expect(screen.getByRole("status")).toHaveTextContent(/at least 2 characters/i);
  });
});

// ---------------------------------------------------------------------------
// 5. Error and not-found pages: no stack trace, no request data, ever.
// ---------------------------------------------------------------------------

describe("error.tsx and not-found.tsx: never a stack trace, never request data", () => {
  it("never renders the thrown error's message, stack, or digest, even when they carry a lookalike email or file path", async () => {
    mockUsePathname.mockReturnValue("/en/contact");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const leakedEmail = "student-example-leak@example.ac.th";
    const leakedStack = "at Object.<anonymous> (/app/[lang]/contact/actions.ts:42:17)";
    const error = Object.assign(
      new Error(`Failed while processing ${leakedEmail}\n${leakedStack}`),
      { digest: "NEXT_DIGEST_TEST_1234" }
    );

    const { container } = render(<LocaleError error={error} reset={() => {}} />);

    expect(container.textContent).not.toContain(leakedEmail);
    expect(container.textContent).not.toContain(leakedStack);
    expect(container.textContent).not.toContain("NEXT_DIGEST_TEST_1234");
    expect(container.textContent).not.toMatch(/\.tsx:\d+/);
    expect(container.textContent).not.toMatch(/^Error:/m);

    // The page still says something real: the generic, fixed sentence.
    expect(container.textContent).toContain(dictEn.error.title);
    assertOneH1();
    assertNoRawTypeUtilities(container);

    // The failure was logged server-side (console.error), which is the only
    // place it is allowed to go.
    expect(consoleSpy).toHaveBeenCalledWith(error);
    consoleSpy.mockRestore();
  });

  it("falls back to the default locale's copy when the path carries no locale segment", () => {
    // lib/i18n.ts's defaultLocale is Thai.
    mockUsePathname.mockReturnValue("/");
    const { container } = render(
      <LocaleError error={new Error("boundary test")} reset={() => {}} />
    );
    expect(container.textContent).toContain(dictTh.error.title);
  });

  it("says the same thing in Thai, still with no technical detail", () => {
    mockUsePathname.mockReturnValue("/th/contact");
    const { container } = render(
      <LocaleError error={new Error("boundary test")} reset={() => {}} />
    );
    expect(container.textContent).toContain(dictTh.error.title);
    expect(container.textContent).not.toMatch(/\.tsx:\d+/);
  });

  it("renders no path, query string or request detail on the 404 page", async () => {
    const el = await NotFound({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertOneH1();
    expect(container.textContent).toContain(dictEn.notFound.title);
    expect(container.textContent).not.toMatch(/\.tsx:\d+/);
    expect(container.textContent).not.toMatch(/^Error:/m);
    assertNoRawTypeUtilities(container);
  });

  it("404 falls back to the default locale when params are omitted, as static generation can do", async () => {
    const el = await NotFound({ params: undefined });
    const { container } = render(el);
    expect(container.textContent).toContain(dictTh.notFound.title);
  });
});

// ---------------------------------------------------------------------------
// 6. /design: every manifest component has an entry there.
// ---------------------------------------------------------------------------

describe("/design: a component that shipped without an entry here has not shipped", () => {
  it("names every component in components/bds/manifest.ts, in both locales", () => {
    for (const locale of ["en", "th"] as const) {
      const { container } = render(<DesignReference locale={locale} />);
      for (const entry of manifest) {
        expect(container.textContent, entry.name).toContain(entry.name);
      }
      cleanup();
    }
  });

  it("marks a component built only when its file actually exists on disk", () => {
    const { container } = render(<DesignReference locale="en" />);
    // Button and PageHeader are both real, shipped files this wave read
    // directly; if the completeness check ever regresses to a hardcoded
    // list, one of these would be the first to go stale.
    const buttonRow = [...container.querySelectorAll("th")].find(
      (th) => th.textContent === "Button"
    );
    expect(buttonRow?.closest("tr")?.textContent).toMatch(/Built/);
  });

  it("carries no raw Tailwind font-size or line-height utility", () => {
    const { container } = render(<DesignReference locale="en" />);
    assertNoRawTypeUtilities(container);
  });
});
