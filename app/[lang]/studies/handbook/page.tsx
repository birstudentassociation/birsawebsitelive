import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, locales, formatDate, type Locale } from "@/lib/i18n";
import { getGuideEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";

/**
 * `/studies/handbook` (ROUTE-MAP-2.0 "Wave 5D"), the index for the seven BIR
 * student handbook documents (SCOPE-AUDIT-2.0 §3.1, all seven KEEP).
 *
 * Reads `content/student-life/{en,th}/handbook/*.mdx` through
 * `lib/content.ts`'s `getGuideEntries`, the same loader
 * `app/[lang]/student-life/[audience]/page.tsx` (1.0, untouched) already
 * reads, rather than a second copy of the frontmatter. `lib/redirects.ts`
 * (frozen) already maps the whole `/student-life/handbook` subtree here.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = getDictionary(locale).handbookIndex;
  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/studies/handbook" });
}

export default async function HandbookIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.handbookIndex;
  const familyLabel = dict.studiesIndex.title;
  const entries = getGuideEntries(locale, "handbook");

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: familyLabel, href: "/studies" },
              { label: t.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/help")} variant="ghost">
            {dict.actions.getHelp}
          </Button>
        }
      />
      <div className="wrap flex flex-col gap-6 py-10">
        <NavList>
          {entries.map((entry) => (
            <NavListItem
              key={entry.slug}
              href={localeHref(locale, `/studies/handbook/${entry.slug}`)}
              title={entry.frontmatter.title}
              level={2}
              footnote={`${t.updatedLabel} ${formatDate(locale, entry.frontmatter.updated)}`}
            >
              {entry.frontmatter.summary}
            </NavListItem>
          ))}
        </NavList>
      </div>
    </>
  );
}
