import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, formatDate, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";
import Button from "@/components/Button";
import {
  serviceCategoryOrder,
  serviceCategories,
  isServiceCategory,
} from "@/content/services/categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "บริการนักศึกษา" : "Services";
  const description =
    locale === "th"
      ? "คู่มือสั้น ๆ เรื่องบัญชี TU การลงทะเบียน ค่าเทอม แลกเปลี่ยน สุขภาพ และการแจ้งปัญหา"
      : "Short guides on TU accounts, registration, fees, exchange, health, and reporting problems.";

  return buildMetadata({ locale, title, description, path: "/services" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    contactBandTitle: string;
    contactBandBody: string;
    contactCta: string;
    updated: string;
  }
> = {
  en: {
    title: "Services",
    lede: "Short, practical guides to the everyday things students ask about — accounts, registration, fees, exchange, and health. For official programme matters (grades, formal appeals, transcripts), go through the BIR office directly.",
    contactBandTitle: "Can't find what you need?",
    contactBandBody: "If these guides don't cover your question, contact BIRSA directly and we'll help or point you the right way.",
    contactCta: "Contact BIRSA",
    updated: "Updated",
  },
  th: {
    title: "บริการนักศึกษา",
    lede: "คู่มือสั้น ๆ ที่ใช้งานได้จริงสำหรับเรื่องที่นักศึกษาถามบ่อย ทั้งบัญชีผู้ใช้ การลงทะเบียน ค่าเทอม การแลกเปลี่ยน และสุขภาพ ส่วนเรื่องทางการของหลักสูตร (เกรด การอุทธรณ์ ใบทรานสคริปต์) กรุณาติดต่อฝ่ายบริหาร BIR โดยตรง",
    contactBandTitle: "หาสิ่งที่ต้องการไม่เจอ?",
    contactBandBody: "ถ้าคู่มือเหล่านี้ยังไม่ตอบคำถามของคุณ ติดต่อ BIRSA ได้โดยตรง เราจะช่วยหรือชี้ทางให้",
    contactCta: "ติดต่อ BIRSA",
    updated: "อัปเดตล่าสุด",
  },
};

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const entries = getEntries("services", locale);
  const grouped = serviceCategoryOrder.map((category) => ({
    category,
    entries: entries.filter((entry) => entry.frontmatter.category === category),
  })).filter((group) => group.entries.length > 0);

  // Any entries whose category isn't in our known map still render, grouped
  // as "Other", so content never silently disappears from the hub.
  const uncategorized = entries.filter((entry) => !isServiceCategory(entry.frontmatter.category));

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
        {grouped.map((group) => (
          <section key={group.category} className="flex flex-col gap-4">
            <h2 className="font-display text-2xl">{serviceCategories[group.category][locale]}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.entries.map((entry) => {
                const href = localeHref(locale, `/services/${entry.slug}`);
                return (
                  <Card key={entry.slug} href={href}>
                    <CardTitle href={href}>{entry.frontmatter.title}</CardTitle>
                    <p className="text-muted text-sm leading-relaxed">{entry.frontmatter.summary}</p>
                    <p className="text-muted mt-auto text-xs">
                      {t.updated}: {formatDate(locale, entry.frontmatter.updated)}
                    </p>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {uncategorized.length > 0 ? (
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {uncategorized.map((entry) => {
                const href = localeHref(locale, `/services/${entry.slug}`);
                return (
                  <Card key={entry.slug} href={href}>
                    <CardTitle href={href}>{entry.frontmatter.title}</CardTitle>
                    <p className="text-muted text-sm leading-relaxed">{entry.frontmatter.summary}</p>
                  </Card>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="border-line bg-sunken flex flex-col items-start gap-4 rounded-lg border p-8">
          <h2 className="font-display text-2xl">{t.contactBandTitle}</h2>
          <p className="text-muted max-w-[var(--measure)]">{t.contactBandBody}</p>
          <Button href={localeHref(locale, "/services/contact")}>{t.contactCta}</Button>
        </div>
      </div>
    </>
  );
}
