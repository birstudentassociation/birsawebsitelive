import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);

  return buildMetadata({
    locale,
    title: copy.meta.title,
    description: copy.meta.description,
    path: "/services/study-plan",
  });
}

/**
 * The study plan service's start page: a GOV.UK-style start page (what this
 * does, what you need, roughly how long it takes) rather than the first
 * question itself. The first question ("cohort") lives one level down at
 * `/services/study-plan/cohort`, unlike `clubs/start` where it lives at the
 * journey root, because this service is consequential enough (the wrong
 * curriculum means the wrong degree) to earn a page that sets expectations
 * before asking anything.
 */
export default async function StudyPlanStartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const copy = buildStudyPlanCopy(locale);
  const servicesLabel = dict.nav.find((n) => n.href === "/services")!.label;

  return (
    <>
      <PageHeader
        title={copy.start.title}
        lede={copy.start.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: servicesLabel, href: "/services" },
              { label: copy.start.title },
            ]}
          />
        }
      />
      <div className="wrap max-w-[var(--measure)] flex flex-col gap-8 py-10">
        <div>
          <h2 className="font-display text-xl">{copy.start.beforeYouStart}</h2>
          <ul className="text-muted mt-3 flex flex-col gap-2 text-sm leading-relaxed">
            {copy.start.needs.map((need) => (
              <li key={need} className="flex gap-2">
                <span aria-hidden="true">&bull;</span>
                <span>{need}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-muted text-sm">{copy.start.timeEstimate}</p>
        <p className="text-muted text-sm leading-relaxed">{copy.start.notARecord}</p>

        <div>
          <Button href={localeHref(locale, "/services/study-plan/cohort")}>
            {copy.start.startButton}
          </Button>
        </div>
      </div>
    </>
  );
}
