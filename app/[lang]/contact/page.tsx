import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import Email from "@/components/Email";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildContactWizardLabels, contactCategoryOptions } from "@/components/forms/contactWizardCopy";
import { getContactDraft, seedContactDraft, submitCategoryStep } from "./actions";
import { CONTACT_STEPS } from "./steps";
import { socials, contact } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ติดต่อ BIRSA" : "Contact BIRSA";
  const description =
    locale === "th"
      ? "ส่งข้อความถึง BIRSA หรือติดต่อโดยตรงทางอีเมลและโซเชียลมีเดีย"
      : "Send BIRSA a message, or reach us directly by email and social media.";

  return buildMetadata({ locale, title, description, path: "/contact" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    answersTitle: string;
    answersBody: string;
    answersCta: string;
    otherWaysTitle: string;
    otherWaysBody: string;
    emailLabel: string;
  }
> = {
  en: {
    title: "Contact BIRSA",
    lede: "Answer a few short questions and we'll get your message to the right person.",
    answersTitle: "Answer it yourself, faster",
    answersBody:
      "Rules, deadlines and services are covered by the guided answers, with the provision each answer comes from.",
    answersCta: "Get an answer",
    otherWaysTitle: "Other ways to reach us",
    otherWaysBody: "Email or message us on social media directly.",
    emailLabel: "Email",
  },
  th: {
    title: "ติดต่อ BIRSA",
    lede: "ตอบคำถามสั้น ๆ ไม่กี่ข้อ แล้วเราจะส่งข้อความของคุณถึงผู้ที่เกี่ยวข้อง",
    answersTitle: "หาคำตอบเองได้เร็วกว่า",
    answersBody:
      "เรื่องกฎระเบียบ กำหนดเวลา และบริการ มีคำตอบแบบนำทางให้แล้ว พร้อมข้ออ้างอิงที่มาของแต่ละคำตอบ",
    answersCta: "ค้นหาคำตอบ",
    otherWaysTitle: "ช่องทางติดต่ออื่น ๆ",
    otherWaysBody: "อีเมลหรือติดต่อเราทางโซเชียลมีเดียได้โดยตรง",
    emailLabel: "อีเมล",
  },
};

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; from?: string; returnTo?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const chrome = buildWizardChromeLabels(locale);
  const wizard = buildContactWizardLabels(locale);

  const { category, from, returnTo } = await searchParams;
  await seedContactDraft(locale, category, from);
  const draft = await getContactDraft();

  const visibleSocials = socials.filter((social) => !social.placeholder);
  const backHref = returnTo === "check" ? localeHref(locale, "/contact/check") : undefined;
  const progress = returnTo === "check"
    ? undefined
    : formatStepOf(chrome.stepOf, CONTACT_STEPS.indexOf("category") + 1, CONTACT_STEPS.length);

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
      <div className="wrap grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6">
          <StepNav backHref={backHref} backLabel={chrome.back} progressText={progress} />
          <h2 className="font-display text-2xl sm:text-3xl">{wizard.categoryHeading}</h2>
          <QuestionStepForm
            action={submitCategoryStep.bind(null, locale, returnTo)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={dict.form.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
            field={{
              name: "category",
              label: dict.form.category,
              as: "select",
              required: true,
              requiredLabel: dict.actions.required,
              options: contactCategoryOptions(locale),
              defaultValue: draft.category ?? "question",
            }}
          />
        </div>

        <aside className="border-line bg-sunken flex flex-col gap-4 rounded-lg border p-6 lg:self-start">
          {/* Answering the question without a round trip is faster for the
              student and cheaper for the committee, so the guided route is
              offered before the form's other channels, not after them. */}
          <div className="border-line flex flex-col gap-2 border-b pb-4">
            <h2 className="font-display text-xl">{t.answersTitle}</h2>
            <p className="text-muted text-sm">{t.answersBody}</p>
            <Link
              href={localeHref(locale, "/answers")}
              className="text-brand-deep text-sm font-semibold hover:underline"
            >
              {t.answersCta} &rarr;
            </Link>
          </div>

          <h2 className="font-display text-xl">{t.otherWaysTitle}</h2>
          <p className="text-muted text-sm">{t.otherWaysBody}</p>
          <dl className="flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-ink font-semibold">{t.emailLabel}</dt>
              <dd className="flex flex-col gap-1">
                <Email address={contact.email} className="text-brand-deep hover:text-brand-dark" />
                <Email
                  address={contact.secondaryEmail}
                  className="text-brand-deep hover:text-brand-dark"
                />
              </dd>
            </div>
            {visibleSocials
              .filter((social) => social.id !== "email")
              .map((social) => (
                <div key={social.id}>
                  <dt className="text-ink font-semibold">{social.label}</dt>
                  <dd>
                    <ExternalLink href={social.href} newTabLabel={dict.a11y.newTab}>
                      {social.label}
                    </ExternalLink>
                  </dd>
                </div>
              ))}
          </dl>
        </aside>
      </div>
    </>
  );
}
