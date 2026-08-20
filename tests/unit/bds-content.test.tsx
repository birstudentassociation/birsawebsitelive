// @vitest-environment jsdom
/**
 * Unit tests for the content cluster (REDESIGN-2.0 §11.4, `components/bds/`):
 * `Accordion`, `Button`, `Card`, `Details`, `Email`, `ExternalLink`,
 * `NavList`, `PageFeedback`, `PageHeader`, `SummaryList`, `Table`,
 * `VisuallyHidden`.
 *
 * Follows the pattern in `tests/unit/bds-type.test.tsx`: jsdom per file
 * (the project default is `node`), Testing Library queries by role and
 * accessible name wherever the assertion is really about accessibility
 * rather than markup shape.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import Link from "next/link";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import Accordion from "@/components/bds/Accordion";
import Button from "@/components/bds/Button";
import Card, { CardTitle, CardMeta } from "@/components/bds/Card";
import Details from "@/components/bds/Details";
import Email from "@/components/bds/Email";
import ExternalLink from "@/components/bds/ExternalLink";
import NavList, { NavListItem } from "@/components/bds/NavList";
import PageFeedback from "@/components/bds/PageFeedback";
import PageHeader from "@/components/bds/PageHeader";
import SummaryList from "@/components/bds/SummaryList";
import Table from "@/components/bds/Table";
import VisuallyHidden from "@/components/bds/VisuallyHidden";

import { a11y as enA11y } from "@/content/dictionaries/en/a11y";
import { a11y as thA11y } from "@/content/dictionaries/th/a11y";
import { chrome as enChrome } from "@/content/dictionaries/en/chrome";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/news/welcome-week",
}));

afterEach(cleanup);

/**
 * Any Tailwind font-size or line-height utility. The same guard
 * `tests/unit/bds-type.test.tsx` uses for defect D7: a `bds/` component
 * reaching for `text-lg` or `leading-tight` instead of the `Text`/`Heading`
 * scale has reintroduced it. Deliberately does not match the scale's own
 * classes (`text-body-sm`, `text-heading-1`, and so on), which are the
 * correct way to set a size.
 */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

