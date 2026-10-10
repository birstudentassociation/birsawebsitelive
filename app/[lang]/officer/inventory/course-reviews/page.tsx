import type { Metadata } from "next";
import Link from "next/link";
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
import {
  approvalsNeeded,
  groupId,
  meetsThreshold,
  PUBLICATION_THRESHOLD,
} from "@/lib/course-review/groups";
import { instructorByKey, OTHER_INSTRUCTOR } from "@/lib/course-review/instructors";
import { listPublishedGroupIds } from "@/lib/course-review/published";
import { isCourseReviewConfigured, listSubmissionGroups } from "@/lib/course-review/submissions";
import { isSummariserConfigured } from "@/lib/course-review/summarise";
import { termYearLabel } from "@/lib/course-review/terms";
import type { AcademicTerm } from "@/content/course-review/types";
import { consoleCopy } from "./copy";

/** Internal officer console page; never indexed. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "รีวิวรายวิชา เจ้าหน้าที่" : "Officer console: course reviews";
  const description =
    locale === "th"
      ? "ตรวจรีวิวรายวิชานิรนามและเผยแพร่บทสรุปสำหรับเจ้าหน้าที่ฝ่ายวิชาการ"
      : "Moderate anonymous course reviews and publish summaries.";

  const metadata = buildMetadata({
    locale,
    title,
    description,
    path: "/officer/inventory/course-reviews",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

function termText(term: AcademicTerm, locale: Locale): string {
  const cr = getDictionary(locale).courseReview;
  const semester =
    term.semester === "summer" ? cr.summer : term.semester === 1 ? cr.semester1 : cr.semester2;
  return `${semester}, ${termYearLabel(term, locale)}`;
}

export default async function OfficerCourseReviewsPage({
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
  const t = consoleCopy[locale];

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

  if (!isCourseReviewConfigured()) {
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

  const [groups, published] = await Promise.all([listSubmissionGroups(), listPublishedGroupIds()]);

  return (
    <>
      <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
      <div className="wrap flex flex-col gap-8 py-10">
        <div className="flex flex-col gap-3">
          <Notice variant="info">
            <p>{fillTemplate(t.ruleBody, { threshold: PUBLICATION_THRESHOLD })}</p>
            <p className="mt-2">
              {isSummariserConfigured() ? t.summariserOnBody : t.summariserOffBody}
            </p>
          </Notice>
        </div>

        <section aria-labelledby="queue-heading" className="flex flex-col gap-4">
          <h2 id="queue-heading" className="font-display text-xl text-ink">
            {t.queueTitle}
          </h2>
          {groups.length === 0 ? (
            <p className="text-sm text-muted">{t.queueEmpty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink">
                <caption className="sr-only">{t.queueTitle}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.courseHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.termHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.instructorHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.pendingHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.approvedHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.rejectedHeader}
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      {t.statusHeader}
                    </th>
                    <th scope="col" className="py-2 font-semibold">
                      <span className="sr-only">{t.openAction}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => {
                    const id = groupId(group.key);
                    const node = courseNode(group.key.courseCode);
                    const instructor = instructorByKey(
                      node?.catalogue?.instructors,
                      group.key.instructorKey
                    );
                    const instructorName =
                      group.key.instructorKey === OTHER_INSTRUCTOR
                        ? t.otherInstructor
                        : (instructor?.name[locale] ?? group.key.instructorKey);
                    const approved = group.counts.approved;
                    const isPublished = published.has(id);
                    const href = `${localeHref(locale, "/officer/inventory/course-reviews/group")}?g=${encodeURIComponent(id)}`;
                    const openLabel = `${t.openAction} ${group.key.courseCode}, ${termText(group.key.term, locale)}, ${instructorName}`;
                    return (
                      <tr key={id} className="border-b border-line align-top last:border-0">
                        <td className="py-2 pr-4">
                          <span className="font-semibold">{group.key.courseCode}</span>
                          {node ? <span className="block text-muted">{node.title}</span> : null}
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {termText(group.key.term, locale)}
                        </td>
                        <td className="py-2 pr-4">{instructorName}</td>
                        <td className="py-2 pr-4 tabular-nums">{group.counts.pending}</td>
                        <td className="py-2 pr-4 tabular-nums">{approved}</td>
                        <td className="py-2 pr-4 tabular-nums">{group.counts.rejected}</td>
                        <td className="py-2 pr-4">
                          <span className="flex flex-wrap gap-1.5">
                            {group.counts.pending > 0 ? (
                              <Tag variant="brand">{t.statusNeedsDecisions}</Tag>
                            ) : null}
                            {isPublished ? <Tag variant="forest">{t.statusPublished}</Tag> : null}
                            {!isPublished && meetsThreshold(approved) ? (
                              <Tag variant="forest">{t.statusReady}</Tag>
                            ) : null}
                            {!isPublished && !meetsThreshold(approved) ? (
                              <Tag>
                                {fillTemplate(t.statusWaiting, { n: approvalsNeeded(approved) })}
                              </Tag>
                            ) : null}
                          </span>
                        </td>
                        <td className="py-2">
                          <Link
                            href={href}
                            aria-label={openLabel}
                            className="inline-flex min-h-11 items-center font-semibold text-brand-deep hover:text-brand-dark"
                          >
                            {t.openAction}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
