/**
 * MDX to Portable Text serializer (REDESIGN-2.0 §4.6, §6.10, §11.4).
 *
 * Turns one locale's raw MDX body (the string `gray-matter` leaves after it
 * strips frontmatter — see `lib/content.ts`'s `parseEntry`) into the section
 * array shape `sanity/schemaTypes/objects/sectionTypes.ts`'s `sectionsField`
 * expects, so `scripts/migrate-mdx.mjs` can write it straight into an
 * NDJSON document. This module is pure: no filesystem access, no network,
 * nothing but functions of their arguments, so `tests/unit/migration-portable-text.test.ts`
 * can exercise it directly against fixture strings instead of the real
 * corpus, and so the same logic runs unchanged in the migrate and verify
 * scripts.
 *
 * TWO PHASES, BECAUSE BIRSA'S SECTIONS ARE BILINGUAL BUT EACH SOURCE FILE
 * IS NOT. A single 1.0 content item is two MDX files (`content/news/en/x.mdx`
 * and `content/news/th/x.mdx`); the 2.0 document that replaces them is ONE
 * Sanity document whose `notice`/`accordion`/`related-links` sections carry
 * both languages via `localizedString`/`localizedText`
 * (`docs/CMS-SCHEMA-CONVENTIONS.md` #3). Neither source file has both
 * languages, so no single-file pass can produce final bilingual sections.
 * The split follows from that:
 *
 *   Phase 1, `parseMdxBody`: parses ONE locale's MDX into `ParsedSection[]`,
 *   a locale-tagged intermediate shape (plain strings, not yet `{en, th}`
 *   objects). Called once per locale file.
 *
 *   Phase 2, `mergeLocaleSections`: takes the EN and TH `ParsedSection[]`
 *   for the same content item and zips them position by position into the
 *   final bilingual `Section[]`, resolving `RelatedClubs` slugs to real
 *   document references on the way. Throws `LocalePairMismatchError` (named,
 *   not guessed past) if the two locales' section sequences do not line up
 *   structurally — different section count, different section kind, or a
 *   `notice` whose EN and TH variant disagree — because guessing which of
 *   two conflicting structures is "right" is a content decision, and this
 *   migration does not make those (`docs/migration/mdx.md` "What this
 *   migration does not do").
 *
 * THE ONE FIELD THIS SCHEMA CANNOT ACTUALLY HOLD BILINGUALLY: `rich-text`
 * and `inset-text` sections carry their prose in `content`, typed
 * `portableText`/`portableTextInline` in `sanity/schemaTypes/objects/portableText.ts`.
 * That type is a bare Portable Text array — it has no `{en, th}` wrapper,
 * unlike literally every other text-bearing field in this schema. There is
 * no way, using the schema as it stands, to store both languages' prose in
 * one document's `rich-text` section. This is the single most consequential
 * finding of this migration; `docs/migration/mdx.md` states it again in
 * plain language and `mergeLocaleSections` works around it the only way
 * that neither invents content nor silently drops a language: `content`
 * carries the English blocks (the schema's canonical, Studio-editable
 * field), and the Thai blocks for the same section go into a sibling
 * property, `_i18nGapPortableText`, that the schema does not declare and
 * the Studio therefore will not render or let an officer edit — it exists
 * only so the Thai prose survives the NDJSON round trip for whoever adds
 * real bilingual rich text support. Every section this happens to is noted
 * in the diff report by document id and section index; nothing is silent.
 *
 * WHAT COUNTS AS "RECOGNISED": every MDX/Markdown construct this module
 * turns into Portable Text is listed in the big switch statements below,
 * each with a comment saying which corpus file first needed it. Anything
 * else — a heading level the palette does not carry (h1, h4, h5, h6), a
 * thematic break (the palette has no divider block), a JSX component this
 * file does not name, an MDX expression container more complex than the
 * literal `{" "}` idiom used for space-preservation across a line wrap —
 * throws `UnsupportedMdxConstructError` naming the exact construct and
 * (where available) its line, rather than dropping it or guessing at an
 * approximation. `docs/migration/mdx.md` explains why: "a serializer that
 * silently drops a `<ReportHarassment />` is worse than one that refuses to
 * run."
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import type { Root as MdastRoot, RootContent as MdastNode } from "mdast";

import { arrayKey } from "@/lib/migration/ids";
import { resolveRedirect, resolveRedirectChain, routeFamilies2_0 } from "@/lib/redirects";

// ---------------------------------------------------------------------------
// Output shapes. These mirror (do not import — an NDJSON document is plain
// data, not a Sanity runtime schema instance) the object shapes defined in
// sanity/schemaTypes/objects/{localizedString,localizedText,portableText}.ts
// and sanity/schemaTypes/objects/sectionTypes.ts.
// ---------------------------------------------------------------------------

export type LocalizedString = { _type: "localizedString"; en: string; th: string };
export type LocalizedText = { _type: "localizedText"; en: string; th: string };

export type PortableTextSpan = { _type: "span"; _key: string; text: string; marks: string[] };
export type PortableTextMarkDef = { _type: "link"; _key: string; href: string };
export type PortableTextTextBlock = {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  children: PortableTextSpan[];
  markDefs: PortableTextMarkDef[];
};
export type PortableTextTableRow = { _type: "row"; _key: string; cells: string[] };
export type PortableTextTable = { _type: "table"; _key: string; rows: PortableTextTableRow[] };
export type PortableTextNode = PortableTextTextBlock | PortableTextTable;

export type RichTextSection = {
  _type: "rich-text";
  _key: string;
  content: PortableTextNode[];
  /**
   * The Thai twin of `content`, for the section types whose schema field
   * has no locale wrapper. See this file's header. Present only when the
   * corresponding TH source actually had a rich-text section at this
   * position; absent (not an empty array) otherwise, so its presence alone
   * signals "this section hit the gap".
   */
  _i18nGapPortableText?: PortableTextNode[];
};
export type NoticeSection = {
  _type: "notice";
  _key: string;
  variant: "info" | "success" | "warning" | "error";
  title?: LocalizedString;
  body: LocalizedText;
};
export type AccordionItem = {
  _type: "accordionItem";
  _key: string;
  question: LocalizedString;
  answer: LocalizedText;
};
export type AccordionSection = { _type: "accordion"; _key: string; items: AccordionItem[] };
export type RelatedLinkItem = {
  _type: "relatedLinkItem";
  _key: string;
  title: LocalizedString;
  description?: LocalizedText;
  linkType: "internal";
  internalRef: { _type: "reference"; _ref: string };
};
export type RelatedLinksSection = {
  _type: "related-links";
  _key: string;
  items: RelatedLinkItem[];
};