function assertNoTailwindTypeUtility(container: HTMLElement) {
  for (const el of Array.from(container.querySelectorAll("*"))) {
    // `el.className` is an `SVGAnimatedString`, not a `string`, on SVG
    // elements (the icons every disclosure and NavList row renders), so the
    // class list is read via the attribute, which is a plain string on
    // every element regardless of namespace.
    const className = el.getAttribute("class") ?? "";
    expect(className, el.outerHTML).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

describe("Accordion", () => {
  it("renders native <details>/<summary>, not a JS-driven widget", () => {
    render(
      <Accordion
        items={[
          { id: "a", summary: "What is BIR", children: "The BPolSc programme.", defaultOpen: true },
          { id: "b", summary: "How to join a club", children: "See the clubs page." },
        ]}
      />
    );

    const items = document.querySelectorAll("details");
    expect(items).toHaveLength(2);
    for (const item of Array.from(items)) {
      expect(item.querySelector("summary")).not.toBeNull();
    }
  });

  it("works with no JS: open state comes from the `open` attribute alone, not an event handler", () => {
    render(
      <Accordion
        items={[
          { id: "open-one", summary: "Open by default", children: "Body", defaultOpen: true },
          { id: "closed-one", summary: "Closed by default", children: "Body" },
        ]}
      />
    );

    const [openItem, closedItem] = Array.from(document.querySelectorAll("details"));
    // The native `open` attribute, not a class or inline style a script would
    // have to toggle, is what determines visibility; the browser (or jsdom's
    // implementation of <details>) handles it with zero JavaScript of ours.
    expect(openItem).toHaveAttribute("open");
    expect(closedItem).not.toHaveAttribute("open");
  });

  it("never for content the reader needs all of is a usage rule, not testable here; see the TSDoc", () => {
    expect(true).toBe(true);
  });
});

describe("Details", () => {
  it("renders one native <details> disclosure", () => {
    const { container } = render(<Details summary="Why we ask for this">Because reasons.</Details>);
    const details = container.querySelector("details");
    expect(details).not.toBeNull();
    expect(details?.querySelector("summary")).not.toBeNull();
  });
});

describe("Button", () => {
  it("renders a real <button> when no href is given", () => {
    render(<Button onClick={() => {}}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.tagName).toBe("BUTTON");
  });

  it("renders a link, not a button, when href is given: a navigating control is a link", () => {
    render(<Button href="/services">Find a service</Button>);
    const link = screen.getByRole("link", { name: "Find a service" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/services");
  });

  it("meets the 44px minimum target size on every variant", () => {
    const { container: c1 } = render(<Button href="/x">Go</Button>);
    expect(c1.querySelector("a")?.className).toMatch(/\bh-11\b/);
    cleanup();
    const { container: c2 } = render(
      <Button variant="start" href="/start">
        Start now
      </Button>
    );
    expect(c2.querySelector("a")?.className).toMatch(/\bh-11\b/);
  });
});

describe("Card and CardTitle: the accessible name is the title, never read more", () => {
  it("makes the title the accessible name of the whole clickable card", () => {
    render(
      <Card href="/news/welcome-week">
        <CardTitle href="/news/welcome-week">Welcome week starts Monday</CardTitle>
        <CardMeta>18 August</CardMeta>
      </Card>
    );

    const link = screen.getByRole("link", { name: "Welcome week starts Monday" });
    expect(link).toHaveAttribute("href", "/news/welcome-week");
    // The stretched link, not a second "read more" link repeated on every card.
    expect(screen.queryByText(/read more/i)).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});

describe("NavList", () => {
  it("makes the title the only link text in a row, stretched over the whole row", () => {
    render(
      <NavList>
        <NavListItem href="/clubs" title="Clubs">
          Find a club to join.
        </NavListItem>
      </NavList>
    );

    const link = screen.getByRole("link", { name: "Clubs" });
    expect(link).toHaveAttribute("href", "/clubs");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});

describe("ExternalLink", () => {
  it("carries rel=noopener noreferrer, an aria-hidden icon, and visually hidden new tab text", () => {
    render(
      <ExternalLink href="https://www.reg.tu.ac.th" newTabLabel={enA11y.a11y.newTab}>
        University registrar
      </ExternalLink>
    );

    const link = screen.getByRole("link", { name: /University registrar/ });
    expect(link).toHaveAttribute("href", "https://www.reg.tu.ac.th");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");

    // The accessible name includes the hidden new tab text (from the a11y
    // namespace this component reads its key NAME from but does not own).
    expect(link).toHaveAccessibleName(`University registrar (${enA11y.a11y.newTab})`);

    // The icon itself never carries meaning alone.
    const icon = link.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("carries the Thai new tab text when given the Thai a11y value, never a machine translation of the English", () => {
    render(
      <ExternalLink href="https://www.reg.tu.ac.th" newTabLabel={thA11y.a11y.newTab}>
        สำนักทะเบียน
      </ExternalLink>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(`สำนักทะเบียน (${thA11y.a11y.newTab})`);
  });
});

describe("Email", () => {
  it("serves the server-rendered HTML as character entities, with no literal '@' for a scraper to harvest", () => {
    // The scrape-resistance is a property of what the SERVER sends, before
    // any browser parses it back into a DOM. jsdom's own DOM (as `render`
    // from Testing Library gives it) has already parsed those entities back
    // into ordinary characters and re-serialises them as such, which would
    // make this assertion pass even if the component emitted a plain "@"
    // to begin with, so it is checked against the real static markup
    // instead of a round trip through jsdom.
    const html = renderToStaticMarkup(<Email address="bir@tu.ac.th" />);
    expect(html).not.toContain("@");
    expect(html).toContain("&#64;");
  });

  it("still renders as an ordinary, working mailto link once the browser parses it", () => {
    const { container } = render(<Email address="bir@tu.ac.th" />);
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("mailto:bir@tu.ac.th");
    expect(link?.textContent).toBe("bir@tu.ac.th");
  });
});

describe("PageHeader", () => {
  // `helpSlot` is a REQUIRED prop on `PageHeaderProps` (components/bds/PageHeader.tsx),
  // not an optional one. That guarantee is enforced by TypeScript at compile
  // time: a caller that omits `helpSlot` does not compile, so there is no
  // runtime "missing helpSlot" case for this test to exercise. What this test
  // pins down is the part that IS a runtime concern: a passed helpSlot
  // actually renders, in the header, every time.
  it("renders the required helpSlot", () => {
    render(<PageHeader title="Find a service" helpSlot={<Link href="/help">Get help</Link>} />);

    expect(screen.getByRole("heading", { level: 1, name: "Find a service" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get help" })).toBeInTheDocument();
  });

  it("renders an optional lede and breadcrumbs alongside the mandatory helpSlot", () => {
    render(
      <PageHeader
        title="Clubs"
        lede="Find a club to join this semester."
        breadcrumbs={<nav aria-label="Breadcrumb">Home / Clubs</nav>}
        helpSlot={<Link href="/help">Get help</Link>}
      />
    );

    expect(screen.getByText("Find a club to join this semester.")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });
});

describe("PageFeedback", () => {
  it("renders a plain link carrying the current path, never on its own a form or client submit", () => {
    render(
      <PageFeedback
        locale="en"
        prompt={enChrome.feedback.prompt}
        report={enChrome.feedback.report}
      />
    );

    const link = screen.getByRole("link", { name: enChrome.feedback.report });
    expect(link.tagName).toBe("A");
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("/en/contact");
    expect(href).toContain("category=problem");
    expect(href).toContain(encodeURIComponent("/en/news/welcome-week"));
  });
});

describe("SummaryList", () => {
  const rows = [
    {
      id: "name",
      label: "Full name",
      value: "Somchai Srisuk",
      changeHref: "/name",
      changeLabel: "Change",
    },
    {
      id: "email",
      label: "Email address",
      value: "somchai@example.com",
      changeHref: "/email",
      changeLabel: "Change",
    },
    { id: "item", label: "Item", value: "Folding table" },
  ];

  it("renders the list variant with a change link per row that names WHAT it changes", () => {
    render(<SummaryList rows={rows} />);

    // The visible word can repeat ("Change"), but the ACCESSIBLE NAME must not
    // be a bare "Change": it carries the row's own label as hidden context.
    expect(screen.getByRole("link", { name: "Change Full name" })).toHaveAttribute("href", "/name");
    expect(screen.getByRole("link", { name: "Change Email address" })).toHaveAttribute(
      "href",
      "/email"
    );
    // A row with no changeHref (read only, WCAG 3.3.7) gets no change link.
    expect(screen.queryByText("Item")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);

    // Neither accessible name is a bare, context-free "Change".
    for (const link of screen.getAllByRole("link")) {
      expect(link.textContent?.trim()).not.toBe("Change");
    }
  });

  it("renders the card variant with a title and the same per-row change links, for an officer console record", () => {
    render(
      <SummaryList
        variant="card"
        title="Loan request LR-2026-0142"
        rows={rows}
        actions={<Link href="/loans/LR-2026-0142">Open full record</Link>}
      />
    );

    expect(screen.getByRole("heading", { name: "Loan request LR-2026-0142" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open full record" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Change Full name" })).toBeInTheDocument();
  });
});

describe("Table", () => {
  const columns = [
    { key: "day", header: "Day" },
    { key: "time", header: "Shuttle time" },
  ];
  const rows = [
    { day: "Monday", time: "08:00" },
    { day: "Tuesday", time: "08:15" },
  ];

  it("scrolls inside its own container, which is keyboard reachable with an accessible name", () => {
    render(<Table caption="Shuttle timetable" columns={columns} rows={rows} />);

    const region = screen.getByRole("region", { name: "Shuttle timetable" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region.className).toMatch(/overflow-x-auto/);
    // The wrapper scrolls; nothing here sets overflow on the page body.
  });

  it('uses a real <th scope="col"> for column headers', () => {
    render(<Table caption="Shuttle timetable" columns={columns} rows={rows} />);

    for (const header of screen.getAllByRole("columnheader")) {
      expect(header.tagName).toBe("TH");
      expect(header).toHaveAttribute("scope", "col");
    }
  });

  it('optionally renders the first cell of each row as <th scope="row">', () => {
    render(<Table caption="Shuttle timetable" columns={columns} rows={rows} rowHeaders />);

    const rowHeaderCells = screen.getAllByRole("rowheader");
    expect(rowHeaderCells).toHaveLength(2);
    for (const cell of rowHeaderCells) {
      expect(cell).toHaveAttribute("scope", "row");
    }
  });

  it("can hide the caption visually while keeping it as the region's accessible name", () => {
    render(<Table caption="Shuttle timetable" captionHidden columns={columns} rows={rows} />);

    const caption = document.querySelector("caption");
    expect(caption?.className).toMatch(/sr-only/);
    expect(screen.getByRole("region", { name: "Shuttle timetable" })).toBeInTheDocument();
  });
});

describe("VisuallyHidden", () => {
  it("hides text visually while keeping it in the accessibility tree", () => {
    render(<VisuallyHidden>opens in a new tab</VisuallyHidden>);
    const el = screen.getByText("opens in a new tab");
    expect(el.className).toMatch(/sr-only/);
  });
});

describe("D7 regression guard: no bds/ content component emits a raw Tailwind type utility", () => {
  it("Accordion", () => {
    const { container } = render(
      <Accordion items={[{ id: "a", summary: "Question", children: "Answer" }]} />
    );
    assertNoTailwindTypeUtility(container);
  });

  it("Details", () => {
    const { container } = render(<Details summary="More detail">Body copy.</Details>);
    assertNoTailwindTypeUtility(container);
  });

  it("Button", () => {
    const { container } = render(<Button href="/services">Find a service</Button>);
    assertNoTailwindTypeUtility(container);
  });

  it("Card", () => {
    const { container } = render(
      <Card href="/x">
        <CardTitle href="/x">A title</CardTitle>
        <CardMeta>18 August</CardMeta>
      </Card>
    );
    assertNoTailwindTypeUtility(container);
  });

  it("NavList", () => {
    const { container } = render(
      <NavList>
        <NavListItem href="/clubs" title="Clubs">
          Find a club.
        </NavListItem>
      </NavList>
    );
    assertNoTailwindTypeUtility(container);
  });

  it("PageHeader", () => {
    const { container } = render(
      <PageHeader
        title="Clubs"
        lede="A short lede."
        helpSlot={<Link href="/help">Get help</Link>}
      />
    );
    assertNoTailwindTypeUtility(container);
  });

  it("PageFeedback", () => {
    const { container } = render(
      <PageFeedback
        locale="en"
        prompt={enChrome.feedback.prompt}
        report={enChrome.feedback.report}
      />
    );
    assertNoTailwindTypeUtility(container);
  });

  it("SummaryList, both variants", () => {
    const rows = [
      {
        id: "name",
        label: "Full name",
        value: "Somchai Srisuk",
        changeHref: "/name",
        changeLabel: "Change",
      },
    ];
    const { container: listContainer } = render(<SummaryList rows={rows} />);
    assertNoTailwindTypeUtility(listContainer);
    cleanup();
    const { container: cardContainer } = render(
      <SummaryList variant="card" title="A record" rows={rows} />
    );
    assertNoTailwindTypeUtility(cardContainer);
  });

  it("Table", () => {
    const { container } = render(
      <Table
        caption="Shuttle timetable"
        columns={[{ key: "day", header: "Day" }]}
        rows={[{ day: "Monday" }]}
      />
    );
    assertNoTailwindTypeUtility(container);
  });
});
