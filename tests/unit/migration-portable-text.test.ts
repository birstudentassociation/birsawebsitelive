/**
 * Unit tests for `lib/migration/portableText.ts`, the MDX to Portable Text
 * serializer (Wave 6A, REDESIGN-2.0 §11.4). One test per construct named in
 * the wave brief ("headings h2-h6... every JSX component that actually
 * appears in the corpus"), plus the merge/locale-pairing behaviour that
 * makes the two-phase design in that file's header necessary.
 *
 * These fixtures are deliberately small and synthetic rather than the real
 * corpus files — the serializer is pure, so a two-line MDX string exercises
 * exactly one construct at a time, which is what makes a failure here point
 * at the right line in `portableText.ts` instead of somewhere in 126 files.
 * `tests/unit/migration-mdx.test.ts` covers the scripts that run this
 * against the real corpus.
 */
import { describe, expect, it } from "vitest";
import {
  parseMdxBody,
  mergeLocaleSections,
  defaultLinkResolver,
  UnsupportedMdxConstructError,
  LocalePairMismatchError,
  type LinkResolver,
  type ParsedSection,
  type RichTextSection,
  type NoticeSection,
  type AccordionSection,
  type RelatedLinksSection,
} from "@/lib/migration/portableText";

const noResolve: LinkResolver = (href) => ({ kind: "external", resolved: href });

function parse(source: string, sourcePath = "content/test/en/fixture.mdx") {
  return parseMdxBody(source, { sourcePath, linkResolver: noResolve });
}

describe("parseMdxBody: prose", () => {
  it("maps h2 and h3 to their Portable Text styles", () => {
    const { sections } = parse("## A heading\n\n### A subheading\n");
    expect(sections).toHaveLength(1);
    const rich = sections[0] as RichTextSection & ParsedSection;
    expect(rich.kind).toBe("rich-text");
    const blocks = (
      rich as unknown as { blocks: { style: string; children: { text: string }[] }[] }
    ).blocks;
    expect(blocks[0]?.style).toBe("h2");
    expect(blocks[0]?.children[0]?.text).toBe("A heading");
    expect(blocks[1]?.style).toBe("h3");
  });

  it("rejects h1 (the page title's own level, not a body block)", () => {
    expect(() => parse("# Top level heading\n")).toThrow(UnsupportedMdxConstructError);
  });

  it("rejects h4, h5 and h6 (no style option in allowedBlocks)", () => {
    expect(() => parse("#### h4\n")).toThrow(/h4/);
    expect(() => parse("##### h5\n")).toThrow(/h5/);
    expect(() => parse("###### h6\n")).toThrow(/h6/);
  });

  it("carries bold, italic and inline code as marks on one paragraph", () => {
    const { sections } = parse("Plain **bold** and *italic* and `code` text.\n");
    const rich = sections[0] as unknown as {
      blocks: { children: { text: string; marks: string[] }[] }[];
    };
    const spans = rich.blocks[0]!.children;
    expect(spans.find((s) => s.text === "bold")?.marks).toContain("strong");
    expect(spans.find((s) => s.text === "italic")?.marks).toContain("em");
    expect(spans.find((s) => s.text === "code")?.marks).toContain("code");
  });

  it("resolves an internal link through the injected resolver and attaches it as a markDef", () => {
    const resolver: LinkResolver = (href) => ({
      kind: "internal",
      resolved: `/whats-on${href}`,
      changed: true,
    });
    const { sections, notes } = parseMdxBody("See [the news](/news/foo) for details.\n", {
      sourcePath: "x.mdx",
      linkResolver: resolver,
    });
    expect(notes).toHaveLength(0);
    const rich = sections[0] as unknown as {
      blocks: {
        children: { text: string; marks: string[] }[];
        markDefs: { _key: string; href: string }[];
      }[];
    };
    const block = rich.blocks[0]!;
    const linkSpan = block.children.find((s) => s.text === "the news")!;
    const markDef = block.markDefs.find((m) => m._key === linkSpan.marks[0]);
    expect(markDef?.href).toBe("/whats-on/news/foo");
  });

  it("keeps an external link's href unchanged", () => {
    const { sections } = parse("Visit [BIR](https://www.birpolsci.com) online.\n");
    const rich = sections[0] as unknown as {
      blocks: { markDefs: { href: string }[] }[];
    };
    expect(rich.blocks[0]!.markDefs[0]?.href).toBe("https://www.birpolsci.com");
  });

  it("reports (does not throw on) an internal link that resolves to nothing", () => {
    const resolver: LinkResolver = () => ({ kind: "unresolved", original: "/no-such-route" });
    const { notes } = parseMdxBody("A [broken link](/no-such-route) here.\n", {
      sourcePath: "content/test/en/fixture.mdx",
      linkResolver: resolver,
    });
    expect(notes).toHaveLength(1);
    expect(notes[0]).toMatch(/does not resolve/);
    expect(notes[0]).toMatch(/no-such-route/);
  });

  it("flattens a nested bulleted list into level-tagged blocks, and numbered lists separately", () => {
    const { sections } = parse("- one\n- two\n  - nested\n\n1. first\n2. second\n");
    const rich = sections[0] as unknown as {
      blocks: { listItem?: string; level?: number; children: { text: string }[] }[];
    };
    const bullets = rich.blocks.filter((b) => b.listItem === "bullet");
    expect(bullets.map((b) => b.children[0]?.text)).toEqual(["one", "two", "nested"]);
    expect(bullets.find((b) => b.children[0]?.text === "nested")?.level).toBe(2);
    const numbers = rich.blocks.filter((b) => b.listItem === "number");
    expect(numbers).toHaveLength(2);
  });

  it("maps a blockquote paragraph to a blockquote-styled block", () => {
    const { sections } = parse('> "Be part of the standard."\n');
    const rich = sections[0] as unknown as { blocks: { style: string }[] };
    expect(rich.blocks[0]?.style).toBe("blockquote");
  });

  it("rejects a thematic break (no divider block in allowedBlocks)", () => {
    expect(() => parse("Some text.\n\n---\n\nMore text.\n")).toThrow(/thematicBreak/);
  });
});

