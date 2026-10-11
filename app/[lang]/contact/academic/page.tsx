import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import BirOfficeContact from "@/components/BirOfficeContact";
import { buildContactWizardLabels } from "@/components/forms/contactWizardCopy";

/**
 * Where the contact form sends a question about studies, courses or
 * registration. BIRSA does not answer these and nothing here emails BIRSA: the
 * page names the BIR office and how to reach it. Plain links throughout, so it
 * reads the same with JavaScript off.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const { title } = buildContactWizardLabels(locale).academic;
  return buildMetadata({ locale, title, description: title, path: "/contact/academic" });
}

export default async function ContactAcademicPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = buildContactWizardLabels(locale).academic;

  return (
    <>
      <PageHeader title={t.title} />
      <div className="wrap max-w-[var(--measure)] py-10">
        <div className="flex flex-col gap-6">
          <Notice variant="info" title={t.noticeTitle}>
            <p>{t.noticeBody}</p>
          </Notice>
          <section aria-labelledby="bir-office-heading" className="flex flex-col gap-3">
            <h2 id="bir-office-heading" className="font-display text-xl">
              {t.contactHeading}
            </h2>
            <BirOfficeContact locale={locale} />
            <p className="text-sm text-muted">{t.datesNote}</p>
          </section>
          <div>
            <Button href={localeHref(locale, "/contact")} variant="secondary">
              {t.back}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
