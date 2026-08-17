import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import {
  filterWhen,
  getTopic,
  parseProfile,
  resolveTopic,
  serializeProfile,
  stepQuery,
  toAnswerIds,
  visibleOptions,
} from "@/lib/smart-answers";
import { service, uiCopy } from "@/content/smart-answers";
import type { OutcomeBlock } from "@/content/smart-answers/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import Notice from "@/components/Notice";
import VisuallyHidden from "@/components/VisuallyHidden";
import ProfileSummary from "@/components/answers/ProfileSummary";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { submitFeedbackAction } from "@/app/[lang]/feedback/actions";

/**
 * The step engine: one URL per state, driven entirely by `?p=` (who the
 * reader is) and `?a=` (what they have answered so far, in order). This
 * route depends on `searchParams`, so it renders dynamically per request,
 * which is expected: every state is still a plain, bookmarkable,
 * no-JS-required GET URL.
 */

type PageParams = { lang: string; topic: string };
type PageSearchParams = { a?: string | string[]; p?: string | string[] };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  const { lang, topic: slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const topic = getTopic(service, slug);
  if (!topic) return {};

  const { a, p } = await searchParams;
  const { node } = resolveTopic(service, topic, parseProfile(p), toAnswerIds(a));
  const stepTitle = node.kind === "question" ? node.question[locale] : node.title[locale];

  const base = buildMetadata({
    locale,
    title: `${stepTitle}: ${topic.title[locale]}`,
    description: topic.lede[locale],
    path: `/answers/${topic.slug}/q`,
  });

  // Every step state is a distinct URL but none of them are worth indexing:
  // they're mid-journey, not a destination in themselves.
  return { ...base, robots: { index: false, follow: false } };
}

