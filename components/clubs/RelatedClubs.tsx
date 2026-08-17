import Link from "next/link";
import { localeHref, type Locale } from "@/lib/i18n";
import { getClubEntries } from "@/lib/content";

export type RelatedClubsProps = {
  /** Club slugs to link to, in the order they should appear. */
  slugs: string[];
  locale: Locale;
};

/**
 * Available in club MDX as `<RelatedClubs slugs="tu-mun,parliamock-tu" />`.
 * Several BIR clubs overlap (the three simulation clubs, the two student
 * publications, the sports teams), and readers deciding what to join benefit
 * from being pointed sideways rather than back to the full index.
 *
 * The MDX attribute is a comma-separated string, not an array expression:
 * `next-mdx-remote` compiles content with `blockJS` on, which strips JSX
 * attribute expressions (`slugs={[...]}` silently arrives as `undefined`).
 * `lib/mdx.tsx` splits the string before it reaches this component.
 *
 * Unknown slugs are skipped rather than thrown, so renaming a club cannot break
 * an unrelated club's page; the tests assert every referenced slug resolves.
 */
export default function RelatedClubs({ slugs, locale }: RelatedClubsProps) {
  const entries = getClubEntries(locale);
  const related = slugs
    .map((slug) => entries.find((entry) => entry.slug === slug))
    .filter((entry) => entry !== undefined);

  if (related.length === 0) return null;

  return (
    <ul className="not-prose grid grid-cols-1 gap-3 border-t border-line pt-5 sm:grid-cols-2">
      {related.map((entry) => (
        <li key={entry.slug}>
          <Link
            href={localeHref(locale, `/clubs/${entry.slug}`)}
            className="focus-halo block h-full rounded-lg border border-line p-4 transition-colors hover:bg-sunken"
          >
            <span className="block text-sm font-semibold text-brand-deep">
              {entry.frontmatter.title}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">
              {entry.frontmatter.tagline}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
