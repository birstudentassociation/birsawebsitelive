import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import SharedPlanView from "@/components/study-plan/SharedPlanView";
import { buildPlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";

/**
 * Never indexed. The page is the same for every visitor (the plan it shows is
 * in the URL fragment, which the server never sees), so there is nothing here
 * for a search engine to read, and a shared link is for the person it was
 * sent to.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const { view } = buildPlanOutreachCopy(locale);

  const metadata = buildMetadata({
    locale,
    title: view.title,
    description: view.lede,
    path: "/services/study-plan/view",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

/**
 * The read-only view of a shared study plan. A server shell around a client
 * island: the shell is static and identical for everyone, and the island
 * (`SharedPlanView`) reads the plan from the URL fragment in the browser, so
 * the plan never reaches the server. With JavaScript off the island renders
 * nothing and the `<noscript>` block explains that the print page is the
 * route that does not need JavaScript.
 */
export default async function SharedStudyPlanPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const { view } = buildPlanOutreachCopy(locale);
  const copy = buildStudyPlanCopy(locale);
  const startHref = localeHref(locale, "/services/study-plan");

  return (
    <>
      <PageHeader
        title={view.title}
        lede={view.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: copy.start.title, href: "/services/study-plan" },
              { label: view.title },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <noscript>
          <Notice variant="warning" title={view.noScriptTitle}>
            <p>{view.noScriptBody}</p>
            <p className="mt-2">
              <Link href={startHref} className="font-semibold text-brand-deep hover:underline">
                {view.noScriptLink} &rarr;
              </Link>
            </p>
          </Notice>
        </noscript>
        <SharedPlanView locale={locale} copy={copy} view={view} startHref={startHref} />
      </div>
    </>
  );
}
