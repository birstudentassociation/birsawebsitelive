import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/activity" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    rolesTitle: string;
    rolesSummary: string;
    regsTitle: string;
    regsSummary: string;
    newsTitle: string;
    newsSummary: string;
  }
> = {
  en: {
    title: "BIRSA activity",
    lede: "How BIRSA is run — officer roles, student regulations, transparency documents, and the latest news and events.",
    rolesTitle: "Officer roles",
    rolesSummary: "Who sits on the BIRSA committee, and what each role is responsible for.",
    regsTitle: "Student regulations and rules",
    regsSummary: "The University's regulations on student activities and discipline, plus the Faculty Notice — set out provision by provision.",
    newsTitle: "News",
    newsSummary: "BIRSA's latest news and upcoming events.",
  },
  th: {
    title: "การดำเนินงานของ BIRSA",
    lede: "การดำเนินงานของ BIRSA — บทบาทหน้าที่ของกรรมการ ระเบียบนักศึกษา เอกสารความโปร่งใส และข่าวสารกิจกรรมล่าสุด",
    rolesTitle: "บทบาทหน้าที่ของคณะกรรมการ",
    rolesSummary: "ใครอยู่ในคณะกรรมการ BIRSA บ้าง และแต่ละตำแหน่งรับผิดชอบเรื่องอะไร",
    regsTitle: "ระเบียบและข้อบังคับนักศึกษา",
    regsSummary: "ข้อบังคับมหาวิทยาลัยว่าด้วยกิจกรรมนักศึกษาและวินัยนักศึกษา และประกาศคณะ จัดเรียงเป็นรายข้อ",
    newsTitle: "ข่าวและกิจกรรม",
    newsSummary: "ข่าวสารล่าสุดและกิจกรรมที่กำลังจะมาถึงของ BIRSA",
  },
};

export default async function ActivityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const entries = getEntries("activity", locale);

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
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(() => {
            const rolesHref = localeHref(locale, "/activity/roles");
            return (
              <Card href={rolesHref}>
                <CardTitle href={rolesHref} as="h2">
                  {t.rolesTitle}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{t.rolesSummary}</p>
              </Card>
            );
          })()}

          {(() => {
            const regsHref = localeHref(locale, "/activity/regulations");
            return (
              <Card href={regsHref}>
                <CardTitle href={regsHref} as="h2">
                  {t.regsTitle}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{t.regsSummary}</p>
              </Card>
            );
          })()}

          {entries.map((entry) => {
            const href = localeHref(locale, `/activity/${entry.slug}`);
            return (
              <Card key={entry.slug} href={href}>
                <CardTitle href={href} as="h2">
                  {entry.frontmatter.title}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{entry.frontmatter.summary}</p>
              </Card>
            );
          })}

          {(() => {
            const newsHref = localeHref(locale, "/news");
            return (
              <Card href={newsHref}>
                <CardTitle href={newsHref} as="h2">
                  {t.newsTitle}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{t.newsSummary}</p>
              </Card>
            );
          })()}
        </div>
      </div>
    </>
  );
}
