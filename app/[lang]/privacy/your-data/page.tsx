import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Wrap, Stack, Section } from "@/components/bds/Layout";
import Notice from "@/components/bds/Notice";
import PageHeader from "@/components/bds/PageHeader";
import { Heading, Text } from "@/components/bds/Type";
import { RIGHTS_RESPONSE_DAYS } from "@/content/privacy/register";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/privacy/your-data" });
}

const copy: Record<
  Locale,
  {
    title: string;
    privacyCrumb: string;
    lede: string;
    whatTitle: string;
    whatBody: string;
    freeTitle: string;
    freeBody: string;
    deadlineTitle: string;
    deadlineBody: (days: number) => string;
    startCta: string;
  }
> = {
  en: {
    title: "Ask about your data",
    privacyCrumb: "Privacy",
    lede: "Use this if you want BIRSA to do something with the personal data we hold about you. See it, get a copy, have it corrected or deleted, or use one of the other rights the Personal Data Protection Act gives you.",
    whatTitle: "What happens",
    whatBody:
      "Answer a few short questions about which right you want to use and how to reach you. We check the request is genuinely yours, then act on it or explain why we can't.",
    freeTitle: "This is free",
    freeBody: "BIRSA cannot charge you for making this request, whichever right you use.",
    deadlineTitle: "How long it takes",
    deadlineBody: (days) =>
      `If you're asking to see your data under section 30, the law gives BIRSA ${days} days to answer from the day we receive your request. We aim to answer other requests just as quickly.`,
    startCta: "Start now",
  },
  th: {
    title: "คำร้องขอใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล",
    privacyCrumb: "ประกาศความเป็นส่วนตัว",
    lede: "โปรดใช้แบบฟอร์มนี้เพื่อยื่นคำร้องขอให้ BIRSA ดำเนินการเกี่ยวกับข้อมูลส่วนบุคคลของท่านที่ BIRSA เก็บรักษาไว้ เช่น ขอเข้าถึงและขอรับสำเนาข้อมูล ขอให้แก้ไขข้อมูลให้ถูกต้อง ขอให้ลบหรือทำลายข้อมูล หรือขอใช้สิทธิประการอื่นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562",
    whatTitle: "ขั้นตอนการดำเนินการ",
    whatBody:
      "ท่านจะได้ตอบคำถามจำนวนไม่กี่ข้อ เพื่อระบุสิทธิที่ท่านประสงค์จะใช้และช่องทางการติดต่อกลับ จากนั้น BIRSA จะตรวจสอบตามสมควรว่าคำร้องดังกล่าวเป็นของท่านจริง แล้วจึงดำเนินการตามคำร้อง หรือชี้แจงเหตุผลในกรณีที่ไม่อาจดำเนินการได้",
    freeTitle: "ค่าใช้จ่าย",
    freeBody:
      "BIRSA ไม่เรียกเก็บค่าใช้จ่ายใดจากท่านในการยื่นคำร้องนี้ ไม่ว่าจะเป็นการใช้สิทธิประการใด",
    deadlineTitle: "ระยะเวลาดำเนินการ",
    deadlineBody: (days) =>
      `ในกรณีที่ท่านใช้สิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลตามมาตรา 30 กฎหมายกำหนดให้ BIRSA ดำเนินการโดยไม่ชักช้า แต่ต้องไม่เกิน ${days} วันนับแต่วันที่ได้รับคำขอ สำหรับคำร้องประเภทอื่น BIRSA จะดำเนินการโดยเร็วเช่นเดียวกัน`,
    startCta: "เริ่มยื่นคำร้อง",
  },
};

export default async function RightsStartPage({ params }: { params: Promise<{ lang: string }> }) {
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
              { label: t.privacyCrumb, href: "/privacy" },
              { label: t.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.whatTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.whatBody}
            </Text>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.freeTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.freeBody}
            </Text>
          </Stack>
        </Section>

        <Notice variant="info" title={t.deadlineTitle}>
          {t.deadlineBody(RIGHTS_RESPONSE_DAYS)}
        </Notice>

        <div>
          <Button href={localeHref(locale, "/privacy/your-data/what")}>{t.startCta}</Button>
        </div>
      </Wrap>
    </>
  );
}
