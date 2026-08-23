import Link from "next/link";
import { Fragment } from "react";

import { Heading, Text, type HeadingLevel } from "@/components/bds/Type";
import Table from "@/components/bds/Table";

/**
 * A minimal renderer for `sanity/schemaTypes/objects/portableText.ts`'s block
 * shape (REDESIGN-2.0 §4.6, §10). Scoped to the `/about` route family and
 * kept local to `components/about/` rather than added to `components/bds/`,
 * because a general purpose Portable Text renderer for every content
 * template on the site is a bigger contract than this wave owns; this one
 * only has to cover what `minutes.publicSummary` and `decision.summary` can
 * actually contain (`portableText.ts`'s own field list: `normal`, `h2`, `h3`,
 * `blockquote`, `ul`, `ol`, a `table` object, and the `strong`/`em`/`code`
 * marks plus a `link` annotation).
 *
 * Every text size goes through `Text`/`Heading` from `components/bds/Type`,
 * never a raw Tailwind size utility (BUILD-BRIEF-2.0 §5, defect D7).
 *
 * `headingBaseLevel` lets a caller say what heading level a CMS `h2` block
 * should land on for THIS page (its own `<h2>`/`<h3>` section heading already
 * used the level above it), so heading order stays logical no matter where
 * this body is embedded. A CMS `h3` renders one level below whatever `h2`
 * resolves to.
 */

type PortableSpan = {
  _type?: "span";
  _key?: string;
  text?: string;
  marks?: string[];
};

type PortableLinkMarkDef = {
  _type?: "link";
  _key?: string;
  href?: string;
};

type PortableBlock = {
  _type?: "block";
  _key?: string;
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  children?: PortableSpan[];
  markDefs?: PortableLinkMarkDef[];
};

type PortableTableRow = {
  _key?: string;
  cells?: string[];
};

type PortableTable = {
  _type?: "table";
  _key?: string;
  rows?: PortableTableRow[];
};

export type PortableTextBlockLike = PortableBlock | PortableTable;

export type PortableTextBodyProps = {
  value: PortableTextBlockLike[] | null | undefined;
  /** Heading level a content `h2` block should render at. Content `h3` renders one level below. Defaults to 3, matching a body that sits under one `<h2>` section heading. */
  headingBaseLevel?: HeadingLevel;
  /** Accessible caption for any table blocks in `value`. Required if `value` might contain a table. */
  tableCaption?: string;
};

function isTableBlock(block: PortableTextBlockLike): block is PortableTable {
  return block._type === "table";
}

function renderSpans(spans: PortableSpan[], markDefs: PortableLinkMarkDef[]) {
  return spans.map((span, index) => {
    const text = span.text ?? "";
    const marks = span.marks ?? [];
    let node: React.ReactNode = text;

    const linkKey = marks.find((mark) => markDefs.some((def) => def._key === mark));
    const linkDef = linkKey ? markDefs.find((def) => def._key === linkKey) : undefined;

    if (marks.includes("code")) {
      node = <code>{node}</code>;
    }
    if (marks.includes("em")) {
      node = <em>{node}</em>;
    }
    if (marks.includes("strong")) {
      node = <strong>{node}</strong>;
    }
    if (linkDef?.href) {
      node = (
        <Link href={linkDef.href} className="text-brand-deep underline">
          {node}
        </Link>
      );
    }

    return <Fragment key={span._key ?? index}>{node}</Fragment>;
  });
}

function renderBlock(
  block: PortableBlock,
  key: React.Key,
  headingBaseLevel: HeadingLevel
): React.ReactNode {
  const content = renderSpans(block.children ?? [], block.markDefs ?? []);

  if (block.style === "blockquote") {
    return (
      <blockquote key={key} className="border-l-2 border-line pl-4">
        <Text step="body">{content}</Text>
      </blockquote>
    );
  }

  if (block.style === "h2") {
    return (
      <Heading key={key} level={headingBaseLevel}>
        {content}
      </Heading>
    );
  }

  if (block.style === "h3") {
    const nextLevel = Math.min(headingBaseLevel + 1, 4) as HeadingLevel;
    return (
      <Heading key={key} level={nextLevel}>
        {content}
      </Heading>
    );
  }

  return (
    <Text key={key} step="body">
      {content}
    </Text>
  );
}

export default function PortableTextBody({
  value,
  headingBaseLevel = 3,
  tableCaption,
}: PortableTextBodyProps) {
  if (!value || value.length === 0) return null;

  const rendered: React.ReactNode[] = [];
  let listBuffer: PortableBlock[] | null = null;

  const flushListBuffer = () => {
    if (!listBuffer || listBuffer.length === 0) return;
    const listType = listBuffer[0]?.listItem;
    const ListTag = listType === "number" ? "ol" : "ul";
    rendered.push(
      <ListTag
        key={`list-${rendered.length}`}
        className={`ml-5 flex flex-col gap-1 ${listType === "number" ? "list-decimal" : "list-disc"}`}
      >
        {listBuffer.map((item, index) => (
          <li key={item._key ?? index}>
            <Text as="span" step="body">
              {renderSpans(item.children ?? [], item.markDefs ?? [])}
            </Text>
          </li>
        ))}
      </ListTag>
    );
    listBuffer = null;
  };

  for (const block of value) {
    if (isTableBlock(block)) {
      flushListBuffer();
      const rows = block.rows ?? [];
      rendered.push(
        <Table
          key={block._key ?? `table-${rendered.length}`}
          caption={tableCaption ?? ""}
          captionHidden={!tableCaption}
          columns={(rows[0]?.cells ?? []).map((_, columnIndex) => ({
            key: String(columnIndex),
            header: "",
          }))}
          rows={rows.map((row) => {
            const record: Record<string, React.ReactNode> = {};
            (row.cells ?? []).forEach((cell, columnIndex) => {
              record[String(columnIndex)] = cell;
            });
            return record;
          })}
        />
      );
      continue;
    }

    const textBlock = block as PortableBlock;
    if (textBlock.listItem) {
      if (listBuffer && listBuffer[0]?.listItem === textBlock.listItem) {
        listBuffer.push(textBlock);
      } else {
        flushListBuffer();
        listBuffer = [textBlock];
      }
      continue;
    }

    flushListBuffer();
    rendered.push(
      renderBlock(textBlock, textBlock._key ?? `block-${rendered.length}`, headingBaseLevel)
    );
  }
  flushListBuffer();

  return <div className="flex flex-col gap-3">{rendered}</div>;
}
