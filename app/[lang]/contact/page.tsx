import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import Email from "@/components/Email";
import ContactForm from "@/components/forms/ContactForm";
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
    lede: "Send us a message with the form below, or reach out directly.",
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
    lede: "ส่งข้อความถึงเราผ่านแบบฟอร์มด้านล่าง หรือติดต่อโดยตรงตามที่สะดวก",
    answersTitle: "หาคำตอบเองได้เร็วกว่า",
    answersBody:
      "เรื่องกฎระเบียบ กำหนดเวลา และบริการ มีคำตอบแบบนำทางให้แล้ว พร้อมข้ออ้างอิงที่มาของแต่ละคำตอบ",
    answersCta: "ค้นหาคำตอบ",
    otherWaysTitle: "ช่องทางติดต่ออื่น ๆ",
    otherWaysBody: "อีเมลหรือติดต่อเราทางโซเชียลมีเดียได้โดยตรง",
    emailLabel: "อีเมล",
  },
};

const CATEGORY_VALUES = ["question", "suggestion", "problem", "other"] as const;

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; from?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const { category, from } = await searchParams;
  const initialCategory = CATEGORY_VALUES.includes(category as (typeof CATEGORY_VALUES)[number])
    ? category
    : undefined;

  // Arriving from the site-wide "report a problem with this page" link: prefill
  // the subject with the page the report is about. Only same-site paths are
  // accepted so the value can't be steered to arbitrary text.
  const initialSubject =
    initialCategory === "problem" && typeof from === "string" && from.startsWith("/")
      ? `${locale === "th" ? "ปัญหาในหน้า" : "Problem with page"}: ${from}`
      : undefined;

  const visibleSocials = socials.filter((social) => !social.placeholder);

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
        <ContactForm
          locale={locale}
          dict={dict}
          initialCategory={initialCategory}
          initialSubject={initialSubject}
        />

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
