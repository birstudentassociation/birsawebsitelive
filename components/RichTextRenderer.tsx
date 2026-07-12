/**
 * Renders a Payload Lexical `SerializedEditorState` (the `body` richText
 * field on the `news`, `activity`, and `student-life` collections) as an RSC
 * tree, using `@payloadcms/richtext-lexical/react`'s `RichText` component.
 *
 * Mirrors `lib/mdx.tsx`'s `Mdx` component: same `.prose` wrapper (see
 * `app/globals.css`), same external-link handling (`ExternalLink`, opens in
 * a new tab with a visually-hidden label), same accessible wide-table
 * handling (`overflow-x-auto` region), and the same heading-anchor behaviour
 * (rehype-slug + rehype-autolink-headings equivalent) so headings get stable
 * `id`s and an appended `#` anchor — this keeps in-page TOC links (see
 * `getStudentLifeH2Toc` in `lib/content-payload.ts`) working the same way
 * they did against rehype-slug ids.
 */
import GithubSlugger from "github-slugger";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import ExternalLink from "@/components/ExternalLink";
import Notice, { type NoticeProps } from "@/components/Notice";
import Email from "@/components/Email";

export type RichTextRendererProps = {
  /** Nullable Lexical editor state — renders nothing when absent. */
  data?: SerializedEditorState | null;
  /** Visually-hidden suffix for external links, e.g. dict.a11y.newTab. Defaults to English. */
  newTabLabel?: string;
  /** Accessible label for the wrapper around wide tables. Defaults to English. */
  tableRegionLabel?: string;
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** Flattens a Lexical node's text content (ignoring formatting) for slug generation. */
function flattenNodeText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: unknown; children?: unknown };
  if (typeof n.text === "string") return n.text;
  if (Array.isArray(n.children)) return n.children.map(flattenNodeText).join("");
  return "";
}

function createConverters(
  newTabLabel: string,
  tableRegionLabel: string,
  slugger: GithubSlugger
): JSXConvertersFunction {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      const Tag = node.tag;
      const id = slugger.slug(flattenNodeText(node));
      return (
        <Tag id={id}>
          {children}
          <a href={`#${id}`} className="anchor" aria-hidden="true" tabIndex={-1}>
            #
          </a>
        </Tag>
      );
    },
    link: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      let href = node.fields.url ?? "";
      if (node.fields.linkType === "internal") {
        // No internal-doc relation is configured on the `link` field in any
        // collection's richText editor, so this branch shouldn't occur in
        // practice; fall back to a safe same-page anchor rather than crashing.
        href = "#";
      }
      if (isExternalHref(href)) {
        return (
          <ExternalLink href={href} newTabLabel={newTabLabel}>
            {children}
          </ExternalLink>
        );
      }
      const rel = node.fields.newTab ? "noopener noreferrer" : undefined;
      const target = node.fields.newTab ? "_blank" : undefined;
      return (
        <a href={href} rel={rel} target={target}>
          {children}
        </a>
      );
    },
    autolink: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      const href = node.fields.url ?? "";
      if (isExternalHref(href)) {
        return (
          <ExternalLink href={href} newTabLabel={newTabLabel}>
            {children}
          </ExternalLink>
        );
      }
      const rel = node.fields.newTab ? "noopener noreferrer" : undefined;
      const target = node.fields.newTab ? "_blank" : undefined;
      return (
        <a href={href} rel={rel} target={target}>
          {children}
        </a>
      );
    },
    // Payload's default table converters emit inline styles/classNames
    // (`.lexical-table`, per-cell `border`/`padding`) that would fight with
    // this site's `.prose table/th/td` CSS. Render plain semantic markup
    // instead — matching what `Mdx`'s `table`/`th` overrides produced for
    // remark-gfm tables — so `.prose` fully controls the look, and wrap wide
    // tables in the same accessible scroll region `Mdx` used.
    table: ({ node, nodesToJSX }) => {
      const rows = node.children as { children?: { headerState?: number }[] }[];
      let splitIndex = 0;
      for (const row of rows) {
        const cells = row.children ?? [];
        const allHeader = cells.length > 0 && cells.every((cell) => (cell.headerState ?? 0) > 0);
        if (!allHeader) break;
        splitIndex++;
      }
      const headerRows = node.children.slice(0, splitIndex);
      const bodyRows = node.children.slice(splitIndex);
      return (
        <div className="overflow-x-auto" role="region" aria-label={tableRegionLabel} tabIndex={0}>
          <table>
            {headerRows.length > 0 ? <thead>{nodesToJSX({ nodes: headerRows })}</thead> : null}
            <tbody>{nodesToJSX({ nodes: bodyRows })}</tbody>
          </table>
        </div>
      );
    },
    tablerow: ({ node, nodesToJSX }) => {
      return <tr>{nodesToJSX({ nodes: node.children })}</tr>;
    },
    tablecell: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      const headerState = node.headerState ?? 0;
      const isHeader = headerState > 0;
      const Tag = isHeader ? "th" : "td";
      // Lexical TableCellHeaderStates: ROW = 1, COLUMN = 2 (bitmask). Map to
      // the correct scope so column headers get scope="col" and row headers
      // scope="row" (WCAG 1.3.1 / H63), preserving the source tables' a11y.
      const scope = headerState & 2 ? "col" : headerState & 1 ? "row" : undefined;
      const colSpan = node.colSpan && node.colSpan > 1 ? node.colSpan : undefined;
      const rowSpan = node.rowSpan && node.rowSpan > 1 ? node.rowSpan : undefined;
      return (
        <Tag scope={scope} colSpan={colSpan} rowSpan={rowSpan}>
          {children}
        </Tag>
      );
    },
    // Custom blocks emitted by the content migration (see payload.config.ts).
    blocks: {
      notice: ({ node }: { node: { fields: Record<string, unknown> } }) => {
        const f = node.fields as {
          variant?: NoticeProps["variant"];
          title?: string | null;
          content?: string;
        };
        return (
          <Notice variant={f.variant} title={f.title ?? undefined}>
            {f.content ?? ""}
          </Notice>
        );
      },
    },
    inlineBlocks: {
      email: ({ node }: { node: { fields: Record<string, unknown> } }) => {
        const f = node.fields as {
          address: string;
          label?: string | null;
          subject?: string | null;
        };
        return <Email address={f.address} label={f.label ?? undefined} subject={f.subject ?? undefined} />;
      },
    },
  });
}

/**
 * Renders a Lexical richText body as an RSC tree, wrapped in the same
 * `.prose` container `Mdx` uses. Renders nothing when `data` is nullish or
 * has no content.
 */
export default function RichTextRenderer({
  data,
  newTabLabel = "opens in a new tab",
  tableRegionLabel = "Table",
}: RichTextRendererProps) {
  if (!data || !data.root || data.root.children.length === 0) return null;

  const slugger = new GithubSlugger();
  const converters = createConverters(newTabLabel, tableRegionLabel, slugger);

  return (
    <div className="prose">
      <RichText data={data} converters={converters} disableContainer />
    </div>
  );
}
