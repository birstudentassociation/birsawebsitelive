import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import StepByStep from "@/components/onboarding/StepByStep";
import {
  getOnboardingTrack,
  isOnboardingAudience,
  onboardingAudiences,
  onboardingUiCopy,
} from "@/content/onboarding";

// "Student life" breadcrumb label, authored locally: see the same constant
// in `../page.tsx` for why it's duplicated rather than imported.
const studentLifeLabel: Record<Locale, string> = {
  en: "Student life",
  th: "ชีวิตนักศึกษา",
};

export function generateStaticParams() {
  return locales.flatMap((lang) => onboardingAudiences.map((audience) => ({ lang, audience })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; audience: string }>;
}): Promise<Metadata> {
  const { lang, audience } = await params;
  if (!isLocale(lang) || !isOnboardingAudience(audience)) return {};
  const locale: Locale = lang;
  const track = getOnboardingTrack(audience);
  if (!track) return {};

  return buildMetadata({
    locale,
    title: track.title[locale],
    description: track.lede[locale],
    path: `/student-life/getting-started/${audience}`,
  });
}

export default async function OnboardingTrackPage({
  params,
}: {
  params: Promise<{ lang: string; audience: string }>;
}) {
  const { lang, audience } = await params;
  if (!isLocale(lang) || !isOnboardingAudience(audience)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const track = getOnboardingTrack(audience);
  if (!track) notFound();

  const t = onboardingUiCopy[locale];

  return (
    <>
      <PageHeader
        title={track.title[locale]}
        lede={track.lede[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: studentLifeLabel[locale], href: "/student-life" },
              { label: t.gettingStarted, href: "/student-life/getting-started" },
              { label: track.title[locale] },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <StepByStep locale={locale} track={track} />

        <Notice variant="info" title={t.track.privacyTitle}>
          <p>{t.track.privacyBody}</p>
          <p className="mt-2">
            <Link
              href={localeHref(locale, "/privacy")}
              className="font-semibold text-brand-deep underline hover:text-brand-dark"
            >
              {t.track.privacyLinkLabel}
            </Link>
          </p>
        </Notice>

        <Link
          href={localeHref(locale, "/student-life/getting-started")}
          className="text-sm font-semibold text-brand-deep hover:text-brand-dark"
        >
          &larr; {t.track.backToChooser}
        </Link>
      </div>
    </>
  );
}