export default async function TopicStepPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { lang, topic: slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const topic = getTopic(service, slug);
  if (!topic) notFound();
  const dict = getDictionary(locale);
  const t = uiCopy[locale];

  const { a, p } = await searchParams;
  const profile = parseProfile(p);
  const journey = resolveTopic(service, topic, profile, toAnswerIds(a));
  const { node, trail, facts, answerIds } = journey;

  const token = serializeProfile(profile);
  const qPath = `/answers/${topic.slug}/q`;
  const qHref = localeHref(locale, qPath);
  const startHref = localeHref(locale, `/answers/${topic.slug}${token ? `?p=${token}` : ""}`);
  const stepHref = (ids: string[]) => `${qHref}${stepQuery(profile, ids)}`;
  const backHref = answerIds.length > 0 ? stepHref(answerIds.slice(0, -1)) : startHref;
  const returnTo = `${qPath}${stepQuery(profile, answerIds)}`;

  const stepLabel = node.kind === "question" ? node.question[locale] : node.title[locale];

  const breadcrumbs = (
    <Breadcrumbs
      locale={locale}
      label={dict.a11y.breadcrumb}
      items={[
        { label: dict.site.name, href: "/" },
        { label: t.hub, href: "/answers" },
        { label: topic.title[locale], href: `/answers/${topic.slug}` },
        { label: stepLabel },
      ]}
    />
  );

  if (node.kind === "question") {
    const options = visibleOptions(node, facts);

    return (
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        {breadcrumbs}

        <form method="GET" action={qHref} className="flex flex-col gap-6">
          <p className="text-sm font-medium text-muted">{topic.title[locale]}</p>

          {/* The profile and every prior answer travel forward as hidden
              fields, in order, so a fresh `a=...` for this step appends after
              them and the query param order matches the trail order. */}
          {token ? <input type="hidden" name="p" value={token} /> : null}
          {answerIds.map((id, index) => (
            <input key={index} type="hidden" name="a" value={id} />
          ))}

          <fieldset
            className="flex flex-col gap-4"
            aria-describedby={node.hint ? "question-hint" : undefined}
          >
            <legend>
              <h1 className="font-display text-2xl sm:text-3xl">{node.question[locale]}</h1>
            </legend>
            {node.hint ? (
              <p id="question-hint" className="text-base leading-relaxed text-muted">
                {node.hint[locale]}
              </p>
            ) : null}

            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint"
                >
                  <input
                    type="radio"
                    name="a"
                    value={option.id}
                    required
                    className="focus-halo mt-0.5 h-5 w-5 shrink-0 border-input-border accent-brand"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="font-semibold text-ink">{option.label[locale]}</span>
                    {option.hint ? (
                      <span className="text-sm text-muted">{option.hint[locale]}</span>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-5">
            <Button type="submit">{t.continueLabel}</Button>
            <Link href={backHref} className="font-medium text-brand-deep hover:underline">
              {t.back}
            </Link>
          </div>
        </form>

        <ProfileSummary locale={locale} profile={profile} returnTo={returnTo} variant="compact" />
      </div>
    );
  }

  const blocks = filterWhen(node.body, facts) as OutcomeBlock[];
  const actions = filterWhen(node.actions, facts);
  const citations = filterWhen(node.citations, facts);
  const related = filterWhen(node.related, facts);

  // The "challenge a decision" route: always a "problem" category, regardless
  // of the outcome's own `contactCategory`, so the contact form prefills the
  // subject with the exact answer state being disputed (see
  // `app/[lang]/contact/page.tsx`'s `initialSubject`, which only fires for
  // "problem"). Disagreeing with an outcome is a problem with what BIRSA
  // told the reader, not a fresh question.
  const challengeHref = localeHref(
    locale,
    `/contact?category=problem&from=${encodeURIComponent(returnTo)}`
  );

  return (
    <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
      {breadcrumbs}

      <div className="flex flex-col gap-4 rounded-lg border-l-4 border-brand bg-brand-tint p-6">
        <h1 className="font-display text-2xl sm:text-3xl">{node.title[locale]}</h1>
        <p className="leading-relaxed text-ink">{node.summary[locale]}</p>

        {blocks.map((block, index) => {
          if (block.kind === "paragraph") {
            return (
              <p key={index} className="leading-relaxed text-ink">
                {block.text[locale]}
              </p>
            );
          }
          if (block.kind === "note") {
            return (
              <Notice key={index} variant={block.tone === "warning" ? "warning" : "info"}>
                {block.text[locale]}
              </Notice>
            );
          }
          return (
            <div key={index} className="flex flex-col gap-2">
              {block.title ? (
                <h2 className="font-display text-lg text-ink">{block.title[locale]}</h2>
              ) : null}
              <ol className="list-inside list-decimal space-y-2 leading-relaxed text-ink">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item[locale]}</li>
                ))}
              </ol>
            </div>
          );
        })}

        {node.owner ? (
          <div className="mt-2 border-t border-line/60 pt-4">
            <h2 className="text-sm font-semibold text-ink">{t.whoDecides}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink">{node.owner[locale]}</p>
          </div>
        ) : null}

        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-3 pt-2">
            {actions.map((action, index) =>
              // A mailto: opens a mail client, not a tab, so it must not be
              // announced as "opens in a new tab".
              action.external && action.href.startsWith("mailto:") ? (
                <a
                  key={index}
                  href={action.href}
                  className="focus-halo inline-flex h-11 items-center rounded-lg border-[1.5px] border-ink px-5 text-[0.95rem] font-semibold text-ink hover:bg-brand-tint"
                >
                  {action.label[locale]}
                </a>
              ) : action.external ? (
                <ExternalLink
                  key={index}
                  href={action.href}
                  newTabLabel={dict.a11y.newTab}
                  className="focus-halo h-11 rounded-lg bg-brand px-5 text-[0.95rem] font-semibold text-white hover:bg-brand-strong"
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

        {citations.length > 0 ? (
          <div className="mt-2 border-t border-line/60 pt-4">
            <h2 className="text-sm font-semibold text-ink">{t.basedOn}</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              {citations.map((citation, index) => (
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

      {related.length > 0 ? (
        <section className="flex flex-col gap-3" aria-labelledby="answer-related">
          <h2 id="answer-related" className="font-display text-xl">
            {t.readMore}
          </h2>
          <ul className="flex flex-col divide-y divide-line">
            {related.map((item, index) => (
              <li key={index} className="py-3">
                <Link
                  href={localeHref(locale, item.href)}
                  className="font-medium text-brand-deep hover:underline"
                >
                  {item.label[locale]}
                </Link>
                {item.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.description[locale]}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {trail.length > 0 ? (
        <section className="flex flex-col gap-3" aria-labelledby="answer-trail">
          <h2 id="answer-trail" className="font-display text-xl">
            {t.yourAnswers}
          </h2>
          <dl className="flex flex-col divide-y divide-line">
            {trail.map((step, index) => {
              // An automatic step was never the reader's choice, so it is
              // labelled as an assumption and corrected by editing the
              // profile, not by re-answering a question they never saw.
              const changeHref = step.auto
                ? localeHref(
                    locale,
                    `/answers/you?return=${encodeURIComponent(returnTo)}${
                      token ? `&p=${token}` : ""
                    }`
                  )
                : stepHref(answerIds.slice(0, step.answerIndex ?? 0));

              return (
                <div
                  key={index}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div>
                    <dt className="text-sm text-muted">{step.question.question[locale]}</dt>
                    <dd className="font-medium text-ink">
                      {step.option.label[locale]}
                      {step.auto ? (
                        <span className="ml-2 text-xs font-normal text-muted">({t.assumed})</span>
                      ) : null}
                    </dd>
                  </div>
                  <Link
                    href={changeHref}
                    className="shrink-0 text-sm font-medium text-brand-deep hover:underline"
                  >
                    {t.change}
                    <VisuallyHidden>{`: ${step.question.question[locale]}`}</VisuallyHidden>
                  </Link>
                </div>
              );
            })}
          </dl>
        </section>
      ) : null}

      <ProfileSummary locale={locale} profile={profile} returnTo={returnTo} variant="compact" />

      <div className="flex flex-col gap-3 rounded-lg border border-line p-5">
        <h2 className="font-display text-lg text-ink">{t.notAnswered}</h2>
        <div>
          <Button href={challengeHref} variant="secondary">
            {t.notAnsweredAction}
          </Button>
        </div>
      </div>

      <div>
        <Link href={startHref} className="font-medium text-brand-deep hover:underline">
          {t.startAgain}
        </Link>
      </div>

      {/*
        The reader has reached an outcome, so the journey is finished. The
        Service Manual requires a satisfaction prompt at that point. The
        source path is the fixed topic route with no query string, so nothing
        about the reader's own answers is recorded alongside the rating.
      */}
      <FeedbackForm
        locale={locale}
        sourcePath={localeHref(locale, qPath)}
        heading={t.feedbackHeading}
        action={submitFeedbackAction}
      />

      <Notice variant="info">{t.guidanceDisclaimer}</Notice>
    </div>
  );
}