export type Section = RichTextSection | NoticeSection | AccordionSection | RelatedLinksSection;

// ---------------------------------------------------------------------------
// Errors. Both name the exact construct, per this file's header: a caller
// (scripts/migrate-mdx.mjs) catches these per source file and turns them
// into a `not-migrated` diff-report entry rather than letting one bad file
// abort the whole corpus.
// ---------------------------------------------------------------------------

export class UnsupportedMdxConstructError extends Error {
  readonly construct: string;
  constructor(construct: string, detail: string) {
    super(`Unsupported MDX construct "${construct}": ${detail}`);
    this.name = "UnsupportedMdxConstructError";
    this.construct = construct;
  }
}

export class LocalePairMismatchError extends Error {
  constructor(detail: string) {
    super(`Locale pair mismatch: ${detail}`);
    this.name = "LocalePairMismatchError";
  }
}

// ---------------------------------------------------------------------------
// Link resolution. Internal hrefs get resolved through the frozen
// `lib/redirects.ts` contract so a 1.0-shaped link (`/news/foo`, some
// carrying a locale prefix, some not — both forms occur in the corpus)
// becomes its 2.0 target; a link with no rule and no match against the 2.0
// route families is reported as unresolved rather than passed through
// silently changed OR silently broken.
// ---------------------------------------------------------------------------

export type LinkResolution =
  | { kind: "external"; resolved: string }
  | { kind: "internal"; resolved: string; changed: boolean }
  | { kind: "unresolved"; original: string };

export type LinkResolver = (href: string) => LinkResolution;

/**
 * The resolver `scripts/migrate-mdx.mjs` actually uses. Exported (rather
 * than baked unexported into the parse functions) so tests can call it
 * directly against real `lib/redirects.ts` rules without going through a
 * full MDX parse, and so a caller can inject a fixture resolver instead when
 * testing the serializer's own tree-walking logic in isolation.
 */
export function defaultLinkResolver(href: string): LinkResolution {
  if (/^(https?:|mailto:)/i.test(href)) {
    return { kind: "external", resolved: href };
  }
  if (!href.startsWith("/") || href.startsWith("//")) {
    // A relative path or protocol-relative URL. None occur in the corpus
    // (verified by corpus enumeration during Wave 6A); treated as opaque
    // external so an unforeseen one is passed through rather than crashing
    // the whole migration on something that isn't actually a route.
    return { kind: "external", resolved: href };
  }
  const localeMatch = /^\/(en|th)(\/.*|)$/.exec(href);
  const locale = localeMatch ? localeMatch[1] : null;
  const pathNoLocale = localeMatch ? localeMatch[2] || "/" : href;

  if (pathNoLocale === "/") {
    return { kind: "internal", resolved: href, changed: false };
  }

  const mapped = resolveRedirectChain(pathNoLocale);
  const hasRule = resolveRedirect(pathNoLocale) !== null;
  const finalPathNoLocale = mapped ?? pathNoLocale;
  const isKnown2_0Route = routeFamilies2_0.some(
    (family) => finalPathNoLocale === family || finalPathNoLocale.startsWith(`${family}/`)
  );

  if (!hasRule && !isKnown2_0Route) {
    return { kind: "unresolved", original: href };
  }

  const resolved = locale ? `/${locale}${finalPathNoLocale}` : finalPathNoLocale;
  return { kind: "internal", resolved, changed: resolved !== href };
}

// ---------------------------------------------------------------------------
// Phase 1: single-locale parse.
// ---------------------------------------------------------------------------

