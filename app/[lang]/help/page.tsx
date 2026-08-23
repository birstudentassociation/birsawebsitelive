import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import NavList, { NavListItem } from "@/components/bds/NavList";

/**
 * The `/help` hub (REDESIGN-2.0 §3.2, ROUTE-MAP-2.0 Wave 5C): "Smart Answers,
 * guides, the rules that apply to you, reporting, welfare, international
 * student support."
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
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.hub.title,
    description: dict.hub.lede,
    path: "/help",
  });
}

type Entry = {
  slug: string;
  title: { en: string; th: string };
  body: { en: string; th: string };
};

const entries: Entry[] = [
  {
    slug: "answers",
    title: { en: "Get an answer", th: "ค้นหาคำตอบ" },
    body: {
      en: "Answer a few questions and get the part of the rules, the handbook or the service that applies to you.",
      th: "ตอบคำถามไม่กี่ข้อ แล้วดูว่ากฎระเบียบ คู่มือนักศึกษา หรือบริการส่วนไหนที่ใช้กับกรณีของคุณ",
    },
  },
  {
    slug: "getting-started",
    title: { en: "Getting started at BIR", th: "เริ่มต้นที่ BIR" },
    body: {
      en: "Arriving, your first week, and reaching Tha Prachan or Rangsit.",
      th: "การมาถึง สัปดาห์แรก และการเดินทางไปท่าพระจันทร์หรือรังสิต",
    },
  },
  {
    slug: "regulations",
    title: { en: "Rules and rights", th: "กฎและสิทธิของคุณ" },
    body: {
      en: "The regulations that govern BIRSA and student activity, and the rights you already have as a student.",
      th: "ระเบียบที่กำกับ BIRSA และกิจกรรมนักศึกษา และสิทธิที่คุณมีอยู่แล้วในฐานะนักศึกษา",
    },
  },
  {
    slug: "reporting",
    title: { en: "Report harassment or bullying", th: "แจ้งการคุกคามหรือกลั่นแกล้ง" },
    body: {
      en: "The two channels for reporting, and what happens after you report.",
      th: "สองช่องทางสำหรับแจ้งเรื่อง และสิ่งที่เกิดขึ้นหลังจากแจ้ง",
    },
  },
  {
    slug: "welfare",
    title: { en: "Welfare and wellbeing", th: "สวัสดิการและสุขภาพใจ" },
    body: {
      en: "What BIRSA can do, and where TU Well Being takes over.",
      th: "สิ่งที่ BIRSA ช่วยได้ และจุดที่ TU Well Being เป็นผู้ดูแลต่อ",
    },
  },
  {
    slug: "international",
    title: { en: "International student support", th: "ความช่วยเหลือสำหรับนักศึกษาต่างชาติ" },
    body: {
      en: "Visas, banking, and healthcare, and who to ask for each.",
      th: "วีซ่า ธนาคาร และสุขภาพ พร้อมหน่วยงานที่ควรสอบถามในแต่ละเรื่อง",
    },
  },
  {
    slug: "university-services",
    title: { en: "University services", th: "บริการจากมหาวิทยาลัย" },
    body: {
      en: "Accident insurance, libraries, printing, counselling and IT support, run by Thammasat.",
      th: "ประกันอุบัติเหตุ ห้องสมุด การพิมพ์เอกสาร การให้คำปรึกษา และไอที ดำเนินการโดยธรรมศาสตร์",
    },
  },
  {
    slug: "guides",
    title: { en: "Guides", th: "คู่มือ" },
    body: {
      en: "Short pages on things Thammasat or Tha Prachan campus runs, not BIRSA.",
      th: "หน้าสั้น ๆ เรื่องที่ธรรมศาสตร์หรือแคมปัสท่าพระจันทร์ดูแล ไม่ใช่ BIRSA",
    },
  },
];

export default async function HelpHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  return (
    <HelpPageShell
      locale={locale}
      title={dict.hub.title}
      lede={dict.hub.lede}
      breadcrumbItems={[{ label: dict.site.name, href: "/" }, { label: dict.hub.title }]}
    >
      <NavList>
        {entries.map((entry) => (
          <NavListItem
            key={entry.slug}
            href={localeHref(locale, `/help/${entry.slug}`)}
            title={entry.title[locale]}
            level={2}
          >
            {entry.body[locale]}
          </NavListItem>
        ))}
      </NavList>
    </HelpPageShell>
  );
}
