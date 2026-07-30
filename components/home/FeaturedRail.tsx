import Link from "next/link";
import QuickIconGlyph from "@/components/quick/QuickIcon";
import type { QuickIcon } from "@/content/quick";

export type FeaturedItem = {
  href: string;
  icon: QuickIcon;
  label: string;
  description: string;
};

export type FeaturedRailProps = {
  heading: string;
  /** Id for the rail's heading, so the section can point at it. */
  headingId: string;
  items: FeaturedItem[];
};

/**
 * The rail that sits in `GridAside` beside a `NavList`: a short, quiet run of
 * things worth a look, each an icon, a link and a line of context.
 *
 * Deliberately unlike `NavList`. The rows there are the page's navigation and
 * are clickable edge to edge; these are a sideline, so only the title is a
 * link and the icon is decoration. Icons come from the `/quick` set rather
 * than new artwork, which keeps the two places that show glyphs consistent.
 */
export default function FeaturedRail({ heading, headingId, items }: FeaturedRailProps) {
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="font-display border-line border-t pt-4 text-xl">
        {heading}
      </h2>
      <ul className="mt-5 flex flex-col gap-6">
        {items.map((item) => (
          <li key={item.href} className="flex gap-4">
            <span
              aria-hidden="true"
              className="bg-brand-tint text-brand-deep grid size-11 shrink-0 place-items-center rounded-lg [&>svg]:size-6"
            >
              <QuickIconGlyph icon={item.icon} />
            </span>
            <div className="min-w-0">
              <Link
                href={item.href}
                className="text-brand-deep focus-highlight font-display underline decoration-1 underline-offset-4 hover:decoration-[3px]"
              >
                {item.label}
              </Link>
              <p className="text-muted mt-1 text-sm leading-relaxed">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