export type ParsedRichText = { kind: "rich-text"; blocks: PortableTextNode[] };
export type ParsedNotice = {
  kind: "notice";
  variant: "info" | "success" | "warning" | "error";
  title: string | null;
  body: string;
};
export type ParsedAccordionItem = { question: string; answer: string };
export type ParsedAccordion = { kind: "accordion"; items: ParsedAccordionItem[] };
export type ParsedRelatedLinks = { kind: "related-links"; slugs: string[] };
export type ParsedSection = ParsedRichText | ParsedNotice | ParsedAccordion | ParsedRelatedLinks;

/** Findings gathered while parsing that are not fatal but must reach the report (e.g. an unresolved link). */
export type ParseNote = string;

export type ParseResult = { sections: ParsedSection[]; notes: ParseNote[] };

const NOTICE_VARIANTS = new Set(["info", "success", "warning", "error"]);

const NO_PORTABLE_TEXT_EQUIVALENT = new Set([
  "GoogleForm",
  "ShuttleTimer",
  "ShuttleRoute",
  "ShuttleTimetable",
  "ShuttleServiceNotice",
  "NearbyFood",
  "NearbyHousing",
  "ReportHarassment",
  "CommitteeRoster",
]);

function nodeLine(node: MdastNode): string {
  const line = node.position?.start.line;
  return line ? `line ${line}` : "unknown line";
}

function jsxAttrString(
  node: { attributes?: Array<{ type: string; name?: string; value?: unknown }> },
  name: string
): string | null {
  const attr = (node.attributes ?? []).find((a) => a.type === "mdxJsxAttribute" && a.name === name);
  if (!attr) return null;
  return typeof attr.value === "string" ? attr.value : null;
}

