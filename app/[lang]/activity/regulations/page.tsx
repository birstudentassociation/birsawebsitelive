import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";
import { documents } from "@/content/activity/regulations";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy: Record<Locale, { title: string; lede: string; sectionLabel: string }> = {
  en: {
    title: "Student regulations and rules",
    lede: "The rules that govern BIRSA and student activities: the University's own Regulation and the Faculty Notice issued under it, each set out provision by provision.",
    sectionLabel: "BIRSA activity",
  },
  th: {
    title: "ระเบียบและข้อบังคับนักศึกษา",
    lede: "กฎเกณฑ์ที่กำกับ BIRSA และกิจกรรมนักศึกษา ทั้งข้อบังคับของมหาวิทยาลัยและประกาศของคณะที่ออกตามข้อบังคับนั้น จัดเรียงเป็นรายข้อ",
    sectionLabel: "การดำเนินงานของ BIRSA",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];
  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/activity/regulations" });
}

export default async function RegulationsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

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
              { label: t.sectionLabel, href: "/activity" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {documents.map((doc) => {
            const href = localeHref(locale, `/activity/regulations/${doc.slug}`);
            return (
              <Card key={doc.slug} href={href}>
                <CardTitle href={href} as="h2">
                  {doc.shortTitle[locale]}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{doc.citation[locale]}</p>
                <p className="text-muted mt-auto pt-2 text-xs">{doc.made[locale]}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