describe("parseMdxBody: GFM tables", () => {
  it("flattens a pipe table to rows of plain-text cells, appending a resolved href for a link cell", () => {
    const resolver: LinkResolver = (href) => ({
      kind: "internal",
      resolved: `/whats-on${href}`,
      changed: true,
    });
    const src = "| Date | Event |\n| --- | --- |\n| 1 Aug | [Orientation](/news/orientation) |\n";
    const { sections } = parseMdxBody(src, { sourcePath: "x.mdx", linkResolver: resolver });
    const rich = sections[0] as unknown as { blocks: { rows: { cells: string[] }[] }[] };
    expect(rich.blocks[0]!.rows[0]!.cells).toEqual(["Date", "Event"]);
    expect(rich.blocks[0]!.rows[1]!.cells).toEqual([
      "1 Aug",
      "Orientation (/whats-on/news/orientation)",
    ]);
  });
});

describe("parseMdxBody: raw HTML tables", () => {
  it("flattens a <table><thead>/<tbody> structure the same way as a GFM table, and reports a dropped caption", () => {
    const src = [
      "<table>",
      '  <caption className="sr-only">Emergency numbers</caption>',
      "  <thead>",
      "    <tr>",
      '      <th scope="col">Situation</th>',
      '      <th scope="col">Number</th>',
      "    </tr>",
      "  </thead>",
      "  <tbody>",
      "    <tr>",
      '      <th scope="row">Medical</th>',
      "      <td>1669</td>",
      "    </tr>",
      "  </tbody>",
      "</table>",
      "",
    ].join("\n");
    const { sections, notes } = parse(src);
    const rich = sections[0] as unknown as { blocks: { rows: { cells: string[] }[] }[] };
    expect(rich.blocks[0]!.rows).toEqual([
      { cells: ["Situation", "Number"], _key: expect.any(String), _type: "row" },
      { cells: ["Medical", "1669"], _key: expect.any(String), _type: "row" },
    ]);
    expect(notes.some((n) => n.includes("Emergency numbers"))).toBe(true);
  });
});

