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

  const title = locale === "th" ? "เกี่ยวกับเรา" : "About";
  const description =
    locale === "th"
      ? "BIRSA คือใคร หลักสูตร BIR เป็นอย่างไร และจะติดต่อเราได้ที่ไหน"
      : "Who BIRSA is, what the BIR programme is, and where to find the essentials.";

  return buildMetadata({ locale, title, description, path: "/about" });
}

const copy: Record<Locale, { title: string; lede: string }> = {
  en: {
    title: "About",
    lede: "Who BIRSA is, what the BIR programme is, and where to find the essentials, from the committee structure to how to get in touch.",
  },
  th: {
    title: "เกี่ยวกับเรา",
    lede: "BIRSA คือใคร หลักสูตร BIR เป็นอย่างไร และจะหาข้อมูลสำคัญได้จากที่ไหน ตั้งแต่โครงสร้างคณะกรรมการไปจนถึงช่องทางติดต่อ",
  },
};

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const entries = getEntries("about", locale);

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
          {entries.map((entry) => {
            const href = localeHref(locale, `/about/${entry.slug}`);
            return (
              <Card key={entry.slug} href={href}>
                <CardTitle href={href} as="h2">
                  {entry.frontmatter.title}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{entry.frontmatter.summary}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
