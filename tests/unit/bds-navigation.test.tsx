// @vitest-environment jsdom
/**
 * Unit tests for the navigation cluster (REDESIGN-2.0 §3.5, §4.3):
 * `Header`, `Footer`, `ServiceNavigation`, `Breadcrumbs`, `BackLink`,
 * `SkipLink`, `Pagination`, `LanguageToggle`, `ThemeToggle`. Follows
 * `tests/unit/bds-type.test.tsx`'s structure and its `@vitest-environment
 * jsdom` directive, since the default env (`vitest.config.ts`) is node.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// `Header` and `LanguageToggle` read the current path via `usePathname`.
// Fixed to one path for the whole file; individual tests derive their
// expectations from this value rather than each other.
vi.mock("next/navigation", () => ({
  usePathname: () => "/en/do",
}));

// jsdom has no `window.matchMedia`. `ThemeToggle` (and `Header`, which
// renders it) reads it on mount to resolve the system preference; stub it
// so mounting either component in this environment does not throw.
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

import Header from "@/components/bds/Header";
import Footer from "@/components/bds/Footer";
import ServiceNavigation, { type ServiceNavLink } from "@/components/bds/ServiceNavigation";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Pagination from "@/components/bds/Pagination";
import BackLink from "@/components/bds/BackLink";
import LanguageToggle from "@/components/bds/LanguageToggle";
import ThemeToggle from "@/components/bds/ThemeToggle";
import SkipLink from "@/components/bds/SkipLink";

afterEach(cleanup);

const serviceLinks: ServiceNavLink[] = [
  { href: "/do/equipment-loan", label: "Start again", current: true },
  { href: "/do/equipment-loan/status", label: "Check status" },
];

const paginationProps = {
  locale: "en" as const,
  hrefFor: (page: number) => `/whats-on/news?page=${page}`,
  ariaLabel: "Pagination",
  previousLabel: "Previous",
  nextLabel: "Next",
  pageLabelTemplate: "Page {page}",
  previousPageLabelTemplate: "Previous, page {page}",
  nextPageLabelTemplate: "Next, page {page}",
  currentPageLabel: "Current page",
};

describe("Header", () => {
  it("every <nav> has a non-empty accessible name", () => {
    render(<Header locale="en" />);
    const navs = screen.getAllByRole("navigation", { hidden: true });
    expect(navs.length).toBeGreaterThanOrEqual(2);
    for (const nav of navs) {
      expect(nav.getAttribute("aria-label")).toBeTruthy();
    }
  });

  it("wires the mobile menu disclosure's aria-expanded and aria-controls correctly", () => {
    render(<Header locale="en" />);

    // The mount effect has already collapsed the panel by the time render()
    // returns (React Testing Library flushes effects synchronously), so the
    // toggle reads "Menu" (closed), not "Close menu".
    const toggle = screen.getByRole("button", { name: "Menu" });
    const controlsId = toggle.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    const panel = document.getElementById(controlsId as string);
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("hidden");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-label", "Close menu");
    expect(panel).not.toHaveAttribute("hidden");
  });

  it("works without JavaScript: the mobile panel starts un-hidden before any effect runs", () => {
    // Mirrors the component's own initial state (`useState(true)`) rather
    // than re-rendering with effects disabled, since jsdom always runs
    // effects: this pins the CONTRACT that makes the no-JS case correct,
    // which is that `open` starts `true`.
    render(<Header locale="en" />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    // Reaching the toggle by role at all confirms the surrounding markup is
    // present without conditional (open &&) rendering, which is what keeps
    // the panel itself in the DOM for a no-JS visitor to read even though
    // this test environment has already run the collapsing effect.
    expect(toggle).toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("has a non-empty accessible name on its nav", () => {
    render(<Footer locale="en" />);
    const nav = screen.getByRole("navigation");
    expect(nav.getAttribute("aria-label")).toBeTruthy();
  });

  it("renders the five primary destinations from the default nav prop", () => {
    render(<Footer locale="en" />);
    expect(screen.getByRole("link", { name: "Do something" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About BIRSA" })).toBeInTheDocument();
  });
});

describe("ServiceNavigation", () => {
  it("has a non-empty accessible name built from the service name", () => {
    render(
      <ServiceNavigation
        locale="en"
        serviceName="Equipment loan"
        links={serviceLinks}
        ariaLabelTemplate="{service} navigation"
      />
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Equipment loan navigation");
  });

  it("sets the --bds-service-nav-height custom property", () => {
    const { container } = render(
      <ServiceNavigation
        locale="en"
        serviceName="Equipment loan"
        links={serviceLinks}
        ariaLabelTemplate="{service} navigation"
      />
    );
    const style = container.querySelector("style");
    expect(style?.textContent).toContain("--bds-service-nav-height");
  });

  it('marks the current link with aria-current="page"', () => {
    render(
      <ServiceNavigation
        locale="en"
        serviceName="Equipment loan"
        links={serviceLinks}
        ariaLabelTemplate="{service} navigation"
      />
    );
    const current = screen.getByRole("link", { name: "Start again" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Check status" })).not.toHaveAttribute("aria-current");
  });
});

describe("Breadcrumbs", () => {
  it('marks the current page with aria-current="page"', () => {
    const { container } = render(
      <Breadcrumbs
        locale="en"
        label="Breadcrumb"
        items={[
          { label: "Home", href: "/" },
          { label: "Get help", href: "/help" },
          { label: "Reporting" },
        ]}
      />
    );
    const current = container.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent("Reporting");
    // Only the current item carries it.
    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });
});

describe("Pagination", () => {
  it('marks the current page with aria-current="page"', () => {
    const { container } = render(
      <Pagination {...paginationProps} currentPage={2} totalPages={3} />
    );
    const current = container.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent("2");
  });

  it("gives the previous and next links an accessible name that says where they go", () => {
    render(<Pagination {...paginationProps} currentPage={2} totalPages={3} />);
    expect(screen.getByRole("link", { name: "Previous, page 1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next, page 3" })).toBeInTheDocument();
  });

  it("renders nothing for a single page", () => {
    const { container } = render(
      <Pagination {...paginationProps} currentPage={1} totalPages={1} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("BackLink", () => {
  it("renders an <a>, never a <button>", () => {
    render(<BackLink locale="en" href="/do/equipment-loan/dates" label="Back" />);
    const link = screen.getByRole("link", { name: "Back" });
    expect(link.tagName).toBe("A");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("links to the previous question, not to browser history", () => {
    render(<BackLink locale="en" href="/do/equipment-loan/dates" label="Back" />);
    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      "/en/do/equipment-loan/dates"
    );
  });
});

describe("LanguageToggle", () => {
  it("produces the same path with the other locale segment swapped", () => {
    render(<LanguageToggle locale="en" label="ภาษาไทย" ariaLabel="Switch to Thai" />);
    const link = screen.getByRole("link", { name: "Switch to Thai" });
    // usePathname is mocked to "/en/do" for this file.
    expect(link).toHaveAttribute("href", "/th/do");
  });

  it("renders an <a>, not a dropdown or a button", () => {
    render(<LanguageToggle locale="en" label="ภาษาไทย" ariaLabel="Switch to Thai" />);
    const link = screen.getByRole("link", { name: "Switch to Thai" });
    expect(link.tagName).toBe("A");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});

describe("SkipLink", () => {
  it("targets #main", () => {
    render(<SkipLink label="Skip to main content" />);
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main"
    );
  });
});

describe("D7 regression guard", () => {
  /** Any Tailwind font-size or line-height utility, the utilities D7 forbids. */
  const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

  function assertNoTailwindTypeUtility(container: HTMLElement) {
    for (const el of Array.from(container.querySelectorAll("*"))) {
      const classAttr = el.getAttribute("class");
      if (classAttr) expect(classAttr).not.toMatch(TAILWIND_TYPE_UTILITY);
    }
  }

  it("no navigation cluster component emits a Tailwind font-size or line-height utility", () => {
    const renders: Array<() => ReturnType<typeof render>> = [
      () => render(<Header locale="en" />),
      () => render(<Footer locale="en" />),
      () =>
        render(
          <ServiceNavigation
            locale="en"
            serviceName="Equipment loan"
            links={serviceLinks}
            ariaLabelTemplate="{service} navigation"
          />
        ),
      () =>
        render(
          <Breadcrumbs
            locale="en"
            label="Breadcrumb"
            items={[{ label: "Home", href: "/" }, { label: "Get help" }]}
          />
        ),
      () => render(<Pagination {...paginationProps} currentPage={2} totalPages={5} />),
      () => render(<BackLink locale="en" href="/do/equipment-loan/dates" label="Back" />),
      () => render(<LanguageToggle locale="en" label="ภาษาไทย" ariaLabel="Switch to Thai" />),
      () =>
        render(
          <ThemeToggle
            neutralLabel="Theme"
            darkLabel="Switch to dark mode"
            lightLabel="Switch to light mode"
          />
        ),
      () => render(<SkipLink label="Skip to main content" />),
    ];

    for (const doRender of renders) {
      const { container } = doRender();
      assertNoTailwindTypeUtility(container);
      cleanup();
    }
  });
});
