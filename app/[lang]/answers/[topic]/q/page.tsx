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
          <p className="text-muted text-sm font-medium">{topic.title[locale]}</p>

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
              <p id="question-hint" className="text-muted text-base leading-relaxed">
                {node.hint[locale]}
              </p>
            ) : null}

            <div className="flex flex-col gap-3">
              {options.map((option) => (
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

        <ProfileSummary locale={locale} profile={profile} returnTo={returnTo} variant="compact" />
      </div>
    );
  }

  const blocks = filterWhen(node.body, facts) as OutcomeBlock[];
  const actions = filterWhen(node.actions, facts);
  const citations = filterWhen(node.citations, facts);
  const related = filterWhen(node.related, facts);

  const contactHref = localeHref(
    locale,
    `/contact?category=${node.contactCategory ?? "question"}&from=${encodeURIComponent(returnTo)}`
  );

  return (
    <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
      {breadcrumbs}

      <div className="border-brand bg-brand-tint flex flex-col gap-4 rounded-lg border-l-4 p-6">
        <h1 className="font-display text-2xl sm:text-3xl">{node.title[locale]}</h1>
        <p className="text-ink leading-relaxed">{node.summary[locale]}</p>

        {blocks.map((block, index) => {
          if (block.kind === "paragraph") {
            return (
              <p key={index} className="text-ink leading-relaxed">
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
                <h2 className="font-display text-ink text-lg">{block.title[locale]}</h2>
              ) : null}
              <ol className="text-ink list-inside list-decimal space-y-2 leading-relaxed">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item[locale]}</li>
                ))}
              </ol>
            </div>
          );
        })}

        {node.owner ? (
          <div className="border-line/60 mt-2 border-t pt-4">
            <h2 className="text-ink text-sm font-semibold">{t.whoDecides}</h2>
            <p className="text-ink mt-1 text-sm leading-relaxed">{node.owner[locale]}</p>
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
                  className="focus-halo border-ink text-ink hover:bg-brand-tint inline-flex h-11 items-center rounded-lg border-[1.5px] px-5 text-[0.95rem] font-semibold"
                >
                  {action.label[locale]}
                </a>
              ) : action.external ? (
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

        {citations.length > 0 ? (
          <div className="border-line/60 mt-2 border-t pt-4">
            <h2 className="text-ink text-sm font-semibold">{t.basedOn}</h2>
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
          <ul className="divide-line flex flex-col divide-y">
            {related.map((item, index) => (
              <li key={index} className="py-3">
                <Link
                  href={localeHref(locale, item.href)}
                  className="text-brand-deep font-medium hover:underline"
                >
                  {item.label[locale]}
                </Link>
                {item.description ? (
                  <p className="text-muted mt-1 text-sm leading-relaxed">
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
          <dl className="divide-line flex flex-col divide-y">
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
                    <dt className="text-muted text-sm">{step.question.question[locale]}</dt>
                    <dd className="text-ink font-medium">
                      {step.option.label[locale]}
                      {step.auto ? (
                        <span className="text-muted ml-2 text-xs font-normal">({t.assumed})</span>
                      ) : null}
                    </dd>
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
        </section>
      ) : null}

      <ProfileSummary locale={locale} profile={profile} returnTo={returnTo} variant="compact" />

      <div className="border-line flex flex-col gap-3 rounded-lg border p-5">
        <h2 className="font-display text-ink text-lg">{t.notAnswered}</h2>
        <div>
          <Button href={contactHref} variant="secondary">
            {t.notAnsweredAction}
          </Button>
        </div>
      </div>

      <div>
        <Link href={startHref} className="text-brand-deep font-medium hover:underline">
          {t.startAgain}
        </Link>
      </div>

      <Notice variant="info">{t.guidanceDisclaimer}</Notice>
    </div>
  );
}