/** The literal-string subset of MDX expression containers this corpus actually uses, e.g. `{" "}` for a preserved space across a line wrap (first needed by `polsci-orientation-2026.mdx`). */
function literalExpressionValue(raw: string): string | null {
  const match = /^(['"])((?:(?!\1).)*)\1$/.exec(raw.trim());
  return match ? (match[2] ?? "") : null;
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ");
}

function sameMarks(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((mark, i) => mark === b[i]);
}

// --- Inline content: two consumers need it in different shapes. Rich text
// blocks need Portable Text spans + markDefs (marks preserved); plain-text
// destinations (a table cell, a Notice/Accordion body, both `localizedText`/
// plain string fields with no mark structure at all) need a flat string
// with link hrefs folded in as visible "text (href)" text, per this file's
// documented table-cell decision, applied identically everywhere marks
// cannot be represented (`sanity/schemaTypes/objects/portableText.ts`'s own
// comment: "a plain text table, no formatting inside a cell").

type InlineResolveContext = { sourcePath: string; linkResolver: LinkResolver; notes: ParseNote[] };

function resolveHrefOrNote(href: string, ctx: InlineResolveContext): string {
  const resolution = ctx.linkResolver(href);
  if (resolution.kind === "unresolved") {
    ctx.notes.push(
      `${ctx.sourcePath}: internal link "${href}" does not resolve to a 1.0->2.0 redirect rule or a known ` +
        "2.0 route family. Left unrewritten; this is a reported failure, not a silent rewrite."
    );
    return resolution.original;
  }
  return resolution.resolved;
}

function inlineToSpans(
  nodes: MdastNode[],
  ctx: InlineResolveContext,
  activeMarks: string[] = []
): { spans: PortableTextSpan[]; markDefs: PortableTextMarkDef[] } {
  const spans: PortableTextSpan[] = [];
  const markDefs: PortableTextMarkDef[] = [];
  let spanIndex = 0;

  const push = (text: string, marks: string[]) => {
    if (text === "") return;
    // Two sibling sources of whitespace can collide at the exact same point
    // in the corpus: the `{" "}` idiom used to hold a space across a line
    // wrap (`polsci-orientation-2026.mdx`), immediately followed by the
    // soft line break that produced the wrap being normalised to its own
    // space (`normalizeWhitespace` above). Emitting both would put a real,
    // visible double space in rendered prose; collapse a whitespace-only
    // push into the end of an already-whitespace-ending previous span
    // instead of appending a redundant second one.
    const previous = spans[spans.length - 1];
    if (text === " " && previous && /\s$/.test(previous.text) && sameMarks(previous.marks, marks)) {
      return;
    }
    spans.push({ _type: "span", _key: arrayKey("span", String(spanIndex++)), text, marks });
  };

  for (const node of nodes) {
    switch (node.type) {
      case "text":
        push(normalizeWhitespace(node.value), activeMarks);
        break;
      case "strong": {
        const inner = inlineToSpans(node.children, ctx, [...activeMarks, "strong"]);
        spans.push(
          ...inner.spans.map((s) => ({ ...s, _key: arrayKey("span", String(spanIndex++)) }))
        );
        markDefs.push(...inner.markDefs);
        break;
      }
      case "emphasis": {
        const inner = inlineToSpans(node.children, ctx, [...activeMarks, "em"]);
        spans.push(
          ...inner.spans.map((s) => ({ ...s, _key: arrayKey("span", String(spanIndex++)) }))
        );
        markDefs.push(...inner.markDefs);
        break;
      }
      case "inlineCode":
        push(node.value, [...activeMarks, "code"]);
        break;
      case "link": {
        const resolved = resolveHrefOrNote(node.url, ctx);
        const markKey = arrayKey("mark", String(markDefs.length));
        markDefs.push({ _type: "link", _key: markKey, href: resolved });
        const inner = inlineToSpans(node.children, ctx, [...activeMarks, markKey]);
        spans.push(
          ...inner.spans.map((s) => ({ ...s, _key: arrayKey("span", String(spanIndex++)) }))
        );
        markDefs.push(...inner.markDefs);
        break;
      }
      case "mdxTextExpression": {
        const literal = literalExpressionValue(node.value);
        if (literal === null) {
          throw new UnsupportedMdxConstructError(
            "mdxTextExpression",
            `${ctx.sourcePath} (${nodeLine(node)}): only a literal string expression like {" "} is ` +
              `recognised; found {${node.value}}.`
          );
        }
        push(normalizeWhitespace(literal), activeMarks);
        break;
      }
      case "mdxJsxTextElement": {
        const name = node.name ?? "";
        if (name === "Email") {
          const address = jsxAttrString(node, "address");
          if (!address) {
            throw new UnsupportedMdxConstructError(
              "Email",
              `${ctx.sourcePath} (${nodeLine(node)}): missing required "address" attribute.`
            );
          }
          const subject = jsxAttrString(node, "subject");
          const label = jsxAttrString(node, "label") ?? address;
          const href = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
          const markKey = arrayKey("mark", String(markDefs.length));
          markDefs.push({ _type: "link", _key: markKey, href });
          push(label, [...activeMarks, markKey]);
          break;
        }
        if (name === "a") {
          const href = jsxAttrString(node, "href");
          if (!href) {
            throw new UnsupportedMdxConstructError(
              "a",
              `${ctx.sourcePath} (${nodeLine(node)}): raw <a> element with no href attribute.`
            );
          }
          const resolved = resolveHrefOrNote(href, ctx);
          const markKey = arrayKey("mark", String(markDefs.length));
          markDefs.push({ _type: "link", _key: markKey, href: resolved });
          const inner = inlineToSpans(node.children, ctx, [...activeMarks, markKey]);
          spans.push(
            ...inner.spans.map((s) => ({ ...s, _key: arrayKey("span", String(spanIndex++)) }))
          );
          markDefs.push(...inner.markDefs);
          break;
        }
        if (name === "strong") {
          const inner = inlineToSpans(node.children, ctx, [...activeMarks, "strong"]);
          spans.push(
            ...inner.spans.map((s) => ({ ...s, _key: arrayKey("span", String(spanIndex++)) }))
          );
          markDefs.push(...inner.markDefs);
          break;
        }
        throw new UnsupportedMdxConstructError(
          name || "(anonymous jsx)",
          `${ctx.sourcePath} (${nodeLine(node)}): unrecognised inline JSX/HTML element. Add explicit ` +
            "handling in lib/migration/portableText.ts's inlineToSpans before migrating content that uses it."
        );
      }
      default:
        throw new UnsupportedMdxConstructError(
          node.type,
          `${ctx.sourcePath} (${nodeLine(node)}): unrecognised inline markdown node type.`
        );
    }
  }
  return { spans, markDefs };
}

function inlineToPlainText(nodes: MdastNode[], ctx: InlineResolveContext): string {
  const parts: string[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case "text":
        parts.push(normalizeWhitespace(node.value));
        break;
      case "strong":
      case "emphasis":
        parts.push(inlineToPlainText(node.children, ctx));
        break;
      case "inlineCode":
        parts.push(node.value);
        break;
      case "link": {
        const resolved = resolveHrefOrNote(node.url, ctx);
        const text = inlineToPlainText(node.children, ctx);
        parts.push(text === resolved ? text : `${text} (${resolved})`);
        break;
      }
      case "mdxTextExpression": {
        const literal = literalExpressionValue(node.value);
        if (literal === null) {
          throw new UnsupportedMdxConstructError(
            "mdxTextExpression",
            `${ctx.sourcePath} (${nodeLine(node)}): only a literal string expression like {" "} is ` +
              `recognised; found {${node.value}}.`
          );
        }
        parts.push(normalizeWhitespace(literal));
        break;
      }
      case "mdxJsxTextElement": {
        const name = node.name ?? "";
        if (name === "Email") {
          const address = jsxAttrString(node, "address");
          if (!address) {
            throw new UnsupportedMdxConstructError(
              "Email",
              `${ctx.sourcePath} (${nodeLine(node)}): missing required "address" attribute.`
            );
          }
          const label = jsxAttrString(node, "label") ?? address;
          parts.push(`${label} (mailto:${address})`);
          break;
        }
        if (name === "a") {
          const href = jsxAttrString(node, "href");
          if (!href) {
            throw new UnsupportedMdxConstructError(
              "a",
              `${ctx.sourcePath} (${nodeLine(node)}): raw <a> element with no href attribute.`
            );
          }
          const resolved = resolveHrefOrNote(href, ctx);
          const text = inlineToPlainText(node.children, ctx);
          parts.push(text === resolved ? text : `${text} (${resolved})`);
          break;
        }
        if (name === "strong") {
          parts.push(inlineToPlainText(node.children, ctx));
          break;
        }
        throw new UnsupportedMdxConstructError(
          name || "(anonymous jsx)",
          `${ctx.sourcePath} (${nodeLine(node)}): unrecognised inline JSX/HTML element in a plain text field.`
        );
      }
      default:
        throw new UnsupportedMdxConstructError(
          node.type,
          `${ctx.sourcePath} (${nodeLine(node)}): unrecognised inline markdown node type in a plain text field.`
        );
    }
  }
  return parts.join("").trim();
}

/** Joins a run of paragraph-like block nodes into one plain-text value, paragraph breaks preserved as a blank line, for `localizedText` fields (Notice/Accordion bodies) that carry no block structure of their own. */
function paragraphsToPlainText(nodes: MdastNode[], ctx: InlineResolveContext): string {
  const paragraphs: string[] = [];
  for (const node of nodes) {
    if (node.type !== "paragraph") {
      throw new UnsupportedMdxConstructError(
        node.type,
        `${ctx.sourcePath} (${nodeLine(node)}): only plain paragraphs are supported inside this element's ` +
          "body (it fills a localizedText field, which carries no block structure of its own)."
      );
    }
    paragraphs.push(inlineToPlainText(node.children, ctx));
  }
  return paragraphs.join("\n\n");
}

// --- Table extraction: two source shapes reach the same {rows: [{cells}]}
// shape. remark-gfm's pipe-table syntax produces `table`/`tableRow`/
// `tableCell` mdast nodes; some corpus files (student-life health/culture
// pages) instead author an accessible raw HTML table (`<table><thead>...`)
// for `scope="row"` header cells GFM tables cannot express, which MDX
// parses as nested `mdxJsxFlowElement`s of the same tag names. Both paths
// are flattened to plain-text cells: `sanity/schemaTypes/objects/portableText.ts`
// documents its `table` object as "a plain text table, no formatting inside
// a cell", so a `<th scope="row">` header cell and a `<td>` data cell both
// become an ordinary string cell, and the header/data and row/col scope
// distinction that made the original HTML table accessible does not survive
// into Portable Text. `docs/migration/mdx.md` names this loss explicitly.

function gfmTableToPortableText(
  node: Extract<MdastNode, { type: "table" }>,
  blockIndex: number,
  ctx: InlineResolveContext
): PortableTextTable {
  const rows: PortableTextTableRow[] = node.children.map((row, rowIndex) => ({
    _type: "row",
    _key: arrayKey("blk", String(blockIndex), "row", String(rowIndex)),
    cells: row.children.map((cell) => inlineToPlainText(cell.children, ctx)),
  }));
  return { _type: "table", _key: arrayKey("blk", String(blockIndex)), rows };
}

/**
 * `mdast`'s own `MdxJsxFlowElement` type (brought into the `mdast` module's
 * `RootContentMap` by `mdast-util-mdx-jsx`'s ambient module augmentation,
 * active here because `remark-mdx` pulls that package in), rather than a
 * hand-rolled shape: its `children` type is `Array<BlockContent |
 * DefinitionContent>`, not a bare `MdastNode[]`, and a hand-rolled
 * re-declaration was not structurally assignable to it.
 */
type JsxFlowNode = Extract<MdastNode, { type: "mdxJsxFlowElement" }>;

function htmlTableToPortableText(
  node: JsxFlowNode,
  blockIndex: number,
  ctx: InlineResolveContext
): { table: PortableTextTable; droppedCaption: string | null } {
  let droppedCaption: string | null = null;
  const rows: PortableTextTableRow[] = [];

  function collectRowsFrom(children: MdastNode[]) {
    for (const child of children) {
      if (child.type !== "mdxJsxFlowElement") {
        // remark-mdx wraps a <table>'s direct text-level children (in
        // practice, always a lone <caption>) in an implicit paragraph, so
        // <caption> itself surfaces as an inline `mdxJsxTextElement`, not a
        // flow element, even though it reads like a block-level tag.
        if (child.type === "paragraph") {
          collectRowsFrom(child.children);
          continue;
        }
        if (child.type === "mdxJsxTextElement" && child.name === "caption") {
          droppedCaption = inlineToPlainText(child.children, ctx);
          continue;
        }
        if (child.type === "text" && child.value.trim() === "") continue;
        throw new UnsupportedMdxConstructError(
          child.type,
          `${ctx.sourcePath} (${nodeLine(child)}): unrecognised element inside a raw HTML <table>.`
        );
      }
      if (child.name === "caption") {
        droppedCaption = inlineToPlainText(child.children as MdastNode[], ctx);
        continue;
      }
      if (child.name === "thead" || child.name === "tbody") {
        collectRowsFrom(child.children as MdastNode[]);
        continue;
      }
      if (child.name === "tr") {
        // A <tr>'s cells are themselves inline JSX (<th>/<td>) wrapped in an
        // implicit paragraph by the MDX parser (verified against remark-mdx's
        // own AST during Wave 6A corpus analysis).
        const cellNodes: MdastNode[] = [];
        for (const c of child.children) {
          if (c.type === "paragraph") cellNodes.push(...c.children);
          else cellNodes.push(c);
        }
        const cells: string[] = [];
        for (const cellNode of cellNodes) {
          if (
            cellNode.type === "mdxJsxTextElement" &&
            (cellNode.name === "th" || cellNode.name === "td")
          ) {
            cells.push(inlineToPlainText(cellNode.children, ctx));
          } else if (cellNode.type === "text" && cellNode.value.trim() === "") {
            // Whitespace between sibling <th>/<td> tags in the source; not a cell.
            continue;
          } else {
            throw new UnsupportedMdxConstructError(
              cellNode.type,
              `${ctx.sourcePath} (${nodeLine(cellNode)}): expected a <th> or <td> inside a raw HTML <tr>.`
            );
          }
        }
        rows.push({
          _type: "row",
          _key: arrayKey("blk", String(blockIndex), "row", String(rows.length)),
          cells,
        });
        continue;
      }
      throw new UnsupportedMdxConstructError(
        child.name ?? "(anonymous jsx)",
        `${ctx.sourcePath} (${nodeLine(child)}): unrecognised element inside a raw HTML <table>.`
      );
    }
  }

  collectRowsFrom(node.children as MdastNode[]);
  return {
    table: { _type: "table", _key: arrayKey("blk", String(blockIndex)), rows },
    droppedCaption,
  };
}

// --- List flattening: Portable Text represents nested lists as a flat
// sequence of blocks each carrying `listItem` + `level`, not as a recursive
// tree, so a markdown `list`/`listItem` tree (arbitrarily nested — the
// corpus goes two levels deep, e.g. `content/student-life/*/home/*.mdx`'s
// transit option lists) is walked and flattened here.

function listToBlocks(
  node: Extract<MdastNode, { type: "list" }>,
  level: number,
  blockIndexRef: { current: number },
  ctx: InlineResolveContext
): PortableTextTextBlock[] {
  const listItem = node.ordered ? "number" : "bullet";
  const blocks: PortableTextTextBlock[] = [];
  for (const item of node.children) {
    for (const child of item.children) {
      if (child.type === "paragraph") {
        const { spans, markDefs } = inlineToSpans(child.children, ctx);
        blocks.push({
          _type: "block",
          _key: arrayKey("blk", String(blockIndexRef.current++)),
          style: "normal",
          listItem,
          level,
          children: spans,
          markDefs,
        });
      } else if (child.type === "list") {
        blocks.push(...listToBlocks(child, level + 1, blockIndexRef, ctx));
      } else {
        throw new UnsupportedMdxConstructError(
          child.type,
          `${ctx.sourcePath} (${nodeLine(child)}): a list item may only contain a paragraph or a nested list.`
        );
      }
    }
  }
  return blocks;
}

/** Bucketed "plain prose" mdast node types: everything that folds into one `rich-text` section's `content` array between JSX-component boundaries. */
const PROSE_NODE_TYPES = new Set(["heading", "paragraph", "list", "blockquote", "table"]);

function flushRichText(nodes: MdastNode[], ctx: InlineResolveContext): ParsedRichText {
  const blocks: PortableTextNode[] = [];
  const blockIndexRef = { current: 0 };

  for (const node of nodes) {
    switch (node.type) {
      case "heading": {
        if (node.depth !== 2 && node.depth !== 3) {
          throw new UnsupportedMdxConstructError(
            `h${node.depth}`,
            `${ctx.sourcePath} (${nodeLine(node)}): the section palette's rich-text block only carries ` +
              "h2/h3 (sanity/schemaTypes/objects/portableText.ts's allowedBlocks); h1 is reserved for the " +
              "page title and h4-h6 have no style option at all."
          );
        }
        const { spans, markDefs } = inlineToSpans(node.children, ctx);
        blocks.push({
          _type: "block",
          _key: arrayKey("blk", String(blockIndexRef.current++)),
          style: node.depth === 2 ? "h2" : "h3",
          children: spans,
          markDefs,
        });
        break;
      }
      case "paragraph": {
        const { spans, markDefs } = inlineToSpans(node.children, ctx);
        blocks.push({
          _type: "block",
          _key: arrayKey("blk", String(blockIndexRef.current++)),
          style: "normal",
          children: spans,
          markDefs,
        });
        break;
      }
      case "blockquote": {
        for (const child of node.children) {
          if (child.type !== "paragraph") {
            throw new UnsupportedMdxConstructError(
              child.type,
              `${ctx.sourcePath} (${nodeLine(child)}): a blockquote may only contain plain paragraphs.`
            );
          }
          const { spans, markDefs } = inlineToSpans(child.children, ctx);
          blocks.push({
            _type: "block",
            _key: arrayKey("blk", String(blockIndexRef.current++)),
            style: "blockquote",
            children: spans,
            markDefs,
          });
        }
        break;
      }
      case "list": {
        const key = blockIndexRef.current++;
        void key; // list items claim their own indices below; this reserves none.
        blocks.push(...listToBlocks(node, 1, blockIndexRef, ctx));
        break;
      }
      case "table": {
        blocks.push(gfmTableToPortableText(node, blockIndexRef.current++, ctx));
        break;
      }
      case "mdxJsxFlowElement": {
        if (node.name === "table") {
          const { table, droppedCaption } = htmlTableToPortableText(
            node,
            blockIndexRef.current++,
            ctx
          );
          if (droppedCaption) {
            ctx.notes.push(
              `${ctx.sourcePath} (${nodeLine(node)}): raw HTML <table> caption "${droppedCaption}" has no ` +
                "field on the table object schema (sanity/schemaTypes/objects/portableText.ts) and was dropped."
            );
          }
          blocks.push(table);
          break;
        }
        throw new UnsupportedMdxConstructError(
          node.name ?? "(anonymous jsx)",
          `${ctx.sourcePath} (${nodeLine(node)}): unrecognised inside a rich-text bucket.`
        );
      }
      default:
        throw new UnsupportedMdxConstructError(
          node.type,
          `${ctx.sourcePath} (${nodeLine(node)}): unrecognised top level markdown/MDX construct.`
        );
    }
  }
  return { kind: "rich-text", blocks };
}

/**
 * Parses one locale's MDX body (post-frontmatter) into locale-tagged
 * sections. Pure: takes the source string and a resolver, returns data.
 */
export function parseMdxBody(
  source: string,
  opts: { sourcePath: string; linkResolver: LinkResolver }
): ParseResult {
  const tree = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).parse(source) as MdastRoot;
  const notes: ParseNote[] = [];
  const ctx: InlineResolveContext = {
    sourcePath: opts.sourcePath,
    linkResolver: opts.linkResolver,
    notes,
  };

  const sections: ParsedSection[] = [];
  let proseRun: MdastNode[] = [];

  const flush = () => {
    if (proseRun.length === 0) return;
    sections.push(flushRichText(proseRun, ctx));
    proseRun = [];
  };

  for (const node of tree.children) {
    if (PROSE_NODE_TYPES.has(node.type)) {
      proseRun.push(node);
      continue;
    }
    if (node.type === "mdxJsxFlowElement" && node.name === "table") {
      // A raw-HTML table is prose too; it belongs in the same bucket as
      // markdown tables, not treated as a "JSX component boundary".
      proseRun.push(node);
      continue;
    }
    if (node.type === "thematicBreak") {
      throw new UnsupportedMdxConstructError(
        "thematicBreak",
        `${opts.sourcePath} (${nodeLine(node)}): the section palette's allowedBlocks ` +
          "(sanity/schemaTypes/objects/portableText.ts) has no divider/rule block type."
      );
    }
    if (node.type === "mdxJsxFlowElement") {
      const name = node.name ?? "";
      if (name === "Notice") {
        flush();
        const variant = jsxAttrString(node, "variant") ?? "info";
        if (!NOTICE_VARIANTS.has(variant)) {
          throw new UnsupportedMdxConstructError(
            `Notice variant="${variant}"`,
            `${opts.sourcePath} (${nodeLine(node)}): the notice section's variant field ` +
              "(sanity/schemaTypes/objects/sectionTypes.ts) only accepts info/success/warning/error. " +
              `1.0's Notice component additionally has a "placeholder" variant with no 2.0 equivalent.`
          );
        }
        const title = jsxAttrString(node, "title");
        const body = paragraphsToPlainText(node.children, ctx);
        sections.push({
          kind: "notice",
          variant: variant as ParsedNotice["variant"],
          title,
          body,
        });
        continue;
      }
      if (name === "Accordion") {
        flush();
        const summary = jsxAttrString(node, "summary");
        if (summary === null) {
          throw new UnsupportedMdxConstructError(
            "Accordion",
            `${opts.sourcePath} (${nodeLine(node)}): missing required "summary" attribute.`
          );
        }
        const answer = paragraphsToPlainText(node.children, ctx);
        const item: ParsedAccordionItem = { question: summary, answer };
        const last = sections[sections.length - 1];
        if (last && last.kind === "accordion") {
          last.items.push(item);
        } else {
          sections.push({ kind: "accordion", items: [item] });
        }
        continue;
      }
      if (name === "RelatedClubs") {
        flush();
        const slugsAttr = jsxAttrString(node, "slugs");
        if (!slugsAttr) {
          throw new UnsupportedMdxConstructError(
            "RelatedClubs",
            `${opts.sourcePath} (${nodeLine(node)}): missing required "slugs" attribute.`
          );
        }
        const slugs = slugsAttr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        sections.push({ kind: "related-links", slugs });
        continue;
      }
      if (NO_PORTABLE_TEXT_EQUIVALENT.has(name)) {
        throw new UnsupportedMdxConstructError(
          name,
          `${opts.sourcePath} (${nodeLine(node)}): renders app runtime behaviour (a form embed, live ` +
            "shuttle data, or static safety copy owned by the component itself) that no section in the " +
            "palette represents; there is no MDX-authored content on this element to migrate."
        );
      }
      throw new UnsupportedMdxConstructError(
        name || "(anonymous jsx)",
        `${opts.sourcePath} (${nodeLine(node)}): unrecognised JSX component. Add explicit handling in ` +
          "lib/migration/portableText.ts's parseMdxBody before migrating content that uses it."
      );
    }
    throw new UnsupportedMdxConstructError(
      node.type,
      `${opts.sourcePath} (${nodeLine(node)}): unrecognised top level markdown/MDX construct.`
    );
  }
  flush();
  return { sections, notes };
}

