// @vitest-environment jsdom
/**
 * Unit tests for the section palette (REDESIGN-2.0 §4.6): one component per
 * entry in `components/bds/sectionPalette.ts`, plus the `sections/index.tsx`
 * registry that maps an id to its component.
 *
 * The single most important test in this file, per this cluster's brief, is
 * the forbidden-fields check: no section component may accept any field
 * named in `sectionPalette.ts`'s `forbiddenSchemaFields`. It runs at the
 * type level, which is exact and exhaustive over each section's real props
 * type, and again at runtime, which is the only way to catch a component
 * that declared a narrow prop type but then forwarded an unknown one to the
 * DOM anyway (`{...rest}` onto a native element, for instance).
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { forbiddenSchemaFields, sectionTypeIds } from "@/components/bds/sectionPalette";
import type { AspectRatio } from "@/components/bds/imageContract";

import RichTextSection, {
  type RichTextBlock,
  type RichTextSectionProps,
} from "@/components/bds/sections/RichTextSection";
import NavListSection, { type NavListSectionProps } from "@/components/bds/sections/NavListSection";
import CardGridSection, {
  type CardGridSectionProps,
} from "@/components/bds/sections/CardGridSection";
import NoticeSection, { type NoticeSectionProps } from "@/components/bds/sections/NoticeSection";
import InsetTextSection, {
  type InsetTextSectionProps,
} from "@/components/bds/sections/InsetTextSection";
import AccordionSection, {
  type AccordionSectionProps,
} from "@/components/bds/sections/AccordionSection";
import StepByStepSection, {
  type StepByStepSectionProps,
} from "@/components/bds/sections/StepByStepSection";
import TaskListSection, {
  type TaskListSectionProps,
} from "@/components/bds/sections/TaskListSection";
import ContactPanelSection, {
  type ContactPanelSectionProps,
} from "@/components/bds/sections/ContactPanelSection";
import RelatedLinksSection, {
  type RelatedLinksSectionProps,
} from "@/components/bds/sections/RelatedLinksSection";
import EmbeddedServiceSection, {
  type EmbeddedServiceSectionProps,
} from "@/components/bds/sections/EmbeddedServiceSection";
import { renderSection, sectionComponents, type SectionData } from "@/components/bds/sections";

afterEach(cleanup);

// ---------------------------------------------------------------------
// The forbidden-fields check (type level)
// ---------------------------------------------------------------------

type ForbiddenField = (typeof forbiddenSchemaFields)[number];

/** `never` when `T` declares no key named in `forbiddenSchemaFields`; otherwise the offending key names, which makes the call below fail to typecheck. */
type ForbiddenKeysOf<T> = Extract<keyof T, ForbiddenField>;

function assertNoForbiddenFields<T>(
  _marker: ForbiddenKeysOf<T> extends never ? true : ForbiddenKeysOf<T>
) {
  return true;
}

describe("no section prop type declares a forbidden schema field (type level)", () => {
  it("checks all eleven section prop types against sectionPalette.ts's forbiddenSchemaFields", () => {
    expect(assertNoForbiddenFields<RichTextSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<NavListSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<CardGridSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<NoticeSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<InsetTextSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<AccordionSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<StepByStepSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<TaskListSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<ContactPanelSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<RelatedLinksSectionProps>(true)).toBe(true);
    expect(assertNoForbiddenFields<EmbeddedServiceSectionProps>(true)).toBe(true);
  });

  it("also holds for SectionData, the discriminated union sections/index.tsx renders from", () => {
    type Props<T extends SectionData["type"]> = Extract<SectionData, { type: T }>["props"];
    expect(assertNoForbiddenFields<Props<"rich-text">>(true)).toBe(true);
    expect(assertNoForbiddenFields<Props<"card-grid">>(true)).toBe(true);
    expect(assertNoForbiddenFields<Props<"embedded-service">>(true)).toBe(true);
  });
});

