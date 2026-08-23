import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import SignpostSource from "@/components/help/SignpostSource";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * `/help/international/healthcare-and-insurance` (SCOPE-AUDIT-2.0 §3.3
 * SIGNPOST row, `international/healthcare-and-insurance.mdx`).
 *
 * DECISIONS-2.0.md Gate 2 records the one fact the audit could not settle,
 * now settled by the operator: health insurance IS REQUIRED for an
 * international student to enter Thailand. The 1.0 page hedges ("many
 * universities, including Thammasat, expect or require"), which the
 * operator named as exactly the vagueness that leaves a student unable to
 * act. `insuranceHeading`/`insuranceBody` below state the requirement
 * plainly and then point at TU International Affairs for current detail
 * (the figure, the accepted providers, any university-arranged option),
 * none of which this page invents.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy = {
  en: {
    title: "Healthcare and insurance",
    lede: "Health insurance is required. TU International Affairs confirms the current detail, not BIRSA.",
    insuranceHeading: "Health insurance is required",
    insuranceBody:
      "Health insurance is required for an international student to enter Thailand to study. What counts as valid cover, and any university-arranged option, is set and confirmed by TU International Affairs, not BIRSA. Confirm the current requirement with them before you travel, and keep your insurance documents, physical or digital, accessible in case a hospital asks for them.",
    hospitalsHeading: "Hospitals near campus",
    hospitalsBody:
      "Siriraj Hospital, one of Thailand's largest hospitals, is directly across the river from Tha Prachan, reachable by a short cross-river boat. Several other hospitals and clinics, public and private, serve the wider old city area.",
    emergencyHeading: "Emergency numbers",
    emergencyBody: "Medical emergency or ambulance: 1669. Police: 191.",
    signpostName: "TU International Affairs",
    signpostBody:
      "TU International Affairs confirms the specific insurance requirement for international students, and any university-arranged option, and issues the documents that go with it.",
    signpostLinkLabel: "TU International Affairs website",
  },
  th: {
    title: "การรักษาพยาบาลและประกันสุขภาพ",
    lede: "ประกันสุขภาพเป็นข้อกำหนดที่ต้องมี กองงานวิเทศสัมพันธ์เป็นผู้ยืนยันรายละเอียดล่าสุด ไม่ใช่ BIRSA",
    insuranceHeading: "ประกันสุขภาพเป็นข้อกำหนดที่ต้องมี",
    insuranceBody:
      "นักศึกษาต่างชาติต้องมีประกันสุขภาพจึงจะเดินทางเข้าประเทศไทยเพื่อศึกษาได้ ส่วนความคุ้มครองที่นับว่าใช้ได้ และตัวเลือกประกันที่มหาวิทยาลัยจัดให้ (ถ้ามี) เป็นเรื่องที่กองงานวิเทศสัมพันธ์เป็นผู้กำหนดและยืนยัน ไม่ใช่ BIRSA ควรตรวจสอบข้อกำหนดล่าสุดกับกองงานวิเทศสัมพันธ์ก่อนเดินทาง และเก็บเอกสารประกันสุขภาพ ทั้งฉบับกระดาษหรือไฟล์ ไว้ในที่หยิบใช้ได้ทันทีเผื่อโรงพยาบาลขอดู",
    hospitalsHeading: "โรงพยาบาลใกล้มหาวิทยาลัย",
    hospitalsBody:
      "โรงพยาบาลศิริราช หนึ่งในโรงพยาบาลขนาดใหญ่ที่สุดของไทย อยู่ฝั่งตรงข้ามแม่น้ำจากท่าพระจันทร์ นั่งเรือข้ามฟากใช้เวลาไม่นาน นอกจากนี้ยังมีโรงพยาบาลและคลินิกทั้งภาครัฐและเอกชนอีกหลายแห่งในย่านเกาะรัตนโกสินทร์",
    emergencyHeading: "เบอร์โทรฉุกเฉิน",
    emergencyBody: "เหตุฉุกเฉินทางการแพทย์หรือรถพยาบาล โทร 1669 ตำรวจ โทร 191",
    signpostName: "กองงานวิเทศสัมพันธ์ ธรรมศาสตร์ (TU International Affairs)",
    signpostBody:
      "กองงานวิเทศสัมพันธ์เป็นผู้ยืนยันข้อกำหนดประกันสุขภาพสำหรับนักศึกษาต่างชาติ รวมถึงตัวเลือกประกันที่มหาวิทยาลัยจัดให้ และออกเอกสารที่เกี่ยวข้อง",
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
    path: "/help/international/healthcare-and-insurance",
  });
}

export default async function HealthcareAndInsurancePage({
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
        <Heading level={2}>{t.insuranceHeading}</Heading>
        <Text step="body">{t.insuranceBody}</Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>{t.hospitalsHeading}</Heading>
        <Text step="body">{t.hospitalsBody}</Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>{t.emergencyHeading}</Heading>
        <Text step="body" className="font-semibold text-ink">
          {t.emergencyBody}
        </Text>
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
