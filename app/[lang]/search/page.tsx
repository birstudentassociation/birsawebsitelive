import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries, getGuideEntries, type GuideAudience } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { clubs } from "@/content/clubs/clubs";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ค้นหา" : "Search";
  const description =
    locale === "th"
      ? "ค้นหาข่าว การดำเนินงานของ BIRSA ชมรม และคู่มือชีวิตนักศึกษาในเว็บไซต์ BIRSA"
      : "Search news, BIRSA activity, clubs and the student-life guide on the BIRSA site.";

  return buildMetadata({ locale, title, description, path: "/search" });
}

const guideAudiences: GuideAudience[] = ["home", "international"];

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    inputLabel: string;
    submit: string;
    resultsFor: (q: string) => string;
    groups: {
      news: string;
      activity: string;
      about: string;
      clubs: string;
      studentLifeHome: string;
      studentLifeInternational: string;
    };
    minChars: string;
  }
> = {
  en: {
    title: "Search",
    lede: "Search news, BIRSA activity, clubs and the student-life guide.",
    inputLabel: "Search this site",
    submit: "Search",
    resultsFor: (q) => `${q ? `Results for "${q}"` : "Results"}`,
    groups: {
      news: "News",
      activity: "BIRSA activity",
      about: "About",
      clubs: "Clubs",
      studentLifeHome: "Student life — home students",
      studentLifeInternational: "Student life — international students",
    },
    minChars: "Type at least 2 characters and press search.",
  },
  th: {
    title: "ค้นหา",
    lede: "ค้นหาข่าว การดำเนินงานของ BIRSA ชมรม และคู่มือชีวิตนักศึกษา",
    inputLabel: "ค้นหาในเว็บไซต์นี้",
    submit: "ค้นหา",
    resultsFor: (q) => (q ? `ผลการค้นหาสำหรับ "${q}"` : "ผลการค้นหา"),
    groups: {
      news: "ข่าวและกิจกรรม",
      activity: "การดำเนินงานของ BIRSA",
      about: "เกี่ยวกับเรา",
      clubs: "ชมรม",
      studentLifeHome: "ชีวิตนักศึกษา — นักศึกษาไทย",
      studentLifeInternational: "ชีวิตนักศึกษา — นักศึกษาต่างชาติ",
    },
    minChars: "พิมพ์อย่างน้อย 2 ตัวอักษรแล้วกดค้นหา",
  },
};

type ResultItem = {
  slug: string;
  href: string;
  title: string;
  summary: string;
};

type ResultGroup = {
  key: string;
  label: string;
  items: ResultItem[];
};

function matches(query: string, ...fields: string[]): boolean {
  const q = query.toLowerCase();
  return fields.some((field) => field.toLowerCase().includes(q));
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const hasQuery = query.length >= 2;

  const groups: ResultGroup[] = [];

  if (hasQuery) {
    const newsResults: ResultItem[] = getEntries("news", locale)
      .filter((entry) => matches(query, entry.frontmatter.title, entry.frontmatter.summary))
      .map((entry) => ({
        slug: entry.slug,
        href: localeHref(locale, `/news/${entry.slug}`),
        title: entry.frontmatter.title,
        summary: entry.frontmatter.summary,
      }));
    if (newsResults.length > 0) groups.push({ key: "news", label: t.groups.news, items: newsResults });

    const activityResults: ResultItem[] = getEntries("activity", locale)
      .filter((entry) => matches(query, entry.frontmatter.title, entry.frontmatter.summary))
      .map((entry) => ({
        slug: entry.slug,
        href: localeHref(locale, `/activity/${entry.slug}`),
        title: entry.frontmatter.title,
        summary: entry.frontmatter.summary,
      }));
    if (activityResults.length > 0)
      groups.push({ key: "activity", label: t.groups.activity, items: activityResults });

    const aboutResults: ResultItem[] = getEntries("about", locale)
      .filter((entry) => matches(query, entry.frontmatter.title, entry.frontmatter.summary))
      .map((entry) => ({
        slug: entry.slug,
        href: localeHref(locale, `/about/${entry.slug}`),
        title: entry.frontmatter.title,
        summary: entry.frontmatter.summary,
      }));
    if (aboutResults.length > 0) groups.push({ key: "about", label: t.groups.about, items: aboutResults });

    for (const audience of guideAudiences) {
      const guideResults: ResultItem[] = getGuideEntries(locale, audience)
        .filter((entry) => matches(query, entry.frontmatter.title, entry.frontmatter.summary))
        .map((entry) => ({
          slug: entry.slug,
          href: localeHref(locale, `/student-life/${audience}/${entry.slug}`),
          title: entry.frontmatter.title,
          summary: entry.frontmatter.summary,
        }));
      if (guideResults.length > 0) {
        groups.push({
          key: `student-life-${audience}`,
          label: audience === "home" ? t.groups.studentLifeHome : t.groups.studentLifeInternational,
          items: guideResults,
        });
      }
    }

    const clubResults: ResultItem[] = clubs
      .filter((club) => matches(query, club[locale].name, club[locale].tagline))
      .map((club) => ({
        slug: club.slug,
        href: localeHref(locale, `/clubs/${club.slug}`),
        title: club[locale].name,
        summary: club[locale].tagline,
      }));
    if (clubResults.length > 0) groups.push({ key: "clubs", label: t.groups.clubs, items: clubResults });
  }

  const totalResults = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        <form method="GET" action={localeHref(locale, "/search")} role="search" className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex max-w-sm flex-1 flex-col gap-1.5">
            <label htmlFor="search-q" className="text-ink text-sm font-semibold">
              {dict.actions.search}
            </label>
            <input
              id="search-q"
              type="search"
              name="q"
              defaultValue={query}
              placeholder={t.inputLabel}
              className="focus-halo border-input-border bg-surface text-ink placeholder:text-muted h-11 w-full rounded-md border px-3.5 py-2.5 text-[0.95rem]"
            />
          </div>
          <Button type="submit">{t.submit}</Button>
        </form>

        {hasQuery ? (
          <div className="flex flex-col gap-8">
            <p role="status" className="text-muted text-sm">
              {t.resultsFor(query)} — {dict.actions.showing} {totalResults}{" "}
              {totalResults === 1 ? dict.actions.result : dict.actions.results}
            </p>

            {totalResults === 0 ? (
              <p className="text-muted">{dict.actions.noResults}</p>
            ) : (
              groups.map((group) => (
                <section key={group.key} className="flex flex-col gap-3">
                  <h2 className="font-display text-2xl">{group.label}</h2>
                  <ul className="flex flex-col gap-4">
                    {group.items.map((item) => (
                      <li key={item.slug} className="border-line border-b pb-4 last:border-b-0 last:pb-0">
                        <a
                          href={item.href}
                          className="text-brand-deep hover:text-brand-dark font-display text-lg font-semibold hover:underline"
                        >
                          {item.title}
                        </a>
                        <p className="text-muted mt-1 text-sm leading-relaxed">{item.summary}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
        ) : (
          <p role="status" className="text-muted text-sm">
            {t.minChars}
          </p>
        )}
      </div>
    </>
  );
}
