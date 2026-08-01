import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
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
    lede: "Use this if you want BIRSA to do something with the personal data we hold about you: see it, get a copy, have it corrected or deleted, or one of the other rights the Personal Data Protection Act gives you.",
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
    title: "ยื่นคำร้องเกี่ยวกับข้อมูลของคุณ",
    privacyCrumb: "ความเป็นส่วนตัว",
    lede: "ใช้แบบฟอร์มนี้หากคุณต้องการให้ BIRSA ดำเนินการอย่างใดอย่างหนึ่งกับข้อมูลส่วนบุคคลของคุณที่เราเก็บไว้ เช่น ขอดูข้อมูล ขอสำเนา ขอแก้ไขหรือขอให้ลบ หรือใช้สิทธิอื่นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล",
    whatTitle: "ขั้นตอนที่จะเกิดขึ้น",
    whatBody:
      "ตอบคำถามสั้น ๆ ไม่กี่ข้อว่าคุณต้องการใช้สิทธิใดและติดต่อคุณได้ทางไหน เราจะตรวจสอบว่าคำร้องเป็นของคุณจริง แล้วดำเนินการให้หรืออธิบายเหตุผลหากทำไม่ได้",
    freeTitle: "ไม่มีค่าใช้จ่าย",
    freeBody: "BIRSA ไม่สามารถเรียกเก็บค่าใช้จ่ายจากคุณในการยื่นคำร้องนี้ ไม่ว่าจะใช้สิทธิใด",
    deadlineTitle: "ใช้เวลานานเท่าไร",
    deadlineBody: (days) =>
      `หากคุณขอดูข้อมูลของคุณตามมาตรา 30 กฎหมายกำหนดให้ BIRSA ตอบภายใน ${days} วัน นับจากวันที่เราได้รับคำร้อง ส่วนคำร้องประเภทอื่นเราตั้งใจตอบให้เร็วเช่นกัน`,
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
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.whatTitle}</h2>
          <p className="text-muted leading-relaxed">{t.whatBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.freeTitle}</h2>
          <p className="text-muted leading-relaxed">{t.freeBody}</p>
        </section>

        <Notice variant="info" title={t.deadlineTitle}>
          {t.deadlineBody(RIGHTS_RESPONSE_DAYS)}
        </Notice>

        <div>
          <Button href={localeHref(locale, "/privacy/your-data/what")}>{t.startCta}</Button>
        </div>
      </div>
    </>
  );
}
