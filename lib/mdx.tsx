/**
 * MDX rendering pipeline (RSC). Wraps `next-mdx-remote/rsc`'s `MDXRemote`
 * with our standard plugin set and a custom component map, so every piece
 * of MDX content in the site gets the same headings/links/tables behaviour
 * and accessibility handling for free.
 */
import type { AnchorHTMLAttributes, TableHTMLAttributes } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import ExternalLink from "@/components/ExternalLink";
import Notice from "@/components/Notice";
import Email from "@/components/Email";
import CommitteeRoster from "@/components/about/CommitteeRoster";
import type { Locale } from "@/lib/i18n";

export type MdxProps = {
  source: string;
  /** Visually-hidden suffix for external links, e.g. dict.a11y.newTab. Defaults to English. */
  newTabLabel?: string;
  /** Accessible label for the wrapper around wide tables. Defaults to English. */
  tableRegionLabel?: string;
  /** Locale passed through to MDX components that render bilingual content (e.g. CommitteeRoster). */
  locale?: Locale;
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function createComponents(newTabLabel: string, tableRegionLabel: string, locale: Locale) {
  return {
    a(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
      const { href = "", children, ...rest } = props;
      if (isExternalHref(href)) {
        return (
          <ExternalLink href={href} newTabLabel={newTabLabel}>
            {children}
          </ExternalLink>
        );
      }
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      );
    },
    table(props: TableHTMLAttributes<HTMLTableElement>) {
      return (
        <div className="overflow-x-auto" role="region" aria-label={tableRegionLabel} tabIndex={0}>
          <table {...props} />
        </div>
      );
    },
    Notice,
    Email,
    CommitteeRoster: () => <CommitteeRoster locale={locale} />,
  };
}

/**
 * Renders MDX source as an RSC tree: remark-gfm for tables/strikethrough/etc,
 * rehype-slug for heading ids, rehype-autolink-headings appending a `#`
 * anchor after each heading. Output is wrapped in `.prose` (see
 * `app/globals.css`). MDX authors get `Notice` available as a component, and
 * `a`/`table` get accessible handling automatically.
 */
export function Mdx({
  source,
  newTabLabel = "opens in a new tab",
  tableRegionLabel = "Table",
  locale = "en",
}: MdxProps) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={createComponents(newTabLabel, tableRegionLabel, locale)}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "append",
                  properties: { className: "anchor", "aria-hidden": "true", tabIndex: -1 },
                  content: { type: "text", value: "#" },
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
