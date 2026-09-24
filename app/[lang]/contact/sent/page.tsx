import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import ConfirmationPage from "@/components/forms/ConfirmationPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const metadata = buildMetadata({
    locale: lang,
    title: dict.form.successTitle,
    description: dict.form.successBody,
    path: "/contact/sent",
  });
  return { ...metadata, robots: { index: false, follow: true } };
}

export default async function ContactSentPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  return (
    <ConfirmationPage
      locale={locale}
      title={dict.form.successTitle}
      next={[dict.form.successBody]}
      sourcePath={localeHref(locale, "/contact/sent")}
    />
  );
}
