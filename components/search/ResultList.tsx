import type { Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/i18n";
import type { SearchResult } from "@/lib/search/types";
import { sectionLabel } from "@/lib/search/sections";
import Tag from "@/components/Tag";
import Highlight from "@/components/search/Highlight";

const eventLabel: Record<Locale, string> = {
  en: "Event",
  th: "กิจกรรม",
};

export type ResultListProps = {
  results: SearchResult[];
  locale: Locale;
};

/**
 * Results render as a plain hairline-separated list rather than `NavList` or
 * a `Card` grid. This list mixes very different result shapes in one run —
 * guided answers, news with dates, regulation clauses, outbound quick links —
 * and a long mixed list reads better as compact rows than as cards, which
 * imply a gallery of similar things. `NavList` was the closest existing
 * pattern (stretched title link, chevron, hairline rows) but is a single
 * fixed shape; results here need a section tag, a badge, an optional date,
 * and a highlighted snippet all in the same row, so the markup is built
 * directly rather than forcing those extras through `NavList`'s slots.
 */
export default function ResultList({ results, locale }: ResultListProps) {
  return (
    <ol className="flex flex-col border-t border-line">
      {results.map((result) => (
        <li key={result.doc.id} className="border-b border-line py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>{sectionLabel(locale, result.doc.section)}</Tag>
            {result.doc.badge ? (
              <span className="text-xs font-medium text-muted">{result.doc.badge}</span>
            ) : null}
          </div>
          <a
            href={result.doc.href}
            className="mt-1 block font-display text-lg leading-snug font-semibold text-brand-deep hover:underline"
          >
            {result.doc.title}
          </a>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {result.snippet ? (
              <Highlight text={result.snippet} terms={result.matched} />
            ) : (
              result.doc.summary
            )}
          </p>
          {result.doc.date ? (
            <p className="mt-1.5 text-xs text-muted">
              {result.doc.upcoming ? `${eventLabel[locale]} · ` : null}
              {formatDate(locale, result.doc.date)}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
