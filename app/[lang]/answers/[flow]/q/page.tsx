import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { answersQuery, resolveFlow } from "@/lib/smart-answers";
import { getFlow, uiCopy } from "@/content/smart-answers";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import VisuallyHidden from "@/components/VisuallyHidden";

/**
 * The Smart Answers step engine: one URL per state, driven entirely by the
 * `a` query param (one value per answer given so far, in order). No
 * `generateStaticParams` here beyond what the dynamic segments require —
 * this route depends on `searchParams`, so it renders dynamically per
 * request, which is expected and fine (every state is still a plain,
 * bookmarkable, no-JS-required GET URL).
 */

function toAnswerIds(a: string | string[] | undefined): string[] {
  if (a === undefined) return [];
  return Array.isArray(a) ? a : [a];
}

type PageParams = { lang: string; flow: string };
type PageSearchParams = { a?: string | string[] };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  const { lang, flow: flowSlug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const flow = getFlow(flowSlug);
  if (!flow) return {};

  const { a } = await searchParams;
  const { node } = resolveFlow(flow, toAnswerIds(a));
  const stepTitle = node.kind === "question" ? node.question[locale] : node.title[locale];

  const base = buildMetadata({
    locale,
    title: `${stepTitle} — ${flow.title[locale]}`,
    description: flow.lede[locale],
    path: `/answers/${flow.slug}/q`,
  });

  // Every step state is a distinct URL but none of them are worth indexing:
  // they're mid-flow, not a destination in themselves.
  return { ...base, robots: { index: false, follow: false } };
}

export default async function FlowQuestionPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { lang, flow: flowSlug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const flow = getFlow(flowSlug);
  if (!flow) notFound();
  const dict = getDictionary(locale);
  const t = uiCopy[locale];

  const { a } = await searchParams;
  const answerIds = toAnswerIds(a);
  const { node, trail } = resolveFlow(flow, answerIds);

  const qHref = localeHref(locale, `/answers/${flow.slug}/q`);
  const startHref = localeHref(locale, `/answers/${flow.slug}`);
  const backHref =
    trail.length > 0
      ? `${qHref}${answersQuery(trail.slice(0, -1).map((step) => step.option.id))}`
      : startHref;

  const stepLabel = node.kind === "question" ? node.question[locale] : node.title[locale];

  return (
    <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
      <Breadcrumbs
        locale={locale}
        label={dict.a11y.breadcrumb}
        items={[
          { label: dict.site.name, href: "/" },
          { label: t.hub, href: "/answers" },
          { label: flow.title[locale], href: `/answers/${flow.slug}` },
          { label: stepLabel },
        ]}
      />

      {node.kind === "question" ? (
        <form method="GET" action={qHref} className="flex flex-col gap-6">
          <p className="text-muted text-sm font-medium">{flow.title[locale]}</p>
          <fieldset
            className="flex flex-col gap-4"
            aria-describedby={node.hint ? "question-hint" : undefined}
          >
            <legend>
              <h1 className="font-display text-2xl sm:text-3xl">{node.question[locale]}</h1>
            </legend>
            {node.hint ? (
              <p id="question-hint" className="text-muted text-base leading-relaxed">
                {node.hint[locale]}
              </p>
            ) : null}

            {/* Prior answers travel forward as hidden fields, in order, so a
                fresh `a=...` for this step appends after them and the query
                param order matches the trail order. */}
            {trail.map((step, index) => (
              <input key={index} type="hidden" name="a" value={step.option.id} />
            ))}

            <div className="flex flex-col gap-3">
              {node.options.map((option) => (
                <label
                  key={option.id}
                  className="border-input-border bg-surface has-checked:border-brand has-checked:bg-brand-tint focus-within:border-brand flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-4"
                >
                  <input
                    type="radio"
                    name="a"
                    value={option.id}
                    required
                    className="focus-halo border-input-border accent-brand mt-0.5 h-5 w-5 shrink-0"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="text-ink font-semibold">{option.label[locale]}</span>
                    {option.hint ? (
                      <span className="text-muted text-sm">{option.hint[locale]}</span>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-5">
            <Button type="submit">{t.continueLabel}</Button>
            <Link href={backHref} className="text-brand-deep font-medium hover:underline">
              {t.back}
            </Link>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="border-brand bg-brand-tint flex flex-col gap-4 rounded-lg border-l-4 p-6">
            <h1 className="font-display text-2xl sm:text-3xl">{node.title[locale]}</h1>
            <p className="text-ink leading-relaxed">{node.summary[locale]}</p>
            {node.body?.map((paragraph, index) => (
              <p key={index} className="text-ink leading-relaxed">
                {paragraph[locale]}
              </p>
            ))}

            {node.actions && node.actions.length > 0 ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {node.actions.map((action, index) =>
                  action.external ? (
                    <ExternalLink
                      key={index}
                      href={action.href}
                      newTabLabel={dict.a11y.newTab}
                      className="focus-halo bg-brand hover:bg-brand-strong h-11 rounded-lg px-5 text-[0.95rem] font-semibold text-white"
                    >
                      {action.label[locale]}
                    </ExternalLink>
                  ) : (
                    <Button
                      key={index}
                      href={localeHref(locale, action.href)}
                      variant={index === 0 ? "primary" : "secondary"}
                    >
                      {action.label[locale]}
                    </Button>
                  )
                )}
              </div>
            ) : null}

            {node.citations && node.citations.length > 0 ? (
              <div className="border-line/60 mt-2 border-t pt-4">
                <h2 className="text-ink text-sm font-semibold">{t.basedOn}</h2>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  {node.citations.map((citation, index) => (
                    <li key={index}>
                      <Link
                        href={localeHref(locale, citation.href)}
                        className="text-brand-deep hover:text-brand-dark hover:underline"
                      >
                        {citation.label[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {trail.length > 0 ? (
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-xl">{t.yourAnswers}</h2>
              <dl className="divide-line flex flex-col divide-y">
                {trail.map((step, index) => {
                  const changeHref = `${qHref}${answersQuery(
                    trail.slice(0, index).map((s) => s.option.id)
                  )}`;
                  return (
                    <div
                      key={step.question.id}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div>
                        <dt className="text-muted text-sm">{step.question.question[locale]}</dt>
                        <dd className="text-ink font-medium">{step.option.label[locale]}</dd>
                      </div>
                      <Link
                        href={changeHref}
                        className="text-brand-deep shrink-0 text-sm font-medium hover:underline"
                      >
                        {t.change}
                        <VisuallyHidden>{`: ${step.question.question[locale]}`}</VisuallyHidden>
                      </Link>
                    </div>
                  );
                })}
              </dl>
            </div>
          ) : null}

          <div>
            <Link href={startHref} className="text-brand-deep font-medium hover:underline">
              {t.startAgain}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
