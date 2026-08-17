import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, formatDate, localeHref, locales, type Locale } from "@/lib/i18n";
import { getGuideEntries, getGuideEntry, type GuideAudience } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Mdx } from "@/lib/mdx";
import { extractH2Toc } from "@/lib/toc";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";

const audiences: GuideAudience[] = ["home", "international", "handbook"];

function isAudience(x: string): x is GuideAudience {
  return audiences.includes(x as GuideAudience);
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    audiences.flatMap((audience) =>
      getGuideEntries(lang, audience).map((entry) => ({ lang, audience, slug: entry.slug }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; audience: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, audience, slug } = await params;
  if (!isLocale(lang) || !isAudience(audience)) return {};
  const locale: Locale = lang;
  const entry = getGuideEntry(locale, audience, slug);
  if (!entry) return {};

  return buildMetadata({
    locale,
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
    path: `/student-life/${audience}/${slug}`,
  });
}

const labels: Record<
  Locale,
  {
    tracks: Record<GuideAudience, string>;
    updated: string;
    onThisPage: string;
    prevNextNav: string;
    previous: string;
    next: string;
    helpTitle: string;
    helpBody: string;
    helpCta: string;
    back: Record<GuideAudience, string>;
  }
> = {
  en: {
    tracks: {
      home: "Student life and culture guides",
      international: "For international students",
      handbook: "Student handbook",
    },
    updated: "Last updated",
    onThisPage: "On this page",
    prevNextNav: "Previous and next sections",
    previous: "Previous",
    next: "Next",
    helpTitle: "Report a problem with this guide",
    helpBody: "Tell BIRSA. This guide is written and kept up to date by students.",
    helpCta: "Tell BIRSA",
    back: {
      home: "Back to the student life and culture guides",
      international: "Back to the international student guide",
      handbook: "Back to the student handbook",
    },
  },
  th: {
    tracks: {
      home: "คู่มือชีวิตนักศึกษาและวัฒนธรรม",
      international: "สำหรับนักศึกษาต่างชาติ",
      handbook: "คู่มือนักศึกษา",
    },
    updated: "อัปเดตล่าสุด",
    onThisPage: "ในหน้านี้",
    prevNextNav: "หัวข้อก่อนหน้าและถัดไป",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    helpTitle: "แจ้งปัญหาเกี่ยวกับคู่มือนี้",
    helpBody: "แจ้ง BIRSA ได้ คู่มือนี้เขียนและดูแลโดยนักศึกษาด้วยกัน",
    helpCta: "แจ้ง BIRSA",
    back: {
      home: "กลับไปคู่มือชีวิตนักศึกษาและวัฒนธรรม",
      international: "กลับไปคู่มือสำหรับนักศึกษาต่างชาติ",
      handbook: "กลับไปคู่มือนักศึกษา",
    },
  },
};

export default async function StudentLifeSectionPage({
  params,
}: {
  params: Promise<{ lang: string; audience: string; slug: string }>;
}) {
  const { lang, audience, slug } = await params;
  if (!isLocale(lang) || !isAudience(audience)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const entry = getGuideEntry(locale, audience, slug);
  if (!entry) notFound();

  const t = labels[locale];
  const trackLabel = t.tracks[audience];
  const trackHref = localeHref(locale, `/student-life/${audience}`);
  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;

  const allEntries = getGuideEntries(locale, audience);
  const currentIndex = allEntries.findIndex((e) => e.slug === slug);
  const prevEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;
  const nextEntry =
    currentIndex >= 0 && currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;

  const toc = extractH2Toc(entry.content);

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
              { label: infoServicesLabel, href: "/services" },
              { label: trackLabel, href: `/student-life/${audience}` },
              { label: entry.frontmatter.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        {toc.length >= 2 ? (
          <nav aria-label={t.onThisPage} className="rounded-lg border border-line bg-sunken p-5">
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
              {t.onThisPage}
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-brand-deep hover:text-brand-dark">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <p className="text-sm text-muted">
          {t.updated}: {formatDate(locale, entry.frontmatter.updated)}
        </p>

        <Mdx source={entry.content} newTabLabel={dict.a11y.newTab} locale={locale} />

        {prevEntry || nextEntry ? (
          <nav
            aria-label={t.prevNextNav}
            className="grid grid-cols-1 gap-4 border-t border-line pt-8 sm:grid-cols-2"
          >
            <div>
              {prevEntry ? (
                <Link
                  href={localeHref(locale, `/student-life/${audience}/${prevEntry.slug}`)}
                  className="flex h-full flex-col gap-1 rounded-lg border border-line bg-surface p-4 hover:border-brand"
                >
                  <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                    &larr; {t.previous}
                  </span>
                  <span className="font-semibold text-ink">{prevEntry.frontmatter.title}</span>
                </Link>
              ) : null}
            </div>
            <div>
              {nextEntry ? (
                <Link
                  href={localeHref(locale, `/student-life/${audience}/${nextEntry.slug}`)}
                  className="flex h-full flex-col gap-1 rounded-lg border border-line bg-surface p-4 text-right hover:border-brand"
                >
                  <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                    {t.next} &rarr;
                  </span>
                  <span className="font-semibold text-ink">{nextEntry.frontmatter.title}</span>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}

        <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-sunken p-8">
          <h2 className="font-display text-xl">{t.helpTitle}</h2>
          <p className="max-w-[var(--measure)] text-muted">{t.helpBody}</p>
          <Button href={localeHref(locale, "/contact")}>{t.helpCta}</Button>
        </div>

        <Link
          href={trackHref}
          className="text-sm font-semibold text-brand-deep hover:text-brand-dark"
        >
          &larr; {t.back[audience]}
        </Link>
      </div>
    </>
  );
}
