import Link from "next/link";
import { formatDate, localeHref, type Locale } from "@/lib/i18n";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";

const homeCopy = { en: homeEn, th: homeTh };

export type LatestNewsItem = { slug: string; title: string; date: string };

export default function LatestNews({
  locale,
  items,
  className = "",
}: {
  locale: Locale;
  items: LatestNewsItem[];
  className?: string;
}) {
  const copy = homeCopy[locale].latestNews;
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="latest-news-heading"
      className={`rounded-2xl border border-line bg-surface p-4 sm:p-5 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="latest-news-heading" className="font-display text-xl">
          {copy.heading}
        </h2>
        <Link
          href={localeHref(locale, "/news")}
          className="focus-highlight inline-flex min-h-11 items-center text-sm font-semibold text-brand-deep underline underline-offset-4"
        >
          {copy.seeAll}
        </Link>
      </div>
      <ul className="mt-2 divide-y divide-line">
        {items.map((item) => (
          <li key={item.slug} className="py-3">
            <Link
              href={localeHref(locale, `/news/${item.slug}`)}
              className="focus-highlight font-semibold text-brand-deep underline underline-offset-4"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-sm text-muted">{formatDate(locale, item.date)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
