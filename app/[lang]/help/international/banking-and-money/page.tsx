import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import SignpostSource from "@/components/help/SignpostSource";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * `/help/international/banking-and-money` (SCOPE-AUDIT-2.0 §3.3 SIGNPOST
 * row, `international/banking-and-money.mdx`).
 *
 * No single bank's requirements are authoritative for all of them, and the
 * university does not run banking either, so this page names the one office
 * that can help with the one document every bank asks for (an enrolment
 * letter) and is honest that the rest is between the student and their own
 * bank.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy = {
  en: {
    title: "Banking and money",
    lede: "Opening a Thai bank account is between you and your chosen bank. TU International Affairs can help with the enrolment letter banks ask for.",
    openingHeading: "Opening a Thai bank account",
    openingBody:
      "Requirements vary by bank and sometimes by branch. International students are typically asked for a combination of a passport, the visa page showing Non-Immigrant ED status, a letter confirming enrolment, and proof of address in Thailand. Ask other international students, or TU International Affairs, which branches near Tha Prachan process student applications most often.",
    promptpayHeading: "PromptPay",
    promptpayBody:
      "PromptPay is Thailand's national instant payment system, linked to a phone number or ID. Once your account supports it, you can send and receive money instantly, split bills, and pay by scanning a QR code.",
    signpostName: "TU International Affairs",
    signpostBody:
      "TU International Affairs is the office that can issue and clarify the enrolment letter your bank asks for. What documents a specific bank or branch requires beyond that is the bank's own decision, not the university's.",
    signpostLinkLabel: "TU International Affairs website",
  },
  th: {
    title: "ธนาคารและการเงิน",
    lede: "การเปิดบัญชีธนาคารไทยเป็นเรื่องระหว่างคุณกับธนาคารที่เลือก กองงานวิเทศสัมพันธ์ช่วยเรื่องหนังสือรับรองการเป็นนักศึกษาที่ธนาคารมักขอได้",
    openingHeading: "การเปิดบัญชีธนาคารไทย",
    openingBody:
      "เงื่อนไขแตกต่างกันไปตามธนาคารและบางครั้งตามสาขา นักศึกษาต่างชาติมักถูกขอเอกสารร่วมกัน เช่น หนังสือเดินทาง หน้าวีซ่าที่แสดงสถานะ Non-Immigrant ED หนังสือรับรองการเป็นนักศึกษา และหลักฐานที่อยู่ในประเทศไทย ลองสอบถามนักศึกษาต่างชาติรุ่นก่อนหรือกองงานวิเทศสัมพันธ์ว่าสาขาใกล้ท่าพระจันทร์สาขาไหนรับเปิดบัญชีให้นักศึกษาบ่อยที่สุด",
    promptpayHeading: "พร้อมเพย์ (PromptPay)",
    promptpayBody:
      "พร้อมเพย์เป็นระบบโอนเงินทันทีระดับประเทศของไทย ผูกกับเบอร์โทรศัพท์หรือเลขบัตรประจำตัว เมื่อบัญชีรองรับแล้ว สามารถโอนและรับเงินได้ทันที หารค่าใช้จ่ายกับเพื่อน และจ่ายเงินด้วยการสแกนคิวอาร์โค้ด",
    signpostName: "กองงานวิเทศสัมพันธ์ ธรรมศาสตร์ (TU International Affairs)",
    signpostBody:
      "กองงานวิเทศสัมพันธ์เป็นผู้ออกและยืนยันหนังสือรับรองการเป็นนักศึกษาที่ธนาคารมักขอ ส่วนเอกสารอื่นที่ธนาคารหรือสาขาใดสาขาหนึ่งกำหนดเพิ่มเติมเป็นดุลยพินิจของธนาคารเอง ไม่ใช่ของมหาวิทยาลัย",
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
    path: "/help/international/banking-and-money",
  });
}

export default async function BankingAndMoneyPage({
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
      <Stack gap="sm">
        <Heading level={2}>{t.openingHeading}</Heading>
        <Text step="body">{t.openingBody}</Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>{t.promptpayHeading}</Heading>
        <Text step="body">{t.promptpayBody}</Text>
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