// ---------------------------------------------------------------------------
// Phase 2: merge an EN/TH ParsedSection[] pair into final bilingual
// Section[], resolving RelatedClubs slugs to real document references.
// ---------------------------------------------------------------------------

export type ClubResolution = { documentId: string; title: LocalizedString; tagline: LocalizedText };
export type ClubResolver = (slug: string) => ClubResolution | null;

function localizedStringOrOmit(
  en: string | null,
  th: string | null,
  ctx: string,
  notes: string[]
): LocalizedString | undefined {
  if (en && th) return { _type: "localizedString", en, th };
  if (!en && !th) return undefined;
  notes.push(
    `${ctx}: an optional title was present in only one locale (en=${JSON.stringify(en)}, th=${JSON.stringify(
      th
    )}). localizedString requires both languages, so it was dropped rather than published half-filled.`
  );
  return undefined;
}

export function mergeLocaleSections(
  en: ParsedSection[],
  th: ParsedSection[],
  opts: { sourcePathEn: string; sourcePathTh: string; resolveClub: ClubResolver }
): { sections: Section[]; notes: string[] } {
  if (en.length !== th.length) {
    throw new LocalePairMismatchError(
      `${opts.sourcePathEn} has ${en.length} top-level section(s) but ${opts.sourcePathTh} has ${th.length}. ` +
        "The two locale files must have the same section sequence for their content to merge into one " +
        "bilingual document; this migration does not guess which extra section is authoritative."
    );
  }

  const notes: string[] = [];
  const sections: Section[] = [];

  for (let i = 0; i < en.length; i++) {
    const a = en[i]!;
    const b = th[i]!;
    const secKey = arrayKey("sec", String(i));

    if (a.kind !== b.kind) {
      throw new LocalePairMismatchError(
        `${opts.sourcePathEn} and ${opts.sourcePathTh} disagree at section index ${i}: "${a.kind}" vs "${b.kind}".`
      );
    }

    switch (a.kind) {
      case "rich-text": {
        const bRich = b as ParsedRichText;
        const section: RichTextSection = { _type: "rich-text", _key: secKey, content: a.blocks };
        if (bRich.blocks.length > 0) {
          section._i18nGapPortableText = bRich.blocks;
          notes.push(
            `section ${i} (rich-text): Thai prose preserved in _i18nGapPortableText, not in the Studio-editable ` +
              "content field. See lib/migration/portableText.ts's file header: portableText/portableTextInline " +
              "have no locale wrapper in the current schema."
          );
        }
        sections.push(section);
        break;
      }
      case "notice": {
        const bNotice = b as ParsedNotice;
        if (a.variant !== bNotice.variant) {
          throw new LocalePairMismatchError(
            `section ${i} (notice): variant differs between locales (en="${a.variant}", th="${bNotice.variant}").`
          );
        }
        const title = localizedStringOrOmit(a.title, bNotice.title, `section ${i} (notice)`, notes);
        sections.push({
          _type: "notice",
          _key: secKey,
          variant: a.variant,
          ...(title ? { title } : {}),
          body: { _type: "localizedText", en: a.body, th: bNotice.body },
        });
        break;
      }
      case "accordion": {
        const bAccordion = b as ParsedAccordion;
        if (a.items.length !== bAccordion.items.length) {
          throw new LocalePairMismatchError(
            `section ${i} (accordion): en has ${a.items.length} item(s), th has ${bAccordion.items.length}.`
          );
        }
        const items: AccordionItem[] = a.items.map((item, itemIndex) => ({
          _type: "accordionItem",
          _key: arrayKey("sec", String(i), "item", String(itemIndex)),
          question: {
            _type: "localizedString",
            en: item.question,
            th: bAccordion.items[itemIndex]!.question,
          },
          answer: {
            _type: "localizedText",
            en: item.answer,
            th: bAccordion.items[itemIndex]!.answer,
          },
        }));
        sections.push({ _type: "accordion", _key: secKey, items });
        break;
      }
      case "related-links": {
        const bLinks = b as ParsedRelatedLinks;
        if (
          a.slugs.length !== bLinks.slugs.length ||
          a.slugs.some((slug, idx) => slug !== bLinks.slugs[idx])
        ) {
          throw new LocalePairMismatchError(
            `section ${i} (related-links): slug list differs between locales (en=[${a.slugs.join(
              ", "
            )}], th=[${bLinks.slugs.join(", ")}]).`
          );
        }
        const items: RelatedLinkItem[] = a.slugs.map((slug, itemIndex) => {
          const club = opts.resolveClub(slug);
          if (!club) {
            throw new UnsupportedMdxConstructError(
              "RelatedClubs",
              `section ${i}: slug "${slug}" (referenced from ${opts.sourcePathEn}) does not match any migrated club.`
            );
          }
          return {
            _type: "relatedLinkItem",
            _key: arrayKey("sec", String(i), "item", String(itemIndex)),
            title: club.title,
            description: club.tagline,
            linkType: "internal",
            internalRef: { _type: "reference", _ref: club.documentId },
          };
        });
        sections.push({ _type: "related-links", _key: secKey, items });
        break;
      }
    }
  }

  return { sections, notes };
}
