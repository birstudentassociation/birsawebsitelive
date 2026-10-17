import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Panel from "@/components/Panel";
import { fillTemplate } from "@/components/course-review/constants";
import { reviewFormCopy } from "@/components/course-review/reviewFormCopy";
import { courseNode } from "@/lib/courses/graph";
import { PUBLICATION_THRESHOLD } from "@/lib/course-review/groups";
import { studentLifeLabel } from "@/content/student-life/topics";

const whatNext: Record<Locale, string> = { en: "What happens next", th: "ขั้นตอนต่อไป" };

/**
 * Confirmation page for a submitted review (Post/Redirect/Get target of
 * ./actions.ts). A plain server-rendered page, not a client "success" state,
 * so refreshing it just re-requests this same GET instead of resubmitting the
 * form: no JavaScript is needed for that guarantee to hold.
 *
 * Never indexed: it carries no content of its own worth finding in search.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}): Promise<Metadata> {
  const { lang, code } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const node = courseNode(code);
  if (!node) return {};
  const t = reviewFormCopy[locale];

  const metadata = buildMetadata({
    locale,
    title: t.confirmationTitle,
    description: fillTemplate(t.confirmationBody, { threshold: PUBLICATION_THRESHOLD }),
    path: `/student-life/course-reviews/${node.code}/review/sent`,
  });
  return { ...metadata, robots: { index: false, follow: true } };
}

export default async function ReviewSentPage({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}) {
  const { lang, code } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = reviewFormCopy[locale];

  const node = courseNode(code);
  if (!node) notFound();
  const courseHref = `/student-life/course-reviews/${node.code}`;

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs
          locale={locale}
          label={dict.a11y.breadcrumb}
          items={[
            { label: dict.site.name, href: "/" },
            { label: studentLifeLabel[locale], href: "/student-life" },
            { label: dict.courseReview.title, href: "/student-life/course-reviews" },
            { label: node.code, href: courseHref },
            { label: t.confirmationTitle },
          ]}
        />
      </div>
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-6 py-8">
        <Panel title={t.confirmationTitle}>
          <p>{node.code}</p>
        </Panel>
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{whatNext[locale]}</h2>
          <p className="leading-relaxed">
            {fillTemplate(t.confirmationBody, { threshold: PUBLICATION_THRESHOLD })}
          </p>
        </section>
        <div>
          <Button href={localeHref(locale, courseHref)} variant="secondary">
            {t.backToCourse}
          </Button>
        </div>
      </div>
    </>
  );
}
