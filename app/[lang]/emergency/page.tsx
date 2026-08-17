import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getEmergencyState } from "@/lib/emergency";
import PageHeader from "@/components/PageHeader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = getDictionary(locale).emergencyPage;

  // Unindexed like every emergency route.
  return {
    ...buildMetadata({
      locale,
      title: t.noActiveTitle,
      description: t.noActiveLede,
      path: "/emergency",
    }),
    robots: { index: false, follow: false },
  };
}

/**
 * Emergency index. When an emergency is active it forwards to the live
 * scenario page; otherwise it shows a calm "nothing is happening" page so the
 * URL is never a dead end.
 */
export default async function EmergencyIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const emergency = await getEmergencyState(locale);

  if (emergency.active) {
    redirect(localeHref(locale, `/emergency/${emergency.scenarioId}`));
  }

  const t = getDictionary(locale).emergencyPage;

  return (
    <>
      <PageHeader title={t.noActiveTitle} lede={t.noActiveLede} />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-6 py-10">
        <p className="leading-relaxed text-muted">{t.noActiveBody}</p>
        <Link href={localeHref(locale, "/")} className="font-medium text-brand-deep underline">
          {t.backHome}
        </Link>
      </div>
    </>
  );
}
