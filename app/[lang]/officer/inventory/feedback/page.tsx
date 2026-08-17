import type { Metadata } from "next";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { getSessionOfficer } from "@/lib/inventory/auth";
import {
  isFeedbackConfigured,
  getRatingCounts,
  listRecentFeedback,
  satisfactionRate,
} from "@/lib/feedback";
import { RATING_ORDER, feedbackCopy } from "@/components/feedback/feedbackCopy";
import FeedbackManager from "@/app/[lang]/officer/inventory/feedback/FeedbackManager";

/** Internal officer console page; never indexed. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ความคิดเห็นผู้ใช้ เจ้าหน้าที่" : "Officer console: feedback";
  const description =
    locale === "th"
      ? "สรุประดับความพึงพอใจของผู้ใช้บริการและความคิดเห็น พร้อมส่งออกข้อมูลเป็น CSV"
      : "Satisfaction rating distribution and comments from readers, with a CSV export.";

  const metadata = buildMetadata({
    locale,
    title,
    description,
    path: "/officer/inventory/feedback",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

type Copy = {
  title: string;
  lede: string;
  signInTitle: string;
  signInBody: string;
  signInCta: string;
  dbNotConfiguredTitle: string;
  dbNotConfiguredBody: string;
  distributionTitle: string;
  satisfactionRateLabel: string;
  commentsTitle: string;
  commentsEmpty: string;
  dateHeader: string;
  ratingHeader: string;
  commentHeader: string;
  localeHeader: string;
  pathHeader: string;
  previous: string;
  next: string;
  pageOf: string;
  exportsTitle: string;
  exportsLede: string;
  exportCta: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Feedback",
    lede: "Satisfaction ratings and comments left on the site's feedback form.",
    signInTitle: "Sign in on the console home",
    signInBody: "You need an active officer session to view feedback.",
    signInCta: "Go to console home",
    dbNotConfiguredTitle: "The feedback database is not connected",
    dbNotConfiguredBody:
      "POSTGRES_URL is not configured, so there is no feedback data to show yet.",
    distributionTitle: "Ratings",
    satisfactionRateLabel: "Satisfied or very satisfied",
    commentsTitle: "Recent comments",
    commentsEmpty: "No comments have been left yet.",
    dateHeader: "Date",
    ratingHeader: "Rating",
    commentHeader: "Comment",
    localeHeader: "Language",
    pathHeader: "Page",
    previous: "Previous",
    next: "Next",
    pageOf: "Page {current} of {total}",
    exportsTitle: "Export CSV",
    exportsLede: "Download every feedback response as a CSV file.",
    exportCta: "Export feedback",
  },
  th: {
    title: "ความคิดเห็น",
    lede: "ระดับความพึงพอใจและความคิดเห็นที่ผู้ใช้ส่งผ่านแบบฟอร์มความคิดเห็นของเว็บไซต์",
    signInTitle: "กรุณาเข้าสู่ระบบที่หน้าแรกของคอนโซล",
    signInBody: "คุณต้องเข้าสู่ระบบเจ้าหน้าที่ก่อนจึงจะดูความคิดเห็นได้",
    signInCta: "ไปที่หน้าแรกคอนโซล",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูลความคิดเห็น",
    dbNotConfiguredBody:
      "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีข้อมูลความคิดเห็นให้แสดงในขณะนี้",
    distributionTitle: "ระดับความพึงพอใจ",
    satisfactionRateLabel: "พึงพอใจหรือพึงพอใจมาก",
    commentsTitle: "ความคิดเห็นล่าสุด",
    commentsEmpty: "ยังไม่มีความคิดเห็นที่ส่งเข้ามา",
    dateHeader: "วันที่",
    ratingHeader: "ระดับความพึงพอใจ",
    commentHeader: "ความคิดเห็น",
    localeHeader: "ภาษา",
    pathHeader: "หน้า",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    pageOf: "หน้า {current} จาก {total}",
    exportsTitle: "ส่งออกข้อมูล CSV",
    exportsLede: "ดาวน์โหลดความคิดเห็นทั้งหมดเป็นไฟล์ CSV",
    exportCta: "ส่งออกความคิดเห็น",
  },
};

const EXPORT_LINK_CLASS =
  "focus-halo inline-flex h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-ink px-5 text-[0.95rem] font-semibold text-ink transition-colors duration-150 hover:bg-sunken whitespace-nowrap";

export default async function OfficerFeedbackPage({
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
  const t = copy[locale];
  const ratingLabels = feedbackCopy[locale].ratingLabels;

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

  if (!isFeedbackConfigured()) {
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

  const [counts, recent] = await Promise.all([getRatingCounts(), listRecentFeedback()]);
  const rate = satisfactionRate(counts);
  const commentEntries = recent.filter((entry) => (entry.comment ?? "").trim().length > 0);

  return (
    <>
      <PageHeader title={t.title} lede={t.lede} breadcrumbs={breadcrumbs} />
      <div className="wrap flex flex-col gap-10 py-10">
        <section aria-labelledby="distribution-heading" className="flex flex-col gap-4">
          <h2 id="distribution-heading" className="font-display text-xl text-ink">
            {t.distributionTitle}
          </h2>
          <Card className="w-fit">
            <p className="text-sm font-semibold text-muted">{t.satisfactionRateLabel}</p>
            <p className="font-display text-2xl text-ink">{rate}%</p>
          </Card>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {RATING_ORDER.map((rating) => (
              <Card key={rating}>
                <p className="text-sm font-semibold text-muted">{ratingLabels[rating]}</p>
                <p className="font-display text-2xl text-ink">{counts[rating]}</p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="comments-heading" className="flex flex-col gap-4">
          <h2 id="comments-heading" className="font-display text-xl text-ink">
            {t.commentsTitle}
          </h2>
          <FeedbackManager
            locale={locale}
            entries={commentEntries}
            ratingLabels={ratingLabels}
            copy={{
              commentHeader: t.commentHeader,
              dateHeader: t.dateHeader,
              localeHeader: t.localeHeader,
              pathHeader: t.pathHeader,
              ratingHeader: t.ratingHeader,
              empty: t.commentsEmpty,
              previous: t.previous,
              next: t.next,
              pageOf: t.pageOf,
            }}
          />
        </section>

        <section aria-labelledby="exports-heading" className="flex flex-col gap-4">
          <h2 id="exports-heading" className="font-display text-xl text-ink">
            {t.exportsTitle}
          </h2>
          <p className="text-sm text-muted">{t.exportsLede}</p>
          <div className="flex flex-wrap gap-3">
            {/* Plain anchor: this hits a route that streams a CSV file
                download, not a page. next/link would intercept it as a
                client navigation and mishandle the non-HTML response. */}
            <a
              href={localeHref(locale, "/officer/inventory/feedback/export")}
              className={EXPORT_LINK_CLASS}
              download
            >
              {t.exportCta}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