describe("parseMdxBody: Notice", () => {
  it("ends the current rich-text bucket and starts a new one after it", () => {
    const src =
      'Before.\n\n<Notice variant="warning" title="Careful">\nBody text.\n</Notice>\n\nAfter.\n';
    const { sections } = parse(src);
    expect(sections.map((s) => s.kind)).toEqual(["rich-text", "notice", "rich-text"]);
    const notice = sections[1] as unknown as {
      variant: string;
      title: string | null;
      body: string;
    };
    expect(notice.variant).toBe("warning");
    expect(notice.title).toBe("Careful");
    expect(notice.body).toBe("Body text.");
  });

  it("joins a multi-paragraph Notice body with a blank line, stripping inline marks and folding link hrefs into text", () => {
    const resolver: LinkResolver = (href) => ({ kind: "external", resolved: href });
    const src =
      '<Notice variant="info">\nLine one with **bold**.\n\nLine two with a [link](https://example.com).\n</Notice>\n';
    const { sections } = parseMdxBody(src, { sourcePath: "x.mdx", linkResolver: resolver });
    const notice = sections[0] as unknown as { body: string };
    expect(notice.body).toBe("Line one with bold.\n\nLine two with a link (https://example.com).");
  });

  it('rejects the 1.0 "placeholder" variant, which the notice section schema does not accept', () => {
    expect(() => parse('<Notice variant="placeholder">\nBody\n</Notice>\n')).toThrow(/placeholder/);
  });

  it("defaults to the info variant when none is given, matching the schema's initialValue", () => {
    const { sections } = parse("<Notice>\nBody\n</Notice>\n");
    expect((sections[0] as unknown as { variant: string }).variant).toBe("info");
  });
});

describe("parseMdxBody: Accordion", () => {
  it("groups consecutive Accordion elements into one accordion section", () => {
    const src =
      '<Accordion summary="Q1">\nA1\n</Accordion>\n\n<Accordion summary="Q2">\nA2\n</Accordion>\n';
    const { sections } = parse(src);
    expect(sections).toHaveLength(1);
    const accordion = sections[0] as unknown as {
      kind: "accordion";
      items: { question: string; answer: string }[];
    };
    expect(accordion.items).toEqual([
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ]);
  });

  it("starts a new accordion section when rich text intervenes between two Accordion runs", () => {
    const src =
      '<Accordion summary="Q1">\nA1\n</Accordion>\n\nSome prose.\n\n<Accordion summary="Q2">\nA2\n</Accordion>\n';
    const { sections } = parse(src);
    expect(sections.map((s) => s.kind)).toEqual(["accordion", "rich-text", "accordion"]);
  });
});

describe("parseMdxBody: inline Email and raw <a>", () => {
  it("turns <Email address> into a mailto link span", () => {
    const { sections } = parse('Contact us: <Email address="birsa@tu.ac.th" />.\n');
    const rich = sections[0] as unknown as {
      blocks: {
        children: { text: string; marks: string[] }[];
        markDefs: { _key: string; href: string }[];
      }[];
    };
    const block = rich.blocks[0]!;
    const span = block.children.find((s) => s.text === "birsa@tu.ac.th")!;
    const markDef = block.markDefs.find((m) => m._key === span.marks[0]);
    expect(markDef?.href).toBe("mailto:birsa@tu.ac.th");
  });

  it("turns a raw <a href> element into a link span like a markdown link", () => {
    const { sections } = parse('Go to <a href="https://aka.ms/mfasetup">aka.ms/mfasetup</a>.\n');
    const rich = sections[0] as unknown as {
      blocks: { markDefs: { href: string }[] }[];
    };
    expect(rich.blocks[0]!.markDefs[0]?.href).toBe("https://aka.ms/mfasetup");
  });

  it('preserves the literal {" "} expression container as a space', () => {
    const src = 'Send a message via{" "}\n<a href="https://example.com">us</a>.\n';
    const { sections } = parse(src);
    const rich = sections[0] as unknown as { blocks: { children: { text: string }[] }[] };
    const text = rich.blocks[0]!.children.map((s) => s.text).join("");
    expect(text).toContain("via us.");
  });
});

