import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Wrap } from "@/components/bds/Layout";
import PageHeader from "@/components/bds/PageHeader";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { submitFeedbackAction } from "./actions";

/**
 * Standalone satisfaction feedback route. Self-contained: it works as a
 * feedback destination on its own (e.g. linked from the footer or shared
 * directly), and also accepts an optional `?from=` path so a link elsewhere
 * on the site can attribute the feedback to the page the reader is leaving,
 * mirroring the `?from=` convention already used by components/PageFeedback.tsx
 * when it links to the contact form.
 *
 * The GOV.UK-preferred integration is different, though: mounting
 * <FeedbackForm> directly at the end of a completed journey (a Smart Answers
 * outcome page, the contact form's sent confirmation) rather than linking
 * away to this page. Those pages are owned by another agent right now, so
 * this route exists so the component has a working home today; see the
 * task's final report for exactly where and how to mount it there instead.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ให้ความคิดเห็น" : "Give feedback";
  const description =
    locale === "th"
      ? "บอกเราว่าคุณคิดเห็นอย่างไรกับบริการของ BIRSA"
      : "Tell BIRSA what you thought of a service you used.";

  return buildMetadata({ locale, title, description, path: "/feedback" });
}

const copy = {
  en: { title: "Give feedback", lede: "Tell us what you thought of a service you used." },
  th: { title: "ให้ความคิดเห็น", lede: "บอกเราว่าคุณคิดเห็นอย่างไรกับบริการที่ใช้" },
} as const;

export default async function FeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  // Only accept a same-site relative path, matching the guard in
  // app/[lang]/contact/page.tsx's `initialSubject`, so this can't be steered
  // to an arbitrary string.
  const { from } = await searchParams;
  const sourcePath =
    typeof from === "string" && from.startsWith("/") ? from : localeHref(locale, "/feedback");

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="max-w-[var(--measure)] py-10">
        <FeedbackForm locale={locale} sourcePath={sourcePath} action={submitFeedbackAction} />
      </Wrap>
    </>
  );
}
