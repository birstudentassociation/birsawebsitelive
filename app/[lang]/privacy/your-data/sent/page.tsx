import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import { RIGHTS_RESPONSE_DAYS } from "@/content/privacy/register";

const copy: Record<
  Locale,
  {
    title: string;
    privacyCrumb: string;
    confirmationBody: string;
    deadlineTitle: string;
    deadlineBody: (days: number) => string;
    nextTitle: string;
    nextBody: string;
    backLink: string;
  }
> = {
  en: {
    title: "Request sent",
    privacyCrumb: "Privacy",
    confirmationBody: "Thank you. Your request has reached BIRSA.",
    deadlineTitle: "What happens next",
    deadlineBody: (days) =>
      `If you asked to see your data under section 30, we have ${days} days from today to answer. We aim to answer other requests just as quickly.`,
    nextTitle: "How we'll answer",
    nextBody:
      "A BIRSA officer will reply to the email address you gave us. If we need more information to be sure the request is yours, or to find your data, we'll ask you for it there.",
    backLink: "Back to home",
  },
  th: {
    title: "ส่งคำร้องแล้ว",
    privacyCrumb: "ความเป็นส่วนตัว",
    confirmationBody: "ส่งเรียบร้อย คำร้องของคุณถึง BIRSA แล้ว",
    deadlineTitle: "ขั้นตอนต่อไป",
    deadlineBody: (days) =>
      `หากคุณขอดูข้อมูลของคุณตามมาตรา 30 เรามีเวลา ${days} วันนับจากวันนี้ในการตอบกลับ ส่วนคำร้องประเภทอื่นเราตั้งใจตอบให้เร็วเช่นกัน`,
    nextTitle: "เราจะตอบกลับอย่างไร",
    nextBody:
      "เจ้าหน้าที่ BIRSA จะตอบกลับไปยังอีเมลที่คุณให้ไว้ หากเราต้องการข้อมูลเพิ่มเติมเพื่อยืนยันว่าคำร้องเป็นของคุณ หรือเพื่อค้นหาข้อมูลของคุณ เราจะสอบถามไปทางอีเมลนั้น",
    backLink: "กลับสู่หน้าหลัก",
  },
};

/**
 * Confirmation page for a submitted PDPA rights request (Post/Redirect/Get
 * target of app/[lang]/privacy/your-data/actions.ts). A plain server-rendered
 * page, not a client "success" state, so refreshing it just re-requests this
 * same GET instead of resubmitting the request: no JavaScript is needed for
 * that guarantee to hold, matching app/[lang]/feedback/sent/page.tsx.
 *
 * Never indexed: it carries no content of its own worth finding in search.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];

  const metadata = buildMetadata({
    locale,
    title: t.title,
    description: t.confirmationBody,
    path: "/privacy/your-data/sent",
  });
  return { ...metadata, robots: { index: false, follow: true } };
}

export default async function RightsSentPage({
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
    <>
      <PageHeader
        title={t.title}
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
        <div
          role="status"
          className="border-success bg-success-tint text-ink focus-halo rounded-lg border-l-4 p-6"
        >
          <p className="text-sm">{t.confirmationBody}</p>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.deadlineTitle}</h2>
          <p className="text-muted leading-relaxed">{t.deadlineBody(RIGHTS_RESPONSE_DAYS)}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.nextTitle}</h2>
          <p className="text-muted leading-relaxed">{t.nextBody}</p>
        </section>

        <div>
          <Button href={localeHref(locale, "/")} variant="secondary">
            {t.backLink}
          </Button>
        </div>
      </div>
    </>
  );
}