describe("parseMdxBody: RelatedClubs", () => {
  it("captures the comma separated slug list as its own section", () => {
    const { sections } = parse('<RelatedClubs slugs="bir-football,bir-basketball" />\n');
    expect(sections).toEqual([
      { kind: "related-links", slugs: ["bir-football", "bir-basketball"] },
    ]);
  });
});

describe("parseMdxBody: components with no Portable Text equivalent", () => {
  it.each(["GoogleForm", "ShuttleTimer", "ShuttleServiceNotice", "NearbyFood", "ReportHarassment"])(
    "refuses to silently drop <%s />",
    (name) => {
      expect(() => parse(`<${name} />\n`)).toThrow(UnsupportedMdxConstructError);
    }
  );

  it("names an entirely unrecognised JSX component rather than guessing", () => {
    try {
      parse("<SomeFutureWidget />\n");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(UnsupportedMdxConstructError);
      expect((error as InstanceType<typeof UnsupportedMdxConstructError>).construct).toBe(
        "SomeFutureWidget"
      );
    }
  });
});

describe("defaultLinkResolver", () => {
  it("rewrites a locale-prefixed 1.0 news path to its 2.0 target, preserving the locale", () => {
    expect(defaultLinkResolver("/en/news/tpc-crazy-week-2026")).toEqual({
      kind: "internal",
      resolved: "/en/whats-on/news/tpc-crazy-week-2026",
      changed: true,
    });
  });

  it("rewrites a bare (no-locale) 1.0 path the same way, without adding a locale", () => {
    expect(defaultLinkResolver("/student-life/home/getting-around")).toEqual({
      kind: "internal",
      resolved: "/help/getting-started",
      changed: true,
    });
  });

  it("passes through a path that is already a valid 2.0 route family unchanged", () => {
    expect(defaultLinkResolver("/contact")).toEqual({
      kind: "internal",
      resolved: "/contact",
      changed: false,
    });
  });

  it("reports a path with neither a redirect rule nor a known 2.0 family as unresolved", () => {
    expect(defaultLinkResolver("/this-path-has-never-existed")).toEqual({
      kind: "unresolved",
      original: "/this-path-has-never-existed",
    });
  });

  it("leaves external and mailto links untouched", () => {
    expect(defaultLinkResolver("https://www.birpolsci.com")).toEqual({
      kind: "external",
      resolved: "https://www.birpolsci.com",
    });
    expect(defaultLinkResolver("mailto:birsa@tu.ac.th")).toEqual({
      kind: "external",
      resolved: "mailto:birsa@tu.ac.th",
    });
  });
});

