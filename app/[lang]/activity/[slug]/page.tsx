import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, formatDate, localeHref, locales, type Locale } from "@/lib/i18n";
import { getEntries, getEntry } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Mdx } from "@/lib/mdx";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getEntries("activity", lang).map((entry) => ({ lang, slug: entry.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const entry = getEntry("activity", locale, slug);
  if (!entry) return {};

  return buildMetadata({
    locale,
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
    path: `/activity/${slug}`,
  });
}

const labels: Record<
  Locale,
  { activity: string; back: string; questions: string; contact: string }
> = {
  en: {
    activity: "BIRSA activity",
    back: "Back to BIRSA activity",
    questions: "Questions?",
    contact: "Contact BIRSA.",
  },
  th: {
    activity: "การดำเนินงานของ BIRSA",
    back: "กลับไปหน้าการดำเนินงานของ BIRSA",
    questions: "มีคำถาม?",
    contact: "ติดต่อ BIRSA",
  },
};

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const entry = getEntry("activity", locale, slug);
  if (!entry) notFound();

  const t = labels[locale];

  return (
    <>
      <PageHeader
        title={entry.frontmatter.title}
        lede={entry.frontmatter.summary}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.activity, href: "/activity" },
              { label: entry.frontmatter.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        <p className="text-muted text-sm">
          {dict.meta.updated}: {formatDate(locale, entry.frontmatter.updated)}
        </p>

        <Mdx source={entry.content} newTabLabel={dict.a11y.newTab} locale={locale} />

        <p className="text-muted max-w-[var(--measure)] text-sm">
          {t.questions}{" "}
          <Link
            href={localeHref(locale, "/contact")}
            className="text-brand-deep hover:text-brand-dark font-semibold underline"
          >
            {t.contact}
          </Link>
        </p>

        <Link
          href={localeHref(locale, "/activity")}
          className="text-brand-deep hover:text-brand-dark text-sm font-semibold"
        >
          &larr; {t.back}
        </Link>
      </div>
    </>
  );
}
