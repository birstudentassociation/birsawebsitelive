import Link from "next/link";

import ExternalLink from "@/components/bds/ExternalLink";
// `Table` (content cluster) does not exist in this checkout yet. This
// import is expected to fail typecheck until that cluster lands it; see
// this cluster's report. Nothing else about this file depends on it.
import Table from "@/components/bds/Table";
// `InsetText` (status cluster, split from `Notice.tsx`) does not exist in
// this checkout yet either. Same note as `Table` above.
import InsetText from "@/components/bds/InsetText";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import { allowedBlocks, allowedMarks } from "@/components/bds/sectionPalette";

/**
 * BIRSA Design System: `RichTextSection` (REDESIGN-2.0 §4.6, media cluster).
 *
 * Renders the `rich-text` entry of `components/bds/sectionPalette.ts`:
 * prose, headings two and three, bold, italic, links, lists and tables, and
 * NOTHING else. This is the section type §4.6 calls out by name for what it
 * deliberately cannot do: **there is no `h1` block.** `RichTextBlock`'s
 * `type` is built from `allowedBlocks`, imported from the frozen contract
 * rather than re-typed by hand, so "no h1" is a property of the contract
 * this file reads, not a rule this file could quietly drift from. A caller
 * that tries `{ type: "h1", ... }` fails to typecheck, which is exactly
 * `tests/unit/bds-sections.test.tsx`'s assertion for this file.
 *
 * WHY THIS SECTION RENDERS THROUGH `Table` (`sectionPalette.ts`'s
 * `component` field for `rich-text`). Reading that field as "the whole
 * section is one instance of `Table`" would be wrong: prose is not a table.
 * Read instead as "wherever this section needs the ONE thing `Table` is
 * chartered for" (`Table`'s own manifest usage rule: "tabular data only,
 * with a real `<th scope>`... must behave at 320px"), it is correct: every
 * OTHER section in the palette (`nav-list` through `NavList`, `notice`
 * through `Notice`, and so on) really is one instance of its named
 * component, and `rich-text` is the one section built from several
 * primitives at once (`Heading`, `Text`, native lists, `Link`/`ExternalLink`
 * for marks) that delegates its one structurally different block, the
 * table, to the component the manifest built for exactly that job. This
 * reading is this cluster's own judgement call, not confirmed by Wave 0;
 * see this cluster's report.
 *
 * NO RAW HTML, EVER. `blocks` is structured data, not a markdown or HTML
 * string: there is no field here or anywhere in this file an officer's
 * content could smuggle a `<script>` or a `style` attribute through, which
 * is exactly what `forbiddenSchemaFields` (`sectionPalette.ts`) exists to
 * keep true of every section in the palette.
 *
 * `newTabLabel` is `dict.a11y.newTab` (or its Thai equivalent): this
 * cluster owns no dictionary namespace, so every user-facing string a
 * section needs comes in as a plain prop, per this cluster's brief.
 */

/** The only marks a run of text may carry, taken from the frozen contract. `link` is its own inline kind below rather than a mark, because a link wraps children and carries an `href`. */
export type RichTextMark = Exclude<(typeof allowedMarks)[number], "link">;

export type RichTextInline =
  | { kind: "text"; text: string; marks?: RichTextMark[] }
  | {
      kind: "link";
      href: string;
      /** Off-site targets render through `ExternalLink` (new-tab notice, `rel="noopener noreferrer"`, §7). */
      external?: boolean;
      children: RichTextInline[];
    };

export type RichTextTextBlock = {
  /** Every block type but `table`. Deliberately excludes `h1`: see the file header. */
  type: Exclude<(typeof allowedBlocks)[number], "table" | "ul" | "ol">;
  children: RichTextInline[];
};

export type RichTextListBlock = {
  type: "ul" | "ol";
  items: RichTextInline[][];
};

export type RichTextTableBlock = {
  type: "table";
  caption: string;
  head: string[];
  rows: string[][];
};

export type RichTextBlock = RichTextTextBlock | RichTextListBlock | RichTextTableBlock;

export type RichTextSectionProps = {
  blocks: RichTextBlock[];
  /** `dict.a11y.newTab`. Only used when a link's `external` is true. */
  newTabLabel: string;
};

function renderMark(mark: RichTextMark, content: React.ReactNode): React.ReactNode {
  if (mark === "strong") return <strong>{content}</strong>;
  if (mark === "em") return <em>{content}</em>;
  return (
    <code className="rounded bg-sunken px-1 py-0.5 text-body-sm">{content}</code>
  );
}

function InlineRun({
  node,
  newTabLabel,
}: {
  node: RichTextInline;
  newTabLabel: string;
}): React.ReactElement {
  if (node.kind === "text") {
    let content: React.ReactNode = node.text;
    for (const mark of node.marks ?? []) {
      content = renderMark(mark, content);
    }
    return <>{content}</>;
  }

  const children = node.children.map((child, index) => (
    <InlineRun key={index} node={child} newTabLabel={newTabLabel} />
  ));
  const linkClassName =
    "text-brand-deep underline decoration-1 underline-offset-2 hover:decoration-2";

  if (node.external) {
    return (
      <ExternalLink href={node.href} newTabLabel={newTabLabel} className={linkClassName}>
        {children}
      </ExternalLink>
    );
  }
  return (
    <Link href={node.href} className={linkClassName}>
      {children}
    </Link>
  );
}

/** Exported so `InsetTextSection` can render the same inline vocabulary without a second copy of this logic. */
export function renderInline(nodes: RichTextInline[], newTabLabel: string): React.ReactNode {
  return nodes.map((node, index) => <InlineRun key={index} node={node} newTabLabel={newTabLabel} />);
}

function RichTextBlockNode({
  block,
  newTabLabel,
}: {
  block: RichTextBlock;
  newTabLabel: string;
}) {
  if (block.type === "table") {
    return <Table caption={block.caption} head={block.head} rows={block.rows} />;
  }

  if (block.type === "ul" || block.type === "ol") {
    const ListTag = block.type;
    return (
      <ListTag className={block.type === "ul" ? "list-disc pl-6" : "list-decimal pl-6"}>
        {block.items.map((item, index) => (
          <Text as="li" step="body" key={index}>
            {renderInline(item, newTabLabel)}
          </Text>
        ))}
      </ListTag>
    );
  }

  if (block.type === "blockquote") {
    return <InsetText>{renderInline(block.children, newTabLabel)}</InsetText>;
  }

  if (block.type === "h2") {
    return (
      <Heading level={2} step="heading-1">
        {renderInline(block.children, newTabLabel)}
      </Heading>
    );
  }

  if (block.type === "h3") {
    return (
      <Heading level={3} step="heading-2">
        {renderInline(block.children, newTabLabel)}
      </Heading>
    );
  }

  return (
    <Text as="p" step="body">
      {renderInline(block.children, newTabLabel)}
    </Text>
  );
}

/**
 * Renders a `rich-text` section: prose, headings two and three, bold,
 * italic, links, lists and tables. See the file header for what it
 * deliberately cannot render and why.
 */
export default function RichTextSection({ blocks, newTabLabel }: RichTextSectionProps) {
  return (
    <Stack gap="md">
      {blocks.map((block, index) => (
        <RichTextBlockNode key={index} block={block} newTabLabel={newTabLabel} />
      ))}
    </Stack>
  );
}