// ---------------------------------------------------------------------
// The forbidden-fields check (runtime): an unknown prop smuggled past the
// type system (e.g. loose CMS response data cast through `as never`) must
// not reach the DOM. Every section destructures its exact prop names and
// forwards none of them onward as `{...rest}`, so this is a real assertion
// about behaviour, not a restatement of the type check above.
// ---------------------------------------------------------------------

describe("no section forwards an unknown prop to the DOM at runtime", () => {
  it("RichTextSection ignores a smuggled className/style/html", () => {
    const smuggled = {
      blocks: [{ type: "normal", children: [{ kind: "text", text: "Hello" }] }],
      newTabLabel: "Opens in a new tab",
      className: "smuggled-class",
      style: { color: "red" },
      html: "<b>smuggled</b>",
    } as unknown as RichTextSectionProps;

    const { container } = render(<RichTextSection {...smuggled} />);
    expect(container.innerHTML).not.toContain("smuggled-class");
    expect(container.innerHTML).not.toContain("color:red");
    expect(container.innerHTML).not.toContain("color: red");
    expect(container.innerHTML).not.toContain("<b>smuggled</b>");
  });

  it("NoticeSection ignores a smuggled className/style", () => {
    const smuggled = {
      variant: "info",
      body: "Hello",
      className: "smuggled-class",
      style: { color: "red" },
    } as unknown as NoticeSectionProps;

    const { container } = render(<NoticeSection {...smuggled} />);
    expect(container.innerHTML).not.toContain("smuggled-class");
    expect(container.innerHTML).not.toContain("color:red");
  });

  it("CardGridSection ignores a smuggled rawHtml/embed/iframe", () => {
    const smuggled = {
      cards: [{ id: "1", title: "A card" }],
      columns: 2,
      locale: "en",
      rawHtml: "<script>alert(1)</script>",
      embed: "<iframe src='https://evil.example'></iframe>",
    } as unknown as CardGridSectionProps;

    const { container } = render(<CardGridSection {...smuggled} />);
    expect(container.innerHTML).not.toContain("<script>");
    expect(container.innerHTML).not.toContain("<iframe");
  });
});

// ---------------------------------------------------------------------
// The registry: sections/index.tsx maps every id in sectionTypeIds, with
// none missing and none extra.
// ---------------------------------------------------------------------

describe("sections/index.tsx", () => {
  it("maps every id in sectionTypeIds, with none missing and none extra", () => {
    expect(Object.keys(sectionComponents).sort()).toEqual([...sectionTypeIds].sort());
  });

  it("names a real component for every id", () => {
    for (const id of sectionTypeIds) {
      expect(typeof sectionComponents[id], id).toBe("function");
    }
  });
});

// ---------------------------------------------------------------------
// RichTextSection: allowed marks/blocks, no h1
// ---------------------------------------------------------------------