describe("mergeLocaleSections", () => {
  const resolveClub = (slug: string) =>
    slug === "bir-football"
      ? {
          documentId: "club-bir-football",
          title: { _type: "localizedString" as const, en: "BIR Football", th: "ฟุตบอล BIR" },
          tagline: { _type: "localizedText" as const, en: "Play together.", th: "เล่นด้วยกัน" },
        }
      : null;

  it("merges matching notice sections into one bilingual notice, keyed by position", () => {
    const en = parse(
      '<Notice variant="warning" title="Careful">\nEN body\n</Notice>\n',
      "en.mdx"
    ).sections;
    const th = parse(
      '<Notice variant="warning" title="ระวัง">\nTH body\n</Notice>\n',
      "th.mdx"
    ).sections;
    const { sections, notes } = mergeLocaleSections(en, th, {
      sourcePathEn: "en.mdx",
      sourcePathTh: "th.mdx",
      resolveClub,
    });
    expect(notes).toHaveLength(0);
    const notice = sections[0] as NoticeSection;
    expect(notice._type).toBe("notice");
    expect(notice.title).toEqual({ _type: "localizedString", en: "Careful", th: "ระวัง" });
    expect(notice.body).toEqual({ _type: "localizedText", en: "EN body", th: "TH body" });
  });

  it("throws LocalePairMismatchError when the two locales' notice variants disagree", () => {
    const en = parse('<Notice variant="warning">\nEN\n</Notice>\n', "en.mdx").sections;
    const th = parse('<Notice variant="info">\nTH\n</Notice>\n', "th.mdx").sections;
    expect(() =>
      mergeLocaleSections(en, th, { sourcePathEn: "en.mdx", sourcePathTh: "th.mdx", resolveClub })
    ).toThrow(LocalePairMismatchError);
  });

  it("throws LocalePairMismatchError when the section counts differ", () => {
    const en = parse("Only prose.\n", "en.mdx").sections;
    const th = parse("Prose.\n\n<Notice>\nExtra\n</Notice>\n", "th.mdx").sections;
    expect(() =>
      mergeLocaleSections(en, th, { sourcePathEn: "en.mdx", sourcePathTh: "th.mdx", resolveClub })
    ).toThrow(LocalePairMismatchError);
  });

  it("keeps English rich-text content in `content` and notes the Thai twin in the _i18nGapPortableText sidecar", () => {
    const en = parse("English prose.\n", "en.mdx").sections;
    const th = parse("Thai prose.\n", "th.mdx").sections;
    const { sections, notes } = mergeLocaleSections(en, th, {
      sourcePathEn: "en.mdx",
      sourcePathTh: "th.mdx",
      resolveClub,
    });
    const rich = sections[0] as RichTextSection;
    expect(rich.content[0]).toMatchObject({ children: [{ text: "English prose." }] });
    expect(rich._i18nGapPortableText?.[0]).toMatchObject({ children: [{ text: "Thai prose." }] });
    expect(notes.some((n) => n.includes("_i18nGapPortableText"))).toBe(true);
  });

  it("merges accordion items pairwise and resolves RelatedClubs slugs to a club reference", () => {
    const en = parse(
      '<Accordion summary="Q">\nA\n</Accordion>\n\n<RelatedClubs slugs="bir-football" />\n',
      "en.mdx"
    ).sections;
    const th = parse(
      '<Accordion summary="ถาม">\nตอบ\n</Accordion>\n\n<RelatedClubs slugs="bir-football" />\n',
      "th.mdx"
    ).sections;
    const { sections } = mergeLocaleSections(en, th, {
      sourcePathEn: "en.mdx",
      sourcePathTh: "th.mdx",
      resolveClub,
    });
    const accordion = sections[0] as AccordionSection;
    expect(accordion.items[0]?.question).toEqual({ _type: "localizedString", en: "Q", th: "ถาม" });
    const related = sections[1] as RelatedLinksSection;
    expect(related.items[0]?.internalRef).toEqual({
      _type: "reference",
      _ref: "club-bir-football",
    });
    expect(related.items[0]?.title.en).toBe("BIR Football");
  });

  it("fails loudly by slug when RelatedClubs references a club that did not resolve", () => {
    const en = parse('<RelatedClubs slugs="no-such-club" />\n', "en.mdx").sections;
    const th = parse('<RelatedClubs slugs="no-such-club" />\n', "th.mdx").sections;
    expect(() =>
      mergeLocaleSections(en, th, { sourcePathEn: "en.mdx", sourcePathTh: "th.mdx", resolveClub })
    ).toThrow(/no-such-club/);
  });
});
