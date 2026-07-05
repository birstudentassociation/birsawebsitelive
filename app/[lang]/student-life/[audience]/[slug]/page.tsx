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

const audiences: GuideAudience[] = ["home", "international"];

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
    studentLife: string;
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
    studentLife: "Student life",
    tracks: { home: "For home students", international: "For international students" },
    updated: "Last updated",
    onThisPage: "On this page",
    prevNextNav: "Previous and next sections",
    previous: "Previous",
    next: "Next",
    helpTitle: "Something wrong or missing?",
    helpBody: "Tell BIRSA and we'll look into it — this guide is written and kept up to date by students.",
    helpCta: "Tell BIRSA",
    back: {
      home: "Back to the home student guide",
      international: "Back to the international student guide",
    },
  },
  th: {
    studentLife: "ชีวิตนักศึกษา",
    tracks: { home: "สำหรับนักศึกษาไทย", international: "สำหรับนักศึกษาต่างชาติ" },
    updated: "อัปเดตล่าสุด",
    onThisPage: "ในหน้านี้",
    prevNextNav: "หัวข้อก่อนหน้าและถัดไป",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    helpTitle: "มีอะไรผิดพลาดหรือขาดหายไปไหม",
    helpBody: "บอก BIRSA ได้เลย เราจะตรวจสอบให้ — คู่มือนี้เขียนและดูแลโดยนักศึกษาด้วยกัน",
    helpCta: "แจ้ง BIRSA",
    back: {
      home: "กลับไปคู่มือสำหรับนักศึกษาไทย",
      international: "กลับไปคู่มือสำหรับนักศึกษาต่างชาติ",
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
              { label: t.studentLife, href: "/student-life" },
              { label: trackLabel, href: `/student-life/${audience}` },
              { label: entry.frontmatter.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        {toc.length >= 2 ? (
          <nav aria-label={t.onThisPage} className="border-line bg-sunken rounded-lg border p-5">
            <h2 className="text-muted text-sm font-semibold tracking-wide uppercase">
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

        <p className="text-muted text-sm">
          {t.updated}: {formatDate(locale, entry.frontmatter.updated)}
        </p>

        <Mdx source={entry.content} newTabLabel={dict.a11y.newTab} />

        {prevEntry || nextEntry ? (
          <nav aria-label={t.prevNextNav} className="border-line grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2">
            <div>
              {prevEntry ? (
                <Link
                  href={localeHref(locale, `/student-life/${audience}/${prevEntry.slug}`)}
                  className="border-line bg-surface hover:border-brand flex h-full flex-col gap-1 rounded-lg border p-4"
                >
                  <span className="text-muted text-xs font-semibold uppercase tracking-wide">
                    &larr; {t.previous}
                  </span>
                  <span className="text-ink font-semibold">{prevEntry.frontmatter.title}</span>
                </Link>
              ) : null}
            </div>
            <div>
              {nextEntry ? (
                <Link
                  href={localeHref(locale, `/student-life/${audience}/${nextEntry.slug}`)}
                  className="border-line bg-surface hover:border-brand flex h-full flex-col gap-1 rounded-lg border p-4 text-right"
                >
                  <span className="text-muted text-xs font-semibold uppercase tracking-wide">
                    {t.next} &rarr;
                  </span>
                  <span className="text-ink font-semibold">{nextEntry.frontmatter.title}</span>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}

        <div className="border-line bg-sunken flex flex-col items-start gap-4 rounded-lg border p-8">
          <h2 className="font-display text-xl">{t.helpTitle}</h2>
          <p className="text-muted max-w-[var(--measure)]">{t.helpBody}</p>
          <Button href={localeHref(locale, "/services/contact")}>{t.helpCta}</Button>
        </div>

        <Link href={trackHref} className="text-brand-deep hover:text-brand-dark text-sm font-semibold">
          &larr; {t.back[audience]}
        </Link>
      </div>
    </>
  );
}