describe("RichTextSection", () => {
  it("refuses an h1 block at the type level", () => {
    const blocks: RichTextBlock[] = [
      // @ts-expect-error -- "h1" is not a member of RichTextBlock["type"]; allowedBlocks deliberately excludes it.
      { type: "h1", children: [{ kind: "text", text: "Should not compile" }] },
    ];
    expect(blocks.length).toBe(1);
  });

  it("renders normal paragraphs, headings, lists, a blockquote and a table, each through the right element", () => {
    const blocks: RichTextBlock[] = [
      { type: "normal", children: [{ kind: "text", text: "Plain paragraph." }] },
      { type: "h2", children: [{ kind: "text", text: "A subheading" }] },
      { type: "h3", children: [{ kind: "text", text: "A smaller subheading" }] },
      {
        type: "blockquote",
        children: [{ kind: "text", text: "A quoted aside." }],
      },
      {
        type: "ul",
        items: [[{ kind: "text", text: "First item" }], [{ kind: "text", text: "Second item" }]],
      },
      {
        type: "table",
        caption: "A small table",
        columns: ["Name", "Role"],
        rows: [["Best", "President"]],
      },
    ];
    render(<RichTextSection blocks={blocks} newTabLabel="Opens in a new tab" />);

    expect(screen.getByText("Plain paragraph.").tagName).toBe("P");
    expect(screen.getByRole("heading", { level: 2, name: "A subheading" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "A smaller subheading" })
    ).toBeInTheDocument();
    expect(screen.getByText("A quoted aside.")).toBeInTheDocument();
    expect(screen.getByText("First item").tagName).toBe("LI");
    expect(screen.getByRole("region", { name: "A small table" })).toBeInTheDocument();
    expect(screen.getByText("President")).toBeInTheDocument();
  });

  it("renders strong, em and code marks, and both internal and external links", () => {
    const blocks: RichTextBlock[] = [
      {
        type: "normal",
        children: [
          { kind: "text", text: "bold", marks: ["strong"] },
          { kind: "text", text: " and ", marks: [] },
          { kind: "text", text: "italic", marks: ["em"] },
          { kind: "text", text: " and ", marks: [] },
          { kind: "text", text: "code", marks: ["code"] },
          { kind: "text", text: " and " },
          {
            kind: "link",
            href: "/about",
            children: [{ kind: "text", text: "an internal link" }],
          },
          { kind: "text", text: " and " },
          {
            kind: "link",
            href: "https://example.com",
            external: true,
            children: [{ kind: "text", text: "an external link" }],
          },
        ],
      },
    ];
    render(<RichTextSection blocks={blocks} newTabLabel="Opens in a new tab" />);

    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.getByText("italic").tagName).toBe("EM");
    expect(screen.getByText("code").tagName).toBe("CODE");

    const internalLink = screen.getByRole("link", { name: "an internal link" });
    expect(internalLink).toHaveAttribute("href", "/about");

    const externalLink = screen.getByRole("link", { name: /an external link/ });
    expect(externalLink).toHaveAttribute("href", "https://example.com");
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});

// ---------------------------------------------------------------------
// The other ten sections: one focused test each.
// ---------------------------------------------------------------------

describe("NavListSection", () => {
  it("renders a run of link rows", () => {
    render(
      <NavListSection
        rows={[
          { id: "1", href: "/a", title: "Page A", description: "About A" },
          { id: "2", href: "/b", title: "Page B" },
        ]}
      />
    );
    expect(screen.getByRole("link", { name: "Page A" })).toHaveAttribute("href", "/a");
    expect(screen.getByText("About A")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Page B" })).toHaveAttribute("href", "/b");
  });
});

describe("CardGridSection", () => {
  it("lays out two columns when columns=2 and three when columns=3", () => {
    const cards = [{ id: "1", title: "Card one", href: "/one" }];
    const { container: two } = render(<CardGridSection cards={cards} columns={2} locale="en" />);
    expect(two.querySelector("ul")).toHaveClass("sm:grid-cols-2");
    cleanup();
    const { container: three } = render(<CardGridSection cards={cards} columns={3} locale="en" />);
    expect(three.querySelector("ul")).toHaveClass("lg:grid-cols-3");
  });

  it("renders an optional image through CardImage, validated the same as every other image", () => {
    const ratio: AspectRatio = "4:3";
    render(
      <CardGridSection
        cards={[
          {
            id: "1",
            title: "Card with an image",
            image: {
              field: {
                assetId: "card-1",
                decorative: false,
                alt: { en: "A busy classroom", th: "ห้องเรียนที่มีนักศึกษาเต็ม" },
                ratio,
              },
              source: { src: "/images/card-1.jpg" },
            },
          },
        ]}
        columns={2}
        locale="en"
      />
    );
    expect(screen.getByAltText("A busy classroom")).toBeInTheDocument();
  });
});

describe("NoticeSection", () => {
  it("renders one of the four variants with its body as real text", () => {
    render(<NoticeSection variant="warning" title="Careful" body="Something to know." />);
    expect(screen.getByText("Careful")).toBeInTheDocument();
    expect(screen.getByText("Something to know.")).toBeInTheDocument();
  });
});

describe("InsetTextSection", () => {
  it("renders inline marks with no block structure", () => {
    render(
      <InsetTextSection
        content={[
          { kind: "text", text: "An aside worth " },
          { kind: "text", text: "emphasising", marks: ["em"] },
          { kind: "text", text: "." },
        ]}
        newTabLabel="Opens in a new tab"
      />
    );
    expect(screen.getByText("emphasising").tagName).toBe("EM");
  });
});

describe("AccordionSection", () => {
  it("renders at least two pairs", () => {
    render(
      <AccordionSection
        pairs={[
          { id: "1", question: "Question one?", answer: "Answer one." },
          { id: "2", question: "Question two?", answer: "Answer two." },
        ]}
      />
    );
    expect(screen.getByText("Question one?")).toBeInTheDocument();
    expect(screen.getByText("Question two?")).toBeInTheDocument();
  });

  it("throws a loud development error for a single pair (sectionPalette.ts: at least two)", () => {
    expect(() =>
      render(<AccordionSection pairs={[{ id: "1", question: "Only one?", answer: "Yes." }]} />)
    ).toThrow(/at least two/);
  });
});

describe("StepByStepSection", () => {
  it("renders each step's title and description", () => {
    render(
      <StepByStepSection
        steps={[
          { id: "1", title: "Step one", description: "Do this first." },
          { id: "2", title: "Step two", description: "Then this." },
        ]}
      />
    );
    expect(screen.getByText("Step one")).toBeInTheDocument();
    expect(screen.getByText("Do this first.")).toBeInTheDocument();
  });

  it("throws a loud development error for a single step", () => {
    expect(() =>
      render(<StepByStepSection steps={[{ id: "1", title: "Only step", description: "x" }]} />)
    ).toThrow(/at least two/);
  });
});

describe("TaskListSection", () => {
  it("renders through TaskList with the given heading and tasks", () => {
    render(
      <TaskListSection
        heading="Arrival checklist"
        items={[
          { id: "1", title: "Bring your passport", status: { label: "Not started" } },
          {
            id: "2",
            title: "Register with the faculty",
            href: "/register",
            status: { label: "Completed" },
          },
        ]}
      />
    );
    expect(screen.getByText("Bring your passport")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register with the faculty" })).toHaveAttribute(
      "href",
      "/register"
    );
  });
});

describe("ContactPanelSection", () => {
  it("pulls the portfolio label from lib/portfolios.ts rather than taking a typed-in title", () => {
    render(
      <ContactPanelSection
        portfolioId="president"
        locale="en"
        email="president@example.test"
        phone="02-000-0000"
      />
    );
    expect(screen.getByRole("heading", { name: "President" })).toBeInTheDocument();
    expect(screen.getByText("02-000-0000")).toBeInTheDocument();
  });

  it("reads the Thai label on the Thai locale, from the same one source", () => {
    render(<ContactPanelSection portfolioId="president" locale="th" />);
    expect(screen.getByRole("heading", { name: "นายกสโมสร" })).toBeInTheDocument();
  });
});

describe("RelatedLinksSection", () => {
  it("renders cross-links as a NavList", () => {
    render(<RelatedLinksSection rows={[{ id: "1", href: "/related", title: "A related page" }]} />);
    expect(screen.getByRole("link", { name: "A related page" })).toHaveAttribute(
      "href",
      "/related"
    );
  });
});

describe("EmbeddedServiceSection", () => {
  it("renders through StartPage with the given service fields", () => {
    render(
      <EmbeddedServiceSection
        start={{
          title: { en: "Request equipment", th: "ขอยืมอุปกรณ์" },
          whoFor: { en: "Any BIR student", th: "นักศึกษา BIR ทุกคน" },
          before: [{ en: "Your student ID", th: "บัตรนักศึกษา" }],
          howLong: { en: "5 minutes", th: "5 นาที" },
          whatNext: { en: "We will confirm by email", th: "เราจะยืนยันทางอีเมล" },
        }}
        locale="en"
        href="/do/equipment-loan"
        labels={{
          beforeHeading: "Before you begin",
          howLongHeading: "How long it takes",
          whatNextHeading: "What happens next",
          startCta: "Start now",
        }}
      />
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Request equipment" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start now/ })).toHaveAttribute(
      "href",
      "/do/equipment-loan"
    );
  });
});

// ---------------------------------------------------------------------
// renderSection: the same eleven, through the registry, from data.
// ---------------------------------------------------------------------

describe("renderSection", () => {
  it("renders every section type from a SectionData value without throwing", () => {
    const fixtures: SectionData[] = [
      {
        type: "rich-text",
        props: {
          blocks: [{ type: "normal", children: [{ kind: "text", text: "Hello" }] }],
          newTabLabel: "Opens in a new tab",
        },
      },
      { type: "nav-list", props: { rows: [{ id: "1", href: "/a", title: "A" }] } },
      {
        type: "card-grid",
        props: { cards: [{ id: "1", title: "Card" }], columns: 2, locale: "en" },
      },
      { type: "notice", props: { variant: "info", body: "Note." } },
      {
        type: "inset-text",
        props: { content: [{ kind: "text", text: "Aside." }], newTabLabel: "Opens in a new tab" },
      },
      {
        type: "accordion",
        props: {
          pairs: [
            { id: "1", question: "Q1", answer: "A1" },
            { id: "2", question: "Q2", answer: "A2" },
          ],
        },
      },
      {
        type: "step-by-step",
        props: {
          steps: [
            { id: "1", title: "Step 1", description: "d1" },
            { id: "2", title: "Step 2", description: "d2" },
          ],
        },
      },
      {
        type: "task-list",
        props: {
          heading: "Checklist",
          items: [{ id: "1", title: "Task", status: { label: "Not started" } }],
        },
      },
      { type: "contact-panel", props: { portfolioId: "treasury", locale: "en" } },
      {
        type: "related-links",
        props: { rows: [{ id: "1", href: "/related", title: "Related" }] },
      },
      {
        type: "embedded-service",
        props: {
          start: {
            title: { en: "A service", th: "บริการ" },
            whoFor: { en: "Everyone", th: "ทุกคน" },
            before: [],
            howLong: { en: "1 minute", th: "1 นาที" },
            whatNext: { en: "Done", th: "เสร็จสิ้น" },
          },
          locale: "en",
          href: "/do/a-service",
          labels: {
            beforeHeading: "Before",
            howLongHeading: "How long",
            whatNextHeading: "Next",
            startCta: "Start",
          },
        },
      },
    ];

    for (const fixture of fixtures) {
      expect(() => {
        const { unmount } = render(<div>{renderSection(fixture)}</div>);
        unmount();
      }, fixture.type).not.toThrow();
    }
  });
});

// ---------------------------------------------------------------------
// No Tailwind font-size or line-height utility, anywhere in this cluster
// (media components and section components alike). Mirrors
// tests/unit/bds-type.test.tsx's own guard.
// ---------------------------------------------------------------------

const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

describe("no component in this cluster emits a Tailwind font-size or line-height utility", () => {
  const mediaDir = path.join(process.cwd(), "components/bds");
  const mediaFiles = [
    "Figure.tsx",
    "HeroImage.tsx",
    "CardImage.tsx",
    "Gallery.tsx",
    "Portrait.tsx",
  ];
  const sectionsDir = path.join(process.cwd(), "components/bds/sections");
  const sectionFiles = readdirSync(sectionsDir).filter((file) => file.endsWith(".tsx"));

  it.each([
    ...mediaFiles.map((f) => path.join(mediaDir, f)),
    ...sectionFiles.map((f) => path.join(sectionsDir, f)),
  ])("%s uses only the bilingual type scale", (filePath: string) => {
    const source = readFileSync(filePath, "utf8");
    // Strip block comments (TSDoc prose legitimately says "text-4xl" as a
    // negative example) before checking for the real utility classes.
    const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(withoutComments, filePath).not.toMatch(TAILWIND_TYPE_UTILITY);
  });
});
