import NavList, { NavListItem } from "@/components/bds/NavList";
import type { HeadingLevel } from "@/components/bds/Type";

/**
 * BIRSA Design System: `NavListSection` (REDESIGN-2.0 §4.6, media cluster).
 *
 * Renders the `nav-list` entry of `components/bds/sectionPalette.ts`: a run
 * of link rows with descriptions, through `NavList`/`NavListItem` (content
 * cluster), which already exist. "Use this wherever the job is 'pick where
 * to go next'" (`NavList`'s own usage rule) is exactly what `nav-list`'s
 * `does` says too, so this section is a thin, direct pass-through with no
 * layout decisions of its own to make.
 *
 * Every row is data: an `href` and text fields, never a `className`, a
 * `style`, or anything from `forbiddenSchemaFields`. Validation of what an
 * `href` may point at ("every target is a published document or a route the
 * application serves", `sectionPalette.ts`) is CMS-side publish validation,
 * not this component's job; this component renders whatever `href` it is
 * given.
 */
export type NavListSectionRow = {
  id: string;
  href: string;
  title: string;
  /** Small category label above the title. */
  meta?: string;
  /** A short preview of the destination. Plain text only, per `NavListItem`. */
  description?: string;
  topics?: { label: string; items: string[] };
  /** A trailing muted detail, such as a last-updated date. */
  footnote?: string;
  level?: HeadingLevel;
};

export type NavListSectionProps = {
  rows: NavListSectionRow[];
};

export default function NavListSection({ rows }: NavListSectionProps) {
  return (
    <NavList>
      {rows.map((row) => (
        <NavListItem
          key={row.id}
          href={row.href}
          title={row.title}
          meta={row.meta}
          topics={row.topics}
          footnote={row.footnote}
          level={row.level}
        >
          {row.description}
        </NavListItem>
      ))}
    </NavList>
  );
}
