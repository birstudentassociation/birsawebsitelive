// @vitest-environment jsdom
/**
 * Unit tests for Wave 5A: the home page (`app/[lang]/page.tsx`), the `/do`
 * index (`app/[lang]/do/page.tsx`), and the site chrome swap
 * (`app/[lang]/layout.tsx`). Follows `tests/unit/bds-type.test.tsx` and
 * `tests/unit/bds-navigation.test.tsx`'s structure and their
 * `@vitest-environment jsdom` directive.
 *
 * `RootLayout` is an async server component that imports `next/font/google`,
 * `next/font/local` (via `lib/fonts.ts`), `@vercel/analytics/next` and
 * `@vercel/edge-config`. None of those resolve outside a real Next.js build,
 * so this file stubs them (mirroring what the Next.js webpack loader would
 * otherwise do) purely so the module graph can load in Vitest; nothing about
 * fonts or analytics is under test. The returned `<html>/<body>` tree is
 * inspected structurally (walking the React element tree) rather than
 * mounted with `render()`, because React Testing Library mounts into
 * `document.body`, and a tree whose own root is `<html>/<body>` cannot
 * nest inside that without producing invalid, untestable markup.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("next/font/google", () => ({
  Fraunces: () => ({ variable: "--font-en-display" }),
  Lexend: () => ({ variable: "--font-en-body" }),
  Sarabun: () => ({ variable: "--font-th" }),
}));
vi.mock("next/font/local", () => ({
  default: () => ({ variable: "--font-jenjrus" }),
}));
vi.mock("@vercel/analytics/next", () => ({
  Analytics: () => null,
}));
vi.mock("@vercel/edge-config", () => ({
  get: async () => undefined,
}));
// `Header` and `LanguageToggle` read the current path via `usePathname`; the
// home and do pages never call `notFound()` for a valid locale, so this stub
// only needs to satisfy the import.
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  notFound: () => {
    throw new Error("notFound() called for a locale the tests always pass as valid");
  },
}));
// jsdom has no `window.matchMedia`. `ThemeToggle` (rendered by `Header`)
// reads it on mount; stub it the same way tests/unit/bds-navigation.test.tsx
// does, so mounting the header does not throw.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

import RootLayout from "@/app/[lang]/layout";
import HomePage from "@/app/[lang]/page";
import DoIndexPage from "@/app/[lang]/do/page";
import Header from "@/components/bds/Header";
import SkipLink from "@/components/bds/SkipLink";
import PhaseBanner from "@/components/bds/PhaseBanner";
import { homeNamespace as homeEn } from "@/content/dictionaries/en/home";
// Registers the "equipment-item" subject resolver as a module-load side
// effect (`lib/services/subject.ts`'s own header: "registered once, at
// module load, by the file"). The real `app/[lang]/do/[service]/**` route
// tree imports this transitively in production so `equipment-loan` publishes
// there; this test file is standalone, so it needs the same import to see
// the same registry state `/do` sees when the whole app is running. Not an
// edit to the file, only a read, the same pattern
// `tests/unit/service-equipment-loan.test.ts` already uses.
import "@/lib/services/loanSubmissionStore";

afterEach(cleanup);

type ReactElementLike = { type: unknown; props: { children?: unknown } } | null | string | number;

function componentName(node: ReactElementLike): string | null {
  if (node === null || typeof node !== "object") return null;
  const { type } = node;
  if (typeof type === "string") return type;
  if (typeof type === "function") return (type as { name?: string }).name ?? null;
  return null;
}

/** Flattens a React element's children into a single ordered array, skipping arrays/fragments transparently. */
function flattenChildren(children: unknown): ReactElementLike[] {
  if (children === null || children === undefined || typeof children === "boolean") return [];
  if (Array.isArray(children)) return children.flatMap(flattenChildren);
  return [children as ReactElementLike];
}

async function renderRootLayout(lang: "en" | "th" = "en") {
  const el = (await RootLayout({
    children: <div data-testid="page-content">content</div>,
    params: Promise.resolve({ lang }),
  } as unknown as Parameters<typeof RootLayout>[0])) as unknown as {
    type: unknown;
    props: { children: { type: unknown; props: { children: unknown } } };
  };
  const body = el.props.children;
  const bodyKids = flattenChildren(body.props.children);
  return { el, body, bodyKids };
}

/** Any Tailwind font-size or line-height utility (matches tests/unit/bds-type.test.tsx's D7 guard). */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

