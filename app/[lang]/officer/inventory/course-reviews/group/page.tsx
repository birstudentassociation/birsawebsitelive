import type { Metadata } from "next";
import { getDictionary, isLocale, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Tag from "@/components/Tag";
import { fillTemplate } from "@/components/course-review/constants";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { courseNode } from "@/lib/courses/graph";
import { canModerateReviews } from "@/lib/course-review/access";
import {
  approvalsNeeded,
  countStatuses,
  groupId,
  meetsThreshold,
  parseGroupId,
  PUBLICATION_THRESHOLD,
} from "@/lib/course-review/groups";
import { instructorByKey, OTHER_INSTRUCTOR } from "@/lib/course-review/instructors";
import { getPublishedGroup } from "@/lib/course-review/published";
import { isCourseReviewConfigured, listGroupSubmissions } from "@/lib/course-review/submissions";
import { isSummariserConfigured } from "@/lib/course-review/summarise";
import { termYearLabel } from "@/lib/course-review/terms";
import { countBands, describeBandDistribution } from "@/lib/course-review/workload";
import type { AcademicTerm } from "@/content/course-review/types";
import { decideSubmissionAction, unpublishSummaryAction } from "../actions";
import SummaryEditor from "../SummaryEditor";
import { consoleCopy } from "../copy";

/**
 * One course, term and instructor: its submissions with approve and reject
 * buttons, and below them the summary editor once enough are approved.
 * Internal officer console page; never indexed.
 *
 * Drafting a summary calls Claude and can take half a minute, so the page,
 * which the draft action runs on, is given a longer limit than the default.
 */
export const maxDuration = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title =
    locale === "th" ? "รีวิวรายวิชา กลุ่มรีวิว" : "Officer console: course review group";
  const description =
    locale === "th"
      ? "ตรวจรีวิวของวิชา ภาคการศึกษา และอาจารย์ผู้สอนกลุ่มหนึ่ง และเผยแพร่บทสรุป"
      : "Moderate the reviews for one course, term and instructor, and publish a summary.";

  const metadata = buildMetadata({
    locale,
    title,
    description,
    path: "/officer/inventory/course-reviews/group",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

function termText(term: AcademicTerm, locale: Locale): string {
  const cr = getDictionary(locale).courseReview;
  const semester =
    term.semester === "summer" ? cr.summer : term.semester === 1 ? cr.semester1 : cr.semester2;
  return `${semester}, ${termYearLabel(term, locale)}`;
}

const STATUS_VARIANT = { pending: "brand", approved: "forest", rejected: "neutral" } as const;

export default async function OfficerCourseReviewGroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ g?: string; done?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return null;
  }
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = consoleCopy[locale];
  const { g, done } = await searchParams;

  const officer = await getSessionOfficer();
  const key = typeof g === "string" ? parseGroupId(g) : null;
  const node = key ? courseNode(key.courseCode) : undefined;

  const queueHref = "/officer/inventory/course-reviews";
  const title = key ? `${t.groupTitle} ${key.courseCode}` : t.title;
  const breadcrumbs = (
    <Breadcrumbs
      locale={locale}
      label={dict.a11y.breadcrumb}
      items={[
        { label: dict.site.name, href: "/" },
        { label: t.title, href: queueHref },
        { label: key ? key.courseCode : t.title },
      ]}
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

  if (!key || !node) {
    return (
      <>
        <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
        <div className="wrap py-10">
          <Notice variant="warning" title={t.draftFailed["bad-group"]}>
            <Button href={localeHref(locale, queueHref)} variant="secondary">
              {t.backToQueue}
            </Button>
          </Notice>
        </div>
      </>
    );
  }

  const [submissions, published] = await Promise.all([
    listGroupSubmissions(key),
    getPublishedGroup(key),
  ]);
  const counts = countStatuses(submissions);
  const approved = submissions.filter((submission) => submission.status === "approved");
  const eligible = meetsThreshold(approved.length);
  const instructor = instructorByKey(node.catalogue?.instructors, key.instructorKey);
  const instructorName =
    key.instructorKey === OTHER_INSTRUCTOR
      ? t.otherInstructor
      : (instructor?.name[locale] ?? key.instructorKey);
  const groupParam = groupId(key);

  const bandCopy = {
    labels: dict.courseReview.collect.bandLabels,
    sentence: dict.courseReview.collect.bandSentence,
    sentenceSingle: dict.courseReview.collect.bandSentenceSingle,
  };
  const bandLines = describeBandDistribution(
    countBands(approved.map((submission) => submission.workloadBand)),
    bandCopy
  );

  return (
    <>
      <PageHeader
        title={title}
        lede={`${node.title}. ${termText(key.term, locale)}. ${instructorName}.`}
        breadcrumbs={breadcrumbs}
      />
      <div className="wrap flex flex-col gap-10 py-10">
        {done === "published" ? <Notice variant="success">{t.publishedDone}</Notice> : null}
        {done === "unpublished" ? <Notice variant="success">{t.unpublishedDone}</Notice> : null}

        <div className="flex flex-wrap items-center gap-3">
          <Tag variant={eligible ? "forest" : "neutral"}>
            {fillTemplate(t.progress, {
              approved: approved.length,
              threshold: PUBLICATION_THRESHOLD,
            })}
          </Tag>
          <Button href={localeHref(locale, queueHref)} variant="secondary">
            {t.backToQueue}
          </Button>
        </div>

        <section aria-labelledby="submissions-heading" className="flex flex-col gap-4">
          <h2 id="submissions-heading" className="font-display text-xl text-ink">
            {t.submissionsTitle}
            <span className="ml-2 text-sm font-normal text-muted">
              {t.pendingHeader} {counts.pending} &middot; {t.approvedHeader} {counts.approved}{" "}
              &middot; {t.rejectedHeader} {counts.rejected}
            </span>
          </h2>
          <ul className="flex flex-col gap-4">
            {submissions.map((submission) => (
              <li key={submission.id}>
                <Card>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag variant={STATUS_VARIANT[submission.status]}>
                      {t.submissionStatus[submission.status]}
                    </Tag>
                    <span className="text-xs text-muted">
                      {t.submittedLabel} {formatDate(locale, submission.createdAt)}
                      {" · "}
                      {t.languageLabel} {submission.locale === "th" ? "ไทย" : "English"}
                    </span>
                  </div>
                  <dl className="mt-2 flex flex-col gap-3 text-sm">
                    <div>
                      <dt className="font-semibold text-ink">{t.workloadLabel}</dt>
                      <dd className="whitespace-pre-line text-muted">{submission.workload}</dd>
                    </div>
                    {submission.workloadBand ? (
                      <div>
                        <dt className="font-semibold text-ink">{t.bandLabel}</dt>
                        <dd className="text-muted">{t.bandLabels[submission.workloadBand]}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="font-semibold text-ink">{t.assessmentLabel}</dt>
                      <dd className="whitespace-pre-line text-muted">{submission.assessment}</dd>
                    </div>
                    {submission.tips.length > 0 ? (
                      <div>
                        <dt className="font-semibold text-ink">{t.tipsLabel}</dt>
                        <dd>
                          <ul className="flex list-disc flex-col gap-0.5 pl-5 text-muted">
                            {submission.tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    ) : null}
                    {submission.quote ? (
                      <div>
                        <dt className="font-semibold text-ink">{t.quoteLabel}</dt>
                        <dd className="whitespace-pre-line text-muted">{submission.quote}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <form action={decideSubmissionAction} className="mt-3 flex flex-wrap gap-3">
                    <input type="hidden" name="id" value={submission.id} />
                    <input type="hidden" name="group" value={groupParam} />
                    <input type="hidden" name="locale" value={locale} />
                    {submission.status !== "approved" ? (
                      <Button type="submit" name="decision" value="approve">
                        {t.approve}
                      </Button>
                    ) : null}
                    {submission.status !== "rejected" ? (
                      <Button type="submit" name="decision" value="reject" variant="secondary">
                        {t.reject}
                      </Button>
                    ) : null}
                  </form>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="summary-heading" className="flex flex-col gap-4">
          <h2 id="summary-heading" className="font-display text-xl text-ink">
            {t.summaryTitle}
          </h2>

          {published ? (
            <Notice variant="success" title={t.publishedTitle}>
              <p className="mb-3">
                {fillTemplate(t.publishedBody, {
                  count: published.reviewCount,
                  date: formatDate(locale, published.publishedAt),
                })}
              </p>
              {!eligible ? <p className="mb-3">{t.publishedBelowBody}</p> : null}
              <form action={unpublishSummaryAction}>
                <input type="hidden" name="group" value={groupParam} />
                <input type="hidden" name="locale" value={locale} />
                <Button type="submit" variant="secondary">
                  {t.unpublish}
                </Button>
              </form>
            </Notice>
          ) : null}

          {eligible ? (
            <SummaryEditor
              locale={locale}
              group={groupParam}
              copy={t}
              initial={published?.summary ?? null}
              canDraft={isSummariserConfigured()}
              bandLines={bandLines}
              published={published !== null}
            />
          ) : (
            <Notice variant="info" title={t.notEnoughTitle}>
              {fillTemplate(t.notEnoughBody, { n: approvalsNeeded(approved.length) })}
            </Notice>
          )}
        </section>
      </div>
    </>
  );
}
