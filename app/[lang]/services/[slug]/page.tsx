import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, formatDate, localeHref, locales, type Locale } from "@/lib/i18n";
import { getEntries, getEntry } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Mdx } from "@/lib/mdx";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getEntries("services", lang).map((entry) => ({ lang, slug: entry.slug }))
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
  const entry = getEntry("services", locale, slug);
  if (!entry) return {};

  return buildMetadata({
    locale,
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
    path: `/services/${slug}`,
  });
}

const labels: Record<Locale, { services: string; helpTitle: string; helpBody: string; helpCta: string; back: string }> = {
  en: {
    services: "Services",
    helpTitle: "Still need help?",
    helpBody: "If this guide didn't answer your question, contact BIRSA and we'll help you or point you to the right office.",
    helpCta: "Contact BIRSA",
    back: "Back to services",
  },
  th: {
    services: "บริการนักศึกษา",
    helpTitle: "ยังต้องการความช่วยเหลืออยู่ไหม",
    helpBody: "ถ้าคู่มือนี้ยังไม่ตอบคำถามของคุณ ติดต่อ BIRSA ได้เลย เราจะช่วยหรือชี้ทางไปหน่วยงานที่ถูกต้อง",
    helpCta: "ติดต่อ BIRSA",
    back: "กลับไปหน้าบริการนักศึกษา",
  },
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const entry = getEntry("services", locale, slug);
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
              { label: t.services, href: "/services" },
              { label: entry.frontmatter.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-8 py-10">
        <p className="text-muted text-sm">
          {dict.meta.updated}: {formatDate(locale, entry.frontmatter.updated)}
        </p>

        <Mdx source={entry.content} newTabLabel={dict.a11y.newTab} />

        <div className="border-line bg-sunken flex flex-col items-start gap-4 rounded-lg border p-8">
          <h2 className="font-display text-xl">{t.helpTitle}</h2>
          <p className="text-muted max-w-[var(--measure)]">{t.helpBody}</p>
          <Button href={localeHref(locale, "/services/contact")}>{t.helpCta}</Button>
        </div>

        <Link href={localeHref(locale, "/services")} className="text-brand-deep hover:text-brand-dark text-sm font-semibold">
          &larr; {t.back}
        </Link>
      </div>
    </>
  );
}
