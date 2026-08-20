import NavList, { NavListItem } from "@/components/bds/NavList";

/**
 * BIRSA Design System: `RelatedLinksSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `related-links` entry of `components/bds/sectionPalette.ts`:
 * cross-links validated against real documents, through `NavList` (content
 * cluster), the same component `nav-list` renders through. The two section
 * types share a component because they share a rendering job ("a run of
 * link rows"); what actually distinguishes them is `sectionPalette.ts`'s
 * `validates` field, which is CMS-side publish validation, not something
 * that changes how the rows are drawn: `nav-list` targets any route the
 * application serves, `related-links` targets either a published document
 * (checked at publish time) or an external URL registered in the link-rot
 * register the daily cron reads (§3.6). Neither check happens here; this
 * component renders whatever `href` it is given, same as `NavListSection`.
 */
export type RelatedLinksSectionRow = {
  id: string;
  href: string;
  title: string;
  description?: string;
};

export type RelatedLinksSectionProps = {
  rows: RelatedLinksSectionRow[];
};

export default function RelatedLinksSection({ rows }: RelatedLinksSectionProps) {
  return (
    <NavList>
      {rows.map((row) => (
        <NavListItem key={row.id} href={row.href} title={row.title}>
          {row.description}
        </NavListItem>
      ))}
    </NavList>
  );
}
