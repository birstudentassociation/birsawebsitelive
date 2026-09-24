import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { buildStartClubWizardLabels } from "@/components/forms/startClubWizardCopy";
import ConfirmationPage from "@/components/forms/ConfirmationPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const wizard = buildStartClubWizardLabels(lang);
  const metadata = buildMetadata({
    locale: lang,
    title: wizard.successTitle,
    description: wizard.successBody,
    path: "/clubs/start/sent",
  });
  return { ...metadata, robots: { index: false, follow: true } };
}

export default async function StartClubSentPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const wizard = buildStartClubWizardLabels(locale);

  return (
    <ConfirmationPage
      locale={locale}
      title={wizard.successTitle}
      next={[wizard.successBody]}
      links={[
        {
          href: localeHref(locale, "/clubs"),
          label: locale === "th" ? "ดูชมรมที่มีอยู่" : "See existing clubs",
        },
      ]}
      sourcePath={localeHref(locale, "/clubs/start/sent")}
    />
  );
}
