import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import SignpostSource from "@/components/help/SignpostSource";
import Notice from "@/components/bds/Notice";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * `/help/international/visa-and-immigration` (SCOPE-AUDIT-2.0 §3.3 SIGNPOST
 * row, `international/visa-and-immigration.mdx`).
 *
 * DECISIONS-2.0.md Gate 2 and REDESIGN-2.0 §3.6 both call this the
 * highest-risk page on the site: being wrong here can put a student out of
 * status, BIRSA has no authority over immigration law, and it has no way to
 * know when the rules move. This page therefore holds NO procedural detail
 * at all, not even the one piece of detail the audit flagged in the 1.0 page
 * (a named government complex for visa extensions). It says what the 90 day
 * report and a re-entry permit ARE, in one sentence each, then names who
 * decides. It does not describe how to file either one, because that is
 * exactly the kind of sentence that goes stale without BIRSA knowing.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy = {
  en: {
    title: "Visa and immigration",
    lede: "In outline only. TU International Affairs and the Thai Immigration Bureau are the offices that actually decide, not BIRSA.",
    noticeBody:
      "This page is general orientation, not legal advice. Immigration rules and procedures change, so always confirm the current requirement with TU International Affairs or the Thai Immigration Bureau before you act.",
    visaHeading: "The Non-Immigrant ED visa",
    visaBody:
      'Most degree-seeking international students study in Thailand on a Non-Immigrant "ED" (education) visa, tied to your enrolment at the university.',
    reportingHeading: "The 90 day report",
    reportingBody:
      "If you stay in Thailand continuously, immigration law requires you to report your address every 90 days. It is a routine notification, not a new visa application, but missing the deadline can bring a fine.",
    reentryHeading: "Re-entry permits",
    reentryBody:
      "If you plan to travel outside Thailand and return on the same visa, you generally need a re-entry permit before you leave, or the visa can be cancelled the moment you exit the country.",
    signpostName: "TU International Affairs",
    signpostBody:
      "TU International Affairs issues the supporting letters your visa and extension applications need, and is the office to ask for the current process, required documents and deadlines. For anything about the law itself, the Thai Immigration Bureau is the authority.",
    signpostLinkLabel: "TU International Affairs website",
  },
  th: {
    title: "วีซ่าและการตรวจคนเข้าเมือง",
    lede: "ข้อมูลโดยสรุปเท่านั้น กองงานวิเทศสัมพันธ์ (TU International Affairs) และสำนักงานตรวจคนเข้าเมืองเป็นผู้ตัดสินใจจริง ไม่ใช่ BIRSA",
    noticeBody:
      "หน้านี้เป็นข้อมูลปฐมนิเทศทั่วไป ไม่ใช่คำแนะนำทางกฎหมาย กฎและขั้นตอนด้านการตรวจคนเข้าเมืองเปลี่ยนแปลงได้ตลอด จึงควรตรวจสอบข้อกำหนดล่าสุดกับกองงานวิเทศสัมพันธ์หรือสำนักงานตรวจคนเข้าเมืองก่อนดำเนินการทุกครั้ง",
    visaHeading: "วีซ่านักเรียนประเภท Non-Immigrant ED",
    visaBody:
      "นักศึกษาต่างชาติที่เรียนระดับปริญญาส่วนใหญ่ถือวีซ่านักเรียนประเภท Non-Immigrant ED ซึ่งผูกกับสถานะการลงทะเบียนเรียนที่มหาวิทยาลัย",
    reportingHeading: "การรายงานตัวทุก 90 วัน",
    reportingBody:
      "หากพำนักอยู่ในไทยต่อเนื่อง กฎหมายตรวจคนเข้าเมืองกำหนดให้ต้องรายงานที่อยู่ทุก 90 วัน เป็นการแจ้งตามปกติ ไม่ใช่การขอวีซ่าใหม่ แต่หากพลาดกำหนดอาจมีค่าปรับ",
    reentryHeading: "ใบอนุญาตกลับเข้าประเทศ (Re-entry permit)",
    reentryBody:
      "หากวางแผนเดินทางออกนอกประเทศไทยแล้วจะกลับมาด้วยวีซ่าเดิม โดยทั่วไปต้องขอใบอนุญาตกลับเข้าประเทศก่อนออกเดินทาง มิเช่นนั้นวีซ่าอาจถูกยกเลิกทันทีที่ออกนอกประเทศ",
    signpostName: "กองงานวิเทศสัมพันธ์ ธรรมศาสตร์ (TU International Affairs)",
    signpostBody:
      "กองงานวิเทศสัมพันธ์เป็นผู้ออกหนังสือรับรองที่ใช้ยื่นขอวีซ่าและการต่ออายุ และเป็นหน่วยงานที่ควรสอบถามขั้นตอน เอกสาร และกำหนดเวลาล่าสุด ส่วนเรื่องข้อกฎหมายโดยตรง สำนักงานตรวจคนเข้าเมืองเป็นผู้มีอำนาจ",
    signpostLinkLabel: "เว็บไซต์กองงานวิเทศสัมพันธ์",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];
  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/help/international/visa-and-immigration",
  });
}

export default async function VisaAndImmigrationPage({
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
    <HelpPageShell
      locale={locale}
      title={t.title}
      lede={t.lede}
      breadcrumbItems={[
        { label: dict.site.name, href: "/" },
        { label: dict.hub.title, href: "/help" },
        { label: dict.internationalIndex.title, href: "/help/international" },
        { label: t.title },
      ]}
    >
      <Notice variant="warning">{t.noticeBody}</Notice>

      <Stack gap="sm">
        <Heading level={2}>{t.visaHeading}</Heading>
        <Text step="body">{t.visaBody}</Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>{t.reportingHeading}</Heading>
        <Text step="body">{t.reportingBody}</Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>{t.reentryHeading}</Heading>
        <Text step="body">{t.reentryBody}</Text>
      </Stack>

      <SignpostSource
        locale={locale}
        name={t.signpostName}
        body={t.signpostBody}
        href="https://www.oia.tu.ac.th"
        linkLabel={t.signpostLinkLabel}
      />
    </HelpPageShell>
  );
}
