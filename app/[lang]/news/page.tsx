import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import NewsCard from "@/components/news/NewsCard";
import { socials } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const title = lang === "th" ? "ข่าวและกิจกรรม" : "What's on";
  const description =
    lang === "th" ? "ข่าวสารและกิจกรรมล่าสุดจาก BIRSA" : "The latest news and events from BIRSA.";
  return buildMetadata({
    locale: lang,
    title: `${title}: ${dict.site.name}`,
    description,
    path: "/news",
  });
}

const copy = {
  en: {
    title: "What's on",
    lede: "News and events from BIRSA. For anything more immediate, follow us on",
    and: "and",
    typeLabel: "Type",
    allTypes: "All",
    news: "News",
    event: "Events",
    categoryLabel: "Category",
    allCategories: "All categories",
    filterNav: "Filter news and events",
    categories: {
      announcements: "Announcements",
      events: "Events",
      community: "Community",
    } as Record<string, string>,
  },
  th: {
    title: "ข่าวและกิจกรรม",
    lede: "ข่าวสารและกิจกรรมล่าสุดจาก BIRSA หากอยากรู้ความเคลื่อนไหวแบบเรียลไทม์ ติดตามเราได้ที่",
    and: "และ",
    typeLabel: "ประเภท",
    allTypes: "ทั้งหมด",
    news: "ข่าว",
    event: "กิจกรรม",
    categoryLabel: "หมวดหมู่",
    allCategories: "ทุกหมวดหมู่",
    filterNav: "ตัวกรองข่าวและกิจกรรม",
    categories: {
      announcements: "ประกาศ",
      events: "กิจกรรม",
      community: "ชุมชน",
    } as Record<string, string>,
  },
};

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: string; category?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const text = copy[locale];
  const { type, category } = await searchParams;

  const allEntries = getEntries("news", locale);
  const categories = Array.from(new Set(allEntries.map((e) => e.frontmatter.category))).sort();

  const filtered = allEntries.filter((entry) => {
    if (type && entry.frontmatter.type !== type) return false;
    if (category && entry.frontmatter.category !== category) return false;
    return true;
  });

  const hasFilter = Boolean(type || category);

  function buildFilterHref(next: { type?: string; category?: string }) {
    const params = new URLSearchParams();
    // `"key" in next` (not `next.key !== undefined`) so an explicit
    // `{ category: undefined }` (used to clear back to "All") is
    // distinguishable from the key being omitted entirely (keep current).
    const nextType = "type" in next ? next.type : type;
    const nextCategory = "category" in next ? next.category : category;
    if (nextType) params.set("type", nextType);
    if (nextCategory) params.set("category", nextCategory);
    const qs = params.toString();
    return localeHref(locale, "/news") + (qs ? `?${qs}` : "");
  }

  const instagram = socials.find((s) => s.id === "instagram")!;
  const facebook = socials.find((s) => s.id === "facebook")!;

  const filterTagBase =
    "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors";
  const filterTagInactive = "border-line bg-surface text-ink hover:bg-sunken";
  const filterTagActive = "border-brand bg-brand text-white";

  return (
    <>
      <PageHeader
        title={text.title}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: text.title }]}
          />
        }
      />
      <div className="wrap py-10">
        <p className="text-muted mb-8 max-w-[var(--measure)] text-lg">
          {text.lede}{" "}
          <ExternalLink
            href={instagram.href}
            newTabLabel={dict.a11y.newTab}
            className="text-brand-deep font-semibold"
          >
            Instagram
          </ExternalLink>{" "}
          {text.and}{" "}
          <ExternalLink
            href={facebook.href}
            newTabLabel={dict.a11y.newTab}
            className="text-brand-deep font-semibold"
          >
            Facebook
          </ExternalLink>
          .
        </p>

        <nav aria-label={text.filterNav} className="mb-6 flex flex-col gap-4">
          <div>
            <p className="text-muted mb-2 text-sm font-semibold tracking-wide uppercase">
              {text.typeLabel}
            </p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <a
                  href={buildFilterHref({ type: undefined })}
                  aria-current={!type ? "true" : undefined}
                  className={`${filterTagBase} ${!type ? filterTagActive : filterTagInactive}`}
                >
                  {text.allTypes}
                </a>
              </li>
              <li>
                <a
                  href={buildFilterHref({ type: "news" })}
                  aria-current={type === "news" ? "true" : undefined}
                  className={`${filterTagBase} ${type === "news" ? filterTagActive : filterTagInactive}`}
                >
                  {text.news}
                </a>
              </li>
              <li>
                <a
                  href={buildFilterHref({ type: "event" })}
                  aria-current={type === "event" ? "true" : undefined}
                  className={`${filterTagBase} ${type === "event" ? filterTagActive : filterTagInactive}`}
                >
                  {text.event}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-muted mb-2 text-sm font-semibold tracking-wide uppercase">
              {text.categoryLabel}
            </p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <a
                  href={buildFilterHref({ category: undefined })}
                  aria-current={!category ? "true" : undefined}
                  className={`${filterTagBase} ${!category ? filterTagActive : filterTagInactive}`}
                >
                  {text.allCategories}
                </a>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <a
                    href={buildFilterHref({ category: c })}
                    aria-current={category === c ? "true" : undefined}
                    className={`${filterTagBase} ${category === c ? filterTagActive : filterTagInactive}`}
                  >
                    {text.categories[c] ?? c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {hasFilter ? (
            <a
              href={localeHref(locale, "/news")}
              className="text-brand-deep w-fit text-sm font-semibold hover:underline"
            >
              {dict.actions.clearFilters}
            </a>
          ) : null}
        </nav>

        <p className="text-muted mb-6 text-sm" role="status">
          {dict.actions.showing} {filtered.length}{" "}
          {filtered.length === 1 ? dict.actions.result : dict.actions.results}
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <NewsCard
                key={entry.slug}
                locale={locale}
                dict={dict}
                slug={entry.slug}
                frontmatter={entry.frontmatter}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted">{dict.actions.noResults}</p>
        )}
      </div>
    </>
  );
}
