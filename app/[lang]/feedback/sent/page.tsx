import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Panel from "@/components/Panel";
import { feedbackCopy } from "@/components/feedback/feedbackCopy";

/**
 * Confirmation page for a submitted feedback response (Post/Redirect/Get
 * target of app/[lang]/feedback/actions.ts). A plain server-rendered page, not
 * a client "success" state, so refreshing it just re-requests this same GET
 * instead of resubmitting the form: no JavaScript is needed for this
 * guarantee to hold.
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
  const t = feedbackCopy[locale];

  const metadata = buildMetadata({
    locale,
    title: t.confirmationTitle,
    description: t.confirmationBody,
    path: "/feedback/sent",
  });
  return { ...metadata, robots: { index: false, follow: true } };
}

export default async function FeedbackSentPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = feedbackCopy[locale];

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs
          locale={locale}
          label={dict.a11y.breadcrumb}
          items={[{ label: dict.site.name, href: "/" }, { label: t.confirmationTitle }]}
        />
      </div>
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-6 py-8">
        <Panel title={t.confirmationTitle}>
          <p>{t.confirmationBody}</p>
        </Panel>
        <div>
          <Button href={localeHref(locale, "/")} variant="secondary">
            {t.backLink}
          </Button>
        </div>
      </div>
    </>
  );
}