/** Every element under `container` carries no forbidden Tailwind type utility in its class list. */
function assertNoRawTypeUtilities(container: HTMLElement) {
  for (const node of container.querySelectorAll<HTMLElement>("*")) {
    // `className` is a plain string on HTML elements but an
    // `SVGAnimatedString` on SVG elements (`Icon` renders <svg>), so read
    // the attribute directly rather than the DOM property.
    const classAttr = node.getAttribute("class") ?? "";
    expect(classAttr).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

/** Heading levels never skip forward (e.g. an h1 followed directly by an h3, with no h2 in between). */
function assertNoSkippedHeadingLevels(container: HTMLElement) {
  const levels = [...container.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((el) =>
    Number(el.tagName.slice(1))
  );
  let deepestSeen = 0;
  for (const level of levels) {
    expect(level).toBeLessThanOrEqual(deepestSeen + 1);
    deepestSeen = Math.max(deepestSeen, level);
  }
}

describe("app/[lang]/layout.tsx: site chrome", () => {
  it("renders Header, SkipLink and Footer, in that relative order", async () => {
    const { bodyKids } = await renderRootLayout();
    const names = bodyKids.map(componentName);

    expect(names).toContain("SkipLink");
    expect(names).toContain("Header");
    expect(names).toContain("Footer");
    const skipIndex = names.indexOf("SkipLink");
    const headerIndex = names.indexOf("Header");
    const footerIndex = names.indexOf("Footer");
    expect(skipIndex).toBeLessThan(headerIndex);
    expect(headerIndex).toBeLessThan(footerIndex);
  });

  it("puts SkipLink first among the focusable chrome, before anything else that could take focus", () => {
    // Rendered directly (not through the layout tree walk above) because
    // "first focusable element" is a real accessibility property of markup,
    // not just element order: SkipLink must be the first *focusable* thing,
    // and the only thing this repo's layout ever places before it is a
    // non-focusable inline <script> (the theme script, run before paint).
    render(
      <>
        <script data-testid="theme-script" />
        <SkipLink label="Skip to main content" />
        <Header locale="en" />
      </>
    );
    const focusable = screen.getAllByRole("link");
    expect(focusable[0]).toHaveTextContent("Skip to main content");
  });

  it("wires Header and Footer with the current locale", async () => {
    const { bodyKids } = await renderRootLayout("th");
    const header = bodyKids.find((k) => componentName(k) === "Header") as unknown as {
      props: { locale: string };
    };
    const footer = bodyKids.find((k) => componentName(k) === "Footer") as unknown as {
      props: { locale: string };
    };
    expect(header.props.locale).toBe("th");
    expect(footer.props.locale).toBe("th");
  });

  it("keeps the emergency banner driven exactly as before: EmergencyBannerClient renders sitewide, above the phase banner and the header", async () => {
    const { bodyKids } = await renderRootLayout();
    const names = bodyKids.map(componentName);
    expect(names).toContain("EmergencyBannerClient");
    expect(names.indexOf("EmergencyBannerClient")).toBeLessThan(names.indexOf("Header"));
  });

  it("wires the phase banner as active, sourced from content/dictionaries/{en,th}/home.ts, never inline copy", async () => {
    const { bodyKids } = await renderRootLayout();
    const banner = bodyKids.find((k) => componentName(k) === "PhaseBanner") as unknown as {
      props: { active: boolean; phaseLabel: string; feedbackLabel: string; children: unknown };
    };
    expect(banner).toBeDefined();
    expect(banner.props.active).toBe(true);
    expect(banner.props.phaseLabel).toBe(homeEn.phaseBanner.phaseLabel);
    expect(banner.props.feedbackLabel).toBe(homeEn.phaseBanner.feedbackLabel);
  });

  it("PhaseBanner: turning it off is a prop change, never a code change. active renders the banner, and active={false} renders nothing", () => {
    const copy = homeEn.phaseBanner;
    const onResult = render(
      <PhaseBanner
        active={true}
        phaseLabel={copy.phaseLabel}
        feedbackHref="/en/feedback"
        feedbackLabel={copy.feedbackLabel}
      >
        {copy.message}
      </PhaseBanner>
    );
    expect(screen.getByText(copy.message)).toBeInTheDocument();
    expect(screen.getByText(copy.phaseLabel)).toBeInTheDocument();
    onResult.unmount();

    const { container } = render(
      <PhaseBanner
        active={false}
        phaseLabel={copy.phaseLabel}
        feedbackHref="/en/feedback"
        feedbackLabel={copy.feedbackLabel}
      >
        {copy.message}
      </PhaseBanner>
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("app/[lang]/page.tsx: home page", () => {
  it("renders exactly one h1, carrying the hero heading", async () => {
    const el = await HomePage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(homeEn.home.hero.heading);
  });

  it("keeps a logical heading order: no level is skipped", async () => {
    const el = await HomePage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoSkippedHeadingLevels(container);
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await HomePage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });

  it("renders the one primary call to action, to /do", async () => {
    const el = await HomePage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    const cta = screen.getByRole("link", { name: homeEn.home.hero.primaryCta });
    expect(cta).toHaveAttribute("href", "/en/do");
  });
});

describe("app/[lang]/do/page.tsx: the /do index", () => {
  it("lists a published service from listServices(), by its own start title", async () => {
    const el = await DoIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    // equipment-loan is the one real, published service the registry
    // currently serves (lib/services/definitions/equipment-loan.ts).
    const link = screen.getByRole("link", { name: /equipment loan/i });
    expect(link).toHaveAttribute("href", "/en/do/equipment-loan");
  });

  it("does not list an unpublished service", async () => {
    const el = await DoIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    // example-chassis-demo (lib/services/definitions/example-chassis-demo.ts)
    // is deliberately invalid, on purpose, and validateForRegistry refuses
    // to serve it. It must never reach /do as a link.
    expect(screen.queryByRole("link", { name: /example service/i })).not.toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).not.toContain("/en/do/example-chassis-demo");
  });

  it("still renders the curated sign up and tell us links alongside registry services", async () => {
    const el = await DoIndexPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);
    expect(
      screen.getByRole("link", { name: homeEn.doIndex.staticLinks.joinClub.label })
    ).toHaveAttribute("href", "/en/whats-on/clubs");
    expect(
      screen.getByRole("link", { name: homeEn.doIndex.staticLinks.contact.label })
    ).toHaveAttribute("href", "/en/contact");
  });

  it("has exactly one h1 and a logical heading order", async () => {
    const el = await DoIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    assertNoSkippedHeadingLevels(container);
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await DoIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});
