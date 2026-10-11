import type { Metadata } from "next";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Tag from "@/components/Tag";
import { fillTemplate } from "@/components/course-review/constants";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { courseNode } from "@/lib/courses/graph";
import { canModerateReviews } from "@/lib/course-review/access";
import { currentTerm } from "@/lib/course-review/terms";
import {
  isElectiveDemandConfigured,
  listDemandCounts,
  type DemandCount,
} from "@/lib/elective-demand/store";
import { academicTermLabel, termOrder } from "@/lib/elective-demand/terms";
import { DEMAND_THRESHOLD, meetsDemandThreshold } from "@/lib/elective-demand/threshold";
import { demandConsoleCopy } from "./copy";

/** Rows drawn on the page. The CSV export has every row. */
const MAX_ROWS = 300;

/** The secondary button look, as a plain anchor: a file download is not a page to prefetch. */
const EXPORT_LINK_CLASS =
  "focus-halo inline-flex h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-ink px-5 text-[0.95rem] font-semibold text-ink transition-colors duration-150 hover:bg-sunken whitespace-nowrap";

/** Internal officer console page; never indexed. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title =
    locale === "th" ? "ความต้องการวิชาเลือก เจ้าหน้าที่" : "Officer console: elective demand";
  const description =
    locale === "th"
      ? "ดูจำนวนนักศึกษาที่วางแผนเรียนวิชาเลือกแต่ละวิชาสำหรับเจ้าหน้าที่ฝ่ายวิชาการ"
      : "See how many students plan to take each elective course.";

  const metadata = buildMetadata({
    locale,
    title,
    description,
    path: "/officer/inventory/course-demand",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

export default async function OfficerElectiveDemandPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return null;
  }
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = demandConsoleCopy[locale];

  const officer = await getSessionOfficer();

  const breadcrumbs = (
    <Breadcrumbs
      locale={locale}
      label={dict.a11y.breadcrumb}
      items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
    />
  );

  if (!officer) {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="info" title={t.signInTitle}>
            <p className="mb-3">{t.signInBody}</p>
            <Button href={localeHref(locale, "/officer/inventory")}>{t.signInCta}</Button>
          </Notice>
        </div>
      </>
    );
  }

  // The same rule as the course review console: admins and Academic Affairs,
  // BIRSA-wide only (lib/course-review/access.ts).
  if (!canModerateReviews(officer)) {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="warning" title={t.noAccessTitle}>
            {t.noAccessBody}
          </Notice>
        </div>
      </>
    );
  }

  if (!isElectiveDemandConfigured()) {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="warning" title={t.dbNotConfiguredTitle}>
            {t.dbNotConfiguredBody}
          </Notice>
        </div>
      </>
    );
  }

  const counts = await listDemandCounts();
  const shown = counts.slice(0, MAX_ROWS);
  const firstCurrent = termOrder(currentTerm(new Date()));

  /** Whether a row's course page says anything, which is the question an officer asks of a count. */
  const publicStatus = (count: DemandCount) =>
    termOrder(count.term) < firstCurrent
      ? t.publicPast
      : meetsDemandThreshold(count.students)
        ? fillTemplate(t.publicShown, { threshold: DEMAND_THRESHOLD })
        : fillTemplate(t.publicBelow, { threshold: DEMAND_THRESHOLD });

  return (
    <>
      <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
      <div className="wrap flex flex-col gap-8 py-10">
        <Notice variant="info">
          <p>{fillTemplate(t.ruleBody, { threshold: DEMAND_THRESHOLD })}</p>
          <p className="mt-2">{t.softLimitBody}</p>
        </Notice>

        <section aria-labelledby="demand-heading" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="demand-heading" className="font-display text-xl text-ink">
              {t.tableTitle}
            </h2>
            {counts.length > 0 ? (
              <a
                href={localeHref(locale, "/officer/inventory/course-demand/export")}
                className={EXPORT_LINK_CLASS}
                download
              >
                {t.exportCsv}
              </a>
            ) : null}
          </div>
          {counts.length === 0 ? (
            <p className="text-sm text-muted">{t.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink">
                <caption className="sr-only">{t.tableTitle}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.termHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.courseHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.studentsHeader}
                    </th>
                    <th scope="col" className="py-2 font-semibold">
                      {t.publicHeader}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((count) => {
                    const node = courseNode(count.courseCode);
                    return (
                      <tr
                        key={`${count.term.year}-${count.term.semester}-${count.courseCode}`}
                        className="border-b border-line align-top last:border-0"
                      >
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {academicTermLabel(count.term, locale)}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="font-semibold">{count.courseCode}</span>
                          {node ? <span className="block text-muted">{node.title}</span> : null}
                        </td>
                        <td className="py-2 pr-4 tabular-nums">{count.students}</td>
                        <td className="py-2">
                          <Tag
                            variant={
                              termOrder(count.term) >= firstCurrent &&
                              meetsDemandThreshold(count.students)
                                ? "forest"
                                : "neutral"
                            }
                          >
                            {publicStatus(count)}
                          </Tag>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {counts.length > shown.length ? (
            <p className="text-sm text-muted">
              {fillTemplate(t.truncated, { shown: shown.length, total: counts.length })}
            </p>
          ) : null}
        </section>
      </div>
    </>
  );
}
