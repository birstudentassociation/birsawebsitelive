import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import DesignReference from "@/components/bds/DesignReference";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

/**
 * `/design`: the public reference page for the BIRSA Design System
 * (REDESIGN-2.0 §4.1, §11.6 point 5).
 *
 * This is the Wave 1 skeleton. It renders the colour palette, the bilingual
 * type scale, the spacing scale and the full component manifest, all read
 * straight from `components/bds/tokens.ts` and `components/bds/manifest.ts`
 * so the page cannot say something the system does not actually do. Wave 2
 * fills in live component demonstrations as each cluster lands; this wave
 * only builds the harness that makes "a component that shipped without an
 * entry here has not shipped" a test rather than a rule.
 *
 * Excluded from the public Lighthouse budgets and from search indexing:
 * this is a developer and reviewer reference, not a page students need.
 */

const content: Record<Locale, { title: string; lede: string }> = {
  en: {
    title: "Design system",
    lede: "The colours, type, spacing and components the BIRSA Portal is built from, rendered from the same source the system itself reads.",
  },
  th: {
    title: "ระบบดีไซน์",
    lede: "สี ตัวอักษร ระยะห่าง และองค์ประกอบทั้งหมดที่ใช้สร้างเว็บไซต์ BIRSA แสดงผลจากแหล่งข้อมูลเดียวกับที่ระบบใช้งานจริง",
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
  const t = content[locale];

  const metadata = buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/design",
  });

  return {
    ...metadata,
    // A developer and reviewer reference, not a page students search for.
    // Kept out of the public Lighthouse budgets (REDESIGN-2.0 §9) and out
    // of search results.
    robots: { index: false, follow: false },
  };
}

export default async function DesignPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = content[locale];

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
      <div className="wrap py-10">
        <DesignReference locale={locale} />
      </div>
    </>
  );
}
